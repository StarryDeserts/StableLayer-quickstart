# 项目验证清单

使用此清单确保项目配置正确。

## ✅ 文件结构检查

- [x] `pnpm-workspace.yaml` - workspace 配置
- [x] `package.json` - 根项目配置
- [x] `app/package.json` - app 依赖配置
- [x] `app/vite.config.ts` - Vite 配置
- [x] `app/tsconfig.json` - TypeScript 配置
- [x] `app/postcss.config.mjs` - PostCSS 配置
- [x] `app/src/main.tsx` - React 入口
- [x] `app/src/App.tsx` - 主组件
- [x] `app/src/index.css` - 样式文件
- [x] `.sdk-reference/stable-layer-sdk/` - SDK 源码

## 🔧 配置验证

### pnpm workspace

```bash
# 验证 workspace 配置
cat pnpm-workspace.yaml
```

**期望输出**：
```yaml
packages:
  - 'app'
  - '.sdk-reference/stable-layer-sdk'
```

### HeroUI v3 依赖

```bash
# 检查 HeroUI 版本
grep -A 2 "@heroui" app/package.json
```

**期望输出**：
```json
"@heroui/react": "beta",
"@heroui/styles": "beta",
```

### Tailwind CSS v4

```bash
# 检查 Tailwind 版本
grep "tailwindcss" app/package.json
```

**期望输出**：
```json
"tailwindcss": "^4.0.0",
```

### Sui 依赖

```bash
# 检查 Sui 相关包
grep "@mysten" app/package.json
```

**期望输出**：
```json
"@mysten/dapp-kit": "^0.14.28",
"@mysten/sui": "^1.16.0",
"@mysten/wallet-standard": "^0.13.2",
```

## 🚀 启动测试

### 1. 安装依赖

```bash
pnpm -w install
```

**验证点**：
- [ ] 没有错误输出
- [ ] `app/node_modules` 目录存在
- [ ] `.sdk-reference/stable-layer-sdk/node_modules` 目录存在

### 2. 启动开发服务器

```bash
pnpm -C app dev
```

**验证点**：
- [ ] 服务器在 `http://localhost:3000` 启动
- [ ] 浏览器自动打开
- [ ] 没有编译错误
- [ ] 没有控制台错误

### 3. 页面检查

访问 `http://localhost:3000`，检查：

- [ ] 页面标题显示 "OneClick DApp"
- [ ] 顶部导航栏显示
- [ ] "Connect Wallet" 按钮显示在右上角
- [ ] 欢迎标题 "Welcome to OneClick" 显示
- [ ] 两个功能卡片（"Get Started" 和 "Features"）显示
- [ ] "Quick Actions" 卡片显示 5 个不同样式的按钮
- [ ] 底部 footer 显示

### 4. HeroUI 样式检查

在浏览器中检查：

- [ ] 卡片有边框和圆角
- [ ] 按钮有不同的颜色样式（primary、secondary 等）
- [ ] 文字有正确的颜色和间距
- [ ] 响应式布局工作正常（缩小浏览器窗口测试）

### 5. Sui 钱包功能

- [ ] 点击 "Connect Wallet" 按钮
- [ ] 钱包选择弹窗出现（如果安装了 Sui 钱包）
- [ ] 没有控制台错误

## 🐛 常见问题

### 依赖安装失败

**解决方案**：
```bash
# 清理缓存
pnpm store prune

# 重新安装
pnpm -w install --force
```

### Tailwind 样式不生效

**检查**：
```bash
cat app/src/index.css
```

**确保顺序正确**：
```css
@import "tailwindcss";      /* 必须在前 */
@import "@heroui/styles";   /* 必须在后 */
```

### HeroUI 组件找不到

**检查导入**：
```bash
grep "import.*@heroui" app/src/App.tsx
```

**确保从正确的包导入**：
```tsx
import { Button, Card } from '@heroui/react'
```

### 端口 3000 被占用

**修改端口**：
编辑 `app/vite.config.ts`：
```ts
server: {
  port: 3001,  // 改成其他端口
  open: true
}
```

## 📝 下一步

全部检查通过后，可以：

1. **阅读文档**
   - 📖 `README.md` - 完整项目说明
   - 🚀 `QUICKSTART.md` - 快速启动指南
   - 🏗️ `PROJECT_STRUCTURE.md` - 项目结构详解

2. **开始开发**
   - 修改 `app/src/App.tsx` 添加功能
   - 在 `app/src/` 创建新组件
   - 引入 StableLayer SDK 功能

3. **学习资源**
   - HeroUI v3 文档: https://v3.heroui.com
   - Sui 文档: https://docs.sui.io
   - Vite 文档: https://vitejs.dev

祝开发顺利！🎉
