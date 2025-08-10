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

// Custom deployments configuration
// This can be extended to include custom contract addresses for different networks
const customDeployments: CustomDeployments = {
  // Mainnet (1) hardcoded addresses
  safeSingleton: [
    {
      networkAddresses: {
        '1': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'Safe',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'GnosisSafe',
      released: true,
    },
  ],
  safeL2Singleton: [
    {
      networkAddresses: {
        '124859': '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'GnosisSafeL2',
      released: true,
    },
  ],
  proxyFactory: [
    {
      networkAddresses: {
        '1': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'ProxyFactory',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'GnosisSafeProxyFactory',
      released: true,
    },
  ],
  multiSend: [
    {
      networkAddresses: {
        '1': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'MultiSend',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'MultiSend',
      released: true,
    },
  ],
  multiSendCallOnly: [
    {
      networkAddresses: {
        '1': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'MultiSendCallOnly',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'MultiSendCallOnly',
      released: true,
    },
  ],
  fallbackHandler: [
    {
      networkAddresses: {
        '1': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'FallbackHandler',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'CompatibilityFallbackHandler',
      released: true,
    },
  ],
  signMessageLib: [
    {
      networkAddresses: {
        '1': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'SignMessageLib',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'SignMessageLib',
      released: true,
    },
  ],
  createCall: [
    {
      networkAddresses: {
        '1': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
      },
      version: '1.4.1',
      abi: [],
      contractName: 'CreateCall',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'CreateCall',
      released: true,
    },
  ],
  // Add compatibility fallback handler for v1.3.0 on network 124859
  compatibilityFallbackHandler: [
    {
      networkAddresses: {
        '124859': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.3.0',
      abi: [],
      contractName: 'CompatibilityFallbackHandler',
      released: true,
    },
  ],
}

// Helper function to find custom deployment
const findCustomDeployment = (
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
const convertToSingletonDeployment = (customDeployment: CustomDeployment, chainId?: string): any => {
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
  const customDeployment = findCustomDeployment(customDeployments.safeSingleton, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeL2SingletonDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.safeL2Singleton, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.multiSendCallOnly, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomMultiSendDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.multiSend, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomFallbackHandlerDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.fallbackHandler, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomProxyFactoryDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.proxyFactory, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSignMessageLibDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.signMessageLib, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomCreateCallDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.createCall, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeMigrationDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.safeMigration, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomCompatibilityFallbackHandlerDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.compatibilityFallbackHandler, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeToL2SetupDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.safeToL2Setup, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

export const getCustomSafeToL2MigrationDeployment = (filter?: DeploymentFilter): any => {
  const customDeployment = findCustomDeployment(customDeployments.safeToL2Migration, filter)
  return customDeployment ? convertToSingletonDeployment(customDeployment, filter?.network) : undefined
}

// For deployments that return SingletonDeploymentV2, we need different handling
export const getCustomCompatibilityFallbackHandlerDeployments = (filter?: DeploymentFilter) => {
  const customDeployment = findCustomDeployment(customDeployments.compatibilityFallbackHandler, filter)
  if (!customDeployment) return undefined

  return {
    networkAddresses: customDeployment.networkAddresses,
    deployments: {
      canonical: undefined, // Custom deployments don't have canonical addresses
    },
  }
}

export default customDeployments
