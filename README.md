# StableLayer Quickstart

A demo / educational DApp that showcases the StableLayer flow on **Sui mainnet**: Mint → Redeem (T+1) → Claim.

> This repository is intended for learning and demos. It is **not** a production-ready app.

## Screenshots

> Add screenshots in `app/assets/` and reference them here. Example:
>
> - `app/assets/overview.png`
> - `app/assets/tx-feedback.png`

## What this demo does

- **Mint**: deposit USDC to mint `btcUSDC`
- **Redeem (T+1)**: burn `btcUSDC` to request USDC redemption (settles on T+1)
- **Claim**: claim liquidity mining rewards (if any)
- Guided flow UI + transaction feedback cards (success/error) with digest copy & explorer links

## How the flow works

1. **Mint** USDC → receive `btcUSDC` in your wallet.
2. **Redeem** `btcUSDC` → submit a **T+1** redemption request. (Settlement happens the next day.)
3. **Claim** rewards if your position has accrued any claimable yield.

The UI enforces a guided, step‑by‑step flow and shows detailed transaction feedback.

## Tech stack

- **Vite 6** + **React 19** + **TypeScript**
- **HeroUI v3 (beta)** + Tailwind CSS v4
- **Sui wallet adapter**: `@mysten/dapp-kit`
- **Sui SDK**: `@mysten/sui`
- **StableLayer SDK**: `stable-layer-sdk`
- **State**: Zustand
- **Data**: React Query

## Getting started

> This project uses **pnpm** only.

```bash
pnpm -w install
pnpm -C app dev
```

Build / preview:

```bash
pnpm -C app build
pnpm -C app preview
```

## Configuration

- **Default network** is `mainnet` (see `app/src/config/networks.ts`).
- **Brand** is fixed to `btcUSDC` (see `app/src/config/brands.ts`).
- `StableLayer` mainnet package/registry IDs are in `app/src/config/stablelayer.ts`.

### Optional environment overrides

You **do not need** a `.env` to run this demo. Optional overrides are supported:

```bash
# app/.env.example
VITE_STABLELAYER_PACKAGE_ID=0x...
VITE_STABLELAYER_REGISTRY_ID=0x...
VITE_STABLELAYER_REGISTRY_INITIAL_SHARED_VERSION=123
```

Copy if needed:

```bash
cp app/.env.example app/.env
```

## Usage

1. Run the dev server and open `http://localhost:3000/`.
2. Connect a Sui wallet (mainnet).
3. **Mint** a small amount of USDC to receive `btcUSDC`.
4. **Redeem** `btcUSDC` (T+1). A pending item is shown in the UI.
5. **Claim** rewards if any are available.
6. Use the transaction feedback card to copy the digest or open the explorer.

## FAQ / Troubleshooting

**Q: Redeem failed with “err_insufficient_deposit (104)”**
- This demo surfaces a friendly explanation in the UI. Most commonly:
  - Your `btcUSDC` came from a transfer, not from Mint.
  - You just minted and the deposit record is not ready yet.
  - A previous T+1 redeem is still pending.

**Q: Claim failed / no rewards**
- Claim can fail if your position has **no claimable rewards** yet. The UI provides a summary and raw error details.

**Q: Why only mainnet?**
- The demo hard‑guards mainnet in the transaction builder. Testnet values are not set by default.

## Project structure

```
app/
  src/
    components/        UI (HeroUI v3) + feedback cards + guided stepper
    hooks/             useTransaction / useBalances / useGuidedFlow / history
    lib/               StableLayer adapters, Sui client, toast
    config/            networks / stablelayer / brands
  docs/                SDK reference docs (generated)
.sdk-reference/
  stable-layer-sdk/    reference-only SDK source (not used for build)
```

## About .sdk-reference

`./.sdk-reference` contains **StableLayer SDK source code for reference only**. It is **not** used as a dependency for the app build.

## Disclaimer

- **Demo / educational use only.**
- **Mainnet gas fees apply.**
- This app is **non‑custodial**; you sign transactions in your wallet.
- Use at your own risk.

## Prompts / Build Notes

To make this hackathon demo reproducible, this repo ships with the full Claude Code prompt & conversation log:

- `project_prompt.txt` (repo root): the exported chat history used during development, including prompts and generated outputs.

Notes:
- The file is provided for transparency and reproducibility.
- It may include iterative instructions and intermediate results during UI refactors.

## License

**MIT** 
