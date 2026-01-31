/**
 * 网络配置
 * mainnet / testnet 网络配置与 USDC Coin Type
 */

import { getFullnodeUrl } from '@mysten/sui/client'

export type NetworkType = 'mainnet' | 'testnet'

export interface NetworkConfig {
  key: NetworkType
  displayName: string
  fullnodeUrl: string
  usdcCoinType: string
}

/**
 * Circle Native USDC Coin Types
 */
export const USDC_COIN_TYPES: Record<NetworkType, string> = {
  mainnet: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
  testnet: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC'
}

/**
 * 网络配置列表
 */
export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  mainnet: {
    key: 'mainnet',
    displayName: 'Mainnet',
    fullnodeUrl: getFullnodeUrl('mainnet'),
    usdcCoinType: USDC_COIN_TYPES.mainnet
  },
  testnet: {
    key: 'testnet',
    displayName: 'Testnet',
    fullnodeUrl: getFullnodeUrl('testnet'),
    usdcCoinType: USDC_COIN_TYPES.testnet
  }
}

/**
 * 默认网络
 */
export const DEFAULT_NETWORK: NetworkType = 'mainnet'

/**
 * 获取网络配置
 */
export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return NETWORKS[network]
}

/**
 * 获取 USDC Coin Type
 */
export function getUsdcCoinType(network: NetworkType): string {
  return USDC_COIN_TYPES[network]
}
