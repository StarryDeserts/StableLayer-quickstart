/**
 * 交易历史类型定义
 */

export type TxAction = 'mint' | 'redeem' | 'claim'
export type TxStatus = 'success' | 'error'

export interface TxHistoryItem {
  id: string // 唯一标识（digest）
  time: number // 时间戳
  network: string // mainnet/testnet
  brandKey: string // 品牌标识
  action: TxAction // 操作类型
  digest: string // 交易 digest
  status: TxStatus // 状态
  amount?: string // 金额（可选）
  error?: string // 错误信息（可选）
}

export interface PendingRedeemItem {
  digest: string // 交易 digest
  time: number // 提交时间
  network: string
  brandKey: string
  amount: string // 赎回金额
  brandCoinType: string // 品牌 coinType
}
