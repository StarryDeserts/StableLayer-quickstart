# OneClick DApp 文档中心

欢迎来到 OneClick DApp 项目文档！这里包含所有关于 StableLayer SDK 集成和使用的文档。

---

## 📚 文档导航

### 🚀 快速开始

从这里开始，快速了解如何使用 SDK：

- **[SDK 快速参考](./sdk-quick-ref.md)** ⭐️
  最常用的 API 速查卡片，适合日常开发时快速查找

### 📖 完整文档

深入了解 SDK 的所有细节：

- **[SDK API 映射](./sdk-map.md)**
  完整的 API 文档，包含所有方法、参数、类型定义和使用示例

### ✅ 集成指南

确保 SDK 正确集成到项目中：

- **[SDK 集成检查清单](./sdk-integration-checklist.md)**
  一步步指导如何配置、构建、安装和验证 SDK

---

## 🎯 按需查找

### 我想...

| 需求 | 查看文档 |
|------|----------|
| **快速查找某个 API 怎么用** | [快速参考](./sdk-quick-ref.md) |
| **了解完整的 API 参数和返回值** | [API 映射](./sdk-map.md) |
| **第一次集成 SDK** | [集成检查清单](./sdk-integration-checklist.md) |
| **排查 SDK 相关错误** | [集成检查清单 - 常见问题](./sdk-integration-checklist.md#常见问题) |
| **查看 Mint 的详细流程** | [API 映射 - Mint 流程](./sdk-map.md#1-mint-流程铸造稳定币) |
| **查看 Redeem 的详细流程** | [API 映射 - Redeem 流程](./sdk-map.md#2-redeem-流程赎回-usdc) |
| **查看 Claim 的详细流程** | [API 映射 - Claim 流程](./sdk-map.md#3-claim-流程领取奖励) |
| **了解 SDK 的常量配置** | [API 映射 - 常量配置](./sdk-map.md#常量配置) |
| **查看测试代码示例** | [API 映射 - 测试代码](./sdk-map.md#测试代码参考) |

---

## 📂 文档文件列表

```
app/docs/
├── README.md                          # 本文档（索引）
├── sdk-map.md                         # 完整 API 映射
├── sdk-quick-ref.md                   # 快速参考卡片
└── sdk-integration-checklist.md       # 集成检查清单
```

---

## 🔧 技术栈概览

| 组件 | 说明 |
|------|------|
| **StableLayer SDK** | 官方 TypeScript SDK，提供 Mint/Redeem/Claim 功能 |
| **@mysten/sui** | Sui 区块链 TypeScript SDK |
| **@mysten/dapp-kit** | Sui DApp 钱包连接组件 |
| **Workspace** | pnpm workspace，SDK 作为本地依赖 |

---

## 🚀 快速命令

```bash
# 构建 SDK
pnpm -C .sdk-reference/stable-layer-sdk build

# 安装所有依赖
pnpm -w install

# 启动 DApp
pnpm -C app dev
```

---

## 📋 核心概念

### StableLayer 协议

- **Mint**: 用户存入 USDC，铸造等值的 btcUSDC 稳定币
- **Redeem**: 用户销毁 btcUSDC，赎回等值的 USDC（SDK 中称为 Burn）
- **Claim**: 领取流动性挖矿奖励

### SDK 架构

```
StableLayerClient (主类)
├── buildMintTx()      - 构建 Mint 交易
├── buildBurnTx()      - 构建 Redeem 交易
├── buildClaimTx()     - 构建 Claim 交易
├── getTotalSupply()   - 查询总供应量
└── getTotalSupplyByCoinName() - 查询指定币种供应量
```

### 支持的稳定币

目前仅支持: **btcUSDC**

---

## ⚠️ 重要提醒

### 使用前必读

1. **SDK 必须先构建**
   运行 `pnpm -C .sdk-reference/stable-layer-sdk build`

2. **Peer Dependencies 必须匹配**
   确保 `@mysten/sui` 和 `@mysten/bcs` 版本符合要求

3. **理解 AutoTransfer 参数**
   - `true`: Coin 自动转移到用户地址（推荐）
   - `false`: 返回 Coin 对象，可用于复杂操作

4. **Burn 操作的参数要求**
   必须提供 `amount` 或 `all` 之一

---

## 🐛 遇到问题？

1. **查看 [集成检查清单 - 常见问题](./sdk-integration-checklist.md#常见问题)**
2. **检查 SDK 是否已构建**: `ls .sdk-reference/stable-layer-sdk/dist`
3. **检查依赖是否已安装**: `pnpm -C app list stable-layer-sdk`
4. **查看完整错误信息**: 检查浏览器控制台和终端输出

---

## 📖 外部资源

- [Sui TypeScript SDK 文档](https://sdk.mystenlabs.com/typescript)
- [Bucket Protocol SDK](https://github.com/bucket-protocol/bucket-protocol-sdk)
- [StableLayer 官网](https://stablelayer.io/)（待添加）

---

## 🎉 开始开发

1. ✅ 阅读 [集成检查清单](./sdk-integration-checklist.md)
2. ✅ 阅读 [快速参考](./sdk-quick-ref.md)
3. ✅ 参考 [API 映射](./sdk-map.md) 实现功能
4. ✅ 开始编码！

**祝开发顺利！** 🚀
