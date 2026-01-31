/**
 * Toast 通知工具
 * 简单的 Toast 实现，用于引导式流程提示
 */

import type React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@heroui/react'

interface ToastOptions {
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

let toastContainer: HTMLDivElement | null = null
let toastRoot: ReactDOM.Root | null = null

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `
    document.body.appendChild(toastContainer)
    toastRoot = ReactDOM.createRoot(toastContainer)
  }
  return { container: toastContainer, root: toastRoot! }
}

export function showToast({ message, action, duration = 5000 }: ToastOptions) {
  const { container, root } = getToastContainer()

  const toastId = `toast-${Date.now()}`

  const Toast = () => {
    return (
      <div
        id={toastId}
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '300px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        <div style={{ flex: 1, color: 'var(--text)', fontSize: '14px' }}>
          {message}
        </div>
        {action && (
          <Button
            size="sm"
            variant="primary"
            onPress={() => {
              action.onClick()
              removeToast(toastId)
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
    )
  }

  // 添加动画样式
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style')
    style.id = 'toast-styles'
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }
    `
    document.head.appendChild(style)
  }

  // 渲染 Toast
  const toasts: React.ReactElement[] = []
  const existingToasts = container.querySelectorAll('[id^="toast-"]')
  existingToasts.forEach((el) => {
    const id = el.id
    toasts.push(<div key={id} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />)
  })
  toasts.push(<Toast key={toastId} />)

  root.render(<>{toasts}</>)

  // 自动移除
  setTimeout(() => {
    removeToast(toastId)
  }, duration)
}

function removeToast(toastId: string) {
  const toast = document.getElementById(toastId)
  if (toast) {
    toast.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => {
      toast.remove()
    }, 300)
  }
}
