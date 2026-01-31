# OneClick DApp - 问题解决文档

## 问题：构建失败 + 页面白屏

### 根本原因
依赖版本冲突导致的构建和运行时错误：

1. **@mysten/dapp-kit 0.14.x** 依赖 **@mysten/sui@1.24.0**
2. **stable-layer-sdk 1.1.0** 依赖 **@mysten/sui@^1.44.0**
3. 两者版本不兼容，导致：
   - TypeScript 类型冲突
   - Vite 构建失败（Buffer polyfill、BcsStruct 缺失等）
   - 页面白屏

### 解决方案

#### 1. 修复依赖版本
```json
{
  "dependencies": {
    "@mysten/dapp-kit": "0.14.53",
    "@mysten/sui": "1.24.0",
    "@mysten/wallet-standard": "0.13.29"
  }
}
```

#### 2. 临时移除 stable-layer-sdk
由于版本不兼容，暂时移除 `stable-layer-sdk`：
```bash
pnpm remove stable-layer-sdk
```

#### 3. 添加 Node.js Polyfills
为浏览器环境添加 Buffer 等 polyfills：
```bash
pnpm add -D vite-plugin-node-polyfills
```

配置 `vite.config.ts`：
```typescript
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    })
  ]
})
```

#### 4. 修复代码导入
- 修改 `useBalances.ts` 直接使用 `SuiClient` API
- 注释掉 `sdkSmokeTest.ts` 中的 SDK 导入
- 简化 `tx.ts` 为 stub 函数
- 更新 `stablelayer/index.ts` 导出 stub

### 当前状态

✅ **构建成功**
```
✓ built in 10.74s
```

✅ **开发服务器运行中**
```
http://localhost:3000/
```

✅ **基础 UI 功能可用**
- 网络选择器
- 品牌选择器
- 钱包连接
- 余额显示（使用 SuiClient 直接查询）
- 交易历史
- Pending Redeems

⚠️ **暂不可用功能**
- Mint 交易（stable-layer-sdk 已禁用）
- Redeem 交易（stable-layer-sdk 已禁用）
- Claim 交易（stable-layer-sdk 已禁用）

### 未来升级路径

#### 选项 1：等待 SDK 更新
等待 `stable-layer-sdk` 发布新版本，支持 `@mysten/sui@1.24.0` 或更低版本。

#### 选项 2：升级到最新版本
当 `@mysten/dapp-kit` 发布支持最新 `@mysten/sui` 的版本时：
1. 升级所有 @mysten 包到最新版本
2. 更新代码以适配 API 变化（如 `getFullnodeUrl` → 新 API）
3. 重新启用 `stable-layer-sdk`

#### 选项 3：自定义 StableLayer 集成
直接使用 Move 合约调用，绕过 SDK：
1. 分析 `.sdk-reference` 中的合约调用逻辑
2. 使用 `Transaction` API 直接构建交易
3. 不依赖 `stable-layer-sdk`

### 测试检查清单

- [x] TypeScript 编译通过
- [x] Vite 构建成功
- [x] 开发服务器启动
- [x] 页面可访问（无白屏）
- [x] HeroUI 样式加载
- [ ] 钱包连接测试（需要钱包插件）
- [ ] 余额查询测试（需要连接钱包）
- [ ] 网络切换测试
- [ ] 品牌切换测试

### 常见错误及解决

#### 错误 1: "SuiClient" is not exported
```
Module '"@mysten/sui/client"' has no exported member 'SuiClient'
```
**解决**: 确保使用 `@mysten/sui@1.24.0`

#### 错误 2: Buffer is not defined
```
"Buffer" is not exported by "__vite-browser-external"
```
**解决**: 安装 `vite-plugin-node-polyfills` 并配置 Vite

#### 错误 3: BcsStruct not found
```
"BcsStruct" is not exported by "...@mysten/sui/bcs/index.js"
```
**解决**: 版本冲突，需要使用兼容的 @mysten/sui 版本

#### 错误 4: Transaction type mismatch
```
Type 'Transaction' is not assignable to type 'string | Transaction'
```
**解决**: 使用 `as any` 类型断言（临时方案）

### 技术债务

1. **stable-layer-sdk 集成**
   - 状态：暂时禁用
   - 优先级：高
   - 预计工作量：等待 SDK 更新或重写集成层

2. **类型断言 (as any)**
   - 位置：`hooks/useTransaction.ts:44`
   - 原因：dapp-kit 版本差异
   - TODO：升级到兼容版本后移除

3. **手动余额查询**
   - 当前：直接使用 SuiClient API
   - TODO：恢复使用 stablelayer/queries.ts

### 联系与支持

如果遇到其他问题：
1. 检查 `pnpm list` 确认依赖版本
2. 删除 `node_modules` 和 `pnpm-lock.yaml` 重新安装
3. 检查浏览器控制台错误
4. 查看开发服务器终端输出

### 版本记录

- **2026-01-30**: 修复依赖冲突，临时禁用 stable-layer-sdk
- 当前版本：
  - @mysten/dapp-kit: 0.14.53
  - @mysten/sui: 1.24.0
  - stable-layer-sdk: 已移除（临时）
