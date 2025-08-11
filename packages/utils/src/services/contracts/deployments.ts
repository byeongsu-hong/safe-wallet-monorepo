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

// Enhanced deployment getters that check custom deployments first, then fallback to official
export const getSafeSingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSafeSingletonDeployment(filter)
  return customDeployment ?? getOfficialSafeSingletonDeployment(filter)
}

export const getSafeL2SingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSafeL2SingletonDeployment(filter)
  return customDeployment ?? getOfficialSafeL2SingletonDeployment(filter)
}

export const getMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomMultiSendCallOnlyDeployment(filter)
  return customDeployment ?? getOfficialMultiSendCallOnlyDeployment(filter)
}

export const getMultiSendDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomMultiSendDeployment(filter)
  return customDeployment ?? getOfficialMultiSendDeployment(filter)
}

export const getFallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomFallbackHandlerDeployment(filter)
  return customDeployment ?? getOfficialFallbackHandlerDeployment(filter)
}

export const getProxyFactoryDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomProxyFactoryDeployment(filter)
  return customDeployment ?? getOfficialProxyFactoryDeployment(filter)
}

export const getSignMessageLibDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSignMessageLibDeployment(filter)
  return customDeployment ?? getOfficialSignMessageLibDeployment(filter)
}

export const getCreateCallDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomCreateCallDeployment(filter)
  return customDeployment ?? getOfficialCreateCallDeployment(filter)
}

export const getSafeMigrationDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSafeMigrationDeployment(filter)
  return customDeployment ?? getOfficialSafeMigrationDeployment(filter)
}

export const getCompatibilityFallbackHandlerDeployment = (
  filter?: DeploymentFilter,
): SingletonDeployment | undefined => {
  const customDeployment = getCustomCompatibilityFallbackHandlerDeployment(filter)
  return customDeployment ?? getOfficialCompatibilityFallbackHandlerDeployment(filter)
}

export const getSafeToL2SetupDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSafeToL2SetupDeployment(filter)
  return customDeployment ?? getOfficialSafeToL2SetupDeployment(filter)
}

export const getSafeToL2MigrationDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  const customDeployment = getCustomSafeToL2MigrationDeployment(filter)
  return customDeployment ?? getOfficialSafeToL2MigrationDeployment(filter)
}

export const getCompatibilityFallbackHandlerDeployments = (
  filter?: DeploymentFilter,
): SingletonDeploymentV2 | undefined => {
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
