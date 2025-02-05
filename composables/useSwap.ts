import { type Contract, ethers } from 'ethers'
import { type AssetBridgingData, SenderFactory } from 'tac-sdk'
import { toNano } from '@ton/ton'

export const useSwap = () => {
  let contract: Contract
  const { tacSdk } = useTac()
  const { getTonConnectUI } = useTonConnect()
  const proxyAddress = '0xF080CaFA628071C4304eBA0832136231667f4609'
  const evmProviderUrl = 'https://newyork-inap-72-251-230-233.ankr.com/tac_tacd_testnet_full_rpc_1'

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
      amount: Number(amount),
      address: tokenAddress === 'ton' ? undefined : tokenAddress,
    }]
    const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })

    return tacSdk.value?.sendCrossChainTransaction(evmProxyMsg, sender, assets)
  }
  const getContract = async (poolAddress: string) => {
    const abi = [
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
  const getSwapRates = async (poolAddress: string, amount: string, swapKeys: Array<number>) => {
    if (!contract) {
      contract = await getContract(poolAddress)
    }

    return contract.get_dy(swapKeys[0], swapKeys[1], amount)
  }

  return {
    swap,
    getSwapRates,
  }
}
