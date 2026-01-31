/**
 * 开发模式 Mint Dry Run 测试组件
 * 仅在开发环境显示
 */

import { useState } from 'react'
import { Button, Card, Alert } from '@heroui/react'
import { useAppStore } from '../lib/store'
import { buildMintTx } from '../lib/stablelayer/adapter'
import { getNetworkConfig } from '../config/networks'

export function DevMintDryRun() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const suiClient = useAppStore((state) => state.suiClient)
  const network = useAppStore((state) => state.selectedNetwork)
  const brand = useAppStore((state) => state.selectedBrand)
  const address = useAppStore((state) => state.address)

  const handleDryRun = async () => {
    if (!address) {
      setError('请先连接钱包')
      return
    }

    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('🧪 [Dry Run] 开始 Mint 交易测试')
      console.log('📍 Network:', network)
      console.log('🏷️ Brand:', brand.displayName, brand.coinType)
      console.log('👛 Sender:', address)

      const networkConfig = getNetworkConfig(network)

      // 构建 Mint 交易（测试金额：1 USDC）
      const { tx, summary } = await buildMintTx({
        suiClient,
        sender: address,
        brandCoinType: brand.coinType,
        usdcCoinType: networkConfig.usdcCoinType,
        amountDecimalString: '1.0', // 测试金额：1 USDC
        network
      })

      console.log('✅ [Dry Run] 交易构建成功')
      console.log('📝 Summary:', summary)

      // Dry Run 交易
      console.log('🔍 [Dry Run] 开始 devInspect...')
      const dryRunResult = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: address
      })

      console.log('✅ [Dry Run] devInspect 完成')
      console.log('📊 Result:', dryRunResult)

      setResult({
        summary,
        dryRunResult,
        status: dryRunResult.effects.status.status,
        gasUsed: dryRunResult.effects.gasUsed
      })
    } catch (err) {
      const errorMessage = (err as Error).message
      console.error('❌ [Dry Run] 失败:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsRunning(false)
    }
  }

  // 仅在开发环境显示
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <Card className="border-2 border-dashed border-orange-500">
      <Card.Header>
        <Card.Title>🧪 Dev: Mint Dry Run</Card.Title>
        <Card.Description>
          开发测试：构建 Mint 交易并进行 dry-run（不会实际发送到链上）
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {/* 当前配置 */}
          <div className="text-sm space-y-1">
            <div>网络: <strong>{network}</strong></div>
            <div>品牌: <strong>{brand.displayName}</strong></div>
            <div>Coin Type: <code className="text-xs bg-default-100 px-1">{brand.coinType}</code></div>
            <div>钱包: {address ? <code className="text-xs bg-default-100 px-1">{address.slice(0, 10)}...</code> : '未连接'}</div>
          </div>

          {/* 测试按钮 */}
          <Button
            variant="primary"
            onPress={handleDryRun}
            isDisabled={isRunning || !address}
          >
            {isRunning ? '运行中...' : 'Dry Run Mint Tx (1 USDC)'}
          </Button>

          {/* 错误提示 */}
          {error && (
            <Alert status="danger">
              <Alert.Title>错误</Alert.Title>
              <Alert.Description>
                <pre className="text-xs overflow-auto">{error}</pre>
              </Alert.Description>
            </Alert>
          )}

          {/* 成功结果 */}
          {result && (
            <Alert status={result.status === 'success' ? 'success' : 'danger'}>
              <Alert.Title>
                {result.status === 'success' ? '✅ Dry Run 成功' : '❌ Dry Run 失败'}
              </Alert.Title>
              <Alert.Description>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>操作:</strong> {result.summary.operation}
                  </div>
                  <div>
                    <strong>金额:</strong> {result.summary.amountFormatted}
                  </div>
                  <div>
                    <strong>Gas Used:</strong>{' '}
                    {result.gasUsed.computationCost} (computation) +{' '}
                    {result.gasUsed.storageCost} (storage)
                  </div>
                  {result.summary.notes && (
                    <div>
                      <strong>备注:</strong>
                      <ul className="list-disc list-inside">
                        {result.summary.notes.map((note: string, i: number) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <details>
                      <summary className="cursor-pointer">查看完整结果</summary>
                      <pre className="mt-2 overflow-auto max-h-60 bg-default-50 p-2 rounded">
                        {JSON.stringify(result.dryRunResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </Alert.Description>
            </Alert>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <p className="text-xs text-muted-foreground">
          此组件仅在开发环境显示。查看浏览器控制台以获取详细日志。
        </p>
      </Card.Footer>
    </Card>
  )
}
