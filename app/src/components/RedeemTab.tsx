/**
 * Redeem Tab - 赎回 USDC
 * Premium unified operation panel - 统一操作面板样式
 * 增加 Preview 信息区和 UI 预校验，避免 err_insufficient_deposit
 * 用户输入品牌币金额，调用 buildRedeemTx 赎回 USDC（T+1 模式）
 */

import { useState } from 'react'
import { Button, Input, Chip } from '@heroui/react'
import { useAppStore } from '../lib/store'
import { buildRedeemTx } from '../lib/stablelayer/adapter'
import { isBrandConfigured } from '../config/brands'
import { useTransaction } from '../hooks/useTransaction'
import { useTxHistory, createSuccessTx } from '../hooks/useTxHistory'
import { usePendingRedeems } from '../hooks/usePendingRedeems'
import { useBalances } from '../hooks/useBalances'
import { TxFeedbackCard } from './TxFeedbackCard'

interface RedeemTabProps {
  onSuccess?: (mode?: 't_plus_1' | 'instant') => void
}

export function RedeemTab({ onSuccess }: RedeemTabProps) {
  const [amount, setAmount] = useState('')
  const suiClient = useAppStore((state) => state.suiClient)
  const address = useAppStore((state) => state.address)
  const network = useAppStore((state) => state.selectedNetwork)
  const brand = useAppStore((state) => state.selectedBrand)

  const { state, result, isLoading, execute, reset } = useTransaction()
  const { addTx } = useTxHistory()
  const { addPending } = usePendingRedeems()
  const { balances } = useBalances()

  const handleRedeem = async () => {
    if (!address) return

    const success = await execute(async () => {
      const { tx } = await buildRedeemTx({
        suiClient,
        sender: address,
        brandCoinType: brand.coinType,
        amountDecimalString: amount,
        mode: 't_plus_1',
        network
      })

      return tx
    })

    // 成功后记录到历史和 pending
    if (success && result.digest) {
      addTx(createSuccessTx({
        digest: result.digest,
        network,
        brandKey: brand.key,
        action: 'redeem',
        amount: `${amount} ${brand.displayName}`
      }))

      // 添加到 pending redeems（T+1）
      addPending({
        digest: result.digest,
        time: Date.now(),
        network,
        brandKey: brand.key,
        amount: `${amount} ${brand.displayName}`,
        brandCoinType: brand.coinType
      })

      // 调用 onSuccess 并传递 mode（当前固定为 t_plus_1）
      onSuccess?.('t_plus_1')
    }
  }

  const isConfigured = isBrandConfigured(brand)
  const brandBalanceNum = parseFloat(balances.brand.balance) || 0
  const requestedAmount = parseFloat(amount) || 0

  // UI 预校验：检查余额是否足够
  const hasEnoughBalance = brandBalanceNum > 0 && requestedAmount > 0 && requestedAmount <= brandBalanceNum

  // 禁用原因
  let disabledReason = ''
  if (!address) disabledReason = '请先连接钱包'
  else if (!isConfigured) disabledReason = '品牌未配置 Coin Type'
  else if (brandBalanceNum === 0) disabledReason = '钱包中无可赎回的品牌币余额'
  else if (requestedAmount === 0) disabledReason = '请输入赎回金额'
  else if (requestedAmount > brandBalanceNum) disabledReason = '赎回金额超过钱包余额'

  const canSubmit = address && amount && parseFloat(amount) > 0 && isConfigured && hasEnoughBalance && !isLoading

  return (
    <div className="space-y-6">
      {/* Amount Input - Premium glass input */}
      <div>
        <label className="text-sm font-semibold mb-3 block" style={{ color: 'var(--text)' }}>
          Amount ({brand.displayName})
        </label>
        <Input
          placeholder="Enter amount (e.g. 1.0)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          isDisabled={isLoading || !isConfigured}
          className="input-glass"
        />
        {!isConfigured && (
          <p className="text-sm mt-2" style={{ color: 'var(--warning)' }}>
            ⚠️ Current brand not configured. Coin Type is TODO_REPLACE_ME
          </p>
        )}
      </div>

      {/* Redeem 前置检查卡片 */}
      <div className="glass-panel rounded-xl p-4">
        <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
          Redeem 前置检查
        </div>
        <div className="space-y-3">
          {/* 检查 1：钱包余额 */}
          <div className="flex items-start gap-2">
            <Chip className={brandBalanceNum > 0 ? 'chip-success' : 'chip-error'} size="sm">
              {brandBalanceNum > 0 ? 'OK' : 'NO'}
            </Chip>
            <div className="flex-1">
              <div className="text-sm" style={{ color: 'var(--text)' }}>
                钱包持有 {brand.displayName}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                当前余额：{balances.brand.balance} {brand.displayName}
              </div>
            </div>
          </div>

          {/* 检查 2：协议存款警告 */}
          <div className="flex items-start gap-2">
            <Chip className="chip-pending" size="sm">提醒</Chip>
            <div className="flex-1">
              <div className="text-sm" style={{ color: 'var(--text)' }}>
                协议存款份额（Deposit Shares）
              </div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                ⚠️ 无法自动查询。如果你通过二级市场获得 {brand.displayName}（而非通过本应用 Mint），
                可能无法直接 Redeem。
              </div>
              <div className="text-xs mt-1 p-2 rounded" style={{
                background: 'var(--warning-subtle)',
                color: 'var(--warning)'
              }}>
                💡 建议：先尝试 Mint 少量 USDC（如 1 USDC）建立存款记录，然后再 Redeem
              </div>
            </div>
          </div>

          {/* 检查 3：T+1 结算提示 */}
          <div className="flex items-start gap-2">
            <Chip className="chip-pending" size="sm">T+1</Chip>
            <div className="flex-1">
              <div className="text-sm" style={{ color: 'var(--text)' }}>
                T+1 结算模式
              </div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                Redeem 请求提交后，需等待 T+1 结算。如果刚提交过 Redeem，
                请等待结算完成后再操作。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA Button */}
      <Button
        className="btn-gradient w-full"
        isDisabled={!canSubmit}
        onPress={handleRedeem}
        title={disabledReason}
      >
        {isLoading ? getLoadingText(state) : 'Redeem (T+1)'}
      </Button>

      {/* Disabled Reason Display */}
      {disabledReason && !canSubmit && !isLoading && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{
            background: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)'
          }}
        >
          ⚠️ {disabledReason}
        </div>
      )}

      {/* Success Alert */}
      {state === 'success' && (
        <div className="glass-panel rounded-xl p-4">
          <div className="font-semibold mb-1" style={{ color: 'var(--success)' }}>
            ✓ Redeem Request Submitted
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            T+1 redeem request submitted. Settlement expected next day. Added to Pending Redeems.
          </div>
        </div>
      )}

      {/* TxStatus Card */}
      <TxFeedbackCard state={state} result={result} action="redeem" onReset={reset} />

      {/* Helper Notes */}
      <div className="glass-panel rounded-lg p-3 text-sm space-y-1" style={{ color: 'var(--text-dim)' }}>
        <p>• Burn {amount || '0'} {brand.displayName} to redeem equivalent USDC</p>
        <p>• T+1 mode: Request requires processing, settlement expected next day</p>
        <p>• Redeemed USDC will be transferred to your address</p>
      </div>
    </div>
  )
}

function getLoadingText(state: string): string {
  switch (state) {
    case 'building':
      return 'Building transaction...'
    case 'signing':
      return 'Waiting for signature...'
    case 'executing':
      return 'Executing...'
    default:
      return 'Redeem (T+1)'
  }
}
