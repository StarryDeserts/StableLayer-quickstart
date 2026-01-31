/**
 * 交易历史管理 Hook
 * 使用 localStorage 保存最近 10 笔交易
 */

import { useState, useCallback, useEffect } from 'react'
import type { TxHistoryItem, TxAction } from '../types/history'

const STORAGE_KEY = 'oneclick_tx_history'
const MAX_HISTORY = 10

export function useTxHistory() {
  const [history, setHistory] = useState<TxHistoryItem[]>([])

  // 从 localStorage 加载历史
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as TxHistoryItem[]
        setHistory(parsed)
      }
    } catch (err) {
      console.error('[useTxHistory] Failed to load history:', err)
    }
  }, [])

  // 保存到 localStorage
  const saveToStorage = useCallback((items: TxHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('[useTxHistory] Failed to save history:', err)
    }
  }, [])

  // 添加交易记录
  const addTx = useCallback((item: Omit<TxHistoryItem, 'id' | 'time'>) => {
    const newItem: TxHistoryItem = {
      id: item.digest,
      time: Date.now(),
      ...item
    }

    setHistory(prev => {
      // 去重（同 digest）
      const filtered = prev.filter(i => i.digest !== item.digest)
      // 添加到开头，限制最多 10 条
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  // 清空历史
  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    history,
    addTx,
    clearHistory
  }
}

/**
 * 便捷函数：添加成功的交易
 */
export function createSuccessTx(params: {
  digest: string
  network: string
  brandKey: string
  action: TxAction
  amount?: string
}): Omit<TxHistoryItem, 'id' | 'time'> {
  return {
    ...params,
    status: 'success'
  }
}

/**
 * 便捷函数：添加失败的交易
 */
export function createErrorTx(params: {
  digest: string
  network: string
  brandKey: string
  action: TxAction
  error: string
}): Omit<TxHistoryItem, 'id' | 'time'> {
  return {
    ...params,
    status: 'error'
  }
}
