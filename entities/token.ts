export interface Token {
  title: string
  logo: string
  symbol: string
  evmTokenAddress: string
  decimals: number
}

export const tokens: Token[] = [
  {
    title: 'TON',
    logo: '/tokens/ton.png',
    symbol: 'TON',
    evmTokenAddress: '',
    decimals: 9,
  },
  {
    title: 'Tether USD',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/usdt.webp',
    symbol: 'USDT',
    evmTokenAddress: '0xAF988C3f7CB2AceAbB15f96b19388a259b6C438f',
    decimals: 6,
  },
  {
    title: 'Wrapped Ether',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    symbol: 'wETH',
    evmTokenAddress: '0x61D66bC21fED820938021B06e9b2291f3FB91945',
    decimals: 18,
  },
  {
    title: 'Coinbase Wrapped BTC',
    logo: 'https://assets.coingecko.com/coins/images/40143/large/cbbtc.webp',
    symbol: 'cbBTC',
    evmTokenAddress: '0x7048c9e4aBD0cf0219E95a17A8C6908dfC4f0Ee4',
    decimals: 8,
  },
  // {
  //   title: 'TAC',
  //   logo: 'https://res.cloudinary.com/dqz8o8js4/image/upload/v1752369223/Copy_of_TAC-logo-symbol-purple_xx17mf.png',
  //   symbol: 'TAC',
  //   evmTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  //   decimals: 18,
  // },
  // {
  //   title: 'TonStakers Liquid Staked TON',
  //   logo: 'https://assets.coingecko.com/coins/images/35404/large/icon_%281%29.png',
  //   symbol: 'tsTON',
  //   evmTokenAddress: '0xD44F691aeD69fe43180B95b6F82f89c18Fb93094',
  //   decimals: 9,
  // },
]
