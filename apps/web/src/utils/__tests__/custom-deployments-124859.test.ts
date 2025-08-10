import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getProxyFactoryDeployment,
  getFallbackHandlerDeployment,
  getMultiSendDeployment,
  getMultiSendCallOnlyDeployment,
  getCreateCallDeployment,
  getSignMessageLibDeployment,
  getCompatibilityFallbackHandlerDeployment,
} from '@/utils/deployments'

describe('Custom Deployments for Network 124859 (Safe v1.3.0)', () => {
  const NETWORK_ID = '124859'
  const VERSION = '1.3.0'

  describe('Safe Singleton', () => {
    it('should return custom Safe singleton deployment for network 124859', () => {
      const deployment = getSafeSingletonDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('GnosisSafe')
    })
  })

  describe('Safe L2 Singleton', () => {
    it('should return custom Safe L2 singleton deployment for network 124859', () => {
      const deployment = getSafeL2SingletonDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0x3E5c63644E683549055b9Be8653de26E0B4CD36E')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('GnosisSafeL2')
    })
  })

  describe('Proxy Factory', () => {
    it('should return custom Proxy Factory deployment for network 124859', () => {
      const deployment = getProxyFactoryDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('GnosisSafeProxyFactory')
    })
  })

  describe('Fallback Handler', () => {
    it('should return custom Fallback Handler deployment for network 124859', () => {
      const deployment = getFallbackHandlerDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('CompatibilityFallbackHandler')
    })
  })

  describe('MultiSend', () => {
    it('should return custom MultiSend deployment for network 124859', () => {
      const deployment = getMultiSendDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('MultiSend')
    })
  })

  describe('MultiSend Call Only', () => {
    it('should return custom MultiSend Call Only deployment for network 124859', () => {
      const deployment = getMultiSendCallOnlyDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0x40A2aCCbd92BCA938b02010E17A5b8929b49130D')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('MultiSendCallOnly')
    })
  })

  describe('Create Call', () => {
    it('should return custom Create Call deployment for network 124859', () => {
      const deployment = getCreateCallDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('CreateCall')
    })
  })

  describe('Sign Message Lib', () => {
    it('should return custom Sign Message Lib deployment for network 124859', () => {
      const deployment = getSignMessageLibDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('SignMessageLib')
    })
  })

  describe('Compatibility Fallback Handler', () => {
    it('should return custom Compatibility Fallback Handler deployment for network 124859', () => {
      const deployment = getCompatibilityFallbackHandlerDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment).toBeDefined()
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4')
      expect(deployment?.version).toBe(VERSION)
      expect(deployment?.contractName).toBe('CompatibilityFallbackHandler')
    })
  })

  describe('Fallback to Official Deployments', () => {
    it('should fallback to official deployments for unsupported versions', () => {
      const deployment = getSafeSingletonDeployment({ network: NETWORK_ID, version: '1.4.1' })

      // Should not get our custom deployment since we only have v1.3.0 for network 124859
      expect(deployment?.version).not.toBe('1.3.0')
    })

    it('should fallback to official deployments for unsupported networks', () => {
      const deployment = getSafeSingletonDeployment({ network: '999999', version: VERSION })

      // Should get official deployment for network 999999 if it exists
      expect(deployment?.networkAddresses['124859']).toBeUndefined()
    })
  })

  describe('Network-specific address retrieval', () => {
    it('should return the correct address for network 124859', () => {
      const deployment = getSafeSingletonDeployment({ network: NETWORK_ID, version: VERSION })

      expect(deployment?.defaultAddress).toBe('0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552')
      expect(deployment?.networkAddresses[NETWORK_ID]).toBe('0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552')
    })
  })
})
