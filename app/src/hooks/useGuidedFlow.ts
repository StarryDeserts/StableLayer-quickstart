/**
 * Guided Flow Hook - 引导式流程管理
 *
 * 根据真实状态（钱包、余额、交易历史）判定 Stepper 的各步骤状态
 * 不改动业务逻辑，仅读取现有状态并提供引导功能
 */

import { useState, useMemo, useCallback } from 'react'
import { useAppStore } from '../lib/store'
import { isBrandConfigured } from '../config/brands'
import type { TxHistoryItem, PendingRedeemItem } from '../types/history'
import type { StepStatus } from '../components/GuidedStepper'

export type StepKey = 'mint' | 'redeem' | 'claim'

export interface GuidedStep {
  key: StepKey
  title: string
  subtitle: string
  status: StepStatus
  icon: string
  disabledReason?: string
}

interface UseGuidedFlowParams {
  usdcBalance: string
  brandBalance: string
  history: TxHistoryItem[]
  pendings: PendingRedeemItem[]
}

interface UseGuidedFlowReturn {
  steps: GuidedStep[]
  currentStepKey: StepKey
  setCurrentStepKey: (key: StepKey) => void
  goToStep: (key: StepKey) => void
  onActionSuccess: (action: StepKey, extra?: { mode?: 't_plus_1' | 'instant' }) => void
}

export function useGuidedFlow({
  usdcBalance,
  brandBalance,
  history,
  pendings
}: UseGuidedFlowParams): UseGuidedFlowReturn {
  const address = useAppStore((state) => state.address)
  const brand = useAppStore((state) => state.selectedBrand)

  const [currentStepKey, setCurrentStepKey] = useState<StepKey>('mint')

  // 获取最近的成功交易
  const lastSuccessTx = useMemo(() => {
    return history.find(tx => tx.status === 'success')
  }, [history])

  // 判定步骤状态
  const steps = useMemo<GuidedStep[]>(() => {
    const brandConfigured = isBrandConfigured(brand)
    const hasBrandBalance = parseFloat(brandBalance) > 0
    const hasUsdcBalance = parseFloat(usdcBalance) > 0

    // ========== Mint 步骤 ==========
    let mintStatus: StepStatus = 'current'
    let mintDisabledReason: string | undefined

    if (!address) {
      mintStatus = 'locked'
      mintDisabledReason = '请先连接钱包'
    } else if (!brandConfigured) {
      mintStatus = 'locked'
      mintDisabledReason = '品牌未配置，coinType 为 TODO_REPLACE_ME'
    } else if (!hasUsdcBalance) {
      mintStatus = 'locked'
      mintDisabledReason = 'USDC 余额不足'
    } else if (hasBrandBalance || (lastSuccessTx?.action === 'mint')) {
      mintStatus = 'done'
    }

    // ========== Redeem 步骤 ==========
    let redeemStatus: StepStatus = 'current'
    let redeemDisabledReason: string | undefined
    let redeemSubtitle = '销毁稳定币，赎回 USDC'

    if (!address) {
      redeemStatus = 'locked'
      redeemDisabledReason = '请先连接钱包'
    } else if (!brandConfigured) {
      redeemStatus = 'locked'
      redeemDisabledReason = '品牌未配置'
    } else if (!hasBrandBalance) {
      redeemStatus = 'locked'
      redeemDisabledReason = '品牌币余额不足'
    } else {
      // 检查是否有 pending redeem
      const hasPending = pendings.length > 0 ||
                        (lastSuccessTx?.action === 'redeem')

      if (hasPending) {
        redeemStatus = 'pending'
        redeemSubtitle = '已提交 T+1 赎回，预计次日结算'
      }
    }

    // ========== Claim 步骤 ==========
    let claimStatus: StepStatus = 'current'
    let claimDisabledReason: string | undefined

    if (!address) {
      claimStatus = 'locked'
      claimDisabledReason = '请先连接钱包'
    } else if (!brandConfigured) {
      claimStatus = 'locked'
      claimDisabledReason = '品牌未配置'
    } else if (lastSuccessTx?.action === 'claim') {
      claimStatus = 'done'
    }

    return [
      {
        key: 'mint',
        title: 'Mint',
        subtitle: '存入 USDC，铸造稳定币',
        status: mintStatus,
        icon: mintStatus === 'done' ? '✓' : mintStatus === 'locked' ? '🔒' : '▶',
        disabledReason: mintDisabledReason
      },
      {
        key: 'redeem',
        title: 'Redeem',
        subtitle: redeemSubtitle,
        status: redeemStatus,
        icon: redeemStatus === 'pending' ? '⏳' :
              redeemStatus === 'locked' ? '🔒' : '▶',
        disabledReason: redeemDisabledReason
      },
      {
        key: 'claim',
        title: 'Claim',
        subtitle: '领取流动性挖矿奖励',
        status: claimStatus,
        icon: claimStatus === 'done' ? '✓' : claimStatus === 'locked' ? '🔒' : '▶',
        disabledReason: claimDisabledReason
      }
    ]
  }, [address, brand, brandBalance, usdcBalance, lastSuccessTx, pendings])

  // 跳转到指定步骤
  const goToStep = useCallback((key: StepKey) => {
    const step = steps.find(s => s.key === key)
    if (step && step.status !== 'locked') {
      setCurrentStepKey(key)
    }
  }, [steps])

  // 操作成功回调（用于 Toast 和自动跳转）
  const onActionSuccess = useCallback((action: StepKey, extra?: { mode?: 't_plus_1' | 'instant' }) => {
    console.log(`[useGuidedFlow] onActionSuccess: ${action}`, extra)

    // 这个回调将由外部使用，用于触发 Toast 和跳转
    // Toast 逻辑在调用方实现，这里只负责状态管理

    // 根据操作自动跳转到下一步
    setTimeout(() => {
      if (action === 'mint') {
        goToStep('redeem')
      } else if (action === 'redeem') {
        // T+1 模式也可以去 Claim（用户可以查看是否有可领取的奖励）
        goToStep('claim')
      }
      // claim 成功后不跳转
    }, 100)
  }, [goToStep])

  return {
    steps,
    currentStepKey,
    setCurrentStepKey,
    goToStep,
    onActionSuccess
  }
}
