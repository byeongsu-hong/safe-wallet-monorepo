// Import the custom deployments configuration to register them
import '@/config/customDeployments'

// Re-export all deployment functions from utils package
// The utils package now automatically checks for custom deployments first
export * from '@safe-global/utils/services/contracts/deployments'

// Additional wrapper functions for compatibility with hasMatchingDeployment
import type { DeploymentFilter, SingletonDeploymentV2 } from '@safe-global/safe-deployments'
import {
  getMultiSendDeployments as getCustomAwareMultiSendDeployments,
  getSignMessageLibDeployments as getCustomAwareSignMessageLibDeployments,
  getSafeSingletonDeployments as getCustomAwareSafeSingletonDeployments,
  getSafeL2SingletonDeployments as getCustomAwareSafeL2SingletonDeployments,
  getSafeToL2SetupDeployments as getCustomAwareSafeToL2SetupDeployments,
  getProxyFactoryDeployments as getCustomAwareProxyFactoryDeployments,
} from '@safe-global/utils/services/contracts/deployments'

/**
 * Get MultiSend deployments in the format expected by hasMatchingDeployment
 * This wraps the custom-aware deployment function to return SingletonDeploymentV2
 */
export const getMultiSendDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareMultiSendDeployments(filter)

/**
 * Get SignMessageLib deployments in the format expected by hasMatchingDeployment
 * This wraps the custom-aware deployment function to return SingletonDeploymentV2
 */
export const getSignMessageLibDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareSignMessageLibDeployments(filter)

/**
 * Get SafeSingleton deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeSingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareSafeSingletonDeployments(filter)

/**
 * Get SafeToL2Setup deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeToL2SetupDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareSafeToL2SetupDeployments(filter)

/**
 * Get SafeL2Singleton deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeL2SingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareSafeL2SingletonDeployments(filter)

/**
 * Get ProxyFactory deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getProxyFactoryDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined =>
  getCustomAwareProxyFactoryDeployments(filter)
