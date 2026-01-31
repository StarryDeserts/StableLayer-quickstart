/**
 * Transaction feedback card
 * Unified glassmorphism UI for success/error states
 */

import { Accordion, Button, Card, Chip, Tooltip } from '@heroui/react'
import type { TxState, TxResult } from '../hooks/useTransaction'
import type { TxAction } from '../types/history'
import { useAppStore } from '../lib/store'

interface TxFeedbackCardProps {
  state: TxState
  result: TxResult
  action: TxAction
  onReset: () => void
}

/**
 * 将错误信息翻译为用户可理解的中文
 */
function translateError(error: string): { friendlyMessage: string; technicalDetails: string } {
  const rawError = error || 'Unknown error'

  if (rawError.includes('err_insufficient_deposit') || rawError.includes('function: 104')) {
    return {
      friendlyMessage: '可赎回存款份额不足 / 尚无可赎回仓位',
      technicalDetails: '协议返回 err_insufficient_deposit (104) 错误。可能原因及解决方法：\n\n' +
        '【Redeem 失败】\n' +
        '1. 你的 btcUSDC 来自二级市场转账，而非通过协议 Mint\n' +
        '   → 解决：先 Mint 少量 USDC（如 1 USDC）建立存款记录\n' +
        '2. 你刚完成 Mint，但存款记录尚未建立（极少发生）\n' +
        '   → 解决：等待几分钟后重试\n' +
        '3. T+1 赎回模式下，之前的 Redeem 请求尚未结算\n' +
        '   → 解决：查看 Pending Redeems，等待 T+1 结算完成\n\n' +
        '【Claim 失败】\n' +
        '4. 当前没有可领取的奖励（刚 Mint、刚 Claim 过、或未产生奖励）\n' +
        '   → 解决：等待流动性挖矿奖励累积后再试\n' +
        '5. 你从未通过协议 Mint，没有存款记录\n' +
        '   → 解决：先执行 Mint 操作建立存款\n\n' +
        '💡 强烈建议：如确认钱包有足够余额但仍失败，请先执行一次小额 Mint 操作（如 1 USDC）。'
    }
  }

  if (rawError.includes('InsufficientGas') || rawError.includes('gas')) {
    return {
      friendlyMessage: '账户 SUI 余额不足以支付 Gas',
      technicalDetails: '请确保钱包中有足够的 SUI 来支付交易手续费（通常需要 0.01-0.1 SUI）。'
    }
  }

  if (rawError.includes('reject') || rawError.includes('denied') || rawError.includes('cancel')) {
    return {
      friendlyMessage: '用户拒绝了签名请求',
      technicalDetails: '您在钱包中取消了交易签名，交易未提交到链上。'
    }
  }

  if (rawError.includes('Insufficient') || rawError.includes('balance')) {
    return {
      friendlyMessage: '代币余额不足',
      technicalDetails: '钱包中没有足够的代币来完成此操作。请检查余额后重试。'
    }
  }

  if (rawError.includes('MoveAbort')) {
    return {
      friendlyMessage: '链上智能合约执行中止',
      technicalDetails: '交易在链上执行时被智能合约中止。这可能是由于不满足某些条件（如余额、权限、状态等）。请检查输入参数和账户状态。'
    }
  }

  return {
    friendlyMessage: '交易执行失败',
    technicalDetails: '请查看下方技术详情了解具体错误原因。'
  }
}

export function TxFeedbackCard({ state, result, action, onReset }: TxFeedbackCardProps) {
  const network = useAppStore((state) => state.selectedNetwork)
  const brand = useAppStore((state) => state.selectedBrand)
  if (state === 'idle' || state === 'building' || state === 'signing' || state === 'executing') {
    return null
  }

  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  if (state === 'error') {
    const { friendlyMessage, technicalDetails } = translateError(result.error || '')

    return (
      <Card className="card-glass rounded-2xl">
        <Card.Header>
          <div className="flex items-center gap-3">
            <Chip className="chip-error" size="sm">失败</Chip>
            <div className="text-lg font-semibold">{getActionLabel(action)} · 交易失败</div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="kv-label">时间</div>
                <div className="kv-value">{timestamp}</div>
              </div>
              <div>
                <div className="kv-label">网络 / 品牌</div>
                <div className="kv-value">{network} · {brand.displayName}</div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--danger)' }}>
                错误原因
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {friendlyMessage}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                详细说明
              </div>
              <div className="text-xs whitespace-pre-line" style={{ color: 'var(--text-dim)' }}>
                {technicalDetails}
              </div>
            </div>

            <Accordion className="glass-panel rounded-xl px-3">
              <Accordion.Item id="raw-error">
                <Accordion.Heading>
                  <Accordion.Trigger className="text-sm">
                    查看原始错误（供排查）
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <div className="pb-3">
                    <pre className="text-xs overflow-auto max-h-40 p-3 rounded-lg digest-pill">
                      {result.error}
                    </pre>
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <div className="flex flex-wrap gap-2">
              <Button className="btn-soft" size="sm" onPress={onReset}>
                🔄 重试
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  if (state === 'success' && result.digest) {
    const explorerUrl = getExplorerUrl(network, result.digest)

    const handleCopyDigest = () => {
      navigator.clipboard.writeText(result.digest!)
    }

    const handleCopyCoinType = () => {
      navigator.clipboard.writeText(brand.coinType)
    }

    return (
      <Card className="card-glass rounded-2xl">
        <Card.Header>
          <div className="flex items-center gap-3">
            <Chip className="chip-success" size="sm">成功</Chip>
            <div className="text-lg font-semibold">{getActionLabel(action)} · 交易已提交</div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="kv-label">时间</div>
                <div className="kv-value">{timestamp}</div>
              </div>
              <div>
                <div className="kv-label">网络 / 品牌</div>
                <div className="kv-value">{network} · {brand.displayName}</div>
              </div>
            </div>

            <div>
              <div className="kv-label mb-2">Transaction Digest</div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <Tooltip.Trigger className="flex-1 min-w-0">
                    <code className="digest-pill block px-3 py-2 truncate">
                      {result.digest}
                    </code>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="tooltip-glass" showArrow>
                    {result.digest}
                  </Tooltip.Content>
                </Tooltip>
                <Button className="btn-soft" size="sm" onPress={handleCopyDigest}>
                  复制
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="btn-gradient" onPress={() => window.open(explorerUrl, '_blank')}>
                查看 Explorer
              </Button>
              <Button className="btn-soft" size="sm" onPress={handleCopyCoinType}>
                复制 Coin Type
              </Button>
              <Button className="btn-ghost" variant="ghost" size="sm" onPress={onReset}>
                关闭
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return null
}

function getExplorerUrl(network: string, digest: string): string {
  const baseUrl = network === 'mainnet'
    ? 'https://suiscan.xyz/mainnet'
    : 'https://suiscan.xyz/testnet'
  return `${baseUrl}/tx/${digest}`
}

function getActionLabel(action: TxAction): string {
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
