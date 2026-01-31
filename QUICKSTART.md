# 快速启动指南

## 一键启动

```bash
# 1. 安装所有依赖（包括 SDK 和 app）
pnpm -w install

# 2. 启动开发服务器
pnpm -C app dev
```

就这么简单！浏览器会自动打开 `http://localhost:3000`

## 项目特点

### ✅ 已完成配置

- **pnpm workspace** - 多包管理，SDK 和 app 都已纳入
- **HeroUI v3** - 最新 beta 版，无需 Provider，开箱即用
- **Tailwind CSS v4** - 最新版本，与 HeroUI v3 完美集成
- **Sui 钱包** - dapp-kit 已配置，ConnectButton 已集成
- **TypeScript** - 严格模式，类型安全

### 📦 Workspace 成员

1. **app** - 前端 DApp（Vite + React + TS）
2. **.sdk-reference/stable-layer-sdk** - StableLayer SDK 源码

## 页面预览

启动后你会看到：

- **顶部导航栏** - 带 Sui 钱包连接按钮
- **欢迎区域** - 标题和描述
- **功能卡片** - 展示 HeroUI Card 组件
- **按钮展示** - 所有 HeroUI 按钮变体（primary、secondary、tertiary、outline、ghost）

## 下一步

### 使用 StableLayer SDK

检查 SDK 包名：

```bash
cat .sdk-reference/stable-layer-sdk/package.json | grep '"name"'
```

然后在 `app/src/App.tsx` 中导入使用：

```tsx
import { ... } from '<sdk-package-name>'
```

### 添加新页面

1. 创建组件文件：`app/src/pages/YourPage.tsx`
2. 使用 HeroUI 组件构建界面
3. 在 `App.tsx` 中引入

### 自定义主题

编辑 `app/src/index.css`，添加 CSS 变量覆盖：

```css
:root {
  --accent: oklch(0.6204 0.195 253.83);
  /* 更多自定义变量 */
}
```

## 故障排除

### 依赖安装失败

确保使用 pnpm：

```bash
pnpm -w install --force
```

### 端口被占用

修改 `app/vite.config.ts` 中的 `server.port`

### HeroUI 样式不生效

检查 `app/src/index.css` 中的导入顺序：

1. `@import "tailwindcss"` 必须在前
2. `@import "@heroui/styles"` 必须在后

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `pnpm -w install` | 安装所有依赖 |
| `pnpm dev` | 启动 app 开发服务器 |
| `pnpm build` | 构建 app 生产版本 |
| `pnpm -C app add <package>` | 在 app 中添加依赖 |
| `pnpm -w add <package> -D` | 在根目录添加开发依赖 |

## 开发建议

1. **使用 HeroUI v3 语法** - 复合组件模式（`Card.Header` 而非 `<CardHeader>`）
2. **优先使用 onPress** - 而非 onClick（更好的可访问性）
3. **语义化 variant** - 使用 `primary`、`secondary` 而非颜色名
4. **查阅文档** - HeroUI v3 文档：https://v3.heroui.com

祝开发愉快！🚀
