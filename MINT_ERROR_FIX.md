# Mint 交易错误修复文档

## 问题描述

执行 Mint 交易时遇到错误：
```
Unable to process transaction
Error checking transaction input objects: Could not find the referenced object
0x52a724433c92c1519a917753cd7340a41747d8a716e74db4d966722fefa41040
at version None
```

## 根本原因分析

### 1. `coinWithBalance` API 使用错误
**原代码**:
```typescript
const usdcCoin = coinWithBalance({
  balance: amountInBaseUnits,
  type: usdcCoinType
})(tx)
```

**问题**:
- `coinWithBalance` 创建的是一个"虚拟" coin 引用，用于模拟特定金额的 coin
- 但 StableLayer SDK 期望的是**真实的 coin object reference**（从用户钱包中选择的实际 USDC coins）
- 虚拟 coin 没有实际的 object ID 和 version，导致 "version None" 错误

### 2. Shared Objects 引用问题
**错误的 Object ID**: `0x52a724433c92c1519a917753cd7340a41747d8a716e74db4d966722fefa41040`

这个 ID 不是我们配置的任何 StableLayer shared objects，可能来自：
- BucketClient 内部使用的 shared objects（treasury、PSM pool 等）
- 如果这些 shared objects 没有正确提供 `initialSharedVersion`，就会出现 "version None" 错误

### 3. StableLayer SDK 依赖链
```
StableLayerClient
  └─> BucketClient (from @bucket-protocol/sdk)
       └─> 使用多个 shared objects:
           - Treasury
           - PSM Pool
           - Saving Pool
           - Oracle/Price Feed
```

如果任何一个 shared object 引用不正确，都会导致交易失败。

## 修复方案

### 修复 1: 使用真实 USDC Coins

**新代码** (app/src/lib/stablelayer/tx.ts):
```typescript
// 1. 查询用户钱包中的 USDC coins
const usdcCoins = await suiClient.getCoins({
  owner: sender,
  coinType: usdcCoinType
})

if (usdcCoins.data.length === 0) {
  throw new Error('钱包中没有 USDC，请先获取 USDC')
}

// 2. 合并所有 USDC coins
const [primaryCoin, ...otherCoins] = usdcCoins.data.map(coin => coin.coinObjectId)

if (otherCoins.length > 0) {
  tx.mergeCoins(primaryCoin, otherCoins)
}

// 3. Split 出需要的金额
const [usdcCoin] = tx.splitCoins(primaryCoin, [amountInBaseUnits])
```

**优势**:
- 使用真实的 coin object references
- 正确的 object ID 和 version
- 符合 Sui 交易规范

### 修复 2: 添加 Shared Objects 验证

添加验证函数检查所有关键 shared objects：

```typescript
const CRITICAL_OBJECTS = {
  STABLE_REGISTRY: '0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642',
  STABLE_VAULT_FARM: '0xe958b7d102b33bf3c09addb0e2cdff102ff2c93afe407ec5c2a541e8959a650c',
  STABLE_VAULT: '0x65f38160110cd6859d05f338ff54b4f462883bb6f87c667a65c0fb0e537410a7',
  YIELD_VAULT: '0x0a7f6325253157cd437812fea0ceee9a6b96f2ec5eac410da6df39558ff3a4d1'
}

async function verifySharedObjects(suiClient: SuiClient): Promise<void> {
  for (const [name, objectId] of Object.entries(CRITICAL_OBJECTS)) {
    const obj = await suiClient.getObject({
      id: objectId,
      options: { showType: true, showOwner: true }
    })

    if (!obj.data) {
      throw new Error(`Critical object ${name} not found: ${objectId}`)
    }

    // 检查是否为 shared object 并获取 initialSharedVersion
    const isShared = obj.data.owner && typeof obj.data.owner === 'object' && 'Shared' in obj.data.owner
    console.log(`✓ ${name}: ${objectId} (shared: ${isShared})`)

    if (isShared && obj.data.owner && 'Shared' in obj.data.owner) {
      console.log(`  - initialSharedVersion: ${obj.data.owner.Shared.initial_shared_version}`)
    }
  }
}
```

### 修复 3: 添加详细日志

在整个交易构建流程中添加日志：
```typescript
console.log('[buildMintTx] Starting...', {
  network,
  sender,
  brandCoinType,
  usdcCoinType,
  amountInBaseUnits: amountInBaseUnits.toString()
})

console.log('[buildMintTx] Fetching USDC coins from wallet...')
console.log(`[buildMintTx] Found ${usdcCoins.data.length} USDC coins`)
console.log('[buildMintTx] Calling SDK buildMintTx...')
console.log('[buildMintTx] Transaction built successfully')
```

## 测试步骤

### 前提条件
1. **网络**: 必须切换到 Mainnet
2. **钱包**: 已连接 Sui 钱包
3. **余额**: 钱包中有足够的 USDC

### 测试流程

1. **打开应用**
   ```
   http://localhost:3001/  (或 3000，取决于端口)
   ```

2. **连接钱包**
   - 点击 "Connect Wallet"
   - 选择你的 Sui 钱包（如 Sui Wallet、Suiet 等）
   - 授权连接

3. **检查配置**
   - 确认网络选择为 "Mainnet"
   - 确认品牌选择为 "btcUSDC"

4. **查看余额**
   - 应该能看到 USDC 余额
   - 如果余额为 0，需要先获取 USDC（可以从交易所转入或使用 faucet）

5. **执行 Mint**
   - 切换到 "Mint" tab
   - 输入金额（如 "1"）
   - 点击 "Mint" 按钮

6. **观察控制台日志**
   打开浏览器开发者工具 (F12)，查看 Console，应该看到：
   ```
   [buildMintTx] Starting...
   [verifySharedObjects] Checking critical shared objects...
   ✓ STABLE_REGISTRY: 0x213f... (shared: true)
     - initialSharedVersion: 696362017
   ✓ STABLE_VAULT_FARM: 0xe958... (shared: true)
   ✓ STABLE_VAULT: 0x65f3... (shared: true)
   ✓ YIELD_VAULT: 0x0a7f... (shared: true)
   [verifySharedObjects] All critical objects verified ✓
   [buildMintTx] Fetching USDC coins from wallet...
   [buildMintTx] Found X USDC coins
   [buildMintTx] Calling SDK buildMintTx...
   [buildMintTx] Transaction built successfully
   ```

7. **签名交易**
   - 钱包会弹出签名请求
   - 检查交易详情
   - 确认并签名

8. **等待结果**
   - 交易执行中...
   - 成功后会显示 TxResultCard（绿色边框）
   - 可以点击 "在 Explorer 中查看" 查看交易详情

### 预期结果

✅ **成功**:
- 交易成功提交
- 获得 transaction digest
- TxResultCard 显示交易详情
- 余额自动刷新
- 交易添加到历史记录

❌ **如果仍然失败**，检查：
1. 是否在 Mainnet（不是 Testnet）
2. USDC 余额是否充足
3. 浏览器控制台是否有其他错误
4. 钱包是否正确连接

## 可能的其他错误

### 错误 1: "钱包中没有 USDC"
**原因**: 用户钱包没有 USDC
**解决**:
- 从交易所转入 USDC 到 Sui mainnet
- 或使用其他方式获取 USDC

### 错误 2: "Critical object XXX not found"
**原因**: Shared object 在链上不存在
**解决**:
- 确认网络为 Mainnet
- 检查 RPC endpoint 是否正常
- 等待网络同步

### 错误 3: "Insufficient gas"
**原因**: 钱包中 SUI 余额不足支付 gas
**解决**:
- 转入一些 SUI 到钱包
- 通常 0.1 SUI 就足够

### 错误 4: BucketClient 相关错误
**原因**: BucketClient 使用的 shared objects 版本不匹配
**解决**:
- 这可能需要等待 `@bucket-protocol/sdk` 更新
- 或者检查是否有 SDK 版本不兼容问题

## 技术细节

### Shared Object 引用规范

在 Sui 中，shared object 必须提供：
1. **Object ID**: 唯一标识符
2. **initialSharedVersion**: 对象首次被共享时的版本号

如果缺少 `initialSharedVersion`，transaction 验证会失败，显示 "version None"。

### StableLayer 架构

```
Mint 操作涉及的 shared objects:
1. STABLE_REGISTRY (0x213f...)
   - 管理所有稳定币的注册表
   - initialSharedVersion: 696362017

2. STABLE_VAULT_FARM (0xe958...)
   - 流动性挖矿农场

3. STABLE_VAULT (0x65f3...)
   - 稳定币金库

4. YIELD_VAULT (0x0a7f...)
   - 收益金库

5. BucketClient objects (来自 @bucket-protocol/sdk):
   - Treasury
   - PSM Pool
   - Saving Pool
   - Oracle
```

所有这些对象都必须正确引用，否则交易会失败。

## 依赖版本

当前使用的版本：
```json
{
  "@mysten/sui": "^1.44.0",
  "@mysten/dapp-kit": "0.14.53",
  "stable-layer-sdk": "^1.1.0",
  "@bucket-protocol/sdk": "~1.1.4" (通过 stable-layer-sdk)
}
```

如果问题持续存在，可能需要检查这些包的版本兼容性。

## 总结

主要修复：
1. ✅ 使用真实 USDC coins 而不是 `coinWithBalance`
2. ✅ 添加 shared objects 验证
3. ✅ 添加详细日志便于调试

这些修复应该能解决 "Could not find the referenced object" 错误，让 Mint 交易正常执行。
