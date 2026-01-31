/**
 * Guided Stepper - Controlled Component (受控组件)
 *
 * Premium visual upgrade - 高级视觉升级
 * 展示 Mint/Redeem/Claim 的引导式步骤流程
 * 接入真实状态，支持点击跳转
 */

import { Chip, Tooltip } from '@heroui/react'
import { Progress } from '@heroui/progress'

export type StepStatus = 'done' | 'current' | 'pending' | 'locked'
export type StepKey = 'mint' | 'redeem' | 'claim'

export interface StepConfig {
  key: StepKey
  title: string
  subtitle: string
  status: StepStatus
  icon: string
  disabledReason?: string
}

interface GuidedStepperProps {
  steps: StepConfig[]
  currentStepKey: StepKey
  onStepClick?: (key: StepKey) => void
}

export function GuidedStepper({ steps, currentStepKey, onStepClick }: GuidedStepperProps) {
  // 计算进度（done 状态的数量）
  const doneCount = steps.filter(s => s.status === 'done').length
  const totalSteps = steps.length
  const progressPercent = (doneCount / totalSteps) * 100

  return (
    <div className="w-full space-y-6">
      {/* Step Cards - Larger, more premium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <StepCard
            key={step.key}
            step={step}
            isCurrent={step.key === currentStepKey}
            onStepClick={onStepClick}
          />
        ))}
      </div>

      {/* Progress Bar - Enhanced with glow */}
      <div className="space-y-3 px-2">
        <div className="flex justify-between text-base font-medium">
          <span style={{ color: 'var(--text-muted)' }}>Overall Progress</span>
          <span style={{ color: 'var(--gold)' }}>
            {doneCount} / {totalSteps} Complete
          </span>
        </div>
        <div className="relative">
          <Progress
            value={progressPercent}
            className="w-full h-2"
            style={{
              '--progress-color': 'linear-gradient(90deg, var(--gold) 0%, var(--purple) 100%)',
              '--progress-bg': 'var(--surface-2)'
            } as React.CSSProperties}
          />
          {progressPercent > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                width: `${progressPercent}%`,
                boxShadow: 'var(--glow-gold)',
                borderRadius: '4px'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface StepCardProps {
  step: StepConfig
  isCurrent: boolean
  onStepClick?: (key: StepKey) => void
}

function StepCard({ step, isCurrent, onStepClick }: StepCardProps) {
  const { key, title, subtitle, status, icon, disabledReason } = step

  // 状态样式映射 - Premium upgrade
  const statusStyles = {
    done: {
      border: 'var(--success)',
      bg: 'var(--surface)',
      opacity: 1,
      glow: 'var(--glow-success)',
      chipColor: 'success' as const,
      iconBg: 'var(--success-subtle)',
      iconColor: 'var(--success)'
    },
    current: {
      border: 'var(--purple)',
      bg: 'var(--surface)',
      opacity: 1,
      glow: 'var(--glow-purple)',
      chipColor: 'accent' as const,
      iconBg: 'linear-gradient(135deg, var(--gold) 0%, var(--purple) 100%)',
      iconColor: 'var(--bg)'
    },
    pending: {
      border: 'var(--warning)',
      bg: 'var(--surface)',
      opacity: 0.9,
      glow: '0 4px 16px rgba(245, 158, 11, 0.2)',
      chipColor: 'warning' as const,
      iconBg: 'var(--warning-subtle)',
      iconColor: 'var(--warning)'
    },
    locked: {
      border: 'var(--border)',
      bg: 'var(--surface)',
      opacity: 0.5,
      glow: 'none',
      chipColor: 'default' as const,
      iconBg: 'var(--surface-2)',
      iconColor: 'var(--text-dim)'
    }
  }

  const currentStyle = statusStyles[status]
  const isLocked = status === 'locked'
  const isClickable = !isLocked && onStepClick

  const handleClick = () => {
    if (isClickable) {
      onStepClick(key)
    }
  }

  const cardContent = (
    <div
      className="glass-card rounded-2xl p-6 transition-all duration-200 ease-out cursor-pointer"
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isCurrent ? currentStyle.border : 'var(--border)',
        opacity: currentStyle.opacity,
        boxShadow: isCurrent ? currentStyle.glow : 'var(--shadow-sm)',
        cursor: isClickable ? 'pointer' : isLocked ? 'not-allowed' : 'default'
      }}
      onClick={handleClick}
    >
      <div className="hover:transform hover:-translate-y-1 transition-transform duration-200">
        <div className="flex items-start gap-4">
          {/* Icon - Larger, premium feel */}
          <div
            className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl text-2xl font-bold"
            style={{
              background: currentStyle.iconBg,
              color: currentStyle.iconColor,
              boxShadow: isCurrent ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className="font-bold text-lg"
                style={{
                  color: isCurrent ? 'var(--text)' : 'var(--text-muted)'
                }}
              >
                {title}
              </h3>
              <Chip
                size="sm"
                variant="soft"
                color={currentStyle.chipColor}
                className="font-semibold"
              >
                {status === 'done' && '✓ Done'}
                {status === 'current' && '▶ Active'}
                {status === 'pending' && '⏳ Pending'}
                {status === 'locked' && '🔒 Locked'}
              </Chip>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-dim)' }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // 如果是 locked 状态，包裹 Tooltip
  if (isLocked && disabledReason) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <div>{cardContent}</div>
        </Tooltip.Trigger>
        <Tooltip.Content placement="top">
          {disabledReason}
        </Tooltip.Content>
      </Tooltip>
    )
  }

  return cardContent
}
