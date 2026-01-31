/**
 * 全局状态管理 (Zustand)
 * 管理网络、品牌、钱包地址、SuiClient 等全局状态
 */

import { create } from 'zustand'
import { SuiClient } from '@mysten/sui/client'
import type { NetworkType } from '../config/networks'
import type { BrandConfig } from '../config/brands'
import { DEFAULT_NETWORK } from '../config/networks'
import { getDefaultBrand } from '../config/brands'
import { getSuiClient, clearSuiClientCache } from './createSuiClient'

/**
 * 全局状态接口
 */
interface AppState {
  // 网络配置
  selectedNetwork: NetworkType
  setNetwork: (network: NetworkType) => void

  // 品牌配置
  selectedBrand: BrandConfig
  setBrand: (brand: BrandConfig) => void

  // 钱包地址
  address?: string
  setAddress: (address: string | undefined) => void

  // SuiClient 实例
  suiClient: SuiClient

  // 刷新 SuiClient（网络切换时）
  refreshClient: () => void

  // 重置所有状态
  reset: () => void
}

/**
 * 创建全局 Store
 */
export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  selectedNetwork: DEFAULT_NETWORK,
  selectedBrand: getDefaultBrand(),
  address: undefined,
  suiClient: getSuiClient(DEFAULT_NETWORK),

  // 设置网络
  setNetwork: (network) => {
    set({ selectedNetwork: network })
    // 网络切换时重建 SuiClient
    get().refreshClient()
  },

  // 设置品牌
  setBrand: (brand) => {
    set({ selectedBrand: brand })
  },

  // 设置钱包地址
  setAddress: (address) => {
    set({ address })
  },

  // 刷新 SuiClient
  refreshClient: () => {
    const { selectedNetwork } = get()
    clearSuiClientCache() // 清除缓存
    const newClient = getSuiClient(selectedNetwork)
    set({ suiClient: newClient })
  },

  // 重置状态
  reset: () => {
    set({
      selectedNetwork: DEFAULT_NETWORK,
      selectedBrand: getDefaultBrand(),
      address: undefined,
      suiClient: getSuiClient(DEFAULT_NETWORK)
    })
  }
}))

/**
 * 便捷 Hooks
 */

// 获取当前网络
export const useSelectedNetwork = () => useAppStore((state) => state.selectedNetwork)

// 获取当前品牌
export const useSelectedBrand = () => useAppStore((state) => state.selectedBrand)

// 获取钱包地址
export const useWalletAddress = () => useAppStore((state) => state.address)

// 获取 SuiClient
export const useSuiClient = () => useAppStore((state) => state.suiClient)

// 获取是否已连接钱包
export const useIsWalletConnected = () => useAppStore((state) => !!state.address)
