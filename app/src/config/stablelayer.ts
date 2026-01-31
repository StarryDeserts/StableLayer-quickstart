/**
 * StableLayer 协议配置
 * 包含 Package ID、Registry ID 等核心合约地址
 */

import type { NetworkType } from './networks'

export interface StableLayerConfig {
  packageId: string
  stableRegistryId: string
  stableRegistryInitialSharedVersion: number
}

/**
 * Mainnet 默认配置（确定值）
 */
const MAINNET_DEFAULTS: StableLayerConfig = {
  packageId: '0x41e25d09e20cf3bc43fe321e51ef178fac419ae47b783a7161982158fc9f17d6',
  stableRegistryId: '0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642',
  stableRegistryInitialSharedVersion: 696362017
}

/**
 * Testnet 配置（官方未公布，需通过环境变量提供）
 */
const TESTNET_DEFAULTS: StableLayerConfig = {
  packageId: 'TODO_REPLACE_ME',
  stableRegistryId: 'TODO_REPLACE_ME',
  stableRegistryInitialSharedVersion: 0 // 需要配置
}

/**
 * 从环境变量读取配置（允许覆盖）
 */
function getConfigFromEnv(defaults: StableLayerConfig): StableLayerConfig {
  return {
    packageId: import.meta.env.VITE_STABLELAYER_PACKAGE_ID || defaults.packageId,
    stableRegistryId: import.meta.env.VITE_STABLELAYER_REGISTRY_ID || defaults.stableRegistryId,
    stableRegistryInitialSharedVersion:
      Number(import.meta.env.VITE_STABLELAYER_REGISTRY_INITIAL_SHARED_VERSION) ||
      defaults.stableRegistryInitialSharedVersion
  }
}

/**
 * 所有网络的 StableLayer 配置
 */
export const STABLE_LAYER_CONFIGS: Record<NetworkType, StableLayerConfig> = {
  mainnet: getConfigFromEnv(MAINNET_DEFAULTS),
  testnet: getConfigFromEnv(TESTNET_DEFAULTS)
}

/**
 * 获取指定网络的 StableLayer 配置
 */
export function getStableLayerConfig(network: NetworkType): StableLayerConfig {
  return STABLE_LAYER_CONFIGS[network]
}

/**
 * 验证配置是否完整
 */
export function isConfigValid(config: StableLayerConfig): boolean {
  return (
    config.packageId !== 'TODO_REPLACE_ME' &&
    config.stableRegistryId !== 'TODO_REPLACE_ME' &&
    config.stableRegistryInitialSharedVersion > 0 &&
    config.packageId.startsWith('0x') &&
    config.stableRegistryId.startsWith('0x')
  )
}

/**
 * 获取配置错误信息
 */
export function getConfigErrors(config: StableLayerConfig): string[] {
  const errors: string[] = []

  if (config.packageId === 'TODO_REPLACE_ME') {
    errors.push('Package ID 未配置')
  } else if (!config.packageId.startsWith('0x')) {
    errors.push('Package ID 格式错误')
  }

  if (config.stableRegistryId === 'TODO_REPLACE_ME') {
    errors.push('Stable Registry ID 未配置')
  } else if (!config.stableRegistryId.startsWith('0x')) {
    errors.push('Stable Registry ID 格式错误')
  }

  if (config.stableRegistryInitialSharedVersion <= 0) {
    errors.push('Initial Shared Version 未配置')
  }

  return errors
}
