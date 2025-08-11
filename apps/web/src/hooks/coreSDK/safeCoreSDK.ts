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
import Safe from '@safe-global/protocol-kit'
import { isValidMasterCopy } from '@safe-global/utils/services/contracts/safeContracts'
import { isPredictedSafeProps, isReplayedSafeProps } from '@/features/counterfactual/utils'
import { isLegacyVersion } from '@safe-global/utils/services/contracts/utils'
import { isInDeployments } from '@safe-global/utils/hooks/coreSDK/utils'
import type { SafeCoreSDKProps } from '@safe-global/utils/hooks/coreSDK/types'
import type { ContractNetworksConfig } from '@safe-global/protocol-kit'

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
  if (providerNetwork !== BigInt(chainId)) return

  const safeVersion = version ?? (await Gnosis_safe__factory.connect(address, provider).VERSION())
  let isL1SafeSingleton = chainId === chains.eth

  // If it is an official deployment we should still initiate the safeSDK
  if (!isValidMasterCopy(implementationVersionState)) {
    const masterCopy = implementation

    const safeL1Deployment = getSafeSingletonDeployment({ network: chainId, version: safeVersion })
    const safeL2Deployment = getSafeL2SingletonDeployment({ network: chainId, version: safeVersion })

    isL1SafeSingleton = isInDeployments(masterCopy, safeL1Deployment?.networkAddresses[chainId])
    const isL2SafeMasterCopy = isInDeployments(masterCopy, safeL2Deployment?.networkAddresses[chainId])

    // Unknown deployment, which we do not want to support
    if (!isL1SafeSingleton && !isL2SafeMasterCopy) {
      return Promise.resolve(undefined)
    }
  }
  // Legacy Safe contracts
  if (isLegacyVersion(safeVersion)) {
    isL1SafeSingleton = true
  }

  // Build contract networks configuration for custom deployments
  const contractNetworks: ContractNetworksConfig = {}

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
  const getContractAddress = (deployment: any) => deployment?.networkAddresses[chainId] || deployment?.defaultAddress

  // Add to contractNetworks if any custom deployments exist for this network
  const hasCustomDeployments = Object.values(deployments).some((deployment) => deployment?.networkAddresses[chainId])

  if (hasCustomDeployments) {
    contractNetworks[chainId] = {
      safeSingletonAddress: getContractAddress(deployments.safe),
      safeProxyFactoryAddress: getContractAddress(deployments.proxyFactory),
      multiSendAddress: getContractAddress(deployments.multiSend),
      multiSendCallOnlyAddress: getContractAddress(deployments.multiSendCallOnly),
      fallbackHandlerAddress: getContractAddress(deployments.fallbackHandler),
      signMessageLibAddress: getContractAddress(deployments.signMessageLib),
      createCallAddress: getContractAddress(deployments.createCall),
    }
  }

  if (undeployedSafe) {
    if (isPredictedSafeProps(undeployedSafe.props) || isReplayedSafeProps(undeployedSafe.props)) {
      return Safe.init({
        provider: provider._getConnection().url,
        isL1SafeSingleton,
        predictedSafe: undeployedSafe.props,
        contractNetworks,
      })
    }
    // We cannot initialize a Core SDK for replayed Safes yet.
    return
  }
  return Safe.init({
    provider: provider._getConnection().url,
    safeAddress: address,
    isL1SafeSingleton,
    contractNetworks,
  })
}

export const {
  getStore: getSafeSDK,
  setStore: setSafeSDK,
  useStore: useSafeSDK,
} = new ExternalStore<Safe | undefined>()
