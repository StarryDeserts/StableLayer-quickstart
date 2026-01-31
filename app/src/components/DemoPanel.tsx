/**
 * DemoPanel - Premium DeFi Demo Section
 * Contains GuidedStepper, Balance, Operations Tabs
 * This is the visual FOCUS of the page - business logic unchanged
 */

import { Button } from '@heroui/react'
import { GuidedStepper, StepKey } from './GuidedStepper'
import { BalancePanel } from './BalancePanel'
import { PendingRedeems } from './PendingRedeems'
import { MintTab } from './MintTab'
import { RedeemTab } from './RedeemTab'
import { ClaimTab } from './ClaimTab'

interface DemoPanelProps {
  // Guided Flow State
  steps: ReturnType<typeof import('../hooks/useGuidedFlow').useGuidedFlow>['steps']
  currentStepKey: StepKey
  setCurrentStepKey: (key: StepKey) => void
  goToStep: (key: StepKey) => void

  // Transaction Handlers (业务逻辑保持不变)
  onMintSuccess: () => void
  onRedeemSuccess: (mode?: 't_plus_1' | 'instant') => void
  onClaimSuccess: () => void
}

export function DemoPanel({
  steps,
  currentStepKey,
  setCurrentStepKey,
  goToStep,
  onMintSuccess,
  onRedeemSuccess,
  onClaimSuccess
}: DemoPanelProps) {
  return (
    <section className="relative py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Your Journey
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--text-muted)' }}
          >
            Follow the guided flow to complete your stablecoin operations
          </p>
        </div>

        {/* Guided Stepper - 视觉焦点 */}
        <div className="mb-8">
          <GuidedStepper
            steps={steps}
            currentStepKey={currentStepKey}
            onStepClick={goToStep}
          />
        </div>

        {/* Balance Panel */}
        <BalancePanel />

        {/* Pending Redeems */}
        <PendingRedeems />

        {/* Operations Card - Premium Glass Effect */}
        <div
          className="glass-card rounded-3xl p-8 md:p-10"
          style={{
            boxShadow: 'var(--shadow-lg), 0 0 60px var(--purple-glow)'
          }}
        >
          {/* Card Header */}
          <div className="mb-8">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text)' }}
            >
              Operations
            </h3>
            <p
              className="text-base"
              style={{ color: 'var(--text-muted)' }}
            >
              Execute Mint, Redeem, or Claim operations with real-time feedback
            </p>
          </div>

          {/* Tab Navigation - Larger, more premium */}
          <div className="flex gap-3 mb-8 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            {[
              { key: 'mint' as const, label: 'Mint', icon: '⚡' },
              { key: 'redeem' as const, label: 'Redeem', icon: '🔄' },
              { key: 'claim' as const, label: 'Claim', icon: '🎁' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={currentStepKey === tab.key ? 'primary' : 'ghost'}
                onPress={() => setCurrentStepKey(tab.key)}
                className="flex-1 h-14 text-base font-medium rounded-xl transition-all duration-200"
                style={
                  currentStepKey === tab.key
                    ? {
                        background: 'linear-gradient(135deg, var(--gold) 0%, var(--purple) 100%)',
                        boxShadow: 'var(--glow-gold)',
                        color: 'var(--bg)'
                      }
                    : {
                        color: 'var(--text-muted)'
                      }
                }
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Panels - 业务逻辑完全保持不变 */}
          <div className="min-h-[300px]">
            {currentStepKey === 'mint' && <MintTab onSuccess={onMintSuccess} />}
            {currentStepKey === 'redeem' && <RedeemTab onSuccess={onRedeemSuccess} />}
            {currentStepKey === 'claim' && <ClaimTab onSuccess={onClaimSuccess} />}
          </div>
        </div>
      </div>
    </section>
  )
}
