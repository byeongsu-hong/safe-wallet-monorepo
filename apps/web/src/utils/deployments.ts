// Import the custom deployments configuration to register them
import '@/config/customDeployments'

// Re-export all enhanced deployment functions from utils package
export {
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
} from '@safe-global/utils/services/contracts/deployments'
