import chains from '@safe-global/utils/config/chains'
import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getMultiSendDeployment,
  getMultiSendCallOnlyDeployment,
  getProxyFactoryDeployment,
  getFallbackHandlerDeployment,
  getSignMessageLibDeployment,
  getCreateCallDeployment,
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
// Safe Core SDK
export const initSafeSDK = async ({
  provider,
  chainId,
  address,
  version,
  implementationVersionState,
  implementation,
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
  const getContractAddress = (deployment: typeof deployments.safe) =>
    deployment?.networkAddresses[chainId] || deployment?.defaultAddress

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

  const safeSDK = await Safe.init({
    provider: providerUrl,
    safeAddress: address,
    isL1SafeSingleton,
    contractNetworks,
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
