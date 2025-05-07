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
    evmTokenAddress: '0xd7d11F0CA352a83aB11fAed983Cf28ACB5AB61aD',
    decimals: 6,
  },
  {
    title: 'Notcoin',
    logo: 'https://cdn.joincommunity.xyz/clicker/not_logo.png',
    symbol: 'NOT',
    evmTokenAddress: '0x54508b77F612B6B68aAC0690c0c2efE382627515',
    decimals: 9,
  },
  {
    title: 'Hamster Kombat',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/hamster.webp',
    symbol: 'HMSTR',
    evmTokenAddress: '0x619A1B0780Ff65f2414B054F685300DD3ecddf44',
    decimals: 9,
  },
  {
    title: 'DOGS',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/dogs.webp',
    symbol: 'DOGS',
    evmTokenAddress: '0x6DEC2B60Fa96a5F7304e89C2B972CE765A5692e3',
    decimals: 9,
  },
  {
    title: 'TonStakers Staked TON',
    logo: '/tokens/tston.svg',
    symbol: 'tsTON',
    evmTokenAddress: '0xf74Cc7d67293f8aBa43Ae6e31308f3E35b475F46',
    decimals: 9,
  },
  {
    title: 'REsistance DOg',
    logo: '/tokens/redo.png',
    symbol: 'REDO',
    evmTokenAddress: '0x6fe43e4c4f7c19edb460b5756D88d7DcFB04198D',
    decimals: 9,
  },
  {
    title: 'CATS',
    logo: '/tokens/cats.png',
    symbol: 'CATS',
    evmTokenAddress: '0x4Ec9C5f9448BCc6c00b2c1c6FA0327c61c217fA1',
    decimals: 9,
  },
  {
    title: 'Catizen',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/CATI_TOKEN.webp',
    symbol: 'CATI',
    evmTokenAddress: '0xB998599650339B282ee80E58dc6cA0478BF86465',
    decimals: 9,
  },
  {
    title: 'Bemo Staked TON',
    logo: 'https://i.tonscan.org/apps/images/9a44b649-1127-436a-b9b4-5e34059b7c73.png?dpr=2',
    symbol: 'stTON',
    evmTokenAddress: '0x3600869f4dD666c44EFA983b8dC97d5981DE77AC',
    decimals: 9,
  },
  {
    title: 'Storm Finance',
    logo: 'https://i.tonscan.org/apps/images/9a5836ef-d305-409a-87dc-e687099031f6.png?dpr=2',
    symbol: 'STORM',
    evmTokenAddress: '0x98983D6D3e481394ab51c48969cf7848EEEa179d',
    decimals: 9,
  },
  {
    title: 'Povel Durev',
    logo: '/tokens/durev.png',
    symbol: 'DUREV',
    evmTokenAddress: '0xb18Bb14D9dbAEd5b849753De2fdde202042aDBa6',
    decimals: 9,
  },
  {
    title: 'NikoAI',
    logo: '/tokens/nikoai.png',
    symbol: 'NikoAI',
    evmTokenAddress: '0x38E0674502C8aE1a4A877F5aDA2A48cFe49586B4',
    decimals: 9,
  },
  {
    title: 'Ston.Fi',
    logo: 'https://static.ston.fi/logo/ston_symbol.png',
    symbol: 'STON',
    evmTokenAddress: '0x8C6a8d6568C3E6b530c3D4e87146ED9ddbaa710A',
    decimals: 9,
  },
  {
    title: 'Ethena USD',
    logo: '/tokens/ethena.png',
    symbol: 'USDE',
    evmTokenAddress: '0x61A2e9F3bC500F0552e5E69B9CDF9175226B16D3',
    decimals: 18,
  },
  {
    title: 'WrappedETH',
    logo: '/tokens/weth.png',
    symbol: 'WETH',
    evmTokenAddress: '0xBd9dEaDd6585e6A91ac84C1fDc0Ee7CEdE52F134',
    decimals: 18,
  },
  {
    title: 'Renzo ETH',
    logo: '/tokens/ezeth.png',
    symbol: 'ezETH',
    evmTokenAddress: '0x5A2C9571F947f15a851b68efE5517691eec4f7Be',
    decimals: 18,
  },
  {
    title: 'Wrapped BTC',
    logo: '/tokens/wbtc.png',
    symbol: 'wBTC',
    evmTokenAddress: '0x40cB6221f0049B8225118332b8240dc2bC8b4f26',
    decimals: 18,
  },
  {
    title: 'Lombard BTC',
    logo: '/tokens/lombard.png',
    symbol: 'LBTC',
    evmTokenAddress: '0xA7b7c2Ac37bB3cBdfaf569c849C2abd59A748F61',
    decimals: 18,
  },
  {
    title: 'Wrapped TAC',
    logo: '/tokens/tac.png',
    symbol: 'wTAC',
    evmTokenAddress: '0x385E86C26D6f74766d2311B51A6C4A48479F258f',
    decimals: 18,
  },
]
