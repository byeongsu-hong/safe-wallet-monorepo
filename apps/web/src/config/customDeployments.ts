import {
  registerCustomDeployments,
  type CustomDeployments,
  type CustomDeployment,
} from '@safe-global/utils/services/contracts/customDeployments'

// Re-export types from utils package
export type { CustomDeployment, CustomDeployments }

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

// Register the custom deployments with the utils package
registerCustomDeployments(customDeployments)

export default customDeployments
