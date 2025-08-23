import type { DeploymentFilter } from '@safe-global/safe-deployments'

// Interface matching the structure from safe-modules-deployments
interface SpendingLimitDeployment {
  networkAddresses: { [chainId: string]: string }
  version: string
  abi: unknown[]
  contractName: string
  released: boolean
}

// Custom spending limit deployments storage
const customSpendingLimitDeployments: SpendingLimitDeployment[] = [
  // Example custom deployment (add your custom deployments here):
  // {
  //   networkAddresses: {
  //     '1': '0x1234567890123456789012345678901234567890', // Mainnet
  //     '100': '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Gnosis Chain
  //   },
  //   version: '0.1.1',
  //   abi: [], // Add ABI if needed
  //   contractName: 'AllowanceModule',
  //   released: true,
  // },
]

/**
 * Get custom spending limit deployment matching the filter
 * @param filter Deployment filter with network and version
 * @returns Custom spending limit deployment or undefined
 */
export const getCustomSpendingLimitDeployment = (filter?: DeploymentFilter): SpendingLimitDeployment | undefined => {
  if (!filter) return undefined

  return customSpendingLimitDeployments.find((deployment) => {
    const versionMatches = !filter.version || deployment.version === filter.version
    const networkMatches = !filter.network || !!deployment.networkAddresses[filter.network]
    const releasedMatches = filter.released === undefined || deployment.released === filter.released

    return versionMatches && networkMatches && releasedMatches
  })
}
