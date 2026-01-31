/**
 * StableLayer 适配层统一接口
 *
 * 目标：
 * - 为 UI 层提供简洁、统一的 API
 * - 隐藏 SDK 的实现细节
 * - 提供完善的错误处理和参数验证
 * - 生成易于理解的交易摘要
 *
 * 铁律：
 * 1. .sdk-reference 仅用于分析 SDK API，不作为依赖
 * 2. 实际 import 必须来自已安装的 'stable-layer-sdk' 包
 */

import { SuiClient } from '@mysten/sui/client'
import type { NetworkType } from '../../config/networks'

// 导入交易构建函数
import {
  buildMintTx as buildMintTxImpl,
  buildRedeemTx as buildRedeemTxImpl,
  buildClaimTx as buildClaimTxImpl,
  type TxBuildResult,
  type TxSummary
} from './tx'

// 导入查询函数
import {
  getBalance,
  getCoinMetadata,
  getTotalSupply,
  getTotalSupplyByCoinType,
  getRedeemConfig,
  getPendingRedeemTickets,
  formatBalance,
  parseAmount,
  type BalanceResult,
  type CoinMetadataResult
} from './queries'

// Re-export 类型
export type {
  TxBuildResult,
  TxSummary,
  BalanceResult,
  CoinMetadataResult
}

/**
 * Mint 交易参数（简化版）
 */
export interface MintParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  usdcCoinType: string
  amountDecimalString: string // 用户输入的小数形式（如 "1.5"）
  network: NetworkType
}

/**
 * Redeem 交易参数（简化版）
 */
export interface RedeemParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  amountDecimalString?: string // 用户输入的小数形式，或使用 all
  all?: boolean
  mode: 't_plus_1' | 'instant'
  network: NetworkType
}

/**
 * Claim 交易参数（简化版）
 */
export interface ClaimParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  network: NetworkType
}

/**
 * Coin Metadata 查询参数
 */
export interface FetchCoinMetadataParams {
  suiClient: SuiClient
  coinType: string
}

/**
 * 构建 Mint 交易
 *
 * @param params - Mint 参数
 * @returns 交易和摘要
 * @throws 如果 brandCoinType 是 TODO_REPLACE_ME
 * @throws 如果 SDK 不支持该品牌
 * @throws 如果金额格式无效
 */
export async function buildMintTx(params: MintParams): Promise<TxBuildResult> {
  const { suiClient, sender, brandCoinType, usdcCoinType, amountDecimalString, network } = params

  // 验证参数
  validateSender(sender)
  validateCoinType(brandCoinType, 'Brand Coin Type')
  validateCoinType(usdcCoinType, 'USDC Coin Type')

  // 解析金额（假设 USDC 为 6 位小数）
  const usdcDecimals = 6
  let amountInBaseUnits: bigint
  try {
    amountInBaseUnits = parseAmount(amountDecimalString, usdcDecimals)
  } catch (error) {
    throw new Error(`Mint 金额解析失败: ${(error as Error).message}`)
  }

  // 验证金额
  if (amountInBaseUnits <= 0n) {
    throw new Error('Mint 金额必须大于 0')
  }

  // 调用底层构建函数
  return buildMintTxImpl({
    suiClient,
    sender,
    brandCoinType,
    usdcCoinType,
    amountInBaseUnits,
    network
  })
}

/**
 * 构建 Redeem 交易
 *
 * @param params - Redeem 参数
 * @returns 交易和摘要
 * @throws 如果 brandCoinType 是 TODO_REPLACE_ME
 * @throws 如果 SDK 不支持该品牌
 * @throws 如果模式不受支持（如 instant）
 * @throws 如果既没有 amount 也没有 all
 */
export async function buildRedeemTx(params: RedeemParams): Promise<TxBuildResult> {
  const { suiClient, sender, brandCoinType, amountDecimalString, all, mode, network } = params

  // 验证参数
  validateSender(sender)
  validateCoinType(brandCoinType, 'Brand Coin Type')

  // 验证 amount 或 all
  if (!amountDecimalString && !all) {
    throw new Error('Redeem 必须提供 amountDecimalString 或 all 参数')
  }

  if (amountDecimalString && all) {
    throw new Error('Redeem 不能同时提供 amountDecimalString 和 all 参数')
  }

  // 解析金额（如果提供）
  let amountInBaseUnits: bigint | undefined
  if (amountDecimalString) {
    // 假设品牌稳定币为 6 位小数（TODO: 从链上查询 metadata）
    const brandDecimals = 6
    try {
      amountInBaseUnits = parseAmount(amountDecimalString, brandDecimals)
    } catch (error) {
      throw new Error(`Redeem 金额解析失败: ${(error as Error).message}`)
    }

    // 验证金额
    if (amountInBaseUnits <= 0n) {
      throw new Error('Redeem 金额必须大于 0')
    }
  }

  // 调用底层构建函数
  return buildRedeemTxImpl({
    suiClient,
    sender,
    brandCoinType,
    amountInBaseUnits,
    all,
    mode,
    network
  })
}

/**
 * 构建 Claim 交易
 *
 * @param params - Claim 参数
 * @returns 交易和摘要
 * @throws 如果 brandCoinType 是 TODO_REPLACE_ME
 * @throws 如果 SDK 不支持该品牌
 */
export async function buildClaimTx(params: ClaimParams): Promise<TxBuildResult> {
  const { suiClient, sender, brandCoinType, network } = params

  // 验证参数
  validateSender(sender)
  validateCoinType(brandCoinType, 'Brand Coin Type')

  // 调用底层构建函数
  return buildClaimTxImpl({
    suiClient,
    sender,
    brandCoinType,
    network
  })
}

/**
 * 获取 Coin Metadata
 *
 * @param params - 查询参数
 * @returns Coin Metadata 或 null
 */
export async function fetchCoinMetadata(
  params: FetchCoinMetadataParams
): Promise<CoinMetadataResult | null> {
  const { suiClient, coinType } = params

  validateCoinType(coinType, 'Coin Type')

  return getCoinMetadata(suiClient, coinType)
}

/**
 * 获取余额
 *
 * @param suiClient - SuiClient 实例
 * @param address - 钱包地址
 * @param coinType - Coin Type
 * @returns 余额信息
 */
export async function fetchBalance(
  suiClient: SuiClient,
  address: string,
  coinType: string
): Promise<BalanceResult> {
  validateSender(address)
  validateCoinType(coinType, 'Coin Type')

  return getBalance(suiClient, address, coinType)
}

/**
 * 格式化余额
 *
 * @param balance - 余额字符串（基础单位）
 * @param decimals - 小数位数
 * @returns 格式化后的余额字符串
 */
export { formatBalance }

/**
 * 解析金额
 *
 * @param amountString - 金额字符串（小数形式）
 * @param decimals - 小数位数
 * @returns 基础单位的 bigint
 */
export { parseAmount }

/**
 * 获取总供应量
 *
 * 注意：当前未实现，需要查询链上 STABLE_REGISTRY
 */
export { getTotalSupply }

/**
 * 获取指定稳定币的总供应量
 *
 * 注意：当前未实现，需要查询链上 Dynamic Field
 */
export { getTotalSupplyByCoinType }

/**
 * 获取 Redeem 配置
 *
 * 注意：当前未实现，SDK 未提供接口
 */
export { getRedeemConfig }

/**
 * 获取 Pending Redeem Tickets
 *
 * 注意：当前未实现，SDK 未提供接口
 */
export { getPendingRedeemTickets }

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 验证钱包地址
 */
function validateSender(sender: string): void {
  if (!sender || sender.trim() === '') {
    throw new Error('钱包地址不能为空')
  }

  if (!sender.startsWith('0x')) {
    throw new Error('钱包地址格式错误，必须以 0x 开头')
  }
}

/**
 * 验证 Coin Type
 */
function validateCoinType(coinType: string, fieldName: string): void {
  if (!coinType || coinType.trim() === '') {
    throw new Error(`${fieldName} 不能为空`)
  }

  if (coinType === 'TODO_REPLACE_ME') {
    throw new Error(`${fieldName} 未配置，请先在配置文件中设置正确的 Coin Type`)
  }

  // 简单验证格式（0x...::module::Type）
  if (!coinType.includes('::')) {
    throw new Error(`${fieldName} 格式错误，应包含 :: 分隔符`)
  }
}
