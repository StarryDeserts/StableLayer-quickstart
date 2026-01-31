# StableLayer SDK 快速参考卡片

> 快速查找常用 API，完整文档见 [sdk-map.md](./sdk-map.md)

---

## 🚀 初始化

```typescript
import { StableLayerClient } from 'stable-layer-sdk'

const client = new StableLayerClient({
  network: "mainnet",
  sender: "0x..." // 用户地址
})
```

---

## 💰 Mint（铸造稳定币）

```typescript
import { Transaction, coinWithBalance } from '@mysten/sui/transactions'

const tx = new Transaction()

const usdcCoin = coinWithBalance({
  balance: BigInt(1_000_000), // 1 USDC
  type: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC"
})(tx)

await client.buildMintTx({
  tx,
  lpToken: "btcUSDC",
  usdcCoin,
  amount: BigInt(1_000_000),
  autoTransfer: true
})
```

**返回**: 自动转移 btcUSDC 到用户地址

---

## 🔄 Redeem（赎回 USDC）

```typescript
const tx = new Transaction()

// 方式1: 赎回指定数量
await client.buildBurnTx({
  tx,
  lpToken: "btcUSDC",
  amount: BigInt(500_000), // 0.5 btcUSDC
  autoTransfer: true
})

// 方式2: 赎回全部
await client.buildBurnTx({
  tx,
  lpToken: "btcUSDC",
  all: true,
  autoTransfer: true
})
```

**返回**: 自动转移 USDC 到用户地址

---

## 🎁 Claim（领取奖励）

```typescript
const tx = new Transaction()

await client.buildClaimTx({
  tx,
  lpToken: "btcUSDC",
  autoTransfer: true
})
```

**返回**: 自动转移奖励到用户地址

---

## 📊 查询

```typescript
// 所有稳定币总供应量
const totalSupply = await client.getTotalSupply()

// 指定币种供应量
const btcUSDCSupply = await client.getTotalSupplyByCoinName("btcUSDC")
```

---

## ⚙️ 参数说明

### autoTransfer

| 值 | 行为 |
|-----|------|
| `true` (默认) | Coin 自动转移到用户地址 |
| `false` | 返回 Coin 对象，可用于后续操作 |

### lpToken

目前仅支持: `"btcUSDC"`

### amount vs all (仅 Burn)

| 参数 | 说明 |
|------|------|
| `amount: BigInt` | 赎回指定数量 |
| `all: true` | 赎回用户全部余额 |

**注意**: 必须提供其中一个，否则抛出错误

---

## 🔧 常用常量

```typescript
// 从 SDK 导入
import * as constants from 'stable-layer-sdk/libs/constants'

// USDC Coin Type
constants.USDC_TYPE
// "0xdba346...::usdc::USDC"

// btcUSDC Coin Type
constants.BTC_USD_TYPE
// "0x6d9fc3...::btc_usdc::BtcUSDC"

// StableRegistry Object ID
constants.STABLE_REGISTRY
// "0x213f4d...6da41642"
```

---

## ✅ 使用前检查

1. SDK 已构建
   ```bash
   pnpm -C .sdk-reference/stable-layer-sdk build
   ```

2. App 已添加依赖
   ```json
   {
     "dependencies": {
       "stable-layer-sdk": "workspace:*",
       "@mysten/sui": "^1.44.0",
       "@mysten/bcs": "^1.9.2"
     }
   }
   ```

3. 用户钱包已连接，地址可用

---

## 🐛 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `"Amount or all must be provided"` | Burn 时未提供参数 | 提供 `amount` 或 `all` |
| `Module not found: stable-layer-sdk` | SDK 未构建 | 运行 `pnpm -C .sdk-reference/stable-layer-sdk build` |
| `Not enough coins` | 余额不足 | 检查用户 USDC/btcUSDC 余额 |

---

## 📖 完整文档

详见 [sdk-map.md](./sdk-map.md)
