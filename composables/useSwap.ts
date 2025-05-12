import { ethers } from 'ethers'
import { type AssetBridgingData, SenderFactory } from '@tonappchain/sdk'
import { DEFAULT_SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'

export const useSwap = () => {
  const { getTacSdk } = useTac()
  const { getTonConnectUI } = useTonConnect()
  const proxyAddress = '0x51b7C14f2Db9C9bA2AE4729622Abb0B9831f38f1'
  const evmProviderUrl = 'https://newyork-inap-72-251-230-233.ankr.com/tac_tacd_testnet_full_rpc_1'
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
    const assets: AssetBridgingData[] = [{
      rawAmount: amountA,
      address: addressA ? await sdk.getTVMTokenAddress(addressA) : undefined,
    }]
    const res = sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    sdk.closeConnections()
    return res
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
    const assets = [{
      rawAmount: amountA,
      address: addressA ? await sdk.getTVMTokenAddress(addressA) : undefined,
    }, {
      rawAmount: amountB,
      address: addressB ? await sdk.getTVMTokenAddress(addressB) : undefined,
    }]
    const res = sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    sdk.closeConnections()
    return res
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
    const assets = [{
      rawAmount: amount,
      address: await sdk.getTVMTokenAddress(poolAddress),
    }]
    const res = sdk.sendCrossChainTransaction(evmProxyMsg, sender, assets)
    sdk.closeConnections()
    return res
  }
  const getContract = async (poolAddress: string) => {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        name: 'get_dx',
        inputs: [
          { name: 'i', type: 'uint256' },
          { name: 'j', type: 'uint256' },
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
          { name: 'i', type: 'uint256' },
          { name: 'j', type: 'uint256' },
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
    ]
    const provider = ethers.getDefaultProvider(evmProviderUrl)
    return new ethers.Contract(poolAddress, abi, provider)
  }
  const getLiquidityRates = async (poolAddress: string, amounts: bigint[], isDeposit: boolean): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract.calc_token_amount(amounts, isDeposit)
  }
  const getSwapRates = async (method: 'get_dx' | 'get_dy', poolAddress: string, amount: bigint, swapKeys: number[]): Promise<bigint> => {
    const contract = await getContract(poolAddress)
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
  const calcUnstakeBalancedTokenValues = (amount: bigint, totalSupply: bigint, poolTokenBalances: [bigint, bigint]) => {
    return [poolTokenBalances[0] * amount / totalSupply, poolTokenBalances[1] * amount / totalSupply]
  }

  return {
    slippagePercent,
    swap,
    addLiquidity,
    removeLiquidity,
    getSwapRates,
    getLiquidityRates,
    getTotalSupply,
    getPoolTokenBalances,
    calcUnstakeBalancedTokenValues,
  }
}
