# UI 主题 + Guided Stepper - 快速开始

## ✅ 已完成

### 1. Bucket 风格深色 DeFi 主题
- ✅ CSS Variables 主题 tokens（`app/src/index.css`）
- ✅ 深色背景渐变（#0f1421 → #060a12）
- ✅ 青蓝 accent 色系（#3b82f6）
- ✅ 文字层级（标题/正文/说明）
- ✅ Tailwind v4 扩展
- ✅ 滚动条主题化

### 2. GuidedStepper 组件
- ✅ 静态 UI 展示四种状态：
  - **Done**: ✓ 绿色 chip
  - **Current**: ▶ 青色边框 + glow
  - **Pending**: ⏳ 橙色 chip
  - **Locked**: 🔒 低透明度 + Tooltip
- ✅ 响应式布局（3 列 → 1 列）
- ✅ 卡片质感（hover 上浮 + 边框变亮）
- ✅ HeroUI Progress 进度条
- ✅ 完整 TypeScript 类型

### 3. 集成到主页面
- ✅ Header 使用新主题
- ✅ Footer 使用新主题
- ✅ GuidedStepper 在 BalancePanel 上方

---

## 🚀 运行命令

```bash
# 启动开发服务器
pnpm dev

# 访问
http://localhost:3001/

# TypeScript 编译检查
pnpm exec tsc --noEmit

# 构建生产版本
pnpm build
```

---

## 📁 文件清单

### 新增文件
- `app/src/components/GuidedStepper.tsx` - Stepper 组件

### 修改文件
- `app/src/index.css` - 主题 tokens + Tailwind 扩展
- `app/src/App.tsx` - 集成 GuidedStepper + 更新样式

### 未改动（业务逻辑）
- `app/src/components/MintTab.tsx`
- `app/src/components/RedeemTab.tsx`
- `app/src/components/ClaimTab.tsx`
- `app/src/hooks/useTransaction.ts`
- `app/src/lib/stablelayer/tx.ts`
- 所有交易相关逻辑

---

## 🎨 主题 Tokens 使用

### CSS Variables（推荐）
```tsx
<div style={{ backgroundColor: 'var(--surface)' }}>
  <h1 style={{ color: 'var(--text)' }}>标题</h1>
  <p style={{ color: 'var(--text-muted)' }}>正文</p>
  <span style={{ color: 'var(--text-dim)' }}>说明</span>
</div>

<button style={{
  backgroundColor: 'var(--accent)',
  color: 'white'
}}>
  主按钮
</button>
```

### Tailwind 类名（v4 扩展）
```tsx
<div className="bg-surface border border-border">
  <h1 className="text-text">标题</h1>
  <p className="text-text-muted">正文</p>
</div>
```

---

## 🔧 Stepper 自定义

### 基本用法（mock 数据）
```tsx
import { GuidedStepper } from './components/GuidedStepper'

function App() {
  return (
    <GuidedStepper />
  )
}
```

### 自定义 steps
```tsx
const customSteps = [
  {
    id: 'step1',
    title: 'Step 1',
    subtitle: '描述文字',
    status: 'done',
    icon: '✓'
  },
  {
    id: 'step2',
    title: 'Step 2',
    subtitle: '描述文字',
    status: 'current',
    icon: '▶'
  },
  {
    id: 'step3',
    title: 'Step 3',
    subtitle: '描述文字',
    status: 'locked',
    icon: '🔒',
    lockReason: '需要完成前置步骤'
  }
]

<GuidedStepper steps={customSteps} progress={1} />
```

---

## 📊 视觉效果

### 页面整体
- **背景**: 深色渐变 (#0f1421 → #060a12)
- **Header**: 深灰蓝卡片 + 模糊背景
- **卡片**: 深灰蓝 (#141b2d) + 低透明度边框

### Stepper 状态
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ✓  Mint        │  │  ▶  Redeem      │  │  🔒 Claim       │
│  Done           │  │  Current        │  │  Locked         │
│                 │  │  [glow effect]  │  │  [50% opacity]  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
     绿色 chip             青色边框 + glow       灰色 chip
     正常透明度           标题更亮              低透明度

Progress: ████████████░░░░░░░░░░░░ 1/3 完成 (33%)
```

### Hover 效果
- transform: translateY(-1px)
- border-color: 变亮
- box-shadow: 增强
- transition: 200ms ease-out

---

## 🎯 验收标准

### ✅ 主题
- [x] 深色背景渐变
- [x] 青蓝 accent 色系
- [x] 文字层级清晰
- [x] 边框低透明度
- [x] 滚动条主题化

### ✅ Stepper
- [x] 四种状态视觉区分明显
- [x] Current 有青色 glow
- [x] Locked 低透明度 + Tooltip
- [x] 响应式布局（3 列 → 1 列）
- [x] Hover 上浮效果
- [x] Progress 进度条

### ✅ 代码质量
- [x] TypeScript 编译通过
- [x] 无业务逻辑改动
- [x] 组件完全独立
- [x] Props 有完整类型定义

---

## 🔜 下一步（第二轮）

### 业务集成建议
1. 连接真实交易状态
   ```tsx
   const steps = [
     {
       id: 'mint',
       status: hasMinted ? 'done' : 'current',
       // ...
     },
     {
       id: 'redeem',
       status: !hasMinted ? 'locked' : hasRedeemed ? 'done' : 'current',
       lockReason: !hasMinted ? '请先完成 Mint' : undefined,
       // ...
     }
   ]
   ```

2. 钱包连接检测
   ```tsx
   status: !address ? 'locked' : 'current',
   lockReason: !address ? '请先连接钱包' : undefined
   ```

3. 余额验证
   ```tsx
   status: balance === '0' ? 'locked' : 'current',
   lockReason: balance === '0' ? 'USDC 余额不足' : undefined
   ```

4. 点击跳转
   ```tsx
   <StepCard onClick={() => setActiveTab(step.id)} />
   ```

---

## 📝 注意事项

1. **本轮仅静态 UI**
   - GuidedStepper 使用 mock 数据
   - 不连接真实业务状态
   - 不改动任何交易逻辑

2. **主题 tokens 规范**
   - 所有颜色使用 CSS variables
   - 禁止硬编码 hex 颜色
   - 语义化命名（--accent / --success / --danger）

3. **组件独立性**
   - GuidedStepper 完全独立
   - 可复用到其他页面
   - 通过 props 控制所有行为

---

## 🎨 Bucket 风格参考

### 颜色方案
- **背景**: 近黑色 + 青蓝偏色
- **卡片**: 深灰蓝 (#141b2d)
- **Accent**: 青色/浅蓝 (#3b82f6)
- **边框**: 低透明度（12%）
- **文字**: 近白 → 浅灰 → 暗灰

### 设计原则
- 低对比度（护眼）
- 轻阴影（不喧宾夺主）
- 青蓝点缀（专业感）
- 渐变背景（空间感）
- 字体平滑（antialiased）

---

**状态**: ✅ 可演示
**访问**: http://localhost:3001/
