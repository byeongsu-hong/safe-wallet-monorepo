import semverSatisfies from 'semver/functions/satisfies'
import {
  getSafeSingletonDeployment as getOfficialSafeSingletonDeployment,
  getSafeL2SingletonDeployment as getOfficialSafeL2SingletonDeployment,
  getMultiSendCallOnlyDeployment as getOfficialMultiSendCallOnlyDeployment,
  getMultiSendDeployment as getOfficialMultiSendDeployment,
  getFallbackHandlerDeployment as getOfficialFallbackHandlerDeployment,
  getProxyFactoryDeployment as getOfficialProxyFactoryDeployment,
  getSignMessageLibDeployment as getOfficialSignMessageLibDeployment,
  getCreateCallDeployment as getOfficialCreateCallDeployment,
  getSafeMigrationDeployment as getOfficialSafeMigrationDeployment,
  getCompatibilityFallbackHandlerDeployment as getOfficialCompatibilityFallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployments as getOfficialCompatibilityFallbackHandlerDeployments,
  getSafeToL2SetupDeployment as getOfficialSafeToL2SetupDeployment,
  getSafeToL2MigrationDeployment as getOfficialSafeToL2MigrationDeployment,
} from '@safe-global/safe-deployments'
import type { SingletonDeployment, DeploymentFilter, SingletonDeploymentV2 } from '@safe-global/safe-deployments'
import {
  getCustomSafeSingletonDeployment,
  getCustomSafeL2SingletonDeployment,
  getCustomMultiSendCallOnlyDeployment,
  getCustomMultiSendDeployment,
  getCustomFallbackHandlerDeployment,
  getCustomProxyFactoryDeployment,
  getCustomSignMessageLibDeployment,
  getCustomCreateCallDeployment,
  getCustomSafeMigrationDeployment,
  getCustomCompatibilityFallbackHandlerDeployment,
  getCustomCompatibilityFallbackHandlerDeployments,
  getCustomSafeToL2SetupDeployment,
  getCustomSafeToL2MigrationDeployment,
} from './customDeployments'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import { type SafeVersion } from '@safe-global/types-kit'
import { getLatestSafeVersion } from '@safe-global/utils/utils/chains'
import { SafeState } from '@safe-global/store/gateway/AUTO_GENERATED/safes'

const toNetworkAddressList = (addresses: string | string[]) => (Array.isArray(addresses) ? addresses : [addresses])

// Generic deployment getter that tries custom deployments first, then falls back to safe-deployments
const getDeploymentWithFallback = <T>(
  customGetter: (filter?: DeploymentFilter) => T | undefined,
  officialGetter: (filter?: DeploymentFilter) => T | undefined,
) => {
  return (filter?: DeploymentFilter): T | undefined => {
    const customDeployment = customGetter(filter)
    return customDeployment ?? officialGetter(filter)
  }
}

// Enhanced deployment getters that check custom deployments first
export const getSafeSingletonDeployment = getDeploymentWithFallback(
  getCustomSafeSingletonDeployment,
  getOfficialSafeSingletonDeployment,
)

export const getSafeL2SingletonDeployment = getDeploymentWithFallback(
  getCustomSafeL2SingletonDeployment,
  getOfficialSafeL2SingletonDeployment,
)

export const getMultiSendCallOnlyDeployment = getDeploymentWithFallback(
  getCustomMultiSendCallOnlyDeployment,
  getOfficialMultiSendCallOnlyDeployment,
)

export const getMultiSendDeployment = getDeploymentWithFallback(
  getCustomMultiSendDeployment,
  getOfficialMultiSendDeployment,
)

export const getFallbackHandlerDeployment = getDeploymentWithFallback(
  getCustomFallbackHandlerDeployment,
  getOfficialFallbackHandlerDeployment,
)

export const getProxyFactoryDeployment = getDeploymentWithFallback(
  getCustomProxyFactoryDeployment,
  getOfficialProxyFactoryDeployment,
)

export const getSignMessageLibDeployment = getDeploymentWithFallback(
  getCustomSignMessageLibDeployment,
  getOfficialSignMessageLibDeployment,
)

export const getCreateCallDeployment = getDeploymentWithFallback(
  getCustomCreateCallDeployment,
  getOfficialCreateCallDeployment,
)

export const getSafeMigrationDeployment = getDeploymentWithFallback(
  getCustomSafeMigrationDeployment,
  getOfficialSafeMigrationDeployment,
)

export const getCompatibilityFallbackHandlerDeployment = getDeploymentWithFallback(
  getCustomCompatibilityFallbackHandlerDeployment,
  getOfficialCompatibilityFallbackHandlerDeployment,
)

export const getSafeToL2SetupDeployment = getDeploymentWithFallback(
  getCustomSafeToL2SetupDeployment,
  getOfficialSafeToL2SetupDeployment,
)

export const getSafeToL2MigrationDeployment = getDeploymentWithFallback(
  getCustomSafeToL2MigrationDeployment,
  getOfficialSafeToL2MigrationDeployment,
)

// Special handling for deployments that return SingletonDeploymentV2
export const getCompatibilityFallbackHandlerDeployments = (filter?: DeploymentFilter): any => {
  const customDeployments = getCustomCompatibilityFallbackHandlerDeployments(filter)
  return customDeployments ?? getOfficialCompatibilityFallbackHandlerDeployments(filter)
}

export const hasCanonicalDeployment = (deployment: SingletonDeploymentV2 | undefined, chainId: string) => {
  const canonicalAddress = deployment?.deployments.canonical?.address

  if (!canonicalAddress) {
    return false
  }

  const networkAddresses = toNetworkAddressList(deployment.networkAddresses[chainId])

  return networkAddresses.some((networkAddress) => sameAddress(canonicalAddress, networkAddress))
}

/**
 * Checks if any of the deployments returned by the `getDeployments` function for the given `network` and `versions` contain a deployment for the `contractAddress`
 *
 * @param getDeployments function to get the contract deployments
 * @param contractAddress address that should be included in the deployments
 * @param network chainId that is getting checked
 * @param versions supported Safe versions
 * @returns true if a matching deployment was found
 */
export const hasMatchingDeployment = (
  getDeployments: (filter?: DeploymentFilter) => SingletonDeploymentV2 | undefined,
  contractAddress: string,
  network: string,
  versions: SafeVersion[],
): boolean => {
  return versions.some((version) => {
    const deployments = getDeployments({ version, network })
    if (!deployments) {
      return false
    }
    const deployedAddresses = toNetworkAddressList(deployments.networkAddresses[network] ?? [])
    return deployedAddresses.some((deployedAddress) => sameAddress(deployedAddress, contractAddress))
  })
}

export const _tryDeploymentVersions = (
  getDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined,
  network: ChainInfo,
  version: SafeState['version'],
): SingletonDeployment | undefined => {
  // Unsupported Safe version
  if (version === null) {
    // Assume latest version as fallback
    return getDeployment({
      version: getLatestSafeVersion(network),
      network: network.chainId,
    })
  }

  // Supported Safe version
  return getDeployment({
    version,
    network: network.chainId,
  })
}

export const _isLegacy = (safeVersion: SafeState['version']): boolean => {
  const LEGACY_VERSIONS = '<=1.0.0'
  return !!safeVersion && semverSatisfies(safeVersion, LEGACY_VERSIONS)
}

export const _isL2 = (chain: ChainInfo, safeVersion: SafeState['version']): boolean => {
  const L2_VERSIONS = '>=1.3.0'

  // Unsupported safe version
  if (typeof safeVersion === 'undefined' || safeVersion === null) {
    return chain.l2
  }

  // We had L1 contracts on xDai, EWC and Volta so we also need to check version is after 1.3.0
  return chain.l2 && semverSatisfies(safeVersion, L2_VERSIONS)
}

export const getSafeContractDeployment = (
  chain: ChainInfo,
  safeVersion: SafeState['version'],
): SingletonDeployment | undefined => {
  // Check if prior to 1.0.0 to keep minimum compatibility
  if (_isLegacy(safeVersion)) {
    return getSafeSingletonDeployment({ version: '1.0.0' })
  }

  const getDeployment = _isL2(chain, safeVersion) ? getSafeL2SingletonDeployment : getSafeSingletonDeployment

  return _tryDeploymentVersions(getDeployment, chain, safeVersion)
}

export const getMultiSendCallOnlyContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getMultiSendCallOnlyDeployment, chain, safeVersion)
}

export const getMultiSendContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getMultiSendDeployment, chain, safeVersion)
}

export const getFallbackHandlerContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getFallbackHandlerDeployment, chain, safeVersion)
}

export const getProxyFactoryContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getProxyFactoryDeployment, chain, safeVersion)
}

export const getSignMessageLibContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getSignMessageLibDeployment, chain, safeVersion)
}

export const getCreateCallContractDeployment = (chain: ChainInfo, safeVersion: SafeState['version']) => {
  return _tryDeploymentVersions(getCreateCallDeployment, chain, safeVersion)
}
