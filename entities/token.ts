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
    evmTokenAddress: '0x7F68522359F290189A4a34460085a7D59b6EaFB2',
    decimals: 6,
  },
  {
    title: 'Notcoin',
    logo: 'https://cdn.joincommunity.xyz/clicker/not_logo.png',
    symbol: 'NOT',
    evmTokenAddress: '0x0941491dFedbb26D8D40564CE92813da97627a3F',
    decimals: 9,
  },
  {
    title: 'Hamster Kombat',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/hamster.webp',
    symbol: 'HMSTR',
    evmTokenAddress: '0x2619A7aFBe4FB518ee1b683b700559EA38F86fA4',
    decimals: 9,
  },
  {
    title: 'DOGS',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/dogs.webp',
    symbol: 'DOGS',
    evmTokenAddress: '0x59D0994F100d2263ac3D3137AD2237eFcD6713BD',
    decimals: 9,
  },
  {
    title: 'TonStakers Staked TON',
    logo: '/tokens/tston.svg',
    symbol: 'tsTON',
    evmTokenAddress: '0x12aC1E9F02f563b79edBa277A85029E82e7a5054',
    decimals: 9,
  },
  {
    title: 'REsistance DOg',
    logo: '/tokens/redo.png',
    symbol: 'REDO',
    evmTokenAddress: '0x7A5cf1F35fC42f28F5565Ba90501e4e38Cadd5dF',
    decimals: 9,
  },
  {
    title: 'CATS',
    logo: '/tokens/cats.png',
    symbol: 'CATS',
    evmTokenAddress: '0xFc08a1c1718aB691478f4451e1484BB9BA71EC59',
    decimals: 9,
  },
  {
    title: 'Catizen',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/CATI_TOKEN.webp',
    symbol: 'CATI',
    evmTokenAddress: '0x837dbD7728b112bC40D88d7c3cc6153D775647d3',
    decimals: 9,
  },
  {
    title: 'Bemo Staked TON',
    logo: 'https://i.tonscan.org/apps/images/9a44b649-1127-436a-b9b4-5e34059b7c73.png?dpr=2',
    symbol: 'stTON',
    evmTokenAddress: '0x68f0F3c9E4237859BdEaF6564Bc55817C0182b32',
    decimals: 9,
  },
  {
    title: 'Storm Finance',
    logo: 'https://i.tonscan.org/apps/images/9a5836ef-d305-409a-87dc-e687099031f6.png?dpr=2',
    symbol: 'STORM',
    evmTokenAddress: '0x9e997C42c90d485692a8c9BE86FaDa6fE7450356',
    decimals: 9,
  },
  {
    title: 'Povel Durev',
    logo: '/tokens/durev.png',
    symbol: 'DUREV',
    evmTokenAddress: '0x17b62558397F24AF199f5C9d1a5c9316F968eC0f',
    decimals: 9,
  },
  {
    title: 'NikoAI',
    logo: '/tokens/nikoai.png',
    symbol: 'NikoAI',
    evmTokenAddress: '0x8B859B5fBD485B80aC3B5Cd203751E5129819dc5',
    decimals: 9,
  },
  {
    title: 'Ston.Fi',
    logo: 'https://static.ston.fi/logo/ston_symbol.png',
    symbol: 'STON',
    evmTokenAddress: '0x6b52423eb8F9c98e3e53D6df3EDcca7b9df836Ef',
    decimals: 9,
  },
  {
    title: 'Ethena USD',
    logo: '/tokens/ethena.png',
    symbol: 'USDE',
    evmTokenAddress: '0xe73C23614ccc93ce8fdcCED785a2B9aEB30bA08B',
    decimals: 18,
  },
  {
    title: 'WrappedETH',
    logo: '/tokens/weth.png',
    symbol: 'WETH',
    evmTokenAddress: '0x14E9be279587B96Bc34Ec95C41d6087Ca32ff158',
    decimals: 18,
  },
  {
    title: 'Renzo ETH',
    logo: '/tokens/ezeth.png',
    symbol: 'ezETH',
    evmTokenAddress: '0x175778f962B99C006aFd8d79476DF1E74cEa3db5',
    decimals: 18,
  },
  {
    title: 'Wrapped BTC',
    logo: '/tokens/wbtc.png',
    symbol: 'wBTC',
    evmTokenAddress: '0x5C8FAD7A2591a10C026895CCab4878A5214f1809',
    decimals: 18,
  },
  {
    title: 'Lombard BTC',
    logo: '/tokens/lombard.png',
    symbol: 'LBTC',
    evmTokenAddress: '0x775D6Bf638C15B4b80109fA72753441b44D09Fd3',
    decimals: 18,
  },
  // {
  //   title: 'Wrapped TAC',
  //   logo: '/tokens/tac.png',
  //   symbol: 'wTAC',
  //   evmTokenAddress: '0x385E86C26D6f74766d2311B51A6C4A48479F258f',
  //   decimals: 18,
  // },
]
