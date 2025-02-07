export interface Token {
  title: string
  logo: string
  tokenName: string
  evmTokenAddress: string
  tokenValue: string
  upperBound: string
  lowerBound: string
  decimals: number
}

export const tokens: Token[] = [
  {
    title: 'TON',
    logo: '/tokens/ton.png',
    tokenName: 'TON',
    evmTokenAddress: '',
    tokenValue: '64000',
    upperBound: '1000000000',
    lowerBound: '5000',
    decimals: 9,
  },
  {
    title: 'Tether USD',
    logo: '/tokens/usdt.png',
    tokenName: 'USDT',
    evmTokenAddress: '0x40d02AAe9D294Ebefe818Bc9020a9883E055154e',
    tokenValue: '6400000',
    upperBound: '10000000000',
    lowerBound: '50000',
    decimals: 6,
  },
  {
    title: 'Teleport Bitcoin',
    logo: '/tokens/tgbtc.svg',
    tokenName: 'tgBTC',
    evmTokenAddress: '0xc6351A409f10a5b5125224D6496d12ee1bE49d54',
    tokenValue: '64000',
    upperBound: '1000000000',
    lowerBound: '5000',
    decimals: 9,
  },
  {
    title: 'Notcoin',
    logo: '/tokens/notcoin.png',
    tokenName: 'NOT',
    evmTokenAddress: '0x132911A0eD9803BAa703048618B38638c40D24C1',
    tokenValue: '711000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Hamster Kombat',
    logo: '/tokens/hamster.png',
    tokenName: 'HMSTR',
    evmTokenAddress: '0xFF2FDb1C8D6c82858A998D65633fb5a3D87b5A10',
    tokenValue: '1730000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'DOGS',
    logo: '/tokens/dogs.png',
    tokenName: 'DOGS',
    evmTokenAddress: '0x232B3FF9145d6bA31A3c552da7eBEff354f5b073',
    tokenValue: '8530000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'TonStakers Staked TON',
    logo: '/tokens/tston.svg',
    tokenName: 'tsTON',
    evmTokenAddress: '0x1c63C68479574Bb9E3a76e842B9272013a717723',
    tokenValue: '1000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'REsistance DOg',
    logo: '/tokens/redo.png',
    tokenName: 'REDO',
    evmTokenAddress: '0x8b55778dB15beafc4709D02D1B712D0109Ad725a',
    tokenValue: '21000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'CATS',
    logo: '/tokens/cats.png',
    tokenName: 'CATS',
    evmTokenAddress: '0xb2e8609Ea7EE128967E4C33fB023d270de3f560b',
    tokenValue: '190000000000000',
    upperBound: '10000000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Catizen',
    logo: '/tokens/catizen.png',
    tokenName: 'CATI',
    evmTokenAddress: '0xc1EA29c1c3923089A35258a15801626F820CDa86',
    tokenValue: '13000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Bemo Staked TON',
    logo: '/tokens/bemo.png',
    tokenName: 'stTON',
    evmTokenAddress: '0x831ca6cA752643E0b9E2a4A42A5d77a93E3D6241',
    tokenValue: '1000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Storm Finance',
    logo: '/tokens/storm.png',
    tokenName: 'STORM',
    evmTokenAddress: '0x838A5c8EbEb2ad98412444Bd34714Ea652c0cbBB',
    tokenValue: '210000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Povel Durev',
    logo: '/tokens/durev.png',
    tokenName: 'DUREV',
    evmTokenAddress: '0x6F615BF749F6E000aEBFd0C2C2b7ab43d4930438',
    tokenValue: '320000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'NikoAI',
    logo: '/tokens/nikoai.png',
    tokenName: 'NikoAI',
    evmTokenAddress: '0x5f807D892Fd1A73936a3DB132E61Adebe6237247',
    tokenValue: '375000000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Ston.Fi',
    logo: '/tokens/ston.png',
    tokenName: 'STON',
    evmTokenAddress: '0xc0C7851E4F31956f3569be9bFB7246F1Bd85FBD7',
    tokenValue: '1300000000',
    upperBound: '10000000000000000',
    lowerBound: '500000000',
    decimals: 9,
  },
  {
    title: 'Ethena USD',
    logo: '/tokens/ethena.png',
    tokenName: 'USDE',
    evmTokenAddress: '0xd90C2a08460fB03847fd13093406233203328a7A',
    tokenValue: '6400000000000000000',
    upperBound: '10000000000000000000000',
    lowerBound: '50000000000000000',
    decimals: 18,
  },
  {
    title: 'WrappedETH',
    logo: '/tokens/weth.png',
    tokenName: 'WETH',
    evmTokenAddress: '0x2183Bb115F6f90840B1d6FEd0857149546e4BF22',
    tokenValue: '165000000000000',
    upperBound: '10000000000000000000',
    lowerBound: '50000000000000',
    decimals: 18,
  },
  {
    title: 'Ether.Fi ETH',
    logo: '/tokens/etherfi.png',
    tokenName: 'EETH',
    evmTokenAddress: '0x309EE0448100201CcC3DB0cED9e79F5D97A72dB7',
    tokenValue: '150000000000000',
    upperBound: '10000000000000000000',
    lowerBound: '50000000000000',
    decimals: 18,
  },
  {
    title: 'Renzo ETH',
    logo: '/tokens/ezeth.png',
    tokenName: 'ezETH',
    evmTokenAddress: '0x57705Dbb817F880A30cb9656D0a8e7F86f416B0E',
    tokenValue: '150000000000000',
    upperBound: '10000000000000000000',
    lowerBound: '50000000000000',
    decimals: 18,
  },
  {
    title: 'Wrapped BTC',
    logo: '/tokens/wbtc.png',
    tokenName: 'wBTC',
    evmTokenAddress: '0x86D8C875A4F21cb60F185ECC1F3a605E88d58Cca',
    tokenValue: '64000000000000',
    upperBound: '1000000000000000000',
    lowerBound: '500000000000',
    decimals: 18,
  },
  {
    title: 'Lombard BTC',
    logo: '/tokens/lombard.png',
    tokenName: 'LBTC',
    evmTokenAddress: '0x0B712c365c344221B09bBDD8dD1b828De86Fb24A',
    tokenValue: '64000000000000',
    upperBound: '1000000000000000000',
    lowerBound: '500000000000',
    decimals: 18,
  },
]
export const pools = Object.entries({
  'TON-USDT': '0x5461C1E0959d4936AB0ED9826f91A507A777578f',
  'TON-USDE': '0xE1724814c3feeF0e4104451D119601b0cF290f57',
  'TON-WETH': '0xA4Dbb78316eb3b3a0Dd1A415E4228D21DF07809C',
  'TON-EETH': '0x068f46E8F592350B40B05a5c440c4Ee949D91209',
  'TON-ezETH': '0xED9f50B7b70FFF45b1E7A0e8AC57C8E2d42e308C',
  'TON-wBTC': '0xd80bD4cDdcE4e0BF10FFd2e3E54e1702f2B67960',
  'TON-LBTC': '0x3B79035A5d6ccD565ABBE24732c8C4843dA78b26',
  'TON-tgBTC': '0xBbBcFFb5F11A194DF81D5A66BdE6CD2Fef4275e6',
  'TON-NOT': '0xFfF9f08DB31C7b0eE9793Cc11d9dD7a932250dD3',
  'TON-HMSTR': '0x7b060593a1329B97a49681D36708BeA712239D4d',
  'TON-DOGS': '0xa61695e9263168D4CACA69e62358b2ba3Bf9261f',
  'TON-stTON': '0x7842d8D18FD6D4BfEcE12aE0f612CebaE120d758',
  'TON-tsTON': '0xBBb711Ee57D85180a0B39F3BeF64a08c535354be',
  'TON-REDO': '0x2cD0e1E926E6137bd71019bF894C52A22c3B74ce',
  'TON-CATI': '0xBfb8cB4d2BC77B20864BE64872a0017feAC23d76',
  'TON-CATS': '0x43690591cb0aa5e659EFa4BF76908340cE6F9a7a',
  'TON-STORM': '0xdA6741920E14848F2497907dee53a5b401A1C515',
  'TON-DUREV': '0xa7870d339d47e822d0bACBf21354892B8913019d',
  'TON-NikoAI': '0x619Cec3E1b690D6b35AdA34295d3402028c0311D',
  'TON-STON': '0x6A265b674B36AB49AFf1B9944D7cA7E7F14425B5',
})
