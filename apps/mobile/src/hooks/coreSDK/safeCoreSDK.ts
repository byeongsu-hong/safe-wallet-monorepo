import chains from '@safe-global/utils/config/chains'
import {
  getCreateCallDeployment,
  getCanonicalMultiSendAddress,
  getCanonicalMultiSendCallOnlyAddress,
  getDeploymentTypeForMasterCopy,
  getFallbackHandlerDeployment,
  getMultiSendCallOnlyDeployment,
  getMultiSendDeployment,
  getProxyFactoryDeployment,
  getSafeL2SingletonDeployment,
  getSafeSingletonDeployment,
  getSignMessageLibDeployment,
  isCanonicalDeployment,
  isChainAgnosticVersion,
  resolveChainAgnosticContractAddresses,
} from '@safe-global/utils/services/contracts/deployments'
import type { ContractNetworksConfig } from '@safe-global/protocol-kit'
import ExternalStore from '@safe-global/utils/services/ExternalStore'
import { Gnosis_safe__factory } from '@safe-global/utils/types/contracts'
import Safe from '@safe-global/protocol-kit'
import { isLegacyVersion } from '@safe-global/utils/services/contracts/utils'
import { isValidMasterCopy } from '@safe-global/utils/services/contracts/safeContracts'
import type { SafeCoreSDKProps } from '@safe-global/utils/hooks/coreSDK/types'
import { isInDeployments } from '@safe-global/utils/hooks/coreSDK/utils'

const singletonSafeSDK = new Map<string, Safe>()

export const initSafeSDK = async ({
  provider,
  chainId,
  address,
  version,
  implementationVersionState,
  implementation,
  isL2Chain,
  isZkChain,
}: SafeCoreSDKProps): Promise<Safe | undefined> => {
  const providerUrl = provider._getConnection().url
  const key = `${chainId}-${address}-${version}-${implementationVersionState}-${implementation}-${providerUrl}`

  if (singletonSafeSDK.has(key)) {
    return singletonSafeSDK.get(key)
  }

  const providerNetwork = (await provider.getNetwork()).chainId
  if (providerNetwork !== BigInt(chainId)) {
    return
  }

  const safeVersion = version ?? (await Gnosis_safe__factory.connect(address, provider).VERSION())
  let isL1SafeSingleton = chainId === chains.eth
  let contractNetworks: ContractNetworksConfig | undefined

  // For versions >= 1.4.1, resolve all addresses chain-agnostically (works on any chain)
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
      // Unknown deployment and no chain-agnostic resolution available
      return undefined
    }
  }

  if (isLegacyVersion(safeVersion)) {
    isL1SafeSingleton = true
  }

  // Build contract networks configuration for custom deployments
  // Only build if we haven't already set contractNetworks from chain-agnostic resolution
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

  const safeSDK = await Safe.init({
    provider: providerUrl,
    safeAddress: address,
    isL1SafeSingleton,
    ...(contractNetworks ? { contractNetworks } : {}),
  })
  singletonSafeSDK.set(key, safeSDK)

  return safeSDK
}

export const {
  getStore: getSafeSDK,
  setStore: setSafeSDK,
  useStore: useSafeSDK,
} = new ExternalStore<Safe | undefined>()

export const clearSingletonCache = (): void => {
  singletonSafeSDK.clear()
}
