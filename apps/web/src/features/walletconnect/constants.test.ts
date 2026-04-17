import { BRAND_NAME } from '@/config/constants'
import { getSafeWalletMetadata } from './constants'

describe('getSafeWalletMetadata', () => {
  it('should use the current app origin for WalletConnect metadata', () => {
    expect(getSafeWalletMetadata()).toEqual({
      name: BRAND_NAME,
      url: window.location.origin,
      description: 'Smart contract wallet for Ethereum',
      icons: [`${window.location.origin}/images/logo-round.svg`],
    })
  })
})
