import chains from '@safe-global/utils/config/chains'
import {
  getSafeL2SingletonDeployment,
  getSafeSingletonDeployment,
  getMultiSendDeployment,
  getMultiSendCallOnlyDeployment,
  getProxyFactoryDeployment,
  getFallbackHandlerDeployment,
  getSignMessageLibDeployment,
  getCreateCallDeployment,
} from '@/utils/deployments'
import ExternalStore from '@safe-global/utils/services/ExternalStore'
import { Gnosis_safe__factory } from '@safe-global/utils/types/contracts'
import Safe, { type ContractNetworksConfig } from '@safe-global/protocol-kit'
import { isValidMasterCopy } from '@safe-global/utils/services/contracts/safeContracts'
import { isPredictedSafeProps, isReplayedSafeProps } from '@/features/counterfactual/services'
import { isLegacyVersion } from '@safe-global/utils/services/contracts/utils'
import { isInDeployments } from '@safe-global/utils/hooks/coreSDK/utils'
import type { SafeCoreSDKProps } from '@safe-global/utils/hooks/coreSDK/types'
import { keccak256 } from 'ethers'
import {
  getCanonicalMultiSendAddress,
  getCanonicalMultiSendCallOnlyAddress,
  getDeploymentTypeForMasterCopy,
  getL2MasterCopyVersionByCodeHash,
  isCanonicalDeployment,
  isChainAgnosticVersion,
  isL2MasterCopyCodeHash,
  resolveChainAgnosticContractAddresses,
} from '@safe-global/utils/services/contracts/deployments'
import { logError, Errors } from '@/services/exceptions'

export const initSafeSDK = async ({
  provider,
  chainId,
  address,
  version,
  implementationVersionState,
  implementation,
  undeployedSafe,
  isL2Chain,
  isZkChain,
}: SafeCoreSDKProps): Promise<Safe | undefined> => {
  const providerNetwork = (await provider.getNetwork()).chainId
  if (providerNetwork !== BigInt(chainId)) {
    return
  }

  let safeVersion = version ?? (await Gnosis_safe__factory.connect(address, provider).VERSION())
  if (safeVersion?.includes('+L2')) safeVersion = safeVersion.replace('+L2', '')
  let isL1SafeSingleton = chainId === chains.eth
  let contractNetworks: ContractNetworksConfig | undefined

  // For versions >= 1.4.1, resolve all addresses chain-agnostically (works on any chain).
  // Derive deployment type AND L1/L2 flavour from the master copy so that Safes on
  // zk chains with a canonical master copy get canonical aux contracts (and vice
  // versa), and Safes on L2 chains running an L1 master copy resolve against the
  // L1 singleton table. Chain-level flags are only used as defaults when the master
  // copy can't be matched (e.g. custom / unregistered deployments).
  if (isChainAgnosticVersion(safeVersion) && isL2Chain !== undefined) {
    const { deploymentType, isL1 } = getDeploymentTypeForMasterCopy(implementation, safeVersion, {
      deploymentType: isZkChain ? 'zksync' : 'canonical',
      isL1: !isL2Chain,
    })
    const resolved = resolveChainAgnosticContractAddresses(chainId, safeVersion, !isL1, deploymentType)

    if (resolved) {
      contractNetworks = { [chainId]: resolved }
      isL1SafeSingleton = isL1
    }
  }

  // For older versions or unrecognized master copies, use per-chain lookup
  if (!isValidMasterCopy(implementationVersionState)) {
    const masterCopy = implementation

    const safeL1Deployment = getSafeSingletonDeployment({ network: chainId, version: safeVersion })
    const safeL2Deployment = getSafeL2SingletonDeployment({ network: chainId, version: safeVersion })

    const isL1Deployment = isInDeployments(masterCopy, safeL1Deployment?.networkAddresses[chainId])
    const isL2SafeMasterCopy = isInDeployments(masterCopy, safeL2Deployment?.networkAddresses[chainId])

    if (isL1Deployment) {
      isL1SafeSingleton = true
    } else if (isL2SafeMasterCopy) {
      isL1SafeSingleton = false
    } else if (!contractNetworks) {
      // Bytecode fallback: only if chain-agnostic resolution didn't already succeed
      try {
        const code = await provider.getCode(masterCopy)

        if (!code || code === '0x') {
          console.warn(`[SafeSDK] No bytecode found for mastercopy at ${masterCopy}`)
          return
        }

        const codeHash = keccak256(code)
        const isUpgradeableL2MasterCopy = isL2MasterCopyCodeHash(codeHash)

        if (!isUpgradeableL2MasterCopy) {
          console.warn(`[SafeSDK] Mastercopy at ${masterCopy} is not a recognized L2 mastercopy`)
          return
        }

        const upgradeableVersion = getL2MasterCopyVersionByCodeHash(codeHash)

        if (!upgradeableVersion) {
          console.warn(`[SafeSDK] Could not determine version for L2 mastercopy at ${masterCopy}`)
          return
        }

        // Merge custom mastercopy with chain-agnostic auxiliary addresses
        const baseAddresses = resolveChainAgnosticContractAddresses(
          chainId,
          upgradeableVersion,
          true,
          isZkChain ? 'zksync' : 'canonical',
        )
        contractNetworks = {
          [chainId]: {
            ...baseAddresses,
            safeSingletonAddress: masterCopy,
          },
        }

        safeVersion = upgradeableVersion
        isL1SafeSingleton = false
      } catch (error) {
        logError(Errors._808, error)
        return
      }
    }
  }

  if (isLegacyVersion(safeVersion)) {
    isL1SafeSingleton = true
  }

  // Build contract networks configuration for custom deployments
  // Only build if we haven't already set contractNetworks from bytecode detection
  if (!contractNetworks) {
    const deploymentFilter = { network: chainId, version: safeVersion }

    // Get all relevant deployments for this network and version
    const safeDeployment = isL1SafeSingleton
      ? getSafeSingletonDeployment(deploymentFilter)
      : getSafeL2SingletonDeployment(deploymentFilter)

    const deployments = {
      safe: safeDeployment,
      multiSend: getMultiSendDeployment(deploymentFilter),
      multiSendCallOnly: getMultiSendCallOnlyDeployment(deploymentFilter),
      proxyFactory: getProxyFactoryDeployment(deploymentFilter),
      fallbackHandler: getFallbackHandlerDeployment(deploymentFilter),
      signMessageLib: getSignMessageLibDeployment(deploymentFilter),
      createCall: getCreateCallDeployment(deploymentFilter),
    }

    // Helper function to get contract address for network
    const getContractAddress = (deployment: typeof deployments.safe) =>
      deployment?.networkAddresses[chainId] || deployment?.defaultAddress

    // Add to contractNetworks if any custom deployments exist for this network
    const hasCustomDeployments = Object.values(deployments).some((deployment) => deployment?.networkAddresses[chainId])

    if (hasCustomDeployments) {
      contractNetworks = {
        [chainId]: {
          safeSingletonAddress: getContractAddress(deployments.safe),
          safeProxyFactoryAddress: getContractAddress(deployments.proxyFactory),
          multiSendAddress: getContractAddress(deployments.multiSend),
          multiSendCallOnlyAddress: getContractAddress(deployments.multiSendCallOnly),
          fallbackHandlerAddress: getContractAddress(deployments.fallbackHandler),
          signMessageLibAddress: getContractAddress(deployments.signMessageLib),
          createCallAddress: getContractAddress(deployments.createCall),
        },
      }
    }
  }

  // zkSync Safes using a canonical (EVM bytecode) master copy cannot delegatecall
  // the zksync-specific (EraVM) MultiSend/MultiSendCallOnly, so force the canonical
  // aux-contract addresses. Only runs for versions below the chain-agnostic threshold
  // (<1.4.1); for >=1.4.1 the chain-agnostic resolver already picks the correct flavour
  // from the master copy, and a second writer on the same fields would only risk drift.
  if (!isChainAgnosticVersion(safeVersion) && isCanonicalDeployment(implementation, chainId, safeVersion)) {
    const canonicalMultiSendCallOnly = getCanonicalMultiSendCallOnlyAddress(safeVersion)
    const canonicalMultiSend = getCanonicalMultiSendAddress(safeVersion)

    contractNetworks = {
      ...contractNetworks,
      [chainId]: {
        ...contractNetworks?.[chainId],
        ...(canonicalMultiSendCallOnly && { multiSendCallOnlyAddress: canonicalMultiSendCallOnly }),
        ...(canonicalMultiSend && { multiSendAddress: canonicalMultiSend }),
      },
    }
  }

  if (undeployedSafe) {
    if (isPredictedSafeProps(undeployedSafe.props) || isReplayedSafeProps(undeployedSafe.props)) {
      return Safe.init({
        provider: provider._getConnection().url,
        isL1SafeSingleton,
        ...(contractNetworks ? { contractNetworks } : {}),
        predictedSafe: undeployedSafe.props,
      })
    }
    return
  }

  return Safe.init({
    provider: provider._getConnection().url,
    safeAddress: address,
    isL1SafeSingleton,
    ...(contractNetworks ? { contractNetworks } : {}),
  })
}

export const {
  getStore: getSafeSDK,
  setStore: setSafeSDK,
  useStore: useSafeSDK,
} = new ExternalStore<Safe | undefined>()
