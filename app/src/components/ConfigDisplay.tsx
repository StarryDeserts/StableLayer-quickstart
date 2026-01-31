/**
 * 配置显示组件
 * 显示当前网络、品牌和配置状态
 */

import { Card, Alert } from '@heroui/react'
import { useAppStore } from '../lib/store'
import { getNetworkConfig } from '../config/networks'
import { getStableLayerConfig, isConfigValid } from '../config/stablelayer'
import { isBrandConfigured } from '../config/brands'

export function ConfigDisplay() {
  const network = useAppStore((state) => state.selectedNetwork)
  const brand = useAppStore((state) => state.selectedBrand)
  const networkConfig = getNetworkConfig(network)
  const stableLayerConfig = getStableLayerConfig(network)
  const isBrandReady = isBrandConfigured(brand)
  const isStableLayerReady = isConfigValid(stableLayerConfig)

  return (
    <div className="space-y-4">
      {/* 当前配置概览 */}
      <Card>
        <Card.Header>
          <Card.Title>当前配置</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-default-600">网络:</span>
              <span className="font-medium">{networkConfig.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">品牌:</span>
              <span className="font-medium">{brand.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Coin Type:</span>
              <code className="text-xs bg-default-100 px-2 py-1 rounded">
                {brand.coinType}
              </code>
            </div>
            {brand.supportedRedeemModes.length > 0 && (
              <div className="flex justify-between">
                <span className="text-default-600">支持的赎回模式:</span>
                <span className="text-sm">
                  {brand.supportedRedeemModes.map(mode => (
                    mode === 't_plus_1' ? 'T+1' : '即时'
                  )).join(', ')}
                </span>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Coin Type 未配置警告 */}
      {!isBrandReady && (
        <Alert status="danger">
          <Alert.Title>⚠️ Coin Type 未配置</Alert.Title>
          <Alert.Description>
            当前品牌 "{brand.displayName}" 的 Coin Type 尚未配置，无法进行交易操作。
            请先在配置文件中设置正确的 Coin Type。
            {brand.notes && (
              <div className="mt-2 text-sm">
                {brand.notes}
              </div>
            )}
          </Alert.Description>
        </Alert>
      )}

      {/* StableLayer 配置未完成警告 */}
      {!isStableLayerReady && (
        <Alert status="danger">
          <Alert.Title>⚠️ StableLayer 配置未完成</Alert.Title>
          <Alert.Description>
            当前网络 "{networkConfig.displayName}" 的 StableLayer 协议配置不完整，无法进行交易操作。
            <div className="mt-2 space-y-1 text-sm">
              <div>Package ID: {stableLayerConfig.packageId}</div>
              <div>Registry ID: {stableLayerConfig.stableRegistryId}</div>
              <div>Initial Shared Version: {stableLayerConfig.stableRegistryInitialSharedVersion}</div>
            </div>
          </Alert.Description>
        </Alert>
      )}

      {/* 配置完成提示 */}
      {isBrandReady && isStableLayerReady && (
        <Alert status="success">
          <Alert.Title>✅ 配置已就绪</Alert.Title>
          <Alert.Description>
            网络和品牌配置已完成，可以进行交易操作。
          </Alert.Description>
        </Alert>
      )}
    </div>
  )
}
