// Import the custom deployments configuration to register them
import '@/config/customDeployments'

// Re-export all deployment functions from utils package
// The utils package now automatically checks for custom deployments first
export * from '@safe-global/utils/services/contracts/deployments'

// Additional wrapper functions for compatibility with hasMatchingDeployment
import type { DeploymentFilter } from '@safe-global/safe-deployments'
import {
  getMultiSendDeployment as getCustomAwareMultiSendDeployment,
  getSignMessageLibDeployment as getCustomAwareSignMessageLibDeployment,
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getSafeToL2SetupDeployment,
  getProxyFactoryDeployment,
} from '@safe-global/utils/services/contracts/deployments'

/**
 * Get MultiSend deployments in the format expected by hasMatchingDeployment
 * This wraps the custom-aware deployment function to return SingletonDeploymentV2
 */
export const getMultiSendDeployments = (filter?: DeploymentFilter): any => {
  const deployment = getCustomAwareMultiSendDeployment(filter)
  if (!deployment) return undefined

  // Convert SingletonDeployment to SingletonDeploymentV2 format
  return {
    networkAddresses: deployment.networkAddresses,
    deployments: {
      canonical: undefined, // Custom deployments don't have canonical addresses
    },
    released: deployment.released,
    contractName: deployment.contractName,
    version: deployment.version,
    abi: deployment.abi,
  }
}

/**
 * Get SignMessageLib deployments in the format expected by hasMatchingDeployment
 * This wraps the custom-aware deployment function to return SingletonDeploymentV2
 */
export const getSignMessageLibDeployments = (filter?: DeploymentFilter): any => {
  const deployment = getCustomAwareSignMessageLibDeployment(filter)
  if (!deployment) return undefined

  // Convert SingletonDeployment to SingletonDeploymentV2 format
  return {
    networkAddresses: deployment.networkAddresses,
    deployments: {
      canonical: undefined, // Custom deployments don't have canonical addresses
    },
    released: deployment.released,
    contractName: deployment.contractName,
    version: deployment.version,
    abi: deployment.abi,
  }
}

/**
 * Get SafeSingleton deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeSingletonDeployments = (filter?: DeploymentFilter): any => {
  return getSafeSingletonDeployment(filter)
}

/**
 * Get SafeToL2Setup deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeToL2SetupDeployments = (filter?: DeploymentFilter): any => {
  return getSafeToL2SetupDeployment(filter)
}

/**
 * Get SafeL2Singleton deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getSafeL2SingletonDeployments = (filter?: DeploymentFilter): any => {
  return getSafeL2SingletonDeployment(filter)
}

/**
 * Get ProxyFactory deployments (plural version for compatibility)
 * This wraps the custom-aware deployment function
 */
export const getProxyFactoryDeployments = (filter?: DeploymentFilter): any => {
  return getProxyFactoryDeployment(filter)
}
