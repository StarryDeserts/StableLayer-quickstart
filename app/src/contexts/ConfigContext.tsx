/**
 * 配置上下文
 * 管理网络和品牌选择
 */

import { createContext, useContext, useState, ReactNode } from 'react'
import type { NetworkType } from '../config/networks'
import type { BrandConfig } from '../config/brands'
import { DEFAULT_NETWORK } from '../config/networks'
import { getDefaultBrand } from '../config/brands'

interface ConfigContextValue {
  // 当前网络
  network: NetworkType
  setNetwork: (network: NetworkType) => void

  // 当前品牌
  brand: BrandConfig
  setBrand: (brand: BrandConfig) => void
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>(DEFAULT_NETWORK)
  const [brand, setBrand] = useState<BrandConfig>(getDefaultBrand())

  return (
    <ConfigContext.Provider
      value={{
        network,
        setNetwork,
        brand,
        setBrand
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
