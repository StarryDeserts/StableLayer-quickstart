# StableLayer SDK API 映射文档

**生成时间**: 2026-01-30
**SDK 版本**: 1.1.0
**分析依据**: 源码分析（index.ts, interface.ts, constants.ts, client.test.ts）

---

## 📦 SDK 包信息

### 包名与版本

```json
{
  "name": "stable-layer-sdk",
  "version": "1.1.0",
  "description": "A TypeScript SDK for Stable Layer"
}
```

### 入口点配置

| 类型 | 路径 |
|------|------|
| **CommonJS** | `./dist/cjs/index.cjs` |
| **ES Module** | `./dist/esm/index.mjs` |
| **TypeScript 类型** | `./dist/types/index.d.ts` |

### 构建脚本

```bash
# 清理构建产物
pnpm run clean

# 完整构建（esbuild + TypeScript 类型）
pnpm run build

# 仅构建类型
pnpm run build:types

# 开发模式（监听 TypeScript 变化）
pnpm run dev

# 运行测试
pnpm test
```

---

## 🔌 Workspace 引用方式

### 1. 在 app/package.json 中添加依赖

```json
{
  "dependencies": {
    "stable-layer-sdk": "workspace:*"
  }
}
```

### 2. 导入方式

```typescript
// 导入主类
import { StableLayerClient } from 'stable-layer-sdk'

// 导入类型定义
import type {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams,
  StableCoinType,
  CoinResult
} from 'stable-layer-sdk'

// 导入常量（如果需要）
import * as constants from 'stable-layer-sdk/libs/constants'
```

**注意**: SDK 需要先构建才能使用，运行 `pnpm -C .sdk-reference/stable-layer-sdk build`

---

## 🎯 核心 API 导出列表

### 主类: `StableLayerClient`

**源码位置**: `src/index.ts`

#### 构造函数

```typescript
constructor(config: StableLayerConfig)
```

**参数**:
```typescript
interface StableLayerConfig {
  network: "mainnet" | "testnet"  // 网络环境
  sender: string                   // 默认发送者地址
}
```

**示例**:
```typescript
const client = new StableLayerClient({
  network: "mainnet",
  sender: "0x..." // 用户钱包地址
})
```

---

#### 公开方法

| 方法名 | 功能 | 返回值 |
|--------|------|--------|
| `buildMintTx()` | 构建 Mint 交易（铸造稳定币） | `Promise<CoinResult \| undefined>` |
| `buildBurnTx()` | 构建 Burn 交易（赎回 USDC，即 Redeem） | `Promise<CoinResult \| undefined>` |
| `buildClaimTx()` | 构建 Claim 交易（领取奖励） | `Promise<CoinResult \| undefined>` |
| `getTotalSupply()` | 获取所有稳定币总供应量 | `Promise<string \| undefined>` |
| `getTotalSupplyByCoinName()` | 获取指定币种的供应量 | `Promise<string \| undefined>` |

---

### 类型定义

**源码位置**: `src/interface.ts`

```typescript
// Mint 交易参数
interface MintTransactionParams {
  tx: Transaction              // Sui 交易对象
  lpToken: StableCoinType      // 稳定币类型（目前只有 "btcUSDC"）
  usdcCoin: TransactionArgument // USDC Coin 对象
  amount: bigint               // Mint 数量（与 usdcCoin balance 一致）
  sender?: string              // 覆盖默认 sender（可选）
  autoTransfer?: boolean       // 是否自动转移到 sender（默认 true）
}

// Burn 交易参数（即 Redeem）
interface BurnTransactionParams {
  tx: Transaction              // Sui 交易对象
  lpToken: StableCoinType      // 稳定币类型
  amount?: bigint              // Burn 数量（与 all 二选一）
  all?: boolean                // 是否 burn 全部余额（与 amount 二选一）
  sender?: string              // 覆盖默认 sender（可选）
  autoTransfer?: boolean       // 是否自动转移 USDC 到 sender（默认 true）
}

// Claim 交易参数
interface ClaimTransactionParams {
  tx: Transaction              // Sui 交易对象
  lpToken: StableCoinType      // 稳定币类型
  sender?: string              // 覆盖默认 sender（可选）
  autoTransfer?: boolean       // 是否自动转移奖励到 sender（默认 true）
}

// 稳定币类型（目前仅支持一种）
type StableCoinType = "btcUSDC"

// Coin 结果类型
type CoinResult = TransactionResult | TransactionResult[number]
```

---

### 常量配置

**源码位置**: `src/libs/constants.ts`

#### 网络对象 ID（Mainnet）

| 常量名 | 说明 | Object ID |
|--------|------|-----------|
| `STABLE_REGISTRY` | StableLayer 注册表（核心） | `0x213f4d...6da41642` |
| `STABLE_VAULT` | 稳定币金库 | `0x65f381...e537410a7` |
| `STABLE_VAULT_FARM` | 流动性挖矿农场 | `0xe958b7...e8959a650c` |
| `YIELD_VAULT` | 收益金库 | `0x0a7f63...8ff3a4d1` |

#### Package ID

| 常量名 | 说明 | Package ID |
|--------|------|------------|
| `STABLE_LAYER_PACKAGE_ID` | StableLayer 核心合约 | `0x41e25d...fc9f17d6` |
| `STABLE_VAULT_FARM_PACKAGE_ID` | Farm 合约 | `0x00d31d...c8250de4d` |
| `YIELD_USDB_PACKAGE_ID` | Yield USDB 合约 | `0x203eeb...052728705` |

#### Coin 类型

| 常量名 | 说明 | Coin Type |
|--------|------|-----------|
| `USDC_TYPE` | USDC 稳定币 | `0xdba346...e2f900e7::usdc::USDC` |
| `BTC_USD_TYPE` | btcUSDC 稳定币 | `0x6d9fc3...c5b5834::btc_usdc::BtcUSDC` |
| `YUSDB_TYPE` | YesUSDB | `0xac718b...fc9f17d6::yesusdb::YesUSDB` |
| `STABLE_LP_TYPE` | LakeUSDC LP Token | `0xb75744...fb97c567::lake_usdc::LakeUSDC` |
| `SAVING_TYPE` | SUSDB (Bucket Saving) | `0x38f61c...b1cde1e::susdb::SUSDB` |

#### 稳定币映射

```typescript
const STABLE_COIN_TYPES: Record<StableCoinType, string> = {
  btcUSDC: BTC_USD_TYPE
}
```

---

## 🔄 核心流程伪代码

### 1. Mint 流程（铸造稳定币）

**目的**: 用户存入 USDC，铸造等值的 btcUSDC 稳定币

**依据**: `src/index.ts:43-98` (buildMintTx 方法)

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
import { Transaction, coinWithBalance } from '@mysten/sui/transactions'

// 初始化客户端
const client = new StableLayerClient({
  network: "mainnet",
  sender: userAddress
})

// 创建交易
const tx = new Transaction()

// 准备 USDC Coin 对象（从用户钱包中选择）
const usdcCoin = coinWithBalance({
  balance: BigInt(1_000_000), // 1 USDC (6 decimals)
  type: "0xdba34...::usdc::USDC"
})(tx)

// 构建 Mint 交易
await client.buildMintTx({
  tx,
  lpToken: "btcUSDC",
  usdcCoin: usdcCoin,
  amount: BigInt(1_000_000),
  sender: userAddress,
  autoTransfer: true  // 自动转移 btcUSDC 到 sender
})

// 签名并执行交易
const result = await signAndExecuteTransaction({
  transaction: tx,
  // ... wallet options
})
```

**内部流程**:
1. 调用 `mint()` 函数（来自 generated/stable_layer）
2. 传入 USDC，返回 `stableCoin` 和 `loan`
3. 调用 `receive()` 函数（来自 stable_vault_farm）
4. 将 `loan` 存入 Farm，开始赚取收益
5. 如果 `autoTransfer=true`，将 `stableCoin` 转移到用户地址

**关键参数**:
- 需要 `STABLE_REGISTRY`（预配置常量）
- 需要 Bucket Protocol 的 `treasury`、`psmPool`、`savingPool`（SDK 自动处理）
- 需要聚合价格 `uPrice`（SDK 自动调用 BucketClient 获取）

---

### 2. Redeem 流程（赎回 USDC）

**目的**: 用户销毁 btcUSDC 稳定币，赎回等值的 USDC

**依据**: `src/index.ts:100-185` (buildBurnTx 方法)

**注意**: SDK 中称为 "Burn"，实际就是 "Redeem" 操作

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
import { Transaction } from '@mysten/sui/transactions'

const client = new StableLayerClient({
  network: "mainnet",
  sender: userAddress
})

const tx = new Transaction()

// 方式1: 赎回指定数量
await client.buildBurnTx({
  tx,
  lpToken: "btcUSDC",
  amount: BigInt(500_000), // 0.5 btcUSDC
  sender: userAddress,
  autoTransfer: true  // 自动转移 USDC 到 sender
})

// 方式2: 赎回全部余额
await client.buildBurnTx({
  tx,
  lpToken: "btcUSDC",
  all: true,  // 赎回用户所有的 btcUSDC
  sender: userAddress,
  autoTransfer: true
})

// 签名并执行
const result = await signAndExecuteTransaction({
  transaction: tx,
  // ... wallet options
})
```

**内部流程（T+1 机制）**:
1. 调用 `releaseRewards()`（释放 Yield Vault 奖励到 Saving Pool）
2. 调用 `requestBurn()`（请求销毁稳定币）
3. 调用 `pay()`（从 Farm 提取对应的 USDC）
4. 调用 `fulfillBurn()`（完成销毁，返回 USDC）
5. 如果 `autoTransfer=true`，将 USDC 转移到用户地址

**重要**:
- 必须提供 `amount` 或 `all` 参数之一，否则抛出错误
- `all=true` 时，SDK 会先查询用户的 btcUSDC 余额（异步操作）
- Redeem 操作会自动触发 `releaseRewards()`，确保收益正确分配

---

### 3. Claim 流程（领取奖励）

**目的**: 领取流动性挖矿奖励（通常是 USDC）

**依据**: `src/index.ts:187-224` (buildClaimTx 方法)

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
import { Transaction } from '@mysten/sui/transactions'

const client = new StableLayerClient({
  network: "mainnet",
  sender: userAddress
})

const tx = new Transaction()

// 构建 Claim 交易
await client.buildClaimTx({
  tx,
  lpToken: "btcUSDC",
  sender: userAddress,
  autoTransfer: true  // 自动转移奖励到 sender
})

// 签名并执行
const result = await signAndExecuteTransaction({
  transaction: tx,
  // ... wallet options
})
```

**内部流程**:
1. 调用 `releaseRewards()`（释放 Yield Vault 奖励）
2. 调用 `claim()`（从 Farm 提取用户的奖励）
3. 检查提取响应（`checkResponse` with type "withdraw"）
4. 如果 `autoTransfer=true`，将奖励 Coin 转移到用户地址

**奖励来源**:
- Farm 挖矿奖励（来自 STABLE_VAULT_FARM）
- Yield Vault 收益分红（来自 YIELD_VAULT）
- 奖励类型通常为 USDC 或 YesUSDB

---

## 🔧 配置与对象获取

### 网络配置

SDK 已内置 mainnet/testnet 支持，通过 `@mysten/sui/client` 的 `getFullnodeUrl()` 自动选择：

```typescript
// 自动选择网络 RPC 端点
const suiClient = new SuiClient({
  url: getFullnodeUrl(config.network)
})
```

**支持的网络**:
- `"mainnet"` - Sui 主网
- `"testnet"` - Sui 测试网

**注意**: 所有常量（Package ID、Object ID）均为 Mainnet 地址，Testnet 需要更新这些常量。

---

### 核心对象 ID 获取

所有核心对象 ID 均已**硬编码**在 `src/libs/constants.ts` 中，无需手动获取：

| 对象 | 常量名 | 如何使用 |
|------|--------|----------|
| **StableRegistry** | `STABLE_REGISTRY` | SDK 自动传入所有交易 |
| **StableVaultFarm** | `STABLE_VAULT_FARM` | SDK 自动传入 Mint/Burn/Claim |
| **YieldVault** | `YIELD_VAULT` | SDK 自动传入奖励释放 |
| **StableVault** | `STABLE_VAULT` | SDK 自动传入 Farm 操作 |

**用户无需手动传入这些对象**，SDK 内部已处理。

---

### Bucket Protocol 依赖

SDK 依赖 `@bucket-protocol/sdk` 来处理：

1. **价格聚合** (`aggregatePrices`):
   ```typescript
   const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
     coinTypes: [USDC_TYPE]
   })
   ```

2. **PSM Pool** (Peg Stability Module):
   ```typescript
   const psmPool = this.bucketClient.psmPoolObj(tx, {
     coinType: USDC_TYPE
   })
   ```

3. **Saving Pool**:
   ```typescript
   const savingPool = this.bucketClient.savingPoolObj(tx, {
     lpType: SAVING_TYPE
   })
   ```

4. **Treasury**:
   ```typescript
   const treasury = this.bucketClient.treasury(tx)
   ```

**用户无需手动调用**，SDK 内部已集成。

---

## 📊 查询方法

### 获取总供应量

```typescript
// 获取所有稳定币的总供应量
const totalSupply = await client.getTotalSupply()
console.log(totalSupply) // "1234567890000" (字符串格式)

// 获取指定币种的供应量
const btcUSDCSupply = await client.getTotalSupplyByCoinName("btcUSDC")
console.log(btcUSDCSupply) // "1234567890000"
```

**依据**: `src/index.ts:226-267`

**实现方式**:
- `getTotalSupply()`: 查询 `STABLE_REGISTRY` 对象的 `total_supply` 字段
- `getTotalSupplyByCoinName()`: 查询 Dynamic Field，获取 `treasury_cap.total_supply.value`

---

## 🧪 测试代码参考

**源码位置**: `test/e2e/client.test.ts`

### 完整测试示例

```typescript
import { StableLayerClient } from "stable-layer-sdk"
import { coinWithBalance, Transaction } from "@mysten/sui/transactions"
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client"

// 测试配置
const testConfig = {
  network: "mainnet" as const,
  sender: "0x2b986d...312150ca"
}

// 初始化
const sdk = new StableLayerClient(testConfig)
const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") })

// Mint 测试
const mintTx = new Transaction()
await sdk.buildMintTx({
  tx: mintTx,
  amount: BigInt(10),
  sender: testConfig.sender,
  usdcCoin: coinWithBalance({
    balance: BigInt(10),
    type: USDC_TYPE
  })(mintTx),
  autoTransfer: false,
  lpToken: "btcUSDC"
})

// Dev Inspect（本地模拟执行）
const result = await suiClient.devInspectTransactionBlock({
  transactionBlock: mintTx,
  sender: testConfig.sender
})

// Burn 测试（指定数量）
const burnTx = new Transaction()
await sdk.buildBurnTx({
  tx: burnTx,
  amount: BigInt(10),
  sender: testConfig.sender,
  lpToken: "btcUSDC"
})

// Burn 测试（全部）
const burnAllTx = new Transaction()
await sdk.buildBurnTx({
  tx: burnAllTx,
  lpToken: "btcUSDC",
  all: true,
  sender: testConfig.sender
})

// Claim 测试
const claimTx = new Transaction()
await sdk.buildClaimTx({
  tx: claimTx,
  lpToken: "btcUSDC",
  sender: testConfig.sender
})
```

---

## ⚠️ 重要注意事项

### 1. SDK 需要构建

SDK 是 TypeScript 源码，使用前需要构建：

```bash
# 在 SDK 目录构建
cd .sdk-reference/stable-layer-sdk
pnpm install
pnpm build
```

### 2. Peer Dependencies

App 项目必须安装以下依赖（与 SDK 版本匹配）：

```json
{
  "dependencies": {
    "@mysten/bcs": "^1.9.2",
    "@mysten/sui": "^1.44.0"
  }
}
```

**当前 app 使用的版本**:
- `@mysten/sui`: `^1.16.0` ✅ (兼容)
- `@mysten/bcs`: 未安装 ⚠️ (需要添加)

### 3. Amount 与 All 参数

在 `buildBurnTx()` 中：
- `amount` 和 `all` **必须提供其中一个**
- 同时提供时，优先使用 `all`
- `all=true` 会触发异步查询余额操作

### 4. AutoTransfer 行为

- `autoTransfer=true` (默认): Coin 自动转移到 sender 地址，方法返回 `undefined`
- `autoTransfer=false`: 返回 `CoinResult` 对象，可用于后续交易操作（如 Coin 合并、拆分等）

### 5. Testnet 支持

当前所有常量均为 Mainnet 地址，如需使用 Testnet：
1. 联系 StableLayer 团队获取 Testnet 对象 ID
2. 更新 `src/libs/constants.ts` 中的所有常量
3. 重新构建 SDK

### 6. 错误处理

SDK 方法均为 `async`，可能抛出以下错误：
- `"Amount or all must be provided"` - Burn 时未提供 amount 或 all
- 余额不足错误 - Sui 节点返回（需捕获）
- 网络错误 - RPC 调用失败（需捕获）

---

## 📚 源码路径索引

| 功能 | 文件路径 |
|------|----------|
| **主类定义** | `src/index.ts` |
| **类型接口** | `src/interface.ts` |
| **常量配置** | `src/libs/constants.ts` |
| **生成的合约绑定** | `src/generated/` |
| **测试用例** | `test/e2e/client.test.ts` |
| **Package 配置** | `package.json` |
| **TypeScript 配置** | `tsconfig.json` |

---

## 🚀 快速开始检查清单

- [ ] SDK 已构建 (`pnpm -C .sdk-reference/stable-layer-sdk build`)
- [ ] App 已添加 SDK 依赖 (`"stable-layer-sdk": "workspace:*"`)
- [ ] App 已安装 peer dependencies (`@mysten/sui`, `@mysten/bcs`)
- [ ] 已导入 `StableLayerClient` 类
- [ ] 已准备用户钱包地址（sender）
- [ ] 已选择网络环境（mainnet/testnet）
- [ ] 理解 `autoTransfer` 参数行为
- [ ] 理解 Burn 的 `amount` vs `all` 参数

---

## 📖 额外资源

- **Sui TypeScript SDK 文档**: https://sdk.mystenlabs.com/typescript
- **Bucket Protocol SDK**: https://github.com/bucket-protocol/bucket-protocol-sdk
- **StableLayer 协议**: （待添加官方文档链接）

---

**文档结束** - 如有疑问，请查阅源码或运行测试用例进行验证。
