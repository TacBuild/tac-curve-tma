import { AbiCoder, Contract, getAddress, getDefaultProvider } from 'ethers'
import { type AssetBridgingData, AssetType, SenderFactory } from '@tonappchain/sdk'
import type { IRoute } from '@curvefi/api/lib/interfaces'
import { DEFAULT_SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'
import { getProxyAddressByPoolImplementation } from '~~/entities/pool'
import { CURVE_ROUTER_PROXY } from '~~/entities/config'

export const useTransaction = () => {
  const { getTacSdk } = useTac()
  const { getTonConnectUI } = useTonConnect()
  const { getCurve } = useCurve()
  const evmProviderUrl = 'https://rpc.ankr.com/tac'
  // const slippagePercent = useLocalStorage('swap-slippage-percent', DEFAULT_SLIPPAGE_PERCENT_VALUE)
  const slippagePercent = DEFAULT_SLIPPAGE_PERCENT_VALUE
  const slippagePercentBigInt = 100n / 2n

  const swap = async (
    poolAddress: string, swapKeys: [0 | 1, 0 | 1],
    addressA: string, amountA: bigint,
    minAmountB: bigint, poolImplementation?: string,
  ) => {
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: getProxyAddressByPoolImplementation(poolImplementation),
      methodName: 'exchange(bytes,bytes)',
      encodedParameters: AbiCoder.defaultAbiCoder().encode(
        [`tuple(address,uint256,uint256,uint256,uint256)`],
        [[poolAddress, BigInt(swapKeys[0]), BigInt(swapKeys[1]), amountA, minAmountB - (minAmountB / slippagePercentBigInt)]],
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
  const swapViaRouter = async (
    route: IRoute,
    inAmount: bigint, inAddress: string,
    outAmount: bigint, outAddress: string,
  ) => {
    const sdk = getTacSdk()
    const curve = getCurve()

    const args = curve.router.getArgs(route)
    const encodedParameters = new AbiCoder().encode(
      ['tuple(address[11],uint256[4][5],uint256,uint256,address)'],
      [
        [
          args._route,
          args._swapParams,
          inAmount,
          outAmount - (outAmount / slippagePercentBigInt),
          outAddress,
        ],
      ],
    )
    const evmProxyMsg = {
      evmTargetAddress: CURVE_ROUTER_PROXY,
      methodName: 'exchange(bytes,bytes)',
      encodedParameters,
    }

    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    let assetAddress = inAddress ? await sdk.getTVMTokenAddress(getAddress(inAddress)) : undefined
    assetAddress = assetAddress === 'NONE' ? undefined : assetAddress
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: inAmount,
      address: assetAddress,
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
  const addLiquidity = async (
    poolAddress: string,
    addressA: string, addressB: string,
    amountA: bigint, amountB: bigint,
    minAmountLP: bigint = 0n, poolImplementation?: string,
  ) => {
    const isPlainStableNg = poolImplementation === 'plainstableng'
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: getProxyAddressByPoolImplementation(poolImplementation),
      methodName: 'addLiquidity(bytes,bytes)',
      encodedParameters: AbiCoder.defaultAbiCoder().encode(
        [`tuple(address,${isPlainStableNg ? 'uint256[]' : 'uint256[2]'},uint256)`],
        [[poolAddress, [amountA, amountB], minAmountLP - (minAmountLP / slippagePercentBigInt)]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    let assetAddressA = addressA ? await sdk.getTVMTokenAddress(getAddress(addressA)) : undefined
    assetAddressA = assetAddressA === 'NONE' ? undefined : assetAddressA
    let assetAddressB = addressB ? await sdk.getTVMTokenAddress(getAddress(addressB)) : undefined
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
    poolImplementation?: string,
  ) => {
    const sdk = getTacSdk()
    const isPlainStableNg = poolImplementation === 'plainstableng'
    const evmProxyMsg = {
      evmTargetAddress: getProxyAddressByPoolImplementation(poolImplementation),
      methodName: 'removeLiquidity(bytes,bytes)',
      encodedParameters: AbiCoder.defaultAbiCoder().encode(
        [`tuple(address,uint256,${isPlainStableNg ? 'uint256[]' : 'uint256[2]'})`],
        [[poolAddress, amount, [minAmountA - (minAmountA / slippagePercentBigInt), minAmountB - (minAmountB / slippagePercentBigInt)]]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amount,
      address: await sdk.getTVMTokenAddress(getAddress(poolAddress)),
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
    poolImplementation?: string,
  ) => {
    // TODO: Untested
    const sdk = getTacSdk()
    const evmProxyMsg = {
      evmTargetAddress: getProxyAddressByPoolImplementation(poolImplementation),
      methodName: 'removeLiquidityOneCoin(bytes,bytes)',
      encodedParameters: AbiCoder.defaultAbiCoder().encode(
        ['tuple(address,uint256,uint256,uint256)'],
        [[poolAddress, amount, tokenIndex, [minTokenAmount - (minTokenAmount / slippagePercentBigInt)]]],
      ),
    }
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })
    const assets: AssetBridgingData[] = [{
      type: AssetType.FT,
      rawAmount: amount,
      address: await sdk.getTVMTokenAddress(getAddress(poolAddress)),
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
  const getContract = async (poolAddress: string, poolImplementation?: string) => {
    const isPlainStableNg = poolImplementation === 'plainstableng'
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
          { name: 'amounts', type: isPlainStableNg ? 'uint256[]' : 'uint256[2]' },
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
    const provider = getDefaultProvider(evmProviderUrl)
    return new Contract(poolAddress, abi, provider)
  }
  const getLiquidityRates = async (poolAddress: string, amounts: bigint[], isDeposit: boolean, poolImplementation?: string): Promise<bigint> => {
    const contract = await getContract(poolAddress, poolImplementation)
    return contract.calc_token_amount!(amounts, isDeposit)
  }
  const getSwapRates = async (method: 'get_dx' | 'get_dy', poolAddress: string, amount: bigint, swapKeys: number[], poolImplementation?: string): Promise<bigint> => {
    const contract = await getContract(poolAddress, poolImplementation)
    return contract[method]!(swapKeys[0], swapKeys[1], amount)
  }
  const getTotalSupply = async (poolAddress: string): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['totalSupply']!()
  }
  const getPoolTokenBalances = async (poolAddress: string, tokenIndex: 0 | 1): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['balances']!(tokenIndex)
  }
  const getOneCoinWithdrawRate = async (poolAddress: string, amount: bigint, tokenIndex: 0 | 1): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract['calc_withdraw_one_coin']!(amount, tokenIndex)
  }
  const calcUnstakeBalancedTokenValues = (amount: bigint, totalSupply: bigint, poolTokenBalances: [bigint, bigint]) => {
    return [poolTokenBalances[0] * amount / totalSupply, poolTokenBalances[1] * amount / totalSupply]
  }

  return {
    slippagePercent,
    swap,
    swapViaRouter,
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
