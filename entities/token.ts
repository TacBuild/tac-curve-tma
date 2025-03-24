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
    evmTokenAddress: '0x40d02AAe9D294Ebefe818Bc9020a9883E055154e',
    decimals: 6,
  },
  {
    title: 'Notcoin',
    logo: 'https://cdn.joincommunity.xyz/clicker/not_logo.png',
    symbol: 'NOT',
    evmTokenAddress: '0x132911A0eD9803BAa703048618B38638c40D24C1',
    decimals: 9,
  },
  {
    title: 'Hamster Kombat',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/hamster.webp',
    symbol: 'HMSTR',
    evmTokenAddress: '0xFF2FDb1C8D6c82858A998D65633fb5a3D87b5A10',
    decimals: 9,
  },
  // {
  //   title: 'DOGS',
  //   logo: 'https://storage.yandexcloud.net/tonscan/avatars/dogs.webp',
  //   symbol: 'DOGS',
  //   evmTokenAddress: '0x232B3FF9145d6bA31A3c552da7eBEff354f5b073',
  //   decimals: 9,
  // },
  {
    title: 'TonStakers Staked TON',
    logo: '/tokens/tston.svg',
    symbol: 'tsTON',
    evmTokenAddress: '0x1c63C68479574Bb9E3a76e842B9272013a717723',
    decimals: 9,
  },
  {
    title: 'REsistance DOg',
    logo: '/tokens/redo.png',
    symbol: 'REDO',
    evmTokenAddress: '0x8b55778dB15beafc4709D02D1B712D0109Ad725a',
    decimals: 9,
  },
  // {
  //   title: 'CATS',
  //   logo: '/tokens/cats.png',
  //   symbol: 'CATS',
  //   evmTokenAddress: '0xb2e8609Ea7EE128967E4C33fB023d270de3f560b',
  //   decimals: 9,
  // },
  {
    title: 'Catizen',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/CATI_TOKEN.webp',
    symbol: 'CATI',
    evmTokenAddress: '0xc1EA29c1c3923089A35258a15801626F820CDa86',
    decimals: 9,
  },
  {
    title: 'Bemo Staked TON',
    logo: 'https://i.tonscan.org/apps/images/9a44b649-1127-436a-b9b4-5e34059b7c73.png?dpr=2',
    symbol: 'stTON',
    evmTokenAddress: '0x831ca6cA752643E0b9E2a4A42A5d77a93E3D6241',
    decimals: 9,
  },
  {
    title: 'Storm Finance',
    logo: 'https://i.tonscan.org/apps/images/9a5836ef-d305-409a-87dc-e687099031f6.png?dpr=2',
    symbol: 'STORM',
    evmTokenAddress: '0x838A5c8EbEb2ad98412444Bd34714Ea652c0cbBB',
    decimals: 9,
  },
  {
    title: 'Povel Durev',
    logo: '/tokens/durev.png',
    symbol: 'DUREV',
    evmTokenAddress: '0x6F615BF749F6E000aEBFd0C2C2b7ab43d4930438',
    decimals: 9,
  },
  {
    title: 'NikoAI',
    logo: '/tokens/nikoai.png',
    symbol: 'NikoAI',
    evmTokenAddress: '0x5f807D892Fd1A73936a3DB132E61Adebe6237247',
    decimals: 9,
  },
  {
    title: 'Ston.Fi',
    logo: 'https://static.ston.fi/logo/ston_symbol.png',
    symbol: 'STON',
    evmTokenAddress: '0xc0C7851E4F31956f3569be9bFB7246F1Bd85FBD7',
    decimals: 9,
  },
  {
    title: 'Ethena USD',
    logo: '/tokens/ethena.png',
    symbol: 'USDE',
    evmTokenAddress: '0xd90C2a08460fB03847fd13093406233203328a7A',
    decimals: 18,
  },
  {
    title: 'WrappedETH',
    logo: '/tokens/weth.png',
    symbol: 'WETH',
    evmTokenAddress: '0x2183Bb115F6f90840B1d6FEd0857149546e4BF22',
    decimals: 18,
  },
  {
    title: 'Renzo ETH',
    logo: '/tokens/ezeth.png',
    symbol: 'ezETH',
    evmTokenAddress: '0x57705Dbb817F880A30cb9656D0a8e7F86f416B0E',
    decimals: 18,
  },
  // {
  //   title: 'Wrapped BTC',
  //   logo: '/tokens/wbtc.png',
  //   symbol: 'wBTC',
  //   evmTokenAddress: '0x86D8C875A4F21cb60F185ECC1F3a605E88d58Cca',
  //   decimals: 18,
  // },
  // {
  //   title: 'Lombard BTC',
  //   logo: '/tokens/lombard.png',
  //   symbol: 'LBTC',
  //   evmTokenAddress: '0x0B712c365c344221B09bBDD8dD1b828De86Fb24A',
  //   decimals: 18,
  // },
]
export const pools = Object.entries({
  'TON-USDT': '0x5461C1E0959d4936AB0ED9826f91A507A777578f',
  'TON-USDE': '0xE1724814c3feeF0e4104451D119601b0cF290f57',
  'TON-WETH': '0xA4Dbb78316eb3b3a0Dd1A415E4228D21DF07809C',
  'USDT-WETH': '0xb513F1C4Ca7EA642eBD5917a2dB754C043Fa92fA',
  'TON-ezETH': '0xED9f50B7b70FFF45b1E7A0e8AC57C8E2d42e308C',
  'TON-NOT': '0xFfF9f08DB31C7b0eE9793Cc11d9dD7a932250dD3',
  'TON-HMSTR': '0x7b060593a1329B97a49681D36708BeA712239D4d',
  'TON-stTON': '0x7842d8D18FD6D4BfEcE12aE0f612CebaE120d758',
  'TON-tsTON': '0xBBb711Ee57D85180a0B39F3BeF64a08c535354be',
  'TON-REDO': '0x2cD0e1E926E6137bd71019bF894C52A22c3B74ce',
  'TON-CATI': '0xBfb8cB4d2BC77B20864BE64872a0017feAC23d76',
  'TON-STORM': '0xdA6741920E14848F2497907dee53a5b401A1C515',
  'TON-DUREV': '0xa7870d339d47e822d0bACBf21354892B8913019d',
  'TON-NikoAI': '0x619Cec3E1b690D6b35AdA34295d3402028c0311D',
  'TON-STON': '0x6A265b674B36AB49AFf1B9944D7cA7E7F14425B5',
})
