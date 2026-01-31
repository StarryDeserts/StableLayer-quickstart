/**
 * StableLayer 品牌配置
 * 当前 SDK 仅支持 btcUSDC（mainnet）
 */

export type RedeemMode = 't_plus_1' | 'instant'

export interface BrandConfig {
  /** 唯一标识符 */
  key: string
  /** 展示名称 */
  displayName: string
  /** Coin Type（完整的类型字符串） */
  coinType: string
  /** 支持的赎回模式 */
  supportedRedeemModes: RedeemMode[]
  /** 标签（用于分类/筛选） */
  tags?: string[]
  /** 图标 URL */
  iconUrl?: string
  /** 备注说明 */
  notes?: string
}

/**
 * 预置品牌配置
 */
export const BTC_USDC_COIN_TYPE =
  '0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC'

export const BRANDS: BrandConfig[] = [
  {
    key: 'btcUSDC',
    displayName: 'btcUSDC',
    coinType: BTC_USDC_COIN_TYPE,
    supportedRedeemModes: ['t_plus_1'],
    tags: ['stable', 'mainnet-only'],
    notes: '当前 SDK 仅支持 mainnet btcUSDC'
  }
]

/**
 * 默认品牌
 */
export const DEFAULT_BRAND_KEY = 'btcUSDC'

/**
 * 根据 key 查找品牌配置
 */
export function getBrandByKey(key: string): BrandConfig | undefined {
  return BRANDS.find(brand => brand.key === key)
}

/**
 * 获取默认品牌
 */
export function getDefaultBrand(): BrandConfig {
  return getBrandByKey(DEFAULT_BRAND_KEY) || BRANDS[0]
}

/**
 * 验证品牌配置是否完整（可用于交易）
 */
export function isBrandConfigured(brand: BrandConfig): boolean {
  return (
    brand.coinType !== 'TODO_REPLACE_ME' &&
    brand.coinType.length > 0 &&
    brand.coinType.includes('::')
  )
}

/**
 * 获取品牌配置错误信息
 */
export function getBrandConfigErrors(brand: BrandConfig): string[] {
  const errors: string[] = []

  if (brand.coinType === 'TODO_REPLACE_ME') {
    errors.push('Coin Type 未配置')
  } else if (!brand.coinType.includes('::')) {
    errors.push('Coin Type 格式错误（应包含 ::）')
  }

  if (brand.supportedRedeemModes.length === 0) {
    errors.push('未配置支持的赎回模式')
  }

  return errors
}

/**
 * 检查品牌是否支持指定赎回模式
 */
export function supportsRedeemMode(brand: BrandConfig, mode: RedeemMode): boolean {
  return brand.supportedRedeemModes.includes(mode)
}
