import { renderHook } from '@/tests/test-utils'
import { extendedSafeInfoBuilder } from '@/tests/builders/safe'
import useIsCounterfactualSafe from '../useIsCounterfactualSafe'
import { PendingSafeStatus, type ReplayedSafeProps } from '@/features/counterfactual'
import { PayMethod } from '@safe-global/utils/features/counterfactual/types'
import type { RootState } from '@/store'

const chainId = '124816'
const safeAddress = '0x4Bb467d706fCB438A4De1055CbBabc8AFf45E973'

const replayedSafeProps: ReplayedSafeProps = {
  factoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
  masterCopy: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
  safeAccountConfig: {
    owners: ['0xE1ccF1e76048551BA4f718c8c5Fd2C225C4B4283'],
    threshold: 1,
    fallbackHandler: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
    to: '0x0000000000000000000000000000000000000000',
    data: '0x',
    paymentReceiver: '0x0000000000000000000000000000000000000000',
  },
  saltNonce: '0',
  safeVersion: '1.3.0',
}

const getReduxState = (deployed: boolean): Partial<RootState> => ({
  safeInfo: {
    data: extendedSafeInfoBuilder()
      .with({
        chainId,
        address: { value: safeAddress, name: null, logoUri: null },
        deployed,
      })
      .build(),
    loaded: true,
    loading: false,
  },
  undeployedSafes: {
    [chainId]: {
      [safeAddress]: {
        props: replayedSafeProps,
        status: {
          status: PendingSafeStatus.AWAITING_EXECUTION,
          type: PayMethod.PayNow,
        },
      },
    },
  },
})

describe('useIsCounterfactualSafe', () => {
  it('returns false when a stale undeployed entry exists for a deployed Safe', () => {
    const { result } = renderHook(() => useIsCounterfactualSafe(), {
      initialReduxState: getReduxState(true),
    })

    expect(result.current).toBe(false)
  })

  it('returns true when an undeployed entry exists for an undeployed Safe', () => {
    const { result } = renderHook(() => useIsCounterfactualSafe(), {
      initialReduxState: getReduxState(false),
    })

    expect(result.current).toBe(true)
  })
})
