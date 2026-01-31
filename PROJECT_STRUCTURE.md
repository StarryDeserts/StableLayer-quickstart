# 项目结构说明

```
OneClick/
│
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── package.json                 # 根项目配置（快捷脚本）
├── README.md                    # 完整项目文档
├── QUICKSTART.md                # 快速启动指南
├── .gitignore                   # Git 忽略配置
│
├── app/                         # 前端 DApp 应用
│   ├── index.html               # HTML 入口
│   ├── package.json             # app 依赖配置
│   ├── vite.config.ts           # Vite 构建配置
│   ├── tsconfig.json            # TypeScript 主配置
│   ├── tsconfig.node.json       # TypeScript Node 配置
│   ├── postcss.config.mjs       # PostCSS 配置（Tailwind v4）
│   │
│   └── src/
│       ├── main.tsx             # React 入口 + Sui Provider 配置
│       ├── App.tsx              # 主应用组件（HeroUI 示例）
│       ├── index.css            # 全局样式（Tailwind + HeroUI）
│       └── vite-env.d.ts        # Vite 类型定义
│
└── .sdk-reference/              # SDK 参考源码
    └── stable-layer-sdk/        # StableLayer SDK（workspace 成员）
        ├── package.json
        ├── src/
        │   ├── index.ts         # SDK 主入口
        │   ├── interface.ts     # SDK 接口定义
        │   ├── libs/            # SDK 工具库
        │   └── generated/       # 自动生成的代码
        └── test/                # SDK 测试
```

## 核心配置文件说明

### 根目录

| 文件 | 说明 |
|------|------|
| `pnpm-workspace.yaml` | 定义 workspace 成员（app + SDK） |
| `package.json` | 根项目元信息和快捷脚本 |

### app 配置

| 文件 | 说明 |
|------|------|
| `package.json` | 包含所有前端依赖（HeroUI、Sui、React） |
| `vite.config.ts` | Vite 开发服务器配置（端口 3000） |
| `tsconfig.json` | TypeScript 严格模式配置 |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS 插件 |

### app 源代码

| 文件 | 说明 |
|------|------|
| `src/main.tsx` | React 根组件 + Sui Provider 包装 |
| `src/App.tsx` | 主页面组件（HeroUI 示例布局） |
| `src/index.css` | Tailwind v4 + HeroUI v3 样式导入 |

## 依赖关系

```
根项目（workspace）
├── app（前端）
│   ├── @heroui/react@beta
│   ├── @heroui/styles@beta
│   ├── @mysten/dapp-kit
│   ├── @mysten/sui
│   ├── @tanstack/react-query
│   ├── react + react-dom
│   ├── tailwind-variants
│   └── vite + typescript
│
└── .sdk-reference/stable-layer-sdk
    └── （SDK 自己的依赖）
```

## 技术栈总结

| 层级 | 技术 |
|------|------|
| **包管理** | pnpm workspace |
| **构建工具** | Vite 6 |
| **前端框架** | React 18 + TypeScript 5.6 |
| **UI 组件** | HeroUI v3 (beta) |
| **样式方案** | Tailwind CSS v4 |
| **区块链** | Sui (@mysten/sui + dapp-kit) |
| **状态管理** | React Query |
| **SDK 集成** | StableLayer SDK (workspace) |

## 工作流程

1. **开发**：`pnpm -C app dev` → 启动 Vite 开发服务器
2. **构建**：`pnpm -C app build` → 生成 `dist/` 目录
3. **预览**：`pnpm -C app preview` → 本地预览生产构建

## 关键特性

- ✅ **零配置启动** - 运行 `pnpm -w install && pnpm dev` 即可
- ✅ **HeroUI v3** - 最新复合组件模式，无需 Provider
- ✅ **Sui 钱包集成** - ConnectButton 已内置
- ✅ **SDK 本地引用** - workspace 管理，方便调试
- ✅ **TypeScript 严格模式** - 类型安全
- ✅ **Tailwind v4** - 最新 CSS 引擎
