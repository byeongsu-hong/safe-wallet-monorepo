# Custom Contract Deployments

This directory contains configuration for custom contract deployments that extend or override the default Safe deployments from `@safe-global/safe-deployments`.

## Overview

The custom deployments system allows you to:

- Define custom contract addresses for specific networks
- Override default Safe contract deployments
- Maintain compatibility with the existing codebase
- Support custom Safe implementations

## Files

- `customDeployments.ts` - Main configuration file for custom contract addresses
- `README.md` - This documentation file

## Usage

### Adding Custom Deployments

To add custom contract deployments, edit `customDeployments.ts`:

```typescript
// Example: Add custom Safe singleton for a private network
const customDeployments: CustomDeployments = {
  safeSingleton: [
    {
      networkAddresses: {
        '31337': '0x1234567890123456789012345678901234567890', // Local network
        '999': '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',   // Custom network
      },
      version: '1.4.1',
      abi: SafeABI, // Import your ABI
      contractName: 'CustomSafe',
      released: true,
    },
  ],
  // Add other contract types as needed
  proxyFactory: [...],
  multiSendCallOnly: [...],
}
```

### Supported Contract Types

The system supports custom deployments for all Safe contract types:

- `safeSingleton` - Main Safe implementation
- `safeL2Singleton` - L2-optimized Safe implementation
- `multiSendCallOnly` - MultiSend call-only contract
- `multiSend` - MultiSend contract
- `fallbackHandler` - Fallback handler contracts
- `proxyFactory` - Safe proxy factory
- `signMessageLib` - Sign message library
- `createCall` - CreateCall contract
- `safeMigration` - Safe migration contracts
- `compatibilityFallbackHandler` - Compatibility fallback handlers
- `safeToL2Setup` - Safe to L2 setup contracts
- `safeToL2Migration` - Safe to L2 migration contracts

### How It Works

The system uses a fallback pattern:

1. First checks for custom deployments matching the requested filter
2. If no custom deployment found, falls back to official Safe deployments
3. Maintains full API compatibility with `@safe-global/safe-deployments`

### Integration

The enhanced deployment getters are automatically used throughout the application via `@/utils/deployments`. All existing code that imports from `@safe-global/safe-deployments` has been updated to use the enhanced versions.

### Example Scenarios

#### Custom Safe on Private Network

```typescript
safeSingleton: [
  {
    networkAddresses: { '31337': '0xYourCustomSafeAddress' },
    version: '1.4.1',
    abi: CustomSafeABI,
    contractName: 'CustomSafe',
    released: true,
  },
]
```

#### Override Mainnet Deployment

```typescript
safeSingleton: [
  {
    networkAddresses: { '1': '0xYourCustomMainnetSafe' },
    version: '1.4.1',
    abi: SafeABI,
    contractName: 'CustomMainnetSafe',
    released: true,
  },
]
```

#### Multi-Network Custom Deployment

```typescript
proxyFactory: [
  {
    networkAddresses: {
      '1': '0xCustomFactoryMainnet',
      '137': '0xCustomFactoryPolygon',
      '42161': '0xCustomFactoryArbitrum',
    },
    version: '1.4.1',
    abi: ProxyFactoryABI,
    contractName: 'CustomProxyFactory',
    released: true,
  },
]
```

## Testing

The system includes comprehensive tests to ensure:

- Custom deployments are preferred when available
- Fallback to official deployments works correctly
- API compatibility is maintained

Run tests with:

```bash
yarn test src/utils/__tests__/deployments.test.ts
```

## Best Practices

1. **Version Consistency** - Ensure custom deployments use appropriate version numbers
2. **ABI Compatibility** - Custom contracts should maintain ABI compatibility with standard Safe contracts
3. **Testing** - Thoroughly test custom deployments on target networks
4. **Documentation** - Document any custom contract modifications or behaviors
5. **Security** - Verify custom contract implementations before deployment

## Migration from Direct Safe-Deployments Usage

If you have code directly importing from `@safe-global/safe-deployments`, update it to use `@/utils/deployments` instead:

```typescript
// Before
import { getSafeSingletonDeployment } from '@safe-global/safe-deployments'

// After
import { getSafeSingletonDeployment } from '@/utils/deployments'
```

The API remains identical, but now supports custom deployments.
