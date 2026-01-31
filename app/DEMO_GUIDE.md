# OneClick DApp - 演示指南（中文）

本项目是一个**教学 / 演示性质**的 StableLayer DApp，用于展示在 **Sui 主网**的三步流程：Mint → Redeem（T+1）→ Claim。重点是“可见的引导流程 + 清晰的交易反馈”。

## 当前项目现状（概要）

- ✅ **主网交易链路完整可演示**：Mint / Redeem（T+1）/ Claim
- ✅ **引导式流程**：通过步骤条与提示引导用户完成三步操作
- ✅ **交易反馈**：成功/失败统一样式的反馈卡片，包含 digest、复制与 Explorer 跳转
- ✅ **余额与历史**：余额面板、交易历史、Pending Redeems 持久化
- ⚠️ **仅支持 mainnet + btcUSDC**（代码中有硬性 guard）
- ⚠️ **Testnet 无官方合约地址，未启用**

## 页面结构

### 1) 顶部导航（TopNav）
- Network Select：主网 / 测试网（UI 可切换）
- Brand Select：当前仅有 btcUSDC
- Connect Wallet：连接 Sui 钱包

### 2) Hero + 引导区（Guided Flow）
- 通过步骤条引导 Mint → Redeem（T+1）→ Claim
- 步骤状态由真实余额与历史自动判定

### 3) Demo Panel（核心演示区）
- 余额面板（USDC + btcUSDC）
- Pending Redeems 列表（T+1 跟踪）
- 操作区（Mint / Redeem / Claim 三个 Tab）

### 4) 交易历史（TxHistory）
- 保存最近 10 笔交易
- 成功可跳转 Explorer
- 失败显示错误摘要
- localStorage 持久化

### 5) FAQ + Footer
- 常见问题提示
- 项目免责声明

## 交易流程说明

### Mint
- 输入 USDC 金额 → 发起交易 → 钱包签名 → 执行成功
- 成功后显示统一的 **TxFeedbackCard**

### Redeem（T+1）
- 输入 btcUSDC 金额 → 发起 T+1 赎回请求
- 成功后加入 Pending Redeems

### Claim
- 领取流动性挖矿奖励
- 若无可领取奖励会给出提示

## 交易状态机

```
idle → building → signing → executing → success/error
```

TxFeedbackCard 在 success / error 状态出现，包含：
- 状态 Chip + 操作类型
- 时间 / 网络 / 品牌
- digest（等宽字体 + tooltip + copy）
- Explorer / Copy / Close
- error 时提供友好摘要 + 可折叠原始错误

## 技术栈（以代码为准）

- **React 19** + **TypeScript 5.6** + **Vite 6**
- **HeroUI v3 (beta)** + Tailwind CSS v4
- **Sui**: `@mysten/sui`, `@mysten/dapp-kit`
- **StableLayer SDK**: `stable-layer-sdk`
- **Zustand** + **React Query**

## 本地运行

```bash
pnpm -w install
pnpm -C app dev
```

访问：`http://localhost:3000`

## 配置说明（以代码为准）

### 网络配置（`app/src/config/networks.ts`）
- mainnet / testnet 均有 RPC 配置
- **默认网络：mainnet**

### 品牌配置（`app/src/config/brands.ts`）
- 仅支持 `btcUSDC`
- 带有 mainnet-only guard

### StableLayer 配置（`app/src/config/stablelayer.ts`）
- Mainnet Package/Registry 已写死
- Testnet 默认 `TODO_REPLACE_ME`
- 可通过 `VITE_STABLELAYER_*` 覆盖

## 演示要点（推荐流程）

1. 连接钱包（主网）
2. Mint 小额 USDC
3. Redeem（T+1）并看到 Pending
4. Claim（若有奖励）
5. 查看 TxHistory 与 Explorer 跳转

## 限制说明

- **仅支持 mainnet + btcUSDC**
- **Testnet 合约地址缺失**
- **Instant Redeem 未实现（SDK 不支持）**

## 下一步（可选）

1. Testnet 合约地址就绪后启用 testnet
2. 细化 Claim 的链上数据展示
3. 增加 APY / TVL 等展示（非交易逻辑）
