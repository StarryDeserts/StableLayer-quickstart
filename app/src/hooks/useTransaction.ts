/**
 * 统一的交易状态管理 Hook
 * 状态机：idle -> building -> signing -> executing -> success/error
 */

import { useState, useCallback } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'

export type TxState = 'idle' | 'building' | 'signing' | 'executing' | 'success' | 'error'

export interface TxResult {
  digest?: string
  error?: string
}

export interface UseTransactionReturn {
  state: TxState
  result: TxResult
  isLoading: boolean
  execute: (buildTx: () => Promise<Transaction>) => Promise<boolean>
  reset: () => void
}

/**
 * 交易执行 Hook
 */
export function useTransaction(): UseTransactionReturn {
  const [state, setState] = useState<TxState>('idle')
  const [result, setResult] = useState<TxResult>({})

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()

  const execute = useCallback(async (buildTx: () => Promise<Transaction>): Promise<boolean> => {
    try {
      // Building
      setState('building')
      setResult({})
      const tx = await buildTx()

      // Signing & Executing
      setState('signing')
      const executeResult = await signAndExecute({
        transaction: tx as any // Type workaround for version compatibility
      })

      setState('executing')

      // Success
      setState('success')
      setResult({
        digest: executeResult.digest
      })
      return true
    } catch (err) {
      setState('error')
      setResult({
        error: (err as Error).message
      })
      return false
    }
  }, [signAndExecute])

  const reset = useCallback(() => {
    setState('idle')
    setResult({})
  }, [])

  const isLoading = ['building', 'signing', 'executing'].includes(state)

  return {
    state,
    result,
    isLoading,
    execute,
    reset
  }
}
