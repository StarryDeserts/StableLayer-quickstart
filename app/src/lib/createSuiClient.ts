/**
 * SuiClient 创建工具
 * 根据网络配置创建 SuiClient 实例
 */

import { SuiClient } from '@mysten/sui/client'
import { getNetworkConfig, type NetworkType } from '../config/networks'

/**
 * 创建 SuiClient 实例
 * @param network - 网络类型 (mainnet | testnet)
 * @returns SuiClient 实例
 */
export function createSuiClient(network: NetworkType): SuiClient {
  const config = getNetworkConfig(network)

  return new SuiClient({
    url: config.fullnodeUrl
  })
}

/**
 * 全局 SuiClient 实例缓存
 * 避免频繁重建
 */
const clientCache = new Map<NetworkType, SuiClient>()

/**
 * 获取或创建 SuiClient（带缓存）
 * @param network - 网络类型
 * @returns SuiClient 实例
 */
export function getSuiClient(network: NetworkType): SuiClient {
  if (!clientCache.has(network)) {
    clientCache.set(network, createSuiClient(network))
  }
  return clientCache.get(network)!
}

/**
 * 清除缓存（用于强制重建）
 */
export function clearSuiClientCache(): void {
  clientCache.clear()
}
