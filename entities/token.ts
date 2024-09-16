export interface Token {
  name: string
  ticker: string
  iconUrl: string
  tokenAddress: string
  swapKey: number
}

export const tokens: Record<string, Token> = {
  stton: {
    name: 'stton',
    ticker: 'stTON',
    iconUrl: '/tokens/stton.png',
    tokenAddress: 'EQDJfaGp5pgN8oVGyCQI0AvUPMiuMyzaWq7Ckdf_wVZYm1IY',
    swapKey: 0
  },
  tac: {
    name: 'tac',
    ticker: 'TAC',
    iconUrl: '/tokens/tac.webp',
    tokenAddress: 'EQC7-W1nM4DwUnI4_vGnQcLjgwYSw6hQixCdBF1XD_rmZAYZ',
    swapKey: 1
  }
};
