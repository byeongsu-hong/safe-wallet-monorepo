import {
  getSafeL2SingletonDeployment,
  getSafeL2SingletonDeployments,
  getSafeSingletonDeployment,
  getSafeSingletonDeployments,
} from '@/utils/deployments'

describe('Custom deployments integration', () => {
  it('returns custom singleton deployments for Mitosis networks', () => {
    const deployment = getSafeSingletonDeployment({ network: '124816', version: '1.3.0' })

    expect(deployment?.networkAddresses['124816']).toBe('0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552')
    expect(deployment?.defaultAddress).toBe('0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552')
  })

  it('returns custom plural deployments in SingletonDeploymentV2 shape', () => {
    const deployment = getSafeL2SingletonDeployments({ network: '124816', version: '1.3.0' })

    expect(deployment?.networkAddresses['124816']).toBe('0x3E5c63644E683549055b9Be8653de26E0B4CD36E')
    expect(deployment?.deployments).toEqual({ canonical: undefined })
  })

  it('does not let no-network custom plural lookups shadow official deployments', () => {
    const deployment = getSafeL2SingletonDeployments({ version: '1.3.0' })

    expect(deployment?.networkAddresses['137']).toBeDefined()
    expect(deployment?.networkAddresses['124816']).toBeUndefined()
  })

  it('falls back to official singleton deployments for unsupported custom networks', () => {
    const deployment = getSafeL2SingletonDeployment({ network: '137', version: '1.4.1' })

    expect(deployment).toBeDefined()
    expect(getSafeSingletonDeployments({ version: '1.4.1' })?.deployments.canonical?.address).toBeDefined()
  })
})
