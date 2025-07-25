import { ethers } from 'ethers'
import { type AssetBridgingData, AssetType, SenderFactory } from '@tonappchain/sdk'
import { DEFAULT_SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'

export const useSwap = () => {
  const { getTacSdk } = useTac()
  const { getTonConnectUI } = useTonConnect()
  const proxyAddress = '0x402879F4a18C79747177a91DDeAb1aB18f97503F'
  const evmProviderUrl = 'https://rpc.ankr.com/tac'
  // const slippagePercent = useLocalStorage('swap-slippage-percent', DEFAULT_SLIPPAGE_PERCENT_VALUE)
  const slippagePercent = DEFAULT_SLIPPAGE_PERCENT_VALUE
  const slippagePercentBigInt = 100n / 2n

  const swap = async (poolAddress: string, swapKeys: Array<0 | 1>, addressA: string, amountA: bigint, minAmountB: bigint) => {
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: proxyAddress,
      methodName: 'exchange(bytes,bytes)',
      encodedParameters: ethers.AbiCoder.defaultAbiCoder().encode(
        ['tuple(address,uint256,uint256,uint256,uint256)'],
        [[poolAddress, swapKeys[0], swapKeys[1], amountA, minAmountB - (minAmountB / slippagePercentBigInt)]],
      ),
    }

    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    let assetAddress = addressA ? await sdk.getTVMTokenAddress(addressA) : undefined
    assetAddress = assetAddress === 'NONE' ? undefined : assetAddress
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amountA,
      address: assetAddress,
    }]
    console.log(assets)
    const tx = await sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    const tsResult = tx.sendTransactionResult as {
      success: boolean
      error: Record<string, unknown>
    }
    sdk.closeConnections()
    if (!tsResult?.success) {
      throw tsResult?.error?.info || 'Unknown error'
    }
    return tx
  }
  const addLiquidity = async (
    poolAddress: string,
    addressA: string, addressB: string,
    amountA: bigint, amountB: bigint,
    minAmountLP: bigint = 0n,
  ) => {
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: proxyAddress,
      methodName: 'addLiquidity(bytes,bytes)',
      encodedParameters: ethers.AbiCoder.defaultAbiCoder().encode(
        ['tuple(address, uint256[2], uint256)'],
        [[poolAddress, [amountA, amountB], minAmountLP - (minAmountLP / slippagePercentBigInt)]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    let assetAddressA = addressA ? await sdk.getTVMTokenAddress(addressA) : undefined
    assetAddressA = assetAddressA === 'NONE' ? undefined : assetAddressA
    let assetAddressB = addressB ? await sdk.getTVMTokenAddress(addressB) : undefined
    assetAddressB = assetAddressB === 'NONE' ? undefined : assetAddressB

    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amountA,
      address: assetAddressA,
    }, {
      type: AssetType.FT,
      rawAmount: amountB,
      address: assetAddressB,
    }]
    const tx = await sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    const tsResult = tx.sendTransactionResult as {
      success: boolean
      error: Record<string, unknown>
    }
    sdk.closeConnections()
    if (!tsResult?.success) {
      throw tsResult?.error?.info || 'Unknown error'
    }
    return tx
  }
  const removeLiquidity = async (
    poolAddress: string, amount: bigint,
    minAmountA: bigint = 0n, minAmountB: bigint = 0n,
  ) => {
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: proxyAddress,
      methodName: 'removeLiquidity(bytes,bytes)',
      encodedParameters: ethers.AbiCoder.defaultAbiCoder().encode(
        ['tuple(address, uint256, uint256[2])'],
        [[poolAddress, amount, [minAmountA - (minAmountA / slippagePercentBigInt), minAmountB - (minAmountB / slippagePercentBigInt)]]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amount,
      address: await sdk.getTVMTokenAddress(poolAddress),
    }]
    const tx = await sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    const tsResult = tx.sendTransactionResult as {
      success: boolean
      error: Record<string, unknown>
    }
    sdk.closeConnections()
    if (!tsResult?.success) {
      throw tsResult?.error?.info || 'Unknown error'
    }
    return tx
  }
  const removeLiquidityOneCoin = async (
    poolAddress: string, amount: bigint,
    tokenIndex: 0 | 1, minTokenAmount: bigint = 0n,
  ) => {
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: proxyAddress,
      methodName: 'removeLiquidityOneCoin(bytes,bytes)',
      encodedParameters: ethers.AbiCoder.defaultAbiCoder().encode(
        ['tuple(address, uint256, uint256, uint256)'],
        [[poolAddress, amount, tokenIndex, [minTokenAmount - (minTokenAmount / slippagePercentBigInt)]]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amount,
      address: await sdk.getTVMTokenAddress(poolAddress),
    }]
    const tx = await sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    const tsResult = tx.sendTransactionResult as {
      success: boolean
      error: Record<string, unknown>
    }
    sdk.closeConnections()
    if (!tsResult?.success) {
      throw tsResult?.error?.info || 'Unknown error'
    }
    return tx
  }
  const getContract = async (poolAddress: string, implementation?: 'plainstableng') => {
    const isPlainStableNg = implementation === 'plainstableng'
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        name: 'get_dx',
        inputs: [
          { name: 'i', type: isPlainStableNg ? 'int128' : 'uint256' },
          { name: 'j', type: isPlainStableNg ? 'int128' : 'uint256' },
          { name: 'dx', type: 'uint256' },
        ],
        outputs: [
          { name: '', type: 'uint256' },
        ],
      },
      {
        stateMutability: 'view',
        type: 'function',
        name: 'get_dy',
        inputs: [
          { name: 'i', type: isPlainStableNg ? 'int128' : 'uint256' },
          { name: 'j', type: isPlainStableNg ? 'int128' : 'uint256' },
          { name: 'dx', type: 'uint256' },
        ],
        outputs: [
          { name: '', type: 'uint256' },
        ],
      },
      {
        stateMutability: 'view',
        type: 'function',
        name: 'calc_token_amount',
        inputs: [
          { name: 'amounts', type: 'uint256[2]' },
          { name: 'deposit', type: 'bool' },
        ],
        outputs: [
          { name: '', type: 'uint256' },
        ],
      },
      {
        stateMutability: 'view',
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [
          { name: 'i', type: 'uint256' },
        ],
      },
      {
        stateMutability: 'view',
        type: 'function',
        name: 'balances',
        inputs: [
          {
            name: 'arg0',
            type: 'uint256',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
      },
      {
        stateMutability: 'view',
        type: 'function',
        name: 'calc_withdraw_one_coin',
        inputs: [
          {
            name: 'token_amount',
            type: 'uint256',
          },
          {
            name: 'i',
            type: 'uint256',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
      },
    ]
    const provider = ethers.getDefaultProvider(evmProviderUrl)
    return new ethers.Contract(poolAddress, abi, provider)
  }
  const getLiquidityRates = async (poolAddress: string, amounts: bigint[], isDeposit: boolean): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract.calc_token_amount(amounts, isDeposit)
  }
  const getSwapRates = async (method: 'get_dx' | 'get_dy', poolAddress: string, amount: bigint, swapKeys: number[], implementation?: 'plainstableng'): Promise<bigint> => {
    const contract = await getContract(poolAddress, implementation)
    return contract[method](swapKeys[0], swapKeys[1], amount)
  }
  const getTotalSupply = async (poolAddress: string): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['totalSupply']()
  }
  const getPoolTokenBalances = async (poolAddress: string, tokenIndex: 0 | 1): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['balances'](tokenIndex)
  }
  const getOneCoinWithdrawRate = async (poolAddress: string, amount: bigint, tokenIndex: 0 | 1): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['calc_withdraw_one_coin'](amount, tokenIndex)
  }
  const calcUnstakeBalancedTokenValues = (amount: bigint, totalSupply: bigint, poolTokenBalances: [bigint, bigint]) => {
    return [poolTokenBalances[0] * amount / totalSupply, poolTokenBalances[1] * amount / totalSupply]
  }

  return {
    slippagePercent,
    swap,
    addLiquidity,
    removeLiquidity,
    removeLiquidityOneCoin,
    getSwapRates,
    getLiquidityRates,
    getTotalSupply,
    getPoolTokenBalances,
    getOneCoinWithdrawRate,
    calcUnstakeBalancedTokenValues,
  }
}
