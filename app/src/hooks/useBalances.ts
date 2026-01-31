/**
 * 余额查询 Hook
 * 自动刷新余额（连接钱包、切换网络/品牌、交易成功后）
 */

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../lib/store'
import { formatBalance } from '../lib/stablelayer'
import { getNetworkConfig } from '../config/networks'
import { isBrandConfigured } from '../config/brands'

export interface BalanceData {
  usdc: {
    balance: string // 格式化后的余额（如 "100.50"）
    decimals: number
    symbol: string
    isLoading: boolean
  }
  brand: {
    balance: string
    decimals: number
    symbol: string
    isLoading: boolean
  }
}

export function useBalances() {
  const suiClient = useAppStore((state) => state.suiClient)
  const address = useAppStore((state) => state.address)
  const network = useAppStore((state) => state.selectedNetwork)
  const brand = useAppStore((state) => state.selectedBrand)

  const [balances, setBalances] = useState<BalanceData>({
    usdc: { balance: '0', decimals: 6, symbol: 'USDC', isLoading: true },
    brand: { balance: '0', decimals: 6, symbol: brand.displayName, isLoading: true }
  })

  const refresh = useCallback(async () => {
    if (!address) {
      setBalances({
        usdc: { balance: '0', decimals: 6, symbol: 'USDC', isLoading: false },
        brand: { balance: '0', decimals: 6, symbol: brand.displayName, isLoading: false }
      })
      return
    }

    setBalances(prev => ({
      usdc: { ...prev.usdc, isLoading: true },
      brand: { ...prev.brand, isLoading: true }
    }))

    try {
      const networkConfig = getNetworkConfig(network)

      // 查询 USDC 余额
      const usdcBalance = await suiClient.getBalance({
        owner: address,
        coinType: networkConfig.usdcCoinType
      })
      const usdcMetadata = await suiClient.getCoinMetadata({ coinType: networkConfig.usdcCoinType })
      const usdcDecimals = usdcMetadata?.decimals ?? 6
      const usdcFormatted = formatBalance(usdcBalance.totalBalance, usdcDecimals)

      // 查询品牌币余额（如果已配置）
      let brandFormatted = '0'
      let brandDecimals = 6
      let brandSymbol = brand.displayName

      if (isBrandConfigured(brand)) {
        try {
          const brandBalance = await suiClient.getBalance({
            owner: address,
            coinType: brand.coinType
          })
          const brandMetadata = await suiClient.getCoinMetadata({ coinType: brand.coinType })
          brandDecimals = brandMetadata?.decimals ?? 6
          brandSymbol = brandMetadata?.symbol ?? brand.displayName
          brandFormatted = formatBalance(brandBalance.totalBalance, brandDecimals)
        } catch (err) {
          console.warn('[useBalances] Brand balance fetch failed:', err)
        }
      }

      setBalances({
        usdc: {
          balance: usdcFormatted,
          decimals: usdcDecimals,
          symbol: usdcMetadata?.symbol || 'USDC',
          isLoading: false
        },
        brand: {
          balance: brandFormatted,
          decimals: brandDecimals,
          symbol: brandSymbol,
          isLoading: false
        }
      })
    } catch (err) {
      console.error('[useBalances] Fetch error:', err)
      setBalances({
        usdc: { balance: '0', decimals: 6, symbol: 'USDC', isLoading: false },
        brand: { balance: '0', decimals: 6, symbol: brand.displayName, isLoading: false }
      })
    }
  }, [suiClient, address, network, brand])

  // 自动刷新：连接钱包、切换网络/品牌时
  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    balances,
    refresh,
    isLoading: balances.usdc.isLoading || balances.brand.isLoading
  }
}
