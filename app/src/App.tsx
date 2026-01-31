import { TopNav } from './components/TopNav'
import { Hero } from './components/Hero'
import { DemoPanel } from './components/DemoPanel'
import { FAQ } from './components/FAQ'
import { TxHistory } from './components/TxHistory'
import { StepKey } from './components/GuidedStepper'
import { useBalances } from './hooks/useBalances'
import { useTxHistory } from './hooks/useTxHistory'
import { usePendingRedeems } from './hooks/usePendingRedeems'
import { useGuidedFlow } from './hooks/useGuidedFlow'
import { showToast } from './lib/toast'

function App() {
  const { balances, refresh: refreshBalances } = useBalances()
  const { history } = useTxHistory()
  const { pendings } = usePendingRedeems()

  // Guided Flow - 引导式流程
  const { steps, currentStepKey, setCurrentStepKey, goToStep, onActionSuccess } = useGuidedFlow({
    usdcBalance: balances.usdc.balance,
    brandBalance: balances.brand.balance,
    history,
    pendings
  })

  const handleTxSuccess = () => {
    // 交易成功后刷新余额
    setTimeout(() => {
      refreshBalances()
    }, 2000) // 延迟 2 秒等待链上确认
  }

  // Toast 处理（成功后自动引导）
  const handleActionSuccess = (action: StepKey, extra?: { mode?: 't_plus_1' | 'instant' }) => {
    // 先调用 onActionSuccess 更新状态
    onActionSuccess(action, extra)

    // 然后显示 Toast
    if (action === 'mint') {
      showToast({
        message: 'Mint 完成 ✅ 下一步：Redeem',
        action: {
          label: '去 Redeem',
          onClick: () => goToStep('redeem')
        }
      })
    } else if (action === 'redeem') {
      const isT1 = !extra?.mode || extra.mode === 't_plus_1'
      if (isT1) {
        showToast({
          message: '已提交 T+1 赎回 ⏳ 结算后会收到 USDC',
          action: {
            label: '去 Claim',
            onClick: () => goToStep('claim')
          }
        })
      } else {
        showToast({
          message: 'Redeem 完成 ✅ 下一步：Claim',
          action: {
            label: '去 Claim',
            onClick: () => goToStep('claim')
          }
        })
      }
    } else if (action === 'claim') {
      showToast({
        message: 'Claim 完成 ✅',
        duration: 3000
      })
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top Navigation - Floating premium navbar */}
      <TopNav />

      {/* Hero Section - Premium landing hero */}
      <div className="pt-20">
        <Hero />
      </div>

      {/* Demo Panel - Visual Focus */}
      <DemoPanel
        steps={steps}
        currentStepKey={currentStepKey}
        setCurrentStepKey={setCurrentStepKey}
        goToStep={goToStep}
        onMintSuccess={() => {
          handleTxSuccess()
          handleActionSuccess('mint')
        }}
        onRedeemSuccess={(mode) => {
          handleTxSuccess()
          handleActionSuccess('redeem', { mode })
        }}
        onClaimSuccess={() => {
          handleTxSuccess()
          handleActionSuccess('claim')
        }}
      />

      {/* Transaction History */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <TxHistory />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer
        className="mt-20 py-8"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            Built with HeroUI v3, Vite, React, Sui & StableLayer SDK
          </p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            © 2024 OneClick DeFi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
