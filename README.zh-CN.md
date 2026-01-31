# OneClick StableLayer Demo（演示版）

一个**教学 / 演示**性质的 StableLayer DApp，用于展示 Sui 主网的三步流程：Mint → Redeem (T+1) → Claim。

> 仅用于学习与演示，不是生产级应用。

## 截图

> 可将截图放在 `app/assets/` 并在此引用。

## 这个 Demo 做什么

- **Mint**：存入 USDC，铸造 `btcUSDC`
- **Redeem (T+1)**：销毁 `btcUSDC` 发起赎回请求（次日结算）
- **Claim**：领取流动性挖矿奖励（如有）
- 引导式流程 + 成功/失败交易反馈 + digest 复制 / Explorer 跳转

## 流程说明

1. **Mint**：USDC → `btcUSDC`。
2. **Redeem**：`btcUSDC` → T+1 赎回请求。
3. **Claim**：若有奖励可领取则进行 Claim。

## 技术栈

- Vite 6 / React 19 / TypeScript
- HeroUI v3 (beta) + Tailwind CSS v4
- @mysten/dapp-kit / @mysten/sui
- stable-layer-sdk
- Zustand / React Query

## 快速开始（pnpm）

```bash
pnpm -w install
pnpm -C app dev
```

构建 / 预览：

```bash
pnpm -C app build
pnpm -C app preview
```

## 配置

- 默认网络：**mainnet**（见 `app/src/config/networks.ts`）
- 默认品牌：`btcUSDC`（见 `app/src/config/brands.ts`）
- StableLayer 主网地址：`app/src/config/stablelayer.ts`

### 可选环境变量

不需要 `.env` 即可运行；如需覆盖参数：

```bash
# app/.env.example
VITE_STABLELAYER_PACKAGE_ID=0x...
VITE_STABLELAYER_REGISTRY_ID=0x...
VITE_STABLELAYER_REGISTRY_INITIAL_SHARED_VERSION=123
```

## 使用说明

1. 启动 dev server 打开 `http://localhost:3000/`
2. 连接 Sui 钱包（主网）
3. Mint 小额 USDC
4. Redeem 发起 T+1 请求
5. Claim（若有可领取奖励）
6. 在反馈卡片中复制 digest / 打开 Explorer

## 常见问题

- **Redeem 报 err_insufficient_deposit (104)**：可能是二级市场转入币、刚 Mint、或已有 T+1 待处理。
- **Claim 失败**：通常是无可领取奖励。
- **仅主网支持**：交易构建中有 mainnet guard。

## 目录结构

```
app/
  src/
    components/        UI + 交易反馈
    hooks/             状态/余额/引导流程
    lib/               StableLayer 适配/客户端/Toast
    config/            network/brands/stablelayer
  docs/                SDK 文档
.sdk-reference/
  stable-layer-sdk/    仅供参考的 SDK 源码
```

## 关于 .sdk-reference

`./.sdk-reference` 仅用于**源码阅读**，不参与依赖或构建。

## 免责声明

- Demo / 教学用途
- 主网交易会产生 gas
- 非托管应用（钱包签名）
- 风险自担

## License

待定。建议选择 MIT / Apache‑2.0。
