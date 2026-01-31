# OneClick DApp - 演示指南

## 功能概述

OneClick 是一个基于 Sui 区块链的 StableLayer 协议 DApp，支持稳定币的 Mint（铸造）、Redeem（赎回）和 Claim（领取奖励）操作。

## 页面结构

### 1. 顶部导航栏
- **Network Select**: 选择网络（Mainnet / Testnet）
- **Brand Select**: 选择品牌稳定币（btcUSDC）
- **Connect Wallet**: 连接 Sui 钱包

### 2. 余额面板（BalancePanel）
显示当前地址的余额：
- **USDC 余额**: 用户的 USDC 余额
- **品牌币余额**: 用户的品牌稳定币余额（btcUSDC）
- **刷新按钮**: 手动刷新余额

余额自动刷新时机：
- 连接钱包成功
- 切换网络
- 切换品牌
- 交易成功后（延迟 2 秒）

### 3. Pending Redeems（待处理赎回）⭐ 新增
显示 T+1 赎回请求：
- 仅在有 pending 时显示（橙色边框）
- 显示赎回金额、提交时间、已等待时长
- 超过 24 小时后显示"可能已完成"
- 提供"查看"和"标记完成"按钮
- 数据保存在 localStorage，刷新不丢失

### 4. 操作面板（Tabs）

#### A) Mint Tab - 铸造稳定币
- **输入**: USDC 金额（字符串，如 "10.5"）
- **流程**:
  1. 用户输入金额
  2. 点击 "Mint" 按钮
  3. 状态：idle → building → signing → executing → success/error
  4. 成功后显示 TxResultCard（绿色边框）⭐
- **限制**:
  - 必须连接钱包
  - 金额必须大于 0
- **成功后**:
  - 自动添加到交易历史
  - 显示 TxResultCard（操作类型、时间戳、Explorer 链接等）

#### B) Redeem Tab - 赎回 USDC
- **输入**: 品牌币金额（如 btcUSDC）
- **模式**: T+1（默认，instant 模式未实现）
- **流程**: 同 Mint
- **成功后**:
  - 自动添加到交易历史
  - 自动添加到 Pending Redeems 列表 ⭐
  - 显示提示："已添加到 Pending Redeems 列表"
  - 显示 TxResultCard

#### C) Claim Tab - 领取奖励
- **功能**: 领取流动性挖矿奖励（USDC 或 YesUSDB）
- **限制**:
  - 如果不支持 Claim，显示警告提示
  - 品牌必须配置完整
- **成功后**:
  - 自动添加到交易历史
  - 显示 TxResultCard

### 5. 交易历史（TxHistory）⭐ 新增
位于页面底部，显示最近 10 笔交易：
- 每条记录显示：操作类型、品牌、网络、时间、金额
- 成功交易显示 "✓" 和"查看"按钮（打开 Explorer）
- 失败交易显示 "✗" 和错误信息
- 提供"清空"按钮清除所有历史
- 数据保存在 localStorage

## 交易状态机

所有交易（Mint/Redeem/Claim）使用统一的状态管理：

```
idle → building → signing → executing → success/error
```

### 状态说明
- **idle**: 初始状态，等待用户操作
- **building**: 构建交易中
- **signing**: 等待钱包签名
- **executing**: 交易执行中
- **success**: 交易成功 ⭐ 增强
  - 显示 TxResultCard（绿色边框卡片）
  - 显示操作类型、时间戳、网络、品牌
  - 显示完整 Transaction Digest
  - 提供三个按钮：
    - **在 Explorer 中查看**: 根据网络自动拼接 SuiScan 链接
    - **复制 Digest**: 一键复制交易哈希
    - **复制 Coin Type**: 一键复制品牌 coinType
  - 自动添加到交易历史
- **error**: 交易失败
  - 显示错误信息
  - 提供重试按钮

## 技术栈

- **前端框架**: React 18 + TypeScript 5.6 + Vite 6
- **UI 组件库**: HeroUI v3 (beta)
- **样式**: Tailwind CSS v4
- **区块链**: Sui (@mysten/sui, @mysten/dapp-kit)
- **协议 SDK**: StableLayer SDK 1.1.0
- **状态管理**: Zustand

## 本地运行

```bash
# 安装依赖
pnpm -w install

# 启动开发服务器
pnpm -C app dev

# 访问
http://localhost:3000
```

## 配置说明

### 网络配置 (`config/networks.ts`)
- Mainnet USDC: `0xdba...::usdc::USDC`
- Testnet USDC: `0xa1e...::usdc::USDC`

### 品牌配置 (`config/brands.ts`)
当前仅配置了 mainnet 的 **btcUSDC**，可直接用于交易功能。

### StableLayer 配置 (`config/stablelayer.ts`)
Mainnet 配置已硬编码：
- Package ID: `0x41e25d09e20cf3bc43fe321e51ef178fac419ae47b783a7161982158fc9f17d6`
- Registry ID: `0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642`

支持通过环境变量覆盖（`VITE_STABLELAYER_*`）。

## 演示要点

### 基础功能
1. **钱包连接**: 展示钱包连接流程，地址显示
2. **余额查询**: 展示 USDC 和品牌币余额
3. **网络切换**: 展示网络切换时 SuiClient 重建和余额刷新
4. **品牌切换**: 展示品牌切换时余额更新

### 交易流程
5. **Mint 流程**: 完整展示铸造流程（如果配置完成）
6. **Redeem 流程**: 展示 T+1 赎回流程
7. **错误处理**: 切换到 Testnet 时会提示仅支持 mainnet

### 增强功能 ⭐
8. **TxResultCard**: 展示交易成功后的增强卡片
   - 操作类型、时间戳、网络、品牌信息
   - Explorer 链接、复制 Digest、复制 Coin Type
9. **交易历史**: 展示历史记录列表
   - 最近 10 笔交易
   - 点击查看 Explorer
   - 数据持久化（刷新页面后仍保留）
10. **Pending Redeems**: 展示 T+1 赎回追踪
    - 待处理的赎回请求
    - 已等待时长显示
    - 超过 24 小时后可标记完成

## 限制说明

- **品牌限制**: 目前仅支持 mainnet 的 btcUSDC
- **Testnet 配置缺失**: StableLayer 未公开 testnet 合约地址
- **Instant Redeem**: SDK 不支持，仅支持 T+1 模式

## 下一步开发

1. 补充 Testnet 合约地址后启用 testnet 交易
2. 实现 Claim 功能的完整支持
3. 添加交易历史记录
4. 添加 APY 显示
5. 优化移动端适配
