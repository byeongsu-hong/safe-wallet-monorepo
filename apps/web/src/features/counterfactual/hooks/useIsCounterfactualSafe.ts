import { selectIsUndeployedSafe } from '../store/undeployedSafesSlice'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppSelector } from '@/store'

const useIsCounterfactualSafe = () => {
  const {
    safeAddress,
    safe: { chainId, deployed },
    safeLoaded,
  } = useSafeInfo()
  const isStoredUndeployedSafe = useAppSelector((state) => selectIsUndeployedSafe(state, chainId, safeAddress))

  return isStoredUndeployedSafe && (!safeLoaded || !deployed)
}

export default useIsCounterfactualSafe
