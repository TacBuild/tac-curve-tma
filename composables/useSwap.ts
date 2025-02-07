import { ethers } from 'ethers'
import { type AssetBridgingData, SenderFactory } from 'tac-sdk'
import { toNano } from '@ton/ton'
import { useLocalStorage } from '@vueuse/core'
import { DEFAULT_SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'

export const useSwap = () => {
  const { tacSdk } = useTac()
  const { getTonConnectUI } = useTonConnect()
  const proxyAddress = '0xF080CaFA628071C4304eBA0832136231667f4609'
  const evmProviderUrl = 'https://newyork-inap-72-251-230-233.ankr.com/tac_tacd_testnet_full_rpc_1'
  const slippagePercent = useLocalStorage('swap-slippage-percent', DEFAULT_SLIPPAGE_PERCENT_VALUE)

  const swap = async (poolAddress: string, tokenAddress: string, swapKeys: Array<number>, amount: number, decimals: number = 9) => {
    const evmProxyMsg = {
      evmTargetAddress: proxyAddress,
      methodName: 'exchange(bytes,bytes)',
      encodedParameters: ethers.AbiCoder.defaultAbiCoder().encode(
        ['tuple(address,uint256,uint256,uint256,uint256)'],
        [[poolAddress, swapKeys[0], swapKeys[1], BigInt(amount * 10 ** decimals), toNano(0)]],
      ),
    }

    const assets: AssetBridgingData[] = [{
      amount: amount,
      address: tokenAddress === '' ? undefined : await tacSdk.value?.getTVMTokenAddress(tokenAddress),
    }]
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })

    return tacSdk.value?.sendCrossChainTransaction(evmProxyMsg, sender, assets)
  }
  const getContract = async (poolAddress: string) => {
    console.log(poolAddress)
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        name: 'get_dx',
        inputs: [
          {
            name: 'i',
            type: 'uint256',
          },
          {
            name: 'j',
            type: 'uint256',
          },
          {
            name: 'dx',
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
        name: 'get_dy',
        inputs: [
          {
            name: 'i',
            type: 'uint256',
          },
          {
            name: 'j',
            type: 'uint256',
          },
          {
            name: 'dx',
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
  const getSwapRates = async (method: 'get_dx' | 'get_dy', poolAddress: string, amount: bigint, swapKeys: number[]): Promise<bigint> => {
    const contract = await getContract(poolAddress)
    return contract[method](swapKeys[0], swapKeys[1], amount)
  }

  return {
    swap,
    getSwapRates,
    slippagePercent,
  }
}
