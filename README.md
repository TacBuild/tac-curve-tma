# Curve TMA Frontend

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.0+-00DC82?logo=nuxt.js)
![TON](https://img.shields.io/badge/Blockchain-TON-0088CC?logo=ton)

A Nuxt 3 frontend for interacting with CurveLite contracts on TAC Chain (TON) demonstrating
token swaps and liquidity pool management. 

Testnet only.

## Key Features

- 🔗 Wallet connection (TonConnect)
- 💱 Swap tokens
- 📊 Add/remove liquidity from pools
- 📖 Transaction history (in development)

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment (copy and edit .env.example)
cp .env.example .env

# Run development server
npm run dev

# Production build
npm run build
```

## Core Functionality

### 1. Token Swapping
- Two-way calculations of rates via blockchain view methods
- Checking rates before swapping
- Follow progress of a transaction in realtime

### 2. Liquidity Management
- Check amounts of liquid pool tokens
- Add liquidity with rate calculation
- Remove liquidity with balanced token amounts (one coin and custom token amounts are in development)
- Follow progress of a transaction in realtime

### 3. Telegram Mini App ready
- You can just deploy and create a telegram bot for this app
- Added support for theming, back button. Easy configuration in one Nuxt plugin

## Development Notes

- Uses [TonConnect](https://www.npmjs.com/package/@tonconnect/ui) for wallet integration
- Built with [ethers](https://www.npmjs.com/package/ethers) for contract interactions
- Responsive design for mobile DeFi usage

## Deployment

Integrate with gitlab's CI/CD via `.gitlab-ci.yml` and `Dockerfile`, or [read the docs here](https://nuxt.com/docs/getting-started/deployment)

## License

MIT Licensed
