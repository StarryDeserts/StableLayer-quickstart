# 下一步操作指南

**任务完成**: ✅ StableLayer SDK 源码分析已完成
**生成文档**: 1260 行（4 个文档）
**更新配置**: app/package.json 已添加 SDK 依赖

---

## 📋 当前状态

### ✅ 已完成

- [x] SDK 源码深度分析
- [x] 生成完整的 API 映射文档（627 行）
- [x] 生成快速参考文档（178 行）
- [x] 生成集成检查清单（299 行）
- [x] 生成文档索引（156 行）
- [x] 更新 app/package.json（添加 SDK 和 @mysten/bcs）
- [x] 生成分析总结报告

### 📚 生成的文档

```
app/docs/
├── README.md                          # 文档导航中心 (156 行)
├── sdk-map.md                         # 完整 API 映射 (627 行) ⭐️
├── sdk-quick-ref.md                   # 快速参考卡片 (178 行)
└── sdk-integration-checklist.md       # 集成检查清单 (299 行)
```

---

## 🚀 立即执行的命令

### 1. 构建 SDK（必须）

```bash
# 进入 SDK 目录
cd .sdk-reference/stable-layer-sdk

# 安装依赖
pnpm install

# 构建 SDK（生成 dist/ 目录）
pnpm build

# 返回项目根目录
cd ../..
```

**验证构建**:
```bash
ls .sdk-reference/stable-layer-sdk/dist
# 应该看到: cjs/ esm/ types/
```

---

### 2. 安装项目依赖

```bash
# 安装所有 workspace 依赖
pnpm -w install
```

**验证安装**:
```bash
pnpm -C app list stable-layer-sdk
# 应该看到: stable-layer-sdk 1.1.0 (link)
```

---

### 3. 同步 @mysten/sui 版本（必需）

SDK 要求 `@mysten/sui@^1.44.0`，已通过根目录 `pnpm.overrides` 固定为 `1.44.0`。
如需手动更新依赖清单，可执行：

```bash
pnpm -C app add @mysten/sui@^1.44.0
```

---

### 4. 启动开发服务器

```bash
pnpm -C app dev
```

访问 `http://localhost:3000`，确认 DApp 正常启动。

---

## 📖 文档阅读顺序

### 第一步：快速了解

**阅读**: `app/docs/sdk-quick-ref.md`

快速了解最常用的 API 和参数。

### 第二步：深入学习

**阅读**: `app/docs/sdk-map.md`

理解完整的 API 参数、返回值、内部流程。

### 第三步：集成验证

**阅读**: `app/docs/sdk-integration-checklist.md`

一步步检查 SDK 是否正确集成。

---

## 💡 核心概念速览

### SDK 初始化

```typescript
import { StableLayerClient } from 'stable-layer-sdk'

const client = new StableLayerClient({
  network: "mainnet",
  sender: userAddress
})
```

### 三个核心操作

| 操作 | 方法 | 输入 | 输出 |
|------|------|------|------|
| **Mint** | `buildMintTx()` | USDC Coin | btcUSDC 稳定币 |
| **Redeem** | `buildBurnTx()` | btcUSDC 稳定币 | USDC Coin |
| **Claim** | `buildClaimTx()` | 无 | 奖励 Coin |

### 关键参数

- **lpToken**: 目前仅支持 `"btcUSDC"`
- **autoTransfer**: `true` = 自动转移到用户，`false` = 返回 Coin 对象
- **amount vs all**: Burn 时必须提供其中一个

---

## 🎯 开始开发业务 UI

### 推荐的实现顺序

1. **创建 SDK 客户端工厂**
   ```typescript
   // app/src/lib/sdk-client.ts
   import { StableLayerClient } from 'stable-layer-sdk'

   export function createSDKClient(userAddress: string) {
     return new StableLayerClient({
       network: "mainnet",
       sender: userAddress
     })
   }
   ```

2. **创建 React Hook**
   ```typescript
   // app/src/hooks/useStableLayerSDK.ts
   import { useMemo } from 'react'
   import { useCurrentAccount } from '@mysten/dapp-kit'
   import { createSDKClient } from '@/lib/sdk-client'

   export function useStableLayerSDK() {
     const account = useCurrentAccount()

     return useMemo(() => {
       if (!account?.address) return null
       return createSDKClient(account.address)
     }, [account?.address])
   }
   ```

3. **实现 Mint 功能**
   - Mint 表单组件
   - USDC 余额查询
   - 数量输入验证
   - 交易签名和执行

4. **实现 Redeem 功能**
   - Redeem 表单组件
   - btcUSDC 余额查询
   - 支持"全部赎回"选项
   - 交易签名和执行

5. **实现 Claim 功能**
   - Claim 按钮组件
   - 奖励余额查询
   - 一键领取交互

6. **添加数据展示**
   - 用户余额（USDC、btcUSDC）
   - 总供应量统计
   - 交易历史记录
   - APY 收益率

---

## 🔍 验证 SDK 可用性

创建测试文件验证导入:

```typescript
// app/src/test-sdk.ts
import { StableLayerClient } from 'stable-layer-sdk'
import type { StableLayerConfig } from 'stable-layer-sdk'

const config: StableLayerConfig = {
  network: "mainnet",
  sender: "0x0000000000000000000000000000000000000000000000000000000000000000"
}

const client = new StableLayerClient(config)
console.log('✅ SDK 导入成功!', client)
```

运行测试:
```bash
pnpm -C app tsx src/test-sdk.ts
```

如果看到 "✅ SDK 导入成功!"，说明 SDK 已正确配置。

---

## ⚠️ 常见问题预防

### 问题 1: 找不到模块 'stable-layer-sdk'

**原因**: SDK 未构建

**解决**:
```bash
pnpm -C .sdk-reference/stable-layer-sdk build
pnpm -w install
```

### 问题 2: TypeScript 类型错误

**原因**: 类型定义未生成

**解决**:
```bash
pnpm -C .sdk-reference/stable-layer-sdk run build:types
```

### 问题 3: Peer dependency 警告

**原因**: @mysten/sui 版本不匹配

**解决**:
```bash
pnpm -C app add @mysten/sui@^1.44.0
```
并确保根目录 `package.json` 中存在 `pnpm.overrides` 固定版本。

---

## 📊 项目依赖关系

```
OneClick Workspace
├── app (前端 DApp)
│   ├── @heroui/react@beta
│   ├── @mysten/sui@^1.44.0（通过 pnpm.overrides 固定 1.44.0）
│   ├── @mysten/bcs@^1.9.2 ✅
│   ├── @mysten/dapp-kit@^0.14.28
│   └── stable-layer-sdk@workspace:* ✅
│
└── .sdk-reference/stable-layer-sdk
    ├── @mysten/sui@^1.44.0 (dev)
    ├── @mysten/bcs@^1.9.2 (dev)
    └── @bucket-protocol/sdk@1.1.4
```

---

## 🎉 准备就绪！

完成上述步骤后，您将拥有：

- ✅ 完整的 SDK API 文档
- ✅ 可用的 SDK 本地依赖
- ✅ 正确配置的 App 项目
- ✅ 清晰的开发路线图

**现在可以开始编写业务 UI 代码了！** 🚀

---

## 📖 快速链接

- **完整 API 文档**: [app/docs/sdk-map.md](./app/docs/sdk-map.md)
- **快速参考**: [app/docs/sdk-quick-ref.md](./app/docs/sdk-quick-ref.md)
- **集成清单**: [app/docs/sdk-integration-checklist.md](./app/docs/sdk-integration-checklist.md)
- **文档索引**: [app/docs/README.md](./app/docs/README.md)
- **分析总结**: [SDK_ANALYSIS_SUMMARY.md](./SDK_ANALYSIS_SUMMARY.md)

---

**祝开发顺利！** 如有任何问题，请查阅文档或检查集成清单。
