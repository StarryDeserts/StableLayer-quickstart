# Mint 错误快速修复总结

## ✅ 已修复的问题

### 错误
```
Could not find the referenced object 0x52a724...
at version None
```

### 根本原因
1. **使用了 `coinWithBalance`** - 创建虚拟 coin，没有实际 object ID
2. **Shared objects 缺少验证** - 无法确认对象是否正确引用

### 修复方案

#### 1. 使用真实 USDC Coins
```typescript
// ❌ 错误（旧代码）
const usdcCoin = coinWithBalance({
  balance: amountInBaseUnits,
  type: usdcCoinType
})(tx)

// ✅ 正确（新代码）
const usdcCoins = await suiClient.getCoins({
  owner: sender,
  coinType: usdcCoinType
})

const [primaryCoin, ...otherCoins] = usdcCoins.data.map(coin => coin.coinObjectId)
if (otherCoins.length > 0) {
  tx.mergeCoins(primaryCoin, otherCoins)
}

const [usdcCoin] = tx.splitCoins(primaryCoin, [amountInBaseUnits])
```

#### 2. 添加 Shared Objects 验证
```typescript
await verifySharedObjects(suiClient)
```

验证以下关键对象：
- ✓ STABLE_REGISTRY
- ✓ STABLE_VAULT_FARM
- ✓ STABLE_VAULT
- ✓ YIELD_VAULT

#### 3. 添加调试日志
浏览器控制台会显示完整的执行流程，便于排查问题。

## 🧪 测试步骤

1. **打开应用**: http://localhost:3001/
2. **连接钱包**: Sui Wallet (必须有 USDC)
3. **选择网络**: Mainnet（必须！）
4. **选择品牌**: btcUSDC
5. **执行 Mint**: 输入金额 → 点击 Mint → 签名
6. **查看日志**: F12 打开控制台查看详细日志

## 📋 检查清单

- [ ] 网络为 Mainnet
- [ ] 钱包已连接
- [ ] USDC 余额 > 0
- [ ] SUI 余额 > 0 (用于 gas)
- [ ] 浏览器控制台无错误
- [ ] 开发服务器运行中 (localhost:3001)

## 🔍 如何确认修复成功

### 控制台日志应该显示：
```
[buildMintTx] Starting...
[verifySharedObjects] Checking critical shared objects...
✓ STABLE_REGISTRY: 0x213f... (shared: true)
  - initialSharedVersion: 696362017
✓ STABLE_VAULT_FARM: 0xe958... (shared: true)
✓ STABLE_VAULT: 0x65f3... (shared: true)
✓ YIELD_VAULT: 0x0a7f... (shared: true)
[verifySharedObjects] All critical objects verified ✓
[buildMintTx] Fetching USDC coins from wallet...
[buildMintTx] Found X USDC coins
[buildMintTx] Calling SDK buildMintTx...
[buildMintTx] Transaction built successfully
```

### UI 应该显示：
1. **签名弹窗** - 钱包请求签名
2. **执行中** - 按钮显示 loading 状态
3. **成功卡片** - 绿色边框的 TxResultCard
4. **交易详情**:
   - Transaction Digest
   - Explorer 链接
   - 复制按钮

## ⚠️ 常见问题

### Q: 还是报错 "object not found"
A: 检查：
1. 确认是 Mainnet（不是 Testnet）
2. 清除缓存并刷新页面
3. 查看浏览器控制台完整错误

### Q: "钱包中没有 USDC"
A: 需要先获取 USDC：
- 从交易所转入到 Sui Mainnet
- 确认 coin type 正确

### Q: Gas 不足
A: 钱包需要有 SUI 用于支付 gas
- 通常 0.1 SUI 就足够

### Q: Shared object 验证失败
A:
- 检查 RPC endpoint 是否正常
- 等待网络同步完成
- 确认 object IDs 正确

## 📁 修改的文件

- `app/src/lib/stablelayer/tx.ts`
  - buildMintTx: 使用真实 USDC coins
  - verifySharedObjects: 新增验证函数
  - 添加详细日志

## 🔗 相关文档

- 详细说明: `MINT_ERROR_FIX.md`
- 故障排除: `TROUBLESHOOTING.md`
- 功能总结: `FEATURE_SUMMARY.md`

## ✨ 下一步

修复成功后，尝试：
1. ✅ Mint 操作
2. ✅ Redeem 操作 (T+1)
3. ✅ Claim 操作（如果支持）
4. ✅ 查看交易历史
5. ✅ 查看 Pending Redeems

**开发服务器**: http://localhost:3001/
**现在可以测试了！** 🚀
