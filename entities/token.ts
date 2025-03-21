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
    evmTokenAddress: '0x35e1BAF9Edb192536E68d0B5c1214a7DA21e0F32',
    decimals: 6,
  },
  {
    title: 'Notcoin',
    logo: 'https://cdn.joincommunity.xyz/clicker/not_logo.png',
    symbol: 'NOT',
    evmTokenAddress: '0x02BE37073AfcFd7EFB70f273EC9EdA9f8AFa5c03',
    decimals: 9,
  },
  {
    title: 'Hamster Kombat',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/hamster.webp',
    symbol: 'HMSTR',
    evmTokenAddress: '0x5EE0C1F187177a82aD88F1d76100DF4fb469d817',
    decimals: 9,
  },
  {
    title: 'DOGS',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/dogs.webp',
    symbol: 'DOGS',
    evmTokenAddress: '0x13eB1D6979cE52F863d8bf1e55Be26Ec3e586A2B',
    decimals: 9,
  },
  {
    title: 'TonStakers Staked TON',
    logo: '/tokens/tston.svg',
    symbol: 'tsTON',
    evmTokenAddress: '0x8CbBCd3Ec6C0af9b8CEdD5B557D101ACeD379104',
    decimals: 9,
  },
  {
    title: 'REsistance DOg',
    logo: '/tokens/redo.png',
    symbol: 'REDO',
    evmTokenAddress: '0xE7C76dee59eA08f865051E91f5337606D745D9D8',
    decimals: 9,
  },
  {
    title: 'CATS',
    logo: '/tokens/cats.png',
    symbol: 'CATS',
    evmTokenAddress: '0x261f5a325c673dF3d80E23A361025a2c8eDDBa43',
    decimals: 9,
  },
  {
    title: 'Catizen',
    logo: 'https://storage.yandexcloud.net/tonscan/avatars/CATI_TOKEN.webp',
    symbol: 'CATI',
    evmTokenAddress: '0xb96B5099Cf3Cc1c9df725DAd682bbC40821F3fF8',
    decimals: 9,
  },
  {
    title: 'Bemo Staked TON',
    logo: 'https://i.tonscan.org/apps/images/9a44b649-1127-436a-b9b4-5e34059b7c73.png?dpr=2',
    symbol: 'stTON',
    evmTokenAddress: '0xECA22dFF808749d294Fe0c306558D14D819C8394',
    decimals: 9,
  },
  {
    title: 'Storm Finance',
    logo: 'https://i.tonscan.org/apps/images/9a5836ef-d305-409a-87dc-e687099031f6.png?dpr=2',
    symbol: 'STORM',
    evmTokenAddress: '0x74d8EfAf627Da0fBF1A97EC9fAbA94741753e377',
    decimals: 9,
  },
  {
    title: 'Povel Durev',
    logo: '/tokens/durev.png',
    symbol: 'DUREV',
    evmTokenAddress: '0x147e715B7e36Aa34bD00fa8FEee23099D8Cd64fd',
    decimals: 9,
  },
  {
    title: 'NikoAI',
    logo: '/tokens/nikoai.png',
    symbol: 'NikoAI',
    evmTokenAddress: '0xfA4cd9757BF9B5e39862c1996Cdbc94B0b6fE915',
    decimals: 9,
  },
  {
    title: 'Ston.Fi',
    logo: 'https://static.ston.fi/logo/ston_symbol.png',
    symbol: 'STON',
    evmTokenAddress: '0xB1d225766B5E6e334d8421554AE21f2Fdf6E8C10',
    decimals: 9,
  },
  {
    title: 'Ethena USD',
    logo: '/tokens/ethena.png',
    symbol: 'USDE',
    evmTokenAddress: '0x0590226F313b1bA88C07242ABE4318A5367Ac119',
    decimals: 18,
  },
  {
    title: 'WrappedETH',
    logo: '/tokens/weth.png',
    symbol: 'WETH',
    evmTokenAddress: '0xA7A61d346D56833b2aE1A55D26Fab0d49cf0E56F',
    decimals: 18,
  },
  {
    title: 'Renzo ETH',
    logo: '/tokens/ezeth.png',
    symbol: 'ezETH',
    evmTokenAddress: '0x00B64F1Af8eE9Ea8Cb850aC12bC148Af02a373E2',
    decimals: 18,
  },
  {
    title: 'Wrapped BTC',
    logo: '/tokens/wbtc.png',
    symbol: 'wBTC',
    evmTokenAddress: '0x83897F05D0c02DE7BAf8A56710D04337C9E505B9',
    decimals: 18,
  },
  {
    title: 'Lombard BTC',
    logo: '/tokens/lombard.png',
    symbol: 'LBTC',
    evmTokenAddress: '0x0364A2d1721d0A4aa2d779295D1C2D317a3c1384',
    decimals: 18,
  },
  {
    title: 'Wrapped TAC',
    logo: '/tokens/tac.png',
    symbol: 'wTAC',
    evmTokenAddress: '0x07840B012d84095397Fd251Ea619cee6F866bC39',
    decimals: 18,
  },
]

export const pools = Object.entries({
  'TON-USDT': '0xBC325356d0d7684017aCD5873651d6CE63f0d908',
  'TON-USDE': '0x0C5eA641f9B764da1E209212ebF9CEd3730c1C63',
  'TON-WETH': '0x266F03628d894bD1450ae511FDd9c68Ff39ff80e',
  'USDT-WETH': '0x8c400ebaAA7808A7AE579E8ef160fF959cD3565a',
  'TON-ezETH': '0x4812daD7907313dd34E4f03C10E27E83817E626A',
  'TON-NOT': '0x8Ec9379dd6FD1a7E2344E3A1018603E4cba933Aa',
  'TON-HMSTR': '0xaF9ECb1bFd834c23F87899A5114D9E7d920544E4',
  'TON-stTON': '0x4734eCe91c0e2d8FC28abA6F758bBd4abd5ac591',
  'TON-tsTON': '0x16776A507af68A38dDc66a309292BA18186159b2',
  'TON-REDO': '0xeE0ed4841D456A6cAfaba22c66f2D03b8821C39E',
  'TON-CATI': '0xCfaC4884D7eb988aAE4257aF9f3d32dC054C4CFf',
  'TON-STORM': '0x13731b9677fB7E292CE11662B56b8034f73A885c',
  'TON-DUREV': '0x8ec83858164a53f73a3a8cb660AB08659fe7f960',
  'TON-NikoAI': '0xdf6f651B5b5B5A98bA2E99330787Dc5C97160160',
  'TON-STON': '0xb692e1AE48D0aDE1A5c9433dE747a9D33c7d0361',
  'TON-DOGS': '0x0055381cA30BCD7Beb1268aC5Cd651C3d0739F8f',
  'TON-CATS': '0x385e2373eC2Be8b11bCE03620aca6173663ec513',
  'TON-wBTC': '0x3DAf36f412edBF69069c2e4b9cAD0d9FbDdB649b',
  'TON-LBTC': '0xaD2Bdf99424Aaae98a2Eb5fB14830FE5127AffBc',
  'TON-wTAC': '0xd6a612F8d8409917a79125A317Ea915FB1Ca3d77',
})
