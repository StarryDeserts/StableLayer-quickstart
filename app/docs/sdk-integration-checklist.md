# StableLayer SDK 集成检查清单

**目的**: 确保 SDK 正确集成到 OneClick DApp 项目中

---

## ✅ 依赖配置

### 1. Workspace 配置

- [x] `pnpm-workspace.yaml` 已包含 SDK
  ```yaml
  packages:
    - 'app'
    - '.sdk-reference/stable-layer-sdk'
  ```

### 2. App 依赖

- [x] `app/package.json` 已添加 SDK workspace 依赖
  ```json
  {
    "dependencies": {
      "stable-layer-sdk": "workspace:*",
      "@mysten/sui": "^1.44.0",
      "@mysten/bcs": "^1.9.2"
    }
  }
  ```

**注意**: `@mysten/bcs` 是 SDK 的 peer dependency，必须安装

---

## 🔨 SDK 构建

### 构建步骤

```bash
# 进入 SDK 目录
cd .sdk-reference/stable-layer-sdk

# 安装依赖
pnpm install

# 构建 SDK（生成 dist/ 目录）
pnpm build
```

### 验证构建

```bash
# 检查 dist 目录是否生成
ls .sdk-reference/stable-layer-sdk/dist

# 期望输出:
# cjs/     - CommonJS 构建
# esm/     - ES Module 构建
# types/   - TypeScript 类型定义
```

---

## 📦 安装依赖

```bash
# 返回项目根目录
cd ../..

# 安装所有 workspace 依赖
pnpm -w install
```

**重要**: 必须在 SDK 构建完成后运行 `pnpm -w install`

---

## 🧪 验证导入

创建测试文件 `app/src/test-sdk.ts`:

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
import type {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams
} from 'stable-layer-sdk'

// 测试初始化
const config: StableLayerConfig = {
  network: "mainnet",
  sender: "0x0000000000000000000000000000000000000000000000000000000000000000"
}

const client = new StableLayerClient(config)
console.log('SDK 导入成功!', client)
```

运行测试:

```bash
pnpm -C app tsx src/test-sdk.ts
```

---

## 📚 文档检查

- [x] `app/docs/sdk-map.md` - 完整 API 映射文档
- [x] `app/docs/sdk-quick-ref.md` - 快速参考卡片
- [x] `app/docs/sdk-integration-checklist.md` - 本清单

---

## 🔧 版本兼容性

### SDK 要求的 Peer Dependencies

| 包名 | SDK 要求版本 | App 当前版本 | 兼容性 |
|------|--------------|--------------|--------|
| `@mysten/sui` | `^1.44.0` | `^1.44.0` | ✅ 匹配 |
| `@mysten/bcs` | `^1.9.2` | `^1.9.2` | ✅ 匹配 |

**建议**: 将 `@mysten/sui` 升级到 `^1.44.0` 并通过根目录 `pnpm.overrides` 固定版本：

```bash
pnpm -C app add @mysten/sui@^1.44.0
```

---

## 🚀 使用示例

### 基础初始化

```typescript
// app/src/lib/sdk-client.ts
import { StableLayerClient } from 'stable-layer-sdk'
import type { StableLayerConfig } from 'stable-layer-sdk'

export function createSDKClient(userAddress: string): StableLayerClient {
  const config: StableLayerConfig = {
    network: "mainnet",
    sender: userAddress
  }

  return new StableLayerClient(config)
}
```

### React Hook 集成

```typescript
// app/src/hooks/useStableLayerSDK.ts
import { useMemo } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { createSDKClient } from '@/lib/sdk-client'

export function useStableLayerSDK() {
  const account = useCurrentAccount()

  const client = useMemo(() => {
    if (!account?.address) return null
    return createSDKClient(account.address)
  }, [account?.address])

  return client
}
```

### 在组件中使用

```typescript
// app/src/components/MintForm.tsx
import { useStableLayerSDK } from '@/hooks/useStableLayerSDK'
import { Transaction } from '@mysten/sui/transactions'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'

export function MintForm() {
  const sdkClient = useStableLayerSDK()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const handleMint = async (amount: bigint) => {
    if (!sdkClient) return

    const tx = new Transaction()

    // 构建 Mint 交易
    await sdkClient.buildMintTx({
      tx,
      lpToken: "btcUSDC",
      usdcCoin: /* ... */,
      amount,
      autoTransfer: true
    })

    // 签名并执行
    signAndExecute({
      transaction: tx
    })
  }

  return (
    // ... UI
  )
}
```

---

## ⚠️ 常见问题

### 问题 1: 找不到模块 'stable-layer-sdk'

**原因**: SDK 未构建或未安装

**解决**:
```bash
# 构建 SDK
pnpm -C .sdk-reference/stable-layer-sdk build

# 重新安装依赖
pnpm -w install
```

### 问题 2: 类型错误 "Cannot find type definitions"

**原因**: TypeScript 找不到类型定义

**解决**:
```bash
# 确保 SDK 构建时生成了类型
pnpm -C .sdk-reference/stable-layer-sdk run build:types

# 检查 dist/types/ 目录是否存在
ls .sdk-reference/stable-layer-sdk/dist/types
```

### 问题 3: Peer dependency 警告

**原因**: `@mysten/sui` 或 `@mysten/bcs` 版本不匹配

**解决**:
```bash
# 升级到 SDK 要求的版本
pnpm -C app add @mysten/sui@^1.44.0 @mysten/bcs@^1.9.2
```

### 问题 4: "Amount or all must be provided"

**原因**: 调用 `buildBurnTx()` 时未提供必需参数

**解决**:
```typescript
// 错误示例
await client.buildBurnTx({ tx, lpToken: "btcUSDC" })

// 正确示例1: 提供 amount
await client.buildBurnTx({ tx, lpToken: "btcUSDC", amount: BigInt(100) })

// 正确示例2: 提供 all
await client.buildBurnTx({ tx, lpToken: "btcUSDC", all: true })
```

---

## 📋 集成完成标准

以下所有项目完成后，SDK 即可正常使用：

1. ✅ SDK 已构建（`dist/` 目录存在）
2. ✅ App 依赖已配置（包含 `stable-layer-sdk` 和 peer deps）
3. ✅ Workspace 依赖已安装（`pnpm -w install` 成功）
4. ✅ 可以成功导入 `StableLayerClient`
5. ✅ TypeScript 类型检查通过
6. ✅ 理解 Mint/Burn/Claim 的使用方式
7. ✅ 已阅读 [sdk-map.md](./sdk-map.md) 和 [sdk-quick-ref.md](./sdk-quick-ref.md)

---

## 🎯 下一步

SDK 集成完成后，可以开始实现业务逻辑：

1. **创建 SDK 客户端工厂** (`lib/sdk-client.ts`)
2. **创建 React Hooks** (`hooks/useStableLayerSDK.ts`)
3. **实现 Mint 功能** (铸造 btcUSDC)
4. **实现 Redeem 功能** (赎回 USDC)
5. **实现 Claim 功能** (领取奖励)
6. **添加余额查询**
7. **添加交易历史**

---

**检查清单完成！** 🎉

如有任何问题，请查阅 [sdk-map.md](./sdk-map.md) 获取详细 API 文档。
