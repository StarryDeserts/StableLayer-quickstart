/**
 * 钱包连接组件
 * 使用 @mysten/dapp-kit 和 HeroUI Button
 */

import { useEffect } from 'react'
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit'
import { Card } from '@heroui/react'
import { useAppStore } from '../lib/store'

/**
 * 格式化地址为短格式
 * @param address - 完整地址
 * @returns 短格式地址 (0x1234...abcd)
 */
function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * 钱包连接状态显示组件
 */
export function WalletConnect() {
  const currentAccount = useCurrentAccount()
  const setAddress = useAppStore((state) => state.setAddress)
  const address = useAppStore((state) => state.address)

  // 监听钱包连接状态变化，同步到 store
  useEffect(() => {
    if (currentAccount?.address) {
      setAddress(currentAccount.address)
      console.log('👛 Wallet connected:', currentAccount.address)
    } else {
      setAddress(undefined)
      console.log('👛 Wallet disconnected')
    }
  }, [currentAccount?.address, setAddress])

  return (
    <Card>
      <Card.Header>
        <Card.Title>钱包连接</Card.Title>
        <Card.Description>
          连接 Sui 钱包以开始使用
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {/* 连接状态 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">状态:</span>
            <span className={`text-sm font-medium ${address ? 'text-green-600' : 'text-orange-600'}`}>
              {address ? '✅ 已连接' : '⚠️ 未连接钱包'}
            </span>
          </div>

          {/* 地址显示 */}
          {address && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">地址:</span>
              <code className="text-sm font-mono bg-default-100 px-2 py-1 rounded">
                {formatAddress(address)}
              </code>
            </div>
          )}

          {/* 连接按钮 */}
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

/**
 * 简化版钱包连接组件（用于 Header）
 * Premium pill button CTA style - 更大更精致的连接按钮
 */
export function WalletConnectButton() {
  const currentAccount = useCurrentAccount()
  const setAddress = useAppStore((state) => state.setAddress)
  const address = useAppStore((state) => state.address)

  // 监听钱包连接状态变化
  useEffect(() => {
    if (currentAccount?.address) {
      setAddress(currentAccount.address)
    } else {
      setAddress(undefined)
    }
  }, [currentAccount?.address, setAddress])

  return (
    <div className="flex items-center gap-3">
      {address && (
        <div className="hidden lg:flex items-center gap-2 px-4 h-11 rounded-xl transition-all duration-200"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)'
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--success)' }}
          />
          <code className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            {formatAddress(address)}
          </code>
        </div>
      )}
      <div className="wallet-connect-wrapper">
        <ConnectButton />
      </div>
    </div>
  )
}
