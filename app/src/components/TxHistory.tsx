/**
 * 交易历史展示组件
 * Premium visual upgrade - 高级视觉升级
 * 显示最近 10 笔交易记录
 */

import { Button } from '@heroui/react'
import { useTxHistory } from '../hooks/useTxHistory'
import type { TxHistoryItem } from '../types/history'

export function TxHistory() {
  const { history, clearHistory } = useTxHistory()

  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--text)' }}
        >
          Transaction History
        </h3>
        <p
          className="text-center py-8 text-base"
          style={{ color: 'var(--text-muted)' }}
        >
          No transactions yet. Start your DeFi journey above.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            Transaction History
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Recent {history.length} transactions
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onPress={clearHistory}
          className="hover:bg-danger-subtle transition-colors"
          style={{ color: 'var(--danger)' }}
        >
          Clear All
        </Button>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <TxHistoryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function TxHistoryRow({ item }: { item: TxHistoryItem }) {
  const explorerUrl = getExplorerUrl(item.network, item.digest)

  const timeStr = new Date(item.time).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  const statusColor = item.status === 'success' ? 'var(--success)' : 'var(--danger)'
  const statusBg = item.status === 'success' ? 'var(--success-subtle)' : 'var(--danger-subtle)'
  const statusIcon = item.status === 'success' ? '✓' : '✗'

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={() => {
        if (item.status === 'success') {
          window.open(explorerUrl, '_blank')
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Status Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold"
          style={{
            background: statusBg,
            color: statusColor
          }}
        >
          {statusIcon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-semibold text-base"
              style={{ color: 'var(--text)' }}
            >
              {getActionLabel(item.action)}
            </span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: 'var(--purple-subtle)',
                color: 'var(--purple-2)'
              }}
            >
              {item.brandKey}
            </span>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {timeStr} · {item.network}
            {item.amount && ` · ${item.amount}`}
          </div>
          {item.status === 'success' && (
            <code
              className="text-xs truncate block mt-1 font-mono"
              style={{ color: 'var(--text-dim)' }}
            >
              {item.digest.slice(0, 20)}...
            </code>
          )}
          {item.status === 'error' && item.error && (
            <div
              className="text-xs mt-1 truncate"
              style={{ color: 'var(--danger)' }}
            >
              {item.error}
            </div>
          )}
        </div>

        {/* Action Button */}
        {item.status === 'success' && (
          <div className="flex-shrink-0">
            <div
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{
                background: 'var(--gold-subtle)',
                color: 'var(--gold)',
                border: '1px solid var(--gold)'
              }}
            >
              View →
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getExplorerUrl(network: string, digest: string): string {
  const baseUrl = network === 'mainnet'
    ? 'https://suiscan.xyz/mainnet'
    : 'https://suiscan.xyz/testnet'
  return `${baseUrl}/tx/${digest}`
}

function getActionLabel(action: string): string {
  switch (action) {
    case 'mint':
      return 'Mint'
    case 'redeem':
      return 'Redeem'
    case 'claim':
      return 'Claim'
    default:
      return action
  }
}
