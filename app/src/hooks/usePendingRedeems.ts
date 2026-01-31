/**
 * Pending Redeems 管理 Hook
 * 记录 T+1 赎回请求（本地存储）
 */

import { useState, useCallback, useEffect } from 'react'
import type { PendingRedeemItem } from '../types/history'

const STORAGE_KEY = 'oneclick_pending_redeems'

export function usePendingRedeems() {
  const [pendings, setPendings] = useState<PendingRedeemItem[]>([])

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as PendingRedeemItem[]
        // 过滤掉超过 7 天的记录
        const now = Date.now()
        const sevenDays = 7 * 24 * 60 * 60 * 1000
        const filtered = parsed.filter(item => now - item.time < sevenDays)
        setPendings(filtered)
        if (filtered.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        }
      }
    } catch (err) {
      console.error('[usePendingRedeems] Failed to load:', err)
    }
  }, [])

  // 保存到 localStorage
  const saveToStorage = useCallback((items: PendingRedeemItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('[usePendingRedeems] Failed to save:', err)
    }
  }, [])

  // 添加 pending redeem
  const addPending = useCallback((item: PendingRedeemItem) => {
    setPendings(prev => {
      // 去重（同 digest）
      const filtered = prev.filter(i => i.digest !== item.digest)
      const updated = [item, ...filtered]
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  // 移除 pending redeem（用户手动确认完成）
  const removePending = useCallback((digest: string) => {
    setPendings(prev => {
      const updated = prev.filter(i => i.digest !== digest)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  // 清空所有 pending
  const clearPendings = useCallback(() => {
    setPendings([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    pendings,
    addPending,
    removePending,
    clearPendings
  }
}
