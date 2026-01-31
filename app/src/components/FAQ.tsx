/**
 * FAQ - Information Cards
 * Clean, spacious cards with clear information hierarchy
 */

// Premium FAQ Section - No card import needed

export function FAQ() {
  const sections = [
    {
      title: "What you're demoing",
      icon: '🎯',
      content: (
        <div className="space-y-3">
          <p style={{ color: 'var(--text-muted)' }}>
            StableLayer is a liquidity protocol on Sui that powers brand stablecoins.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>In this demo, you'll try:</p>
          <ul className="space-y-2">
            {[
              'Mint a brand stablecoin with USDC',
              'Redeem back to USDC (may be T+1 settlement)',
              'Claim rewards (if available)'
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span style={{ color: 'var(--gold)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      title: 'Guided walkthrough',
      icon: '🗺️',
      content: (
        <div className="space-y-3">
          <p style={{ color: 'var(--text-muted)' }}>
            This page is a learning sandbox — not a full DeFi product UI:
          </p>
          <ol className="space-y-3">
            {[
              'Connect your wallet (Mainnet)',
              'Pick a supported brand stablecoin',
              'Try Mint → Redeem → Claim',
              'Watch real-time transaction feedback (hash / status / explorer link)'
            ].map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'var(--purple-subtle)',
                    color: 'var(--purple-2)',
                    border: '1px solid var(--purple)'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    },
    {
      title: 'Notes & safety',
      icon: '⚠️',
      content: (
        <div className="space-y-3">
          <ul className="space-y-2">
            {[
              'This is a demo interface for educational purposes.',
              'Use small amounts on Mainnet; gas fees apply.',
              'Redeem may settle in T+1 depending on the pool/mode.',
              "Always verify you're interacting with the intended contracts."
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span style={{ color: 'var(--warning)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    }
  ]

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Learn More
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            A hands-on demo to understand what StableLayer enables on Sui — in 3 guided actions.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.title}
              className="glass-card rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]"
            >
              {/* Icon & Title */}
              <div className="mb-4">
                <div className="text-4xl mb-3">{section.icon}</div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  {section.title}
                </h3>
              </div>

              {/* Content */}
              <div className="text-sm leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
