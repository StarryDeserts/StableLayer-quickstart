/**
 * StableLayer 查询逻辑
 *
 * 依据源码：
 * - .sdk-reference/stable-layer-sdk/src/index.ts (getTotalSupply, getTotalSupplyByCoinName)
 * - Sui SDK 文档（getBalance, getCoinMetadata, getObject 等）
 *
 * 实际导入来源：@mysten/sui SDK
 */

import { SuiClient } from '@mysten/sui/client'

/**
 * 余额查询结果
 */
export interface BalanceResult {
  totalBalance: string
  coinType: string
  decimals?: number
}

/**
 * Coin Metadata 查询结果
 */
export interface CoinMetadataResult {
  decimals: number
  name: string
  symbol: string
  description: string
  iconUrl?: string
}

/**
 * 获取指定 Coin 的余额
 *
 * @param suiClient - SuiClient 实例
 * @param address - 钱包地址
 * @param coinType - Coin Type 完整字符串（如 0x2::sui::SUI）
 * @returns 余额信息
 */
export async function getBalance(
  suiClient: SuiClient,
  address: string,
  coinType: string
): Promise<BalanceResult> {
  const result = await suiClient.getBalance({
    owner: address,
    coinType
  })

  // 尝试获取 metadata 以获取 decimals
  let decimals: number | undefined
  try {
    const metadata = await suiClient.getCoinMetadata({ coinType })
    decimals = metadata?.decimals
  } catch {
    decimals = undefined
  }

  return {
    totalBalance: result.totalBalance,
    coinType: result.coinType,
    decimals
  }
}

/**
 * 获取 Coin Metadata（名称、符号、小数位等）
 *
 * @param suiClient - SuiClient 实例
 * @param coinType - Coin Type 完整字符串
 * @returns Coin Metadata 或 null（如果不存在）
 */
export async function getCoinMetadata(
  suiClient: SuiClient,
  coinType: string
): Promise<CoinMetadataResult | null> {
  try {
    const metadata = await suiClient.getCoinMetadata({ coinType })

    if (!metadata) {
      return null
    }

    return {
      decimals: metadata.decimals,
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      iconUrl: metadata.iconUrl || undefined
    }
  } catch (error) {
    console.warn(`Failed to get coin metadata for ${coinType}:`, error)
    return null
  }
}

/**
 * 获取所有稳定币的总供应量
 *
 * 依据：.sdk-reference/stable-layer-sdk/src/index.ts:226-243 (getTotalSupply)
 *
 * 注意：此方法需要查询 STABLE_REGISTRY 对象
 * TODO: 当前未实现，因为需要知道 STABLE_REGISTRY 的具体结构
 *
 * @param suiClient - SuiClient 实例
 * @returns 总供应量字符串或 undefined
 */
export async function getTotalSupply(
  _suiClient: SuiClient
): Promise<string | undefined> {
  // TODO: 需要从 SDK 或链上查询 STABLE_REGISTRY
  // 依据：SDK index.ts:226-243
  //
  // const STABLE_REGISTRY = '0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642'
  //
  // const result = await suiClient.getObject({
  //   id: STABLE_REGISTRY,
  //   options: { showContent: true }
  // })
  //
  // 解析 content.fields.total_supply

  console.warn('getTotalSupply: 当前未实现，需要查询链上 STABLE_REGISTRY 对象')
  return undefined
}

/**
 * 获取指定稳定币的总供应量
 *
 * 依据：.sdk-reference/stable-layer-sdk/src/index.ts:245-267 (getTotalSupplyByCoinName)
 *
 * 注意：此方法需要查询 STABLE_REGISTRY 的 Dynamic Field
 * TODO: 当前未实现，因为需要知道 Dynamic Field 的结构
 *
 * @param suiClient - SuiClient 实例
 * @param coinType - Coin Type
 * @returns 总供应量字符串或 undefined
 */
export async function getTotalSupplyByCoinType(
  _suiClient: SuiClient,
  _coinType: string
): Promise<string | undefined> {
  // TODO: 需要使用 getDynamicFieldObject 查询
  // 依据：SDK index.ts:245-267
  //
  // const STABLE_REGISTRY = '0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642'
  //
  // const result = await suiClient.getDynamicFieldObject({
  //   parentId: STABLE_REGISTRY,
  //   name: {
  //     type: '0x1::type_name::TypeName',
  //     value: coinType
  //   }
  // })
  //
  // 解析 content.fields.treasury_cap.fields.total_supply.fields.value

  console.warn(
    'getTotalSupplyByCoinType: 当前未实现，需要查询链上 STABLE_REGISTRY Dynamic Field'
  )
  return undefined
}

/**
 * 获取 Redeem 配置（费率、上限等）
 *
 * TODO: 当前未实现，SDK 中没有提供查询 Redeem 配置的方法
 * 需要直接调用链上合约或等待 SDK 更新
 *
 * @param suiClient - SuiClient 实例
 * @param brandCoinType - 品牌 Coin Type
 * @returns Redeem 配置或 undefined
 */
export async function getRedeemConfig(
  _suiClient: SuiClient,
  _brandCoinType: string
): Promise<{ fee?: string; cap?: string } | undefined> {
  // TODO: 需要查询链上合约的 Redeem 配置
  // SDK 中未提供此接口，需要直接调用 Move 函数或查询对象

  console.warn('getRedeemConfig: 当前无法从链上读取该参数，SDK 未提供接口')
  return undefined
}

/**
 * 获取 Pending Redeem Ticket（待处理的赎回请求）
 *
 * TODO: 当前未实现，SDK 中没有提供查询用户 Pending Ticket 的方法
 * 需要查询用户拥有的对象或等待 SDK 更新
 *
 * @param suiClient - SuiClient 实例
 * @param address - 用户地址
 * @param brandCoinType - 品牌 Coin Type
 * @returns Pending Ticket 列表或 undefined
 */
export async function getPendingRedeemTickets(
  _suiClient: SuiClient,
  _address: string,
  _brandCoinType: string
): Promise<Array<{ id: string; amount: string; timestamp: string }> | undefined> {
  // TODO: 需要查询用户拥有的对象
  // 可能需要使用 getOwnedObjects 并过滤 Redeem Ticket 类型

  console.warn('getPendingRedeemTickets: 当前无法从链上读取该参数，SDK 未提供接口')
  return undefined
}

/**
 * 格式化余额（基础单位 → 小数）
 */
export function formatBalance(balance: string, decimals: number): string {
  const amount = BigInt(balance)
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return integerPart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '')
}

/**
 * 解析金额（小数 → 基础单位）
 */
export function parseAmount(amountString: string, decimals: number): bigint {
  // 移除前后空格
  const cleaned = amountString.trim()

  // 检查格式
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    throw new Error(`无效的金额格式: ${amountString}`)
  }

  // 分离整数和小数部分
  const [integerPart, fractionalPart = ''] = cleaned.split('.')

  // 检查小数位数
  if (fractionalPart.length > decimals) {
    throw new Error(`小数位数过多: ${fractionalPart.length} > ${decimals}`)
  }

  // 补齐小数位数
  const paddedFractional = fractionalPart.padEnd(decimals, '0')

  // 合并为基础单位
  const amountInBaseUnits = BigInt(integerPart + paddedFractional)

  return amountInBaseUnits
}
