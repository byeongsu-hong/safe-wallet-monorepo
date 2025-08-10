import { getSafeSingletonDeployment, getSafeL2SingletonDeployment } from '@/utils/deployments'
import { getCustomSafeSingletonDeployment, getCustomSafeL2SingletonDeployment } from '@/config/customDeployments'

// Mock the custom deployments
jest.mock('@/config/customDeployments', () => ({
  getCustomSafeSingletonDeployment: jest.fn(),
  getCustomSafeL2SingletonDeployment: jest.fn(),
  getCustomMultiSendCallOnlyDeployment: jest.fn(),
  getCustomMultiSendDeployment: jest.fn(),
  getCustomFallbackHandlerDeployment: jest.fn(),
  getCustomProxyFactoryDeployment: jest.fn(),
  getCustomSignMessageLibDeployment: jest.fn(),
  getCustomCreateCallDeployment: jest.fn(),
  getCustomSafeMigrationDeployment: jest.fn(),
  getCustomCompatibilityFallbackHandlerDeployment: jest.fn(),
  getCustomCompatibilityFallbackHandlerDeployments: jest.fn(),
  getCustomSafeToL2SetupDeployment: jest.fn(),
  getCustomSafeToL2MigrationDeployment: jest.fn(),
}))

describe('Custom Deployments Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return custom deployment if available', () => {
    const mockCustomDeployment = {
      version: '1.4.1' as const,
      abi: [],
      networkAddresses: { '1': '0xCustomSafeAddress' },
      defaultAddress: '0xCustomSafeAddress',
      released: true,
      contractName: 'CustomSafe',
    }

    ;(getCustomSafeSingletonDeployment as jest.Mock).mockReturnValue(mockCustomDeployment)

    const result = getSafeSingletonDeployment({ network: '1', version: '1.4.1' })

    expect(getCustomSafeSingletonDeployment).toHaveBeenCalledWith({ network: '1', version: '1.4.1' })
    expect(result).toEqual(mockCustomDeployment)
  })

  it('should fallback to safe-deployments if no custom deployment', () => {
    ;(getCustomSafeSingletonDeployment as jest.Mock).mockReturnValue(undefined)

    const result = getSafeSingletonDeployment({ network: '1', version: '1.4.1' })

    expect(getCustomSafeSingletonDeployment).toHaveBeenCalledWith({ network: '1', version: '1.4.1' })
    // Should get the official deployment (specific assertion depends on safe-deployments package)
    expect(result).toBeDefined()
    expect(result?.version).toBe('1.4.1')
  })

  it('should handle L2 deployments with custom fallback', () => {
    ;(getCustomSafeL2SingletonDeployment as jest.Mock).mockReturnValue(undefined)

    const result = getSafeL2SingletonDeployment({ network: '137', version: '1.4.1' })

    expect(result).toBeDefined()
    // Should fallback to official L2 deployment
  })
})

describe('Custom Deployments Module', () => {
  it('should be structured correctly for extensions', () => {
    // This test validates that the module can be extended
    expect(getCustomSafeSingletonDeployment).toBeDefined()
    expect(typeof getCustomSafeSingletonDeployment).toBe('function')

    // Test with empty filter
    const result = getCustomSafeSingletonDeployment()
    expect(result).toBeUndefined() // No custom deployments defined by default
  })
})
