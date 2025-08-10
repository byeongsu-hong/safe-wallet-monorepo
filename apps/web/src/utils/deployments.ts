import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getMultiSendCallOnlyDeployment,
  getMultiSendDeployment,
  getFallbackHandlerDeployment,
  getProxyFactoryDeployment,
  getSignMessageLibDeployment,
  getCreateCallDeployment,
  getSafeMigrationDeployment,
  getCompatibilityFallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployments,
  getSafeToL2SetupDeployment,
  getSafeToL2MigrationDeployment,
} from '@safe-global/safe-deployments'
import type { DeploymentFilter, SingletonDeployment, SingletonDeploymentV2 } from '@safe-global/safe-deployments'
import {
  getCustomSafeSingletonDeployment,
  getCustomSafeL2SingletonDeployment,
  getCustomMultiSendCallOnlyDeployment,
  getCustomMultiSendDeployment,
  getCustomFallbackHandlerDeployment,
  getCustomProxyFactoryDeployment,
  getCustomSignMessageLibDeployment,
  getCustomCreateCallDeployment,
  getCustomSafeMigrationDeployment,
  getCustomCompatibilityFallbackHandlerDeployment,
  getCustomCompatibilityFallbackHandlerDeployments,
  getCustomSafeToL2SetupDeployment,
  getCustomSafeToL2MigrationDeployment,
} from '@/config/customDeployments'

// Generic deployment getter that tries custom deployments first, then falls back to safe-deployments
const getDeploymentWithFallback = <T>(
  customGetter: (filter?: DeploymentFilter) => T | undefined,
  safeGetter: (filter?: DeploymentFilter) => T | undefined,
) => {
  return (filter?: DeploymentFilter): T | undefined => {
    const customDeployment = customGetter(filter)
    return customDeployment ?? safeGetter(filter)
  }
}

// Enhanced deployment getters that check custom deployments first
export const enhancedGetSafeSingletonDeployment = getDeploymentWithFallback(
  getCustomSafeSingletonDeployment,
  getSafeSingletonDeployment,
)

export const enhancedGetSafeL2SingletonDeployment = getDeploymentWithFallback(
  getCustomSafeL2SingletonDeployment,
  getSafeL2SingletonDeployment,
)

export const enhancedGetMultiSendCallOnlyDeployment = getDeploymentWithFallback(
  getCustomMultiSendCallOnlyDeployment,
  getMultiSendCallOnlyDeployment,
)

export const enhancedGetMultiSendDeployment = getDeploymentWithFallback(
  getCustomMultiSendDeployment,
  getMultiSendDeployment,
)

export const enhancedGetFallbackHandlerDeployment = getDeploymentWithFallback(
  getCustomFallbackHandlerDeployment,
  getFallbackHandlerDeployment,
)

export const enhancedGetProxyFactoryDeployment = getDeploymentWithFallback(
  getCustomProxyFactoryDeployment,
  getProxyFactoryDeployment,
)

export const enhancedGetSignMessageLibDeployment = getDeploymentWithFallback(
  getCustomSignMessageLibDeployment,
  getSignMessageLibDeployment,
)

export const enhancedGetCreateCallDeployment = getDeploymentWithFallback(
  getCustomCreateCallDeployment,
  getCreateCallDeployment,
)

export const enhancedGetSafeMigrationDeployment = getDeploymentWithFallback(
  getCustomSafeMigrationDeployment,
  getSafeMigrationDeployment,
)

export const enhancedGetCompatibilityFallbackHandlerDeployment = getDeploymentWithFallback(
  getCustomCompatibilityFallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployment,
)

export const enhancedGetSafeToL2SetupDeployment = getDeploymentWithFallback(
  getCustomSafeToL2SetupDeployment,
  getSafeToL2SetupDeployment,
)

export const enhancedGetSafeToL2MigrationDeployment = getDeploymentWithFallback(
  getCustomSafeToL2MigrationDeployment,
  getSafeToL2MigrationDeployment,
)

// Special handling for deployments that return SingletonDeploymentV2
export const enhancedGetCompatibilityFallbackHandlerDeployments = (
  filter?: DeploymentFilter,
): SingletonDeploymentV2 | undefined => {
  const customDeployments = getCustomCompatibilityFallbackHandlerDeployments(filter)
  return customDeployments ?? getCompatibilityFallbackHandlerDeployments(filter)
}

// Utility functions for deployment detection
export const isCustomDeployment = (
  address: string,
  chainId: string,
  contractType:
    | 'safeSingleton'
    | 'safeL2Singleton'
    | 'multiSendCallOnly'
    | 'multiSend'
    | 'fallbackHandler'
    | 'proxyFactory'
    | 'signMessageLib'
    | 'createCall',
): boolean => {
  const customGetters = {
    safeSingleton: getCustomSafeSingletonDeployment,
    safeL2Singleton: getCustomSafeL2SingletonDeployment,
    multiSendCallOnly: getCustomMultiSendCallOnlyDeployment,
    multiSend: getCustomMultiSendDeployment,
    fallbackHandler: getCustomFallbackHandlerDeployment,
    proxyFactory: getCustomProxyFactoryDeployment,
    signMessageLib: getCustomSignMessageLibDeployment,
    createCall: getCustomCreateCallDeployment,
  }

  const getter = customGetters[contractType]
  const deployment = getter({ network: chainId })

  return Boolean(deployment?.networkAddresses[chainId] === address)
}

// Re-export enhanced versions with original names for easy replacement
export {
  enhancedGetSafeSingletonDeployment as getSafeSingletonDeployment,
  enhancedGetSafeL2SingletonDeployment as getSafeL2SingletonDeployment,
  enhancedGetMultiSendCallOnlyDeployment as getMultiSendCallOnlyDeployment,
  enhancedGetMultiSendDeployment as getMultiSendDeployment,
  enhancedGetFallbackHandlerDeployment as getFallbackHandlerDeployment,
  enhancedGetProxyFactoryDeployment as getProxyFactoryDeployment,
  enhancedGetSignMessageLibDeployment as getSignMessageLibDeployment,
  enhancedGetCreateCallDeployment as getCreateCallDeployment,
  enhancedGetSafeMigrationDeployment as getSafeMigrationDeployment,
  enhancedGetCompatibilityFallbackHandlerDeployment as getCompatibilityFallbackHandlerDeployment,
  enhancedGetCompatibilityFallbackHandlerDeployments as getCompatibilityFallbackHandlerDeployments,
  enhancedGetSafeToL2SetupDeployment as getSafeToL2SetupDeployment,
  enhancedGetSafeToL2MigrationDeployment as getSafeToL2MigrationDeployment,
}
