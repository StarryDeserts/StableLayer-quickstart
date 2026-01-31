import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import '@mysten/dapp-kit/dist/index.css'
import { sdkSmokeTestSync } from './lib/sdkSmokeTest'

const queryClient = new QueryClient()

// 开发环境下运行 SDK 烟雾测试
if (import.meta.env.DEV) {
  sdkSmokeTestSync().then((success) => {
    if (success) {
      console.log('🎉 SDK smoke test passed!')
    } else {
      console.error('💥 SDK smoke test failed!')
    }
  })
}

const networks = {
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="mainnet">
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
