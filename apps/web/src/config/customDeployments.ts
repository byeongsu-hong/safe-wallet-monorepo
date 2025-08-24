import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getProxyFactoryDeployment,
  getMultiSendDeployment,
  getMultiSendCallOnlyDeployment,
  getFallbackHandlerDeployment,
  getSignMessageLibDeployment,
  getCreateCallDeployment,
  getCompatibilityFallbackHandlerDeployment,
} from '@safe-global/safe-deployments'
import type { SafeVersion } from '@safe-global/types-kit'
import {
  registerCustomDeployments,
  type CustomDeployments,
  type CustomDeployment,
} from '@safe-global/utils/services/contracts/customDeployments'

// Re-export types from utils package
export type { CustomDeployment, CustomDeployments }

// Get ABIs from mainnet deployments
const mainnetAbis = {
  safeSingleton: getSafeSingletonDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  safeL2Singleton: getSafeL2SingletonDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  proxyFactory: getProxyFactoryDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  multiSend: getMultiSendDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  multiSendCallOnly: getMultiSendCallOnlyDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  fallbackHandler: getFallbackHandlerDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  signMessageLib: getSignMessageLibDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  createCall: getCreateCallDeployment({ network: '1', version: '1.3.0' })?.abi || [],
  compatibilityFallbackHandler:
    getCompatibilityFallbackHandlerDeployment({ network: '1', version: '1.3.0' })?.abi || [],
}

// Custom deployments configuration
// This can be extended to include custom contract addresses for different networks
const customDeployments: CustomDeployments = {
  // Mainnet (1) hardcoded addresses
  safeSingleton: [
    {
      networkAddresses: {
        '124859': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
        '124816': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
      },
      version: '1.3.0',
      abi: mainnetAbis.safeSingleton,
      contractName: 'GnosisSafe',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
        '124816': '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.safeSingleton,
      contractName: 'GnosisSafe',
      released: true,
    },
  ],
  safeL2Singleton: [
    {
      networkAddresses: {
        '124859': '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        '124816': '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
      },
      version: '1.3.0',
      abi: mainnetAbis.safeL2Singleton,
      contractName: 'GnosisSafeL2',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        '124816': '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.safeL2Singleton,
      contractName: 'GnosisSafeL2',
      released: true,
    },
  ],
  proxyFactory: [
    {
      networkAddresses: {
        '124859': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        '124816': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
      },
      version: '1.3.0',
      abi: mainnetAbis.proxyFactory,
      contractName: 'GnosisSafeProxyFactory',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        '124816': '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.proxyFactory,
      contractName: 'GnosisSafeProxyFactory',
      released: true,
    },
  ],
  multiSend: [
    {
      networkAddresses: {
        '124859': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        '124816': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      },
      version: '1.3.0',
      abi: mainnetAbis.multiSend,
      contractName: 'MultiSend',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        '124816': '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.multiSend,
      contractName: 'MultiSend',
      released: true,
    },
  ],
  multiSendCallOnly: [
    {
      networkAddresses: {
        '124859': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        '124816': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
      },
      version: '1.3.0',
      abi: mainnetAbis.multiSendCallOnly,
      contractName: 'MultiSendCallOnly',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        '124816': '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.multiSendCallOnly,
      contractName: 'MultiSendCallOnly',
      released: true,
    },
  ],
  fallbackHandler: [
    {
      networkAddresses: {
        '124859': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        '124816': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.3.0',
      abi: mainnetAbis.fallbackHandler,
      contractName: 'CompatibilityFallbackHandler',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        '124816': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.fallbackHandler,
      contractName: 'CompatibilityFallbackHandler',
      released: true,
    },
  ],
  signMessageLib: [
    {
      networkAddresses: {
        '124859': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
        '124816': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
      },
      version: '1.3.0',
      abi: mainnetAbis.signMessageLib,
      contractName: 'SignMessageLib',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
        '124816': '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.signMessageLib,
      contractName: 'SignMessageLib',
      released: true,
    },
  ],
  createCall: [
    {
      networkAddresses: {
        '124859': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        '124816': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
      },
      version: '1.3.0',
      abi: mainnetAbis.createCall,
      contractName: 'CreateCall',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        '124816': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.createCall,
      contractName: 'CreateCall',
      released: true,
    },
  ],
  // Add compatibility fallback handler for v1.3.0 on network 124859
  compatibilityFallbackHandler: [
    {
      networkAddresses: {
        '124859': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        '124816': '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      },
      version: '1.3.0',
      abi: mainnetAbis.compatibilityFallbackHandler,
      contractName: 'CompatibilityFallbackHandler',
      released: true,
    },
    {
      networkAddresses: {
        '124859': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        '124816': '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
      },
      version: '1.3.0+L2' as SafeVersion,
      abi: mainnetAbis.createCall,
      contractName: 'CreateCall',
      released: true,
    },
  ],
}

// Register the custom deployments with the utils package
registerCustomDeployments(customDeployments)

export default customDeployments
