/**
 * StableLayer 交易构建逻辑
 */

import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'
import { StableLayerClient } from 'stable-layer-sdk'
import type { NetworkType } from '../../config/networks'
import { BTC_USDC_COIN_TYPE } from '../../config/brands'
import { formatBalance } from './queries'

// 关键 shared objects（用于验证）
const CRITICAL_OBJECTS = {
  STABLE_REGISTRY: '0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642',
  STABLE_VAULT_FARM: '0xe958b7d102b33bf3c09addb0e2cdff102ff2c93afe407ec5c2a541e8959a650c',
  STABLE_VAULT: '0x65f38160110cd6859d05f338ff54b4f462883bb6f87c667a65c0fb0e537410a7',
  YIELD_VAULT: '0x0a7f6325253157cd437812fea0ceee9a6b96f2ec5eac410da6df39558ff3a4d1'
}

/**
 * SDK 支持的稳定币类型（硬编码，基于 SDK interface.ts）
 */
export type SDKStableCoinType = 'btcUSDC'

/**
 * 交易摘要信息
 */
export interface TxSummary {
  operation: 'mint' | 'redeem' | 'claim'
  brandCoinType: string
  amountFormatted?: string
  mode?: 't_plus_1' | 'instant'
  notes?: string[]
}

/**
 * 交易构建结果
 */
export interface TxBuildResult {
  tx: Transaction
  summary: TxSummary
}

/**
 * Mint 参数
 */
export interface BuildMintTxParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  usdcCoinType: string
  amountInBaseUnits: bigint
  network: NetworkType
}

/**
 * Redeem 参数
 */
export interface BuildRedeemTxParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  amountInBaseUnits?: bigint
  all?: boolean
  mode: 't_plus_1' | 'instant'
  network: NetworkType
}

/**
 * Claim 参数
 */
export interface BuildClaimTxParams {
  suiClient: SuiClient
  sender: string
  brandCoinType: string
  network: NetworkType
}

const SUPPORTED_LP_TOKEN: SDKStableCoinType = 'btcUSDC'
const STABLE_DECIMALS = 6

function assertMainnet(network: NetworkType): void {
  if (network !== 'mainnet') {
    throw new Error('StableLayer SDK 当前仅支持 mainnet，请切换到 mainnet')
  }
}

function assertSupportedBrand(brandCoinType: string): void {
  if (brandCoinType !== BTC_USDC_COIN_TYPE) {
    throw new Error(`当前 SDK 仅支持 btcUSDC: ${BTC_USDC_COIN_TYPE}`)
  }
}

/**
 * 验证关键 shared objects 是否存在（调试用）
 */
async function verifySharedObjects(suiClient: SuiClient): Promise<void> {
  console.log('[verifySharedObjects] Checking critical shared objects...')

  for (const [name, objectId] of Object.entries(CRITICAL_OBJECTS)) {
    try {
      const obj = await suiClient.getObject({
        id: objectId,
        options: { showType: true, showOwner: true }
      })

      if (!obj.data) {
        console.error(`[verifySharedObjects] ❌ ${name} not found: ${objectId}`)
        throw new Error(`Critical object ${name} not found on chain: ${objectId}`)
      }

      const owner = obj.data.owner
      const isShared = owner && typeof owner === 'object' && 'Shared' in owner
      console.log(`[verifySharedObjects] ✓ ${name}: ${objectId} (shared: ${isShared})`)

      if (isShared && owner && typeof owner === 'object' && 'Shared' in owner) {
        const sharedOwner = owner as { Shared: { initial_shared_version: string } }
        console.log(`  - initialSharedVersion: ${sharedOwner.Shared.initial_shared_version}`)
      }
    } catch (err) {
      console.error(`[verifySharedObjects] Error checking ${name}:`, err)
      throw new Error(`Failed to verify ${name} (${objectId}): ${(err as Error).message}`)
    }
  }

  console.log('[verifySharedObjects] All critical objects verified ✓')
}

export async function buildMintTx(params: BuildMintTxParams): Promise<TxBuildResult> {
  const { suiClient, sender, brandCoinType, usdcCoinType, amountInBaseUnits, network } = params

  assertMainnet(network)
  assertSupportedBrand(brandCoinType)

  console.log('[buildMintTx] Starting...', {
    network,
    sender,
    brandCoinType,
    usdcCoinType,
    amountInBaseUnits: amountInBaseUnits.toString()
  })

  // 验证关键 shared objects（仅首次或调试时）
  await verifySharedObjects(suiClient)

  const tx = new Transaction()
  tx.setSender(sender)

  // 查询用户的 USDC coins
  console.log('[buildMintTx] Fetching USDC coins from wallet...')
  const usdcCoins = await suiClient.getCoins({
    owner: sender,
    coinType: usdcCoinType
  })

  if (usdcCoins.data.length === 0) {
    throw new Error('钱包中没有 USDC，请先获取 USDC')
  }

  console.log(`[buildMintTx] Found ${usdcCoins.data.length} USDC coins`)

  // 合并 USDC coins 并 split 出需要的金额
  const [primaryCoin, ...otherCoins] = usdcCoins.data.map(coin => coin.coinObjectId)

  if (otherCoins.length > 0) {
    tx.mergeCoins(primaryCoin, otherCoins)
  }

  const [usdcCoin] = tx.splitCoins(primaryCoin, [amountInBaseUnits])

  const client = new StableLayerClient({ network, sender })

  console.log('[buildMintTx] Calling SDK buildMintTx...')

  await client.buildMintTx({
    tx,
    lpToken: SUPPORTED_LP_TOKEN,
    usdcCoin,
    amount: amountInBaseUnits,
    sender,
    autoTransfer: true
  })

  console.log('[buildMintTx] Transaction built successfully')

  return {
    tx,
    summary: {
      operation: 'mint',
      brandCoinType,
      amountFormatted: formatBalance(amountInBaseUnits.toString(), STABLE_DECIMALS)
    }
  }
}

export async function buildRedeemTx(params: BuildRedeemTxParams): Promise<TxBuildResult> {
  const { sender, brandCoinType, amountInBaseUnits, all, mode, network } = params

  assertMainnet(network)
  assertSupportedBrand(brandCoinType)

  if (mode !== 't_plus_1') {
    throw new Error('StableLayer SDK 当前仅支持 T+1 赎回模式')
  }

  const tx = new Transaction()
  const client = new StableLayerClient({ network, sender })

  await client.buildBurnTx({
    tx,
    lpToken: SUPPORTED_LP_TOKEN,
    amount: all ? undefined : amountInBaseUnits,
    all,
    sender,
    autoTransfer: true
  })

  return {
    tx,
    summary: {
      operation: 'redeem',
      brandCoinType,
      amountFormatted: all
        ? 'ALL'
        : amountInBaseUnits
          ? formatBalance(amountInBaseUnits.toString(), STABLE_DECIMALS)
          : undefined,
      mode: 't_plus_1'
    }
  }
}

export async function buildClaimTx(params: BuildClaimTxParams): Promise<TxBuildResult> {
  const { sender, brandCoinType, network } = params

  assertMainnet(network)
  assertSupportedBrand(brandCoinType)

  const tx = new Transaction()
  const client = new StableLayerClient({ network, sender })

  await client.buildClaimTx({
    tx,
    lpToken: SUPPORTED_LP_TOKEN,
    sender,
    autoTransfer: true
  })

  return {
    tx,
    summary: {
      operation: 'claim',
      brandCoinType
    }
  }
}
