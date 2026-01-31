# 实现检查清单

## 需求验证

### ✅ 页面结构

- [x] **顶部**: NetworkSelect / BrandSelect / Connect（延续现有）
- [x] **BalancePanel**: 显示 USDC 余额、BrandUSD 余额（自动刷新）
- [x] **Tabs**: Mint / Redeem / Claim

### ✅ A) 通用交易状态机

- [x] 状态：idle / building / signing / executing / success / error
- [x] executing 时按钮禁用
- [x] error 时显示 HeroUI Alert（含错误信息）
- [x] success 时显示 digest + Explorer 链接 + Copy

**实现位置**:
- `hooks/useTransaction.ts`: 统一状态管理
- `components/TxResultAlert.tsx`: 结果展示组件

### ✅ B) Mint Tab

- [x] 输入：USDC amount（字符串输入，避免浮点误差）
- [x] 点击 Mint：
  1. [x] 调用 adapter.buildMintTx
  2. [x] 用 dapp-kit 签名并执行交易
  3. [x] 成功后 refreshBalances()

**实现位置**: `components/MintTab.tsx`

### ✅ C) Redeem Tab

- [x] 输入：BrandUSD amount
- [x] mode：默认只给 T+1（instant 如果 supportedRedeemModes 包含才显示）
- [x] 点击 Redeem：同流程
- [x] 成功后显示文案："已提交 T+1 赎回请求，预计次日结算"（不写具体时间）
- [x] 记录一条 pending（仅本地记录也行）

**实现位置**: `components/RedeemTab.tsx`

### ✅ D) Claim Tab

- [x] 如果 adapter.buildClaimTx 抛"不支持"：UI 显示提示（例如"该 brand / 该账户暂不支持 claim"）
- [x] 支持则执行交易，并在成功后刷新

**实现位置**: `components/ClaimTab.tsx`

### ✅ E) 余额与 metadata 刷新

- [x] 在 `hooks/useBalances.ts` 实现（复用 stablelayer/queries.ts）
- [x] 刷新触发：
  - [x] 连接钱包成功
  - [x] 切换 network
  - [x] 切换 brand
  - [x] 任意交易 success 后
- [x] metadata：优先链上 getCoinMetadata，失败 fallback 到 brands.ts displayName

**实现位置**: `hooks/useBalances.ts`

## 技术要求验证

### ✅ UI 组件

- [x] 所有 UI 用 HeroUI 组件
- [x] Card, Button, Input, Alert 等组件使用正确
- [x] Tab 切换功能实现（使用 Button 实现简单 Tab）

### ✅ 交易执行

- [x] 使用 `@mysten/dapp-kit` 的 `useSignAndExecuteTransaction`
- [x] 统一的状态管理和错误处理
- [x] 交易成功后显示 Explorer 链接

### ✅ 错误处理

- [x] 非 mainnet 时交易提示不可用
- [x] 显示友好的错误提示
- [x] 不支持的功能显示警告

### ✅ 代码质量

- [x] TypeScript 编译通过（无错误）
- [x] 使用 Zustand 管理全局状态
- [x] 代码模块化，职责清晰
- [x] 适当的注释和文档

## 文件清单

### 新增文件

1. `hooks/useTransaction.ts` - 交易状态管理 Hook
2. `hooks/useBalances.ts` - 余额查询 Hook
3. `components/BalancePanel.tsx` - 余额显示面板
4. `components/TxResultAlert.tsx` - 交易结果展示
5. `components/MintTab.tsx` - Mint 操作面板
6. `components/RedeemTab.tsx` - Redeem 操作面板
7. `components/ClaimTab.tsx` - Claim 操作面板
8. `app/DEMO_GUIDE.md` - 演示指南
9. `IMPLEMENTATION_CHECKLIST.md` - 实现检查清单

### 修改文件

1. `App.tsx` - 整合所有组件

## 运行状态

- [x] 开发服务器运行在 `http://localhost:3000/`
- [x] TypeScript 编译无错误
- [x] HMR（热模块替换）工作正常
- [x] 页面可正常访问

## 已知限制

1. **品牌限制**: 当前仅支持 mainnet 的 btcUSDC
   - **状态**: 非 mainnet 会提示不可用
   - **UI**: 完整可展示

2. **Instant Redeem**: SDK 不支持
   - **状态**: 仅显示 T+1 模式
   - **UI**: 完整可展示

3. **Testnet 配置缺失**: StableLayer 未公开 testnet 合约地址
   - **状态**: 需要提供 testnet Package/Registry 才能启用
   - **UI**: 完整可展示

## 测试建议

### 1. 钱包连接测试
- 连接钱包
- 验证地址显示
- 验证余额加载

### 2. 网络切换测试
- 切换 Mainnet/Testnet
- 验证 SuiClient 重建
- 验证余额重新加载

### 3. 品牌切换测试
- 验证当前品牌为 btcUSDC
- 验证品牌币余额更新

### 4. Mint 流程测试（mainnet）
- 输入金额
- 点击 Mint
- 验证状态变化：building → signing → executing → success
- 验证 Explorer 链接
- 验证余额刷新

### 5. Redeem 流程测试（mainnet）
- 输入金额
- 点击 Redeem
- 验证 T+1 提示
- 验证交易成功提示

### 6. Claim 流程测试（mainnet）
- 点击 Claim
- 验证不支持的提示（如果适用）
- 验证成功流程（如果支持）

## 总结

✅ **所有需求已实现**
✅ **页面可跑通**（至少能发起交易）
✅ **非 mainnet 时交易会提示不可用，但 UI 完整**
✅ **所有 UI 用 HeroUI 组件**

**状态**: 可演示 ✅
