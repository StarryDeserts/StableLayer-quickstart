/**
 * Hero - Premium DeFi Hero Section
 * Spacious hero with gradient background and clear value proposition
 */

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      {/* Gradient Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--gold)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--purple)' }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <div className="inline-block mb-6">
          <div
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'var(--gold-subtle)',
              border: '1px solid var(--gold)',
              color: 'var(--gold-2)'
            }}
          >
            📚 Interactive Demo · Powered by StableLayer on Sui
          </div>
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{
            color: 'var(--text)',
            textShadow: '0 0 40px var(--purple-glow)'
          }}
        >
          StableLayer
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, var(--gold) 0%, var(--purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Quickstart Demo
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          A guided sandbox to learn brand stablecoin operations.
          <br />
          Try Mint → Redeem → Claim in a real Mainnet environment.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto">
          {[
            { label: 'Mint', value: '1 Step', icon: '⚡' },
            { label: 'T+1 Redeem', value: '24h', icon: '⏱️' },
            { label: 'Claim', value: 'Instant', icon: '🎁' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: 'var(--gold)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-dim)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
