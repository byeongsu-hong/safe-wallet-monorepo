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
import { isPredictedSafeProps, isReplayedSafeProps } from '@/features/counterfactual/utils'
import { isLegacyVersion } from '@safe-global/utils/services/contracts/utils'
import { isInDeployments } from '@safe-global/utils/hooks/coreSDK/utils'
import type { SafeCoreSDKProps } from '@safe-global/utils/hooks/coreSDK/types'
import { keccak256 } from 'ethers'
import {
  getL2MasterCopyVersionByCodeHash,
  isL2MasterCopyCodeHash,
} from '@safe-global/utils/services/contracts/deployments'
import { logError, Errors } from '@/services/exceptions'

// Safe Core SDK
export const initSafeSDK = async ({
  provider,
  chainId,
  address,
  version,
  implementationVersionState,
  implementation,
  undeployedSafe,
}: SafeCoreSDKProps): Promise<Safe | undefined> => {
  const providerNetwork = (await provider.getNetwork()).chainId
  if (providerNetwork !== BigInt(chainId)) {
    return
  }

  let safeVersion = version ?? (await Gnosis_safe__factory.connect(address, provider).VERSION())
  if (safeVersion.includes('+L2')) safeVersion = safeVersion.replace('+L2', '')
  let isL1SafeSingleton = chainId === chains.eth
  let contractNetworks: ContractNetworksConfig | undefined

  // If it is an official deployment we should still initiate the safeSDK
  if (!isValidMasterCopy(implementationVersionState)) {
    const masterCopy = implementation

    const safeL1Deployment = getSafeSingletonDeployment({ network: chainId, version: safeVersion })
    const safeL2Deployment = getSafeL2SingletonDeployment({ network: chainId, version: safeVersion })

    isL1SafeSingleton = isInDeployments(masterCopy, safeL1Deployment?.networkAddresses[chainId])
    const isL2SafeMasterCopy = isInDeployments(masterCopy, safeL2Deployment?.networkAddresses[chainId])

    if (!isL1SafeSingleton && !isL2SafeMasterCopy) {
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

        // Use the custom mastercopy address with the SDK
        contractNetworks = {
          [chainId]: {
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

    if (isL2SafeMasterCopy) {
      isL1SafeSingleton = false
    }
  }
  // Legacy Safe contracts
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

  if (undeployedSafe) {
    if (isPredictedSafeProps(undeployedSafe.props) || isReplayedSafeProps(undeployedSafe.props)) {
      return Safe.init({
        provider: provider._getConnection().url,
        isL1SafeSingleton,
        ...(contractNetworks ? { contractNetworks } : {}),
        predictedSafe: undeployedSafe.props,
      })
    }
    // We cannot initialize a Core SDK for replayed Safes yet.
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
