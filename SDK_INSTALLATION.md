# StableLayer SDK 安装说明

## ✅ 采用方案：npm 安装

**版本**: `stable-layer-sdk@1.1.0`

### 安装方式

SDK 通过 **npm registry** 直接安装，而非 workspace 本地依赖。

```bash
# 在 app 目录安装
pnpm -C app add stable-layer-sdk

# 或者在 app 目录内直接安装
cd app
pnpm add stable-layer-sdk
```

### 当前配置

#### app/package.json

```json
{
  "dependencies": {
    "stable-layer-sdk": "^1.1.0"
  }
}
```

#### pnpm-workspace.yaml

```yaml
packages:
  - 'app'
  # .sdk-reference/stable-layer-sdk 仅作为源码参考，不作为 workspace 成员
```

### .sdk-reference 目录说明

`.sdk-reference/stable-layer-sdk` 目录 **仅用于源码分析和参考**，不参与实际的依赖链接。

用途：
- ✅ 阅读源码理解 SDK 实现
- ✅ 查看测试用例学习 API 用法
- ✅ 分析接口定义和类型
- ❌ 不作为 workspace 本地依赖
- ❌ 不通过 `workspace:*` 引用

---

## 🧪 验证安装

### 1. 检查依赖

```bash
pnpm -C app list stable-layer-sdk
```

**期望输出**:
```
stable-layer-sdk 1.1.0
```

### 2. 运行烟雾测试

```bash
pnpm -C app dev
```

启动开发服务器后，打开浏览器控制台（F12），应该看到：

```
✅ StableLayer SDK loaded OK (sync)
📦 SDK Exports: ['StableLayerClient']
✅ StableLayerClient class found
🔧 StableLayerClient methods: ['buildMintTx', 'buildBurnTx', 'buildClaimTx', 'getTotalSupply', 'getTotalSupplyByCoinName', ...]
🎉 SDK smoke test passed!
```

### 3. 测试导入

创建测试文件 `app/src/test.ts`:

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
import type { StableLayerConfig } from 'stable-layer-sdk'

const config: StableLayerConfig = {
  network: "mainnet",
  sender: "0x0000000000000000000000000000000000000000000000000000000000000000"
}

const client = new StableLayerClient(config)
console.log('SDK client created:', client)
```

---

## 📦 依赖信息

### npm 包信息

- **Package Name**: `stable-layer-sdk`
- **Version**: `1.1.0`
- **Registry**: npm (https://registry.npmjs.org)
- **Repository**: https://github.com/StableLayer/stable-layer-sdk

### Peer Dependencies

SDK 要求以下 peer dependencies：

```json
{
  "@mysten/sui": "^1.44.0",
  "@mysten/bcs": "^1.9.2"
}
```

**当前 app 版本**:
- `@mysten/sui`: `^1.45.2` ✅ (符合要求)
- `@mysten/bcs`: `^1.9.2` ✅ (符合要求)

### 其他依赖

SDK 内部依赖：
- `@bucket-protocol/sdk`: `1.1.4`

---

## 🔄 对比：npm vs workspace

### ❌ 之前的方案（workspace）

```json
{
  "dependencies": {
    "stable-layer-sdk": "workspace:*"
  }
}
```

**问题**:
- 需要将 `.sdk-reference` 加入 pnpm-workspace.yaml
- 需要构建本地 SDK（`pnpm build`）
- 依赖本地文件系统路径

### ✅ 当前方案（npm）

```json
{
  "dependencies": {
    "stable-layer-sdk": "^1.1.0"
  }
}
```

**优势**:
- ✅ 直接从 npm registry 下载
- ✅ 无需构建，即装即用
- ✅ 版本管理清晰（semver）
- ✅ 可以锁定版本
- ✅ 与其他开发者共享项目时无需额外配置

---

## 🚀 使用示例

### 基础导入

```typescript
import { StableLayerClient } from 'stable-layer-sdk'
```

### 类型导入

```typescript
import type {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams,
  StableCoinType
} from 'stable-layer-sdk'
```

### 初始化客户端

```typescript
const client = new StableLayerClient({
  network: "mainnet",
  sender: userAddress
})
```

---

## 📚 相关文档

- [SDK API 映射](./app/docs/sdk-map.md) - 完整 API 文档
- [快速参考](./app/docs/sdk-quick-ref.md) - 常用 API 速查
- [集成检查清单](./app/docs/sdk-integration-checklist.md) - 集成指南
- [README](./README.md) - 项目总览

---

## ⚠️ 注意事项

1. **不要修改 `.sdk-reference` 目录**
   - 该目录仅用于参考，修改不会影响实际使用的 SDK

2. **版本更新**
   ```bash
   # 更新到最新版本
   pnpm -C app update stable-layer-sdk

   # 或指定版本
   pnpm -C app add stable-layer-sdk@1.2.0
   ```

3. **完全重装**
   ```bash
   # 删除依赖
   pnpm -C app remove stable-layer-sdk

   # 重新安装
   pnpm -C app add stable-layer-sdk
   ```

---

## ✅ 安装完成检查清单

- [x] `stable-layer-sdk` 已从 npm 安装
- [x] 版本为 `1.1.0`
- [x] Peer dependencies 已满足
- [x] 烟雾测试通过（`sdkSmokeTest.ts`）
- [x] 开发服务器可正常启动
- [x] 浏览器控制台显示 SDK 导入成功

**状态**: ✅ 安装成功，可以开始使用！
