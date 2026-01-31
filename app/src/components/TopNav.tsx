/**
 * TopNav - Premium DeFi Navigation
 * Floating glass navbar with logo, network/brand controls, and wallet
 */

import { NetworkSelect } from './NetworkSelect'
import { BrandSelect } from './BrandSelect'
import { WalletConnectButton } from './WalletConnect'

export function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass-card max-w-7xl mx-auto rounded-2xl">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/stable_layer_demo_icon.png"
                alt="StableLayer Logo"
                className="w-[26px] h-[26px] rounded-lg"
                style={{
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              />
              <h1
                className="text-2xl font-bold tracking-wide"
                style={{
                  color: 'var(--text)',
                  textShadow: '0 0 20px var(--gold-glow)'
                }}
              >
                StableLayer Quickstart
              </h1>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <NetworkSelect />
              <BrandSelect />
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
