// Import the custom deployments configuration to register them
import '@/config/customDeployments'

// Re-export all deployment functions from utils package
// The utils package now automatically checks for custom deployments first
export * from '@safe-global/utils/services/contracts/deployments'
