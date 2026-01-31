# UI 主题与 Guided Stepper 实现说明

## 变更概述

本次实现了 Bucket 风格的深色 DeFi 主题和静态 Guided Stepper 组件，**未改动任何业务逻辑**，仅新增 UI 基础设施。

---

## A. 主题 Tokens 实现

### 1. CSS Variables（核心 Tokens）

**文件**: `app/src/index.css`

新增了完整的深色 DeFi 主题变量：

```css
:root {
  /* Background - 近黑色带青蓝偏色 */
  --bg: #0a0e1a;
  --bg-gradient-top: #0f1421;
  --bg-gradient-bottom: #060a12;

  /* Surface - 深灰蓝卡片底色 */
  --surface: #141b2d;
  --surface-2: #1a2336;
  --surface-hover: #1f2840;

  /* Borders - 低透明度 */
  --border: rgba(99, 179, 237, 0.12);
  --border-hover: rgba(99, 179, 237, 0.25);

  /* Text 层级 */
  --text: #e8edf5;          /* 标题 - 近白 */
  --text-muted: #9ca3af;    /* 正文 - 浅灰 */
  --text-dim: #6b7280;      /* 说明 - 更暗灰 */

  /* Accent - 青色/浅蓝 */
  --accent: #3b82f6;
  --accent-2: #60a5fa;
  --accent-glow: rgba(59, 130, 246, 0.2);
  --accent-subtle: rgba(59, 130, 246, 0.1);

  /* 语义颜色 */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

  /* 状态颜色 */
  --status-done: #10b981;
  --status-current: #3b82f6;
  --status-pending: #f59e0b;
  --status-locked: #6b7280;
}
```

### 2. Tailwind v4 扩展

```css
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  /* ... 等 */
}
```

现在可以使用 `bg-surface`、`text-muted`、`border-border` 等 Tailwind 类名。

### 3. 全局样式

- **背景渐变**: 顶部略亮 (#0f1421) → 底部更暗 (#060a12)
- **字体平滑**: `-webkit-font-smoothing: antialiased`
- **滚动条样式**: 深色主题匹配

---

## B. GuidedStepper 组件

### 组件文件

**文件**: `app/src/components/GuidedStepper.tsx`

### 功能特性

#### 1. 静态 Mock 数据
```typescript
const DEFAULT_STEPS: StepConfig[] = [
  {
    id: 'mint',
    title: 'Mint',
    subtitle: '存入 USDC，铸造稳定币',
    status: 'done',      // ✓ 已完成
    icon: '✓'
  },
  {
    id: 'redeem',
    title: 'Redeem',
    subtitle: '销毁稳定币，赎回 USDC',
    status: 'current',   // ▶ 当前步骤
    icon: '▶'
  },
  {
    id: 'claim',
    title: 'Claim',
    subtitle: '领取流动性挖矿奖励',
    status: 'locked',    // 🔒 已锁定
    icon: '🔒',
    lockReason: '示例：余额不足或未连接钱包'
  }
]
```

#### 2. 四种状态视觉规范

| 状态 | 边框 | 发光 | Opacity | Chip 颜色 | Icon |
|------|------|------|---------|-----------|------|
| **done** | `var(--border)` | 无 | 1.0 | success | ✓ |
| **current** | `var(--accent)` | 青色 glow | 1.0 | primary | ▶ |
| **pending** | `var(--border)` | 无 | 0.85 | warning | ⏳ |
| **locked** | `var(--border)` | 无 | 0.55 | default | 🔒 |

#### 3. 卡片质感

```css
/* 默认 */
background: var(--surface);
border: 1px solid var(--border);
box-shadow: 轻阴影;

/* hover */
transform: translateY(-1px);
border-color: var(--border-hover);
box-shadow: 增强轻阴影;
transition: all 200ms ease-out;
```

#### 4. 响应式布局

- **≥1024px**: 3 列横排
- **<1024px**: 自动换行（grid-cols-1）

#### 5. Progress Bar

使用 HeroUI `<Progress>` 组件：
- 颜色: `var(--accent)`
- 背景: `var(--surface-2)`
- 显示: `{progress} / {totalSteps} 完成`

#### 6. Locked 状态 Tooltip

```tsx
<Tooltip content="示例：余额不足或未连接钱包" placement="top">
  <div>{cardContent}</div>
</Tooltip>
```

---

## C. 集成位置

**文件**: `app/src/App.tsx`

在主内容区域顶部插入（BalancePanel 上方）：

```tsx
<main className="container mx-auto px-4 py-8">
  <div className="max-w-4xl mx-auto space-y-6">
    {/* Guided Stepper - 静态 UI 演示 */}
    <GuidedStepper />

    {/* Balance Panel */}
    <BalancePanel />

    {/* ... 其他组件 */}
  </div>
</main>
```

同时更新了 Header 和 Footer 的样式以使用新的主题 tokens。

---

## D. 验收自检

### ✅ 功能完整性

- [x] **pnpm dev 可启动**: 无编译错误
- [x] **TypeScript 编译通过**: `npx tsc --noEmit` 无错误
- [x] **主题 tokens 落地**: 所有颜色使用 CSS variables
- [x] **四种状态视觉区分**: done/current/pending/locked 样式明显不同
- [x] **响应式布局**: ≥1024px 三列，<1024px 自动换行
- [x] **卡片质感**: hover 上浮 + 边框变亮 + 阴影增强
- [x] **Tooltip 功能**: locked 状态显示原因
- [x] **Progress 展示**: HeroUI Progress 组件正常显示

### ✅ 样式规范

- [x] **深色背景**: 近黑色 (#0a0e1a) 带青蓝偏色
- [x] **背景渐变**: 顶部略亮 → 底部更暗
- [x] **Surface 卡片**: 深灰蓝 (#141b2d)
- [x] **边框低透明**: rgba(99, 179, 237, 0.12)
- [x] **文字层级**: 标题近白 → 正文浅灰 → 说明暗灰
- [x] **Accent 青蓝**: #3b82f6 用于主按钮、active、chips、progress
- [x] **Current glow**: 青色光晕效果
- [x] **字体平滑**: antialiased
- [x] **滚动条主题**: 深色匹配

### ✅ 业务逻辑隔离

- [x] **未改动 Mint 逻辑**: `MintTab.tsx` 未修改
- [x] **未改动 Redeem 逻辑**: `RedeemTab.tsx` 未修改
- [x] **未改动 Claim 逻辑**: `ClaimTab.tsx` 未修改
- [x] **未改动交易流程**: `useTransaction.ts` 未修改
- [x] **未改动 SDK 调用**: `stablelayer/tx.ts` 未修改
- [x] **仅新增 UI 组件**: `GuidedStepper.tsx` 为纯静态组件

---

## 文件变更清单

### 新增文件（1 个）
1. `app/src/components/GuidedStepper.tsx` - Guided Stepper 组件

### 修改文件（2 个）
1. `app/src/index.css` - 主题 tokens + Tailwind 扩展
2. `app/src/App.tsx` - 集成 GuidedStepper + 更新 Header/Footer 样式

### 未改动（业务逻辑）
- `app/src/components/MintTab.tsx`
- `app/src/components/RedeemTab.tsx`
- `app/src/components/ClaimTab.tsx`
- `app/src/hooks/useTransaction.ts`
- `app/src/lib/stablelayer/tx.ts`
- 所有其他业务逻辑文件

---

## 关键代码片段

### 1. 主题 Tokens 使用示例

```tsx
// 使用 CSS variables
<div style={{ backgroundColor: 'var(--surface)' }}>
  <h1 style={{ color: 'var(--text)' }}>标题</h1>
  <p style={{ color: 'var(--text-muted)' }}>正文</p>
</div>

// 使用 Tailwind 扩展（如果配置了）
<div className="bg-surface border border-border">
  <h1 className="text-text">标题</h1>
</div>
```

### 2. GuidedStepper 状态切换

```tsx
// Current step - 青色边框 + glow
{
  border: 'var(--accent)',
  boxShadow: '0 0 12px var(--accent-glow), 0 0 24px var(--accent-glow)',
  opacity: 1
}

// Locked step - 低透明度 + cursor-not-allowed
{
  border: 'var(--border)',
  opacity: 0.55,
  cursor: 'not-allowed'
}
```

### 3. 响应式网格

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  {steps.map((step) => (
    <StepCard key={step.id} step={step} />
  ))}
</div>
```

---

## 运行命令

```bash
# 安装依赖（如果需要）
pnpm install

# 启动开发服务器
pnpm dev

# TypeScript 编译检查
pnpm exec tsc --noEmit

# 构建生产版本
pnpm build
```

---

## 视觉效果预览

### 页面整体
- 背景: 深色渐变（#0f1421 → #060a12）
- Header: 深灰蓝卡片 (#141b2d) + 低透明度边框
- 内容区: 最大宽度 4xl，间距 6

### GuidedStepper
- **Done (Mint)**: 绿色 chip，✓ 图标，正常透明度
- **Current (Redeem)**: 蓝色边框 + 青色 glow，▶ 图标，标题更亮
- **Locked (Claim)**: 低透明度 (0.55)，🔒 图标，hover 显示 Tooltip

### Progress Bar
- 进度: 1/3 (33.33%)
- 颜色: 青色 (#3b82f6)
- 背景: 深灰 (#1a2336)

---

## 后续扩展建议

### 第二轮（业务集成）
1. 将 GuidedStepper 连接到真实交易状态
2. 根据钱包连接、余额、pending 状态动态更新 step status
3. 点击 step card 自动切换到对应 Tab

### 第三轮（交互增强）
1. 添加 step 之间的连线动画
2. 完成进度动画（number counting）
3. locked → unlocked 过渡动画

### 第四轮（功能完善）
1. Stepper 状态持久化（localStorage）
2. 多步骤流程引导（onboarding）
3. 移动端优化（横向滚动 + snap）

---

## 技术亮点

1. **纯 CSS Variables**: 所有颜色可复用，无硬编码
2. **Tailwind v4 集成**: @theme 扩展支持新语法
3. **组件化设计**: GuidedStepper 完全独立，易于扩展
4. **响应式优先**: 移动端和桌面端都有良好体验
5. **业务逻辑隔离**: 本轮零改动业务代码
6. **TypeScript 类型安全**: 所有 props 都有完整类型定义

---

## 总结

✅ **主题 tokens 完整落地**（CSS variables + Tailwind v4 扩展）
✅ **GuidedStepper 静态 UI 完成**（四种状态 + 响应式 + Tooltip）
✅ **集成到主页面**（Header/Footer/Main 都使用新主题）
✅ **业务逻辑零改动**（仅新增 UI 基础设施）
✅ **编译构建通过**（TypeScript + Vite）

**下一步**: 等待用户反馈，或进入第二轮业务集成阶段。
