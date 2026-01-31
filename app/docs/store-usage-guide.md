# Zustand Store 使用指南

## 📦 Store 结构

全局状态位于 `app/src/lib/store.ts`，使用 Zustand 管理。

---

## 🎯 状态列表

| 状态 | 类型 | 说明 |
|------|------|------|
| `selectedNetwork` | `NetworkType` | 当前选择的网络 (mainnet/testnet) |
| `selectedBrand` | `BrandConfig` | 当前选择的品牌 (btcUSDC) |
| `address` | `string \| undefined` | 钱包地址（连接后自动填充） |
| `suiClient` | `SuiClient` | Sui 客户端实例（随网络切换自动重建） |

---

## 🔧 方法列表

| 方法 | 参数 | 说明 |
|------|------|------|
| `setNetwork` | `(network: NetworkType)` | 切换网络（自动重建 SuiClient） |
| `setBrand` | `(brand: BrandConfig)` | 切换品牌 |
| `setAddress` | `(address?: string)` | 设置钱包地址 |
| `refreshClient` | `()` | 手动刷新 SuiClient |
| `reset` | `()` | 重置所有状态到初始值 |

---

## 📖 使用方式

### 方式 1: 使用完整 Store

```typescript
import { useAppStore } from '@/lib/store'

function MyComponent() {
  const network = useAppStore((state) => state.selectedNetwork)
  const setNetwork = useAppStore((state) => state.setNetwork)
  const address = useAppStore((state) => state.address)

  return (
    <div>
      <p>Network: {network}</p>
      <p>Address: {address || 'Not connected'}</p>
      <button onClick={() => setNetwork('testnet')}>
        Switch to Testnet
      </button>
    </div>
  )
}
```

### 方式 2: 使用便捷 Hooks

```typescript
import {
  useSelectedNetwork,
  useSelectedBrand,
  useWalletAddress,
  useSuiClient,
  useIsWalletConnected
} from '@/lib/store'

function MyComponent() {
  const network = useSelectedNetwork()
  const brand = useSelectedBrand()
  const address = useWalletAddress()
  const suiClient = useSuiClient()
  const isConnected = useIsWalletConnected()

  return (
    <div>
      <p>Network: {network}</p>
      <p>Brand: {brand.displayName}</p>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      {address && <p>Address: {address}</p>}
    </div>
  )
}
```

---

## 🔄 常见使用场景

### 1. 检查钱包是否连接

```typescript
import { useIsWalletConnected } from '@/lib/store'

function MyComponent() {
  const isConnected = useIsWalletConnected()

  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }

  return <div>Wallet connected!</div>
}
```

### 2. 使用 SuiClient 查询数据

```typescript
import { useSuiClient, useWalletAddress } from '@/lib/store'
import { useEffect, useState } from 'react'

function BalanceDisplay() {
  const suiClient = useSuiClient()
  const address = useWalletAddress()
  const [balance, setBalance] = useState<string>()

  useEffect(() => {
    if (!address) return

    suiClient.getBalance({ owner: address, coinType: '0x2::sui::SUI' })
      .then(result => setBalance(result.totalBalance))
  }, [suiClient, address])

  return <div>SUI Balance: {balance || 'Loading...'}</div>
}
```

### 3. 根据当前网络显示不同内容

```typescript
import { useSelectedNetwork } from '@/lib/store'

function NetworkBadge() {
  const network = useSelectedNetwork()

  return (
    <div className={network === 'mainnet' ? 'bg-green-500' : 'bg-orange-500'}>
      {network === 'mainnet' ? '🟢 Mainnet' : '🟠 Testnet'}
    </div>
  )
}
```

### 4. 根据品牌配置显示警告

```typescript
import { useSelectedBrand } from '@/lib/store'
import { isBrandConfigured } from '@/config/brands'

function BrandStatus() {
  const brand = useSelectedBrand()
  const isConfigured = isBrandConfigured(brand)

  if (!isConfigured) {
    return <div className="alert">⚠️ {brand.displayName} not configured</div>
  }

  return <div className="success">✅ {brand.displayName} ready</div>
}
```

### 5. 切换网络

```typescript
import { useAppStore } from '@/lib/store'

function NetworkSwitcher() {
  const setNetwork = useAppStore((state) => state.setNetwork)

  return (
    <div>
      <button onClick={() => setNetwork('mainnet')}>Mainnet</button>
      <button onClick={() => setNetwork('testnet')}>Testnet</button>
    </div>
  )
}
```

### 6. 获取当前品牌的 Coin Type

```typescript
import { useSelectedBrand, useSelectedNetwork } from '@/lib/store'
import { getUsdcCoinType } from '@/config/networks'

function CoinTypes() {
  const brand = useSelectedBrand()
  const network = useSelectedNetwork()
  const usdcCoinType = getUsdcCoinType(network)

  return (
    <div>
      <p>Brand Coin Type: {brand.coinType}</p>
      <p>USDC Coin Type: {usdcCoinType}</p>
    </div>
  )
}
```

---

## ⚡ 性能优化

### 精确订阅（推荐）

```typescript
// ✅ 好的做法：只订阅需要的状态
const address = useAppStore((state) => state.address)
const network = useAppStore((state) => state.selectedNetwork)

// 组件只在 address 或 network 变化时重新渲染
```

### 避免订阅整个 Store

```typescript
// ❌ 不好的做法：订阅整个 store
const store = useAppStore()

// 组件会在任何状态变化时重新渲染
```

### 使用 Shallow 比较（多个状态）

```typescript
import { useAppStore } from '@/lib/store'
import { shallow } from 'zustand/shallow'

function MyComponent() {
  const { network, brand, address } = useAppStore(
    (state) => ({
      network: state.selectedNetwork,
      brand: state.selectedBrand,
      address: state.address
    }),
    shallow // 浅比较，避免不必要的重新渲染
  )

  return (/* ... */)
}
```

---

## 🐛 调试

### 查看当前状态

```typescript
import { useAppStore } from '@/lib/store'

function DebugPanel() {
  const store = useAppStore()

  return (
    <pre>
      {JSON.stringify({
        network: store.selectedNetwork,
        brand: store.selectedBrand.key,
        address: store.address,
        hasClient: !!store.suiClient
      }, null, 2)}
    </pre>
  )
}
```

### 控制台输出

```typescript
// 在任何地方获取当前状态
const currentState = useAppStore.getState()
console.log('Current state:', currentState)
```

### 重置状态

```typescript
import { useAppStore } from '@/lib/store'

function ResetButton() {
  const reset = useAppStore((state) => state.reset)

  return (
    <button onClick={reset}>
      Reset All State
    </button>
  )
}
```

---

## 📚 更多资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 最佳实践](https://github.com/pmndrs/zustand/wiki/Best-Practices)
- [Store 源码](../src/lib/store.ts)

---

## 💡 提示

1. **网络切换会自动重建 SuiClient**
   调用 `setNetwork()` 时，`suiClient` 会自动更新为新网络的客户端。

2. **钱包地址自动同步**
   不需要手动调用 `setAddress()`，`WalletConnect` 组件会自动监听钱包状态变化。

3. **使用便捷 Hooks**
   优先使用 `useSelectedNetwork()` 等便捷 hooks，代码更简洁。

4. **精确订阅**
   只订阅需要的状态，避免不必要的重新渲染。
