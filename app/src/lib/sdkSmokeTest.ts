/**
 * SDK 烟雾测试
 * 启动时检查 SDK 导入是否正常
 */

import { StableLayerClient } from 'stable-layer-sdk'

export async function sdkSmokeTestSync(): Promise<boolean> {
  try {
    if (!StableLayerClient) {
      throw new Error('StableLayerClient not found')
    }
    console.log('✅ StableLayer SDK loaded OK')
    return true
  } catch (error) {
    console.error('❌ StableLayer SDK load failed:', (error as Error).message)
    return false
  }
}
