import type { SafeVersion } from '@safe-global/types-kit'
import type { DeploymentFilter } from '@safe-global/safe-deployments'

// Custom contract deployment interface that mirrors safe-deployments structure
export interface CustomDeployment {
  networkAddresses: { [chainId: string]: string }
  version: SafeVersion
  abi: unknown[]
  contractName: string
  released: boolean
}

// Custom contract deployments storage
export interface CustomDeployments {
  safeSingleton?: CustomDeployment[]
  safeL2Singleton?: CustomDeployment[]
  multiSendCallOnly?: CustomDeployment[]
  multiSend?: CustomDeployment[]
  fallbackHandler?: CustomDeployment[]
  proxyFactory?: CustomDeployment[]
  signMessageLib?: CustomDeployment[]
  createCall?: CustomDeployment[]
  safeMigration?: CustomDeployment[]
  compatibilityFallbackHandler?: CustomDeployment[]
  safeToL2Setup?: CustomDeployment[]
  safeToL2Migration?: CustomDeployment[]
}

// Global custom deployments registry
let globalCustomDeployments: CustomDeployments = {}

// Function to register custom deployments
export const registerCustomDeployments = (deployments: CustomDeployments): void => {
  globalCustomDeployments = { ...globalCustomDeployments, ...deployments }
}

// Function to get registered custom deployments
export const getRegisteredCustomDeployments = (): CustomDeployments => {
  return globalCustomDeployments
}

// Helper function to find custom deployment
export const findCustomDeployment = (
  deployments: CustomDeployment[] | undefined,
  filter?: DeploymentFilter,
): CustomDeployment | undefined => {
  if (!deployments) return undefined

  return deployments.find((deployment) => {
    const versionMatches = !filter?.version || deployment.version === filter.version
    const networkMatches = !filter?.network || deployment.networkAddresses[filter.network]
    const releasedMatches = filter?.released === undefined || deployment.released === filter.released

    return versionMatches && networkMatches && releasedMatches
  })
}

// Convert CustomDeployment to SingletonDeployment format
export const convertToSingletonDeployment = (customDeployment: CustomDeployment, chainId?: string): any => {
  const networkAddress = chainId ? customDeployment.networkAddresses[chainId] : undefined
  const defaultAddress = networkAddress || Object.values(customDeployment.networkAddresses)[0]

  return {
    version: customDeployment.version,
    abi: customDeployment.abi,
    networkAddresses: customDeployment.networkAddresses,
    defaultAddress,
    released: customDeployment.released,
    contractName: customDeployment.contractName,
  }
}

// Custom deployment getter functions that mirror safe-deployments API
export const getCustomSafeSingletonDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.safeSingleton, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeL2SingletonDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.safeL2Singleton, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.multiSendCallOnly, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomMultiSendDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.multiSend, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomFallbackHandlerDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.fallbackHandler, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomProxyFactoryDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.proxyFactory, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSignMessageLibDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.signMessageLib, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomCreateCallDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.createCall, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeMigrationDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.safeMigration, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomCompatibilityFallbackHandlerDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.compatibilityFallbackHandler, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeToL2SetupDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.safeToL2Setup, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeToL2MigrationDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.safeToL2Migration, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

// For deployments that return SingletonDeploymentV2, we need different handling
export const getCustomCompatibilityFallbackHandlerDeployments = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(globalCustomDeployments.compatibilityFallbackHandler, filter)
  if (!customDeployment) return undefined

  return {
    networkAddresses: customDeployment.networkAddresses,
    deployments: {
      canonical: undefined, // Custom deployments don't have canonical addresses
    },
    released: customDeployment.released,
    contractName: customDeployment.contractName,
    version: customDeployment.version,
    abi: customDeployment.abi,
  }
}
