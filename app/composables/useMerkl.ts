import { Address } from '@ton/ton'
import { SenderFactory, type EvmProxyMsg } from '@tonappchain/sdk'
import axios from 'axios'
import { ethers } from 'ethers'

import type { Reward, RewardsResponseItem, RewardToken } from '~~/entities/merkl'
import {
  EVM_CHAIN_ID,
  EVM_PROVIDER_URL,
  MERKL_API_BASE_URL,
  MERKL_PROXY,
  TAC_SA_FACTORY_ADDRESS,
} from '~~/entities/config'
import { until } from '@vueuse/core'

const endpoints = {
  rewards: (addr: string) => `${MERKL_API_BASE_URL}/users/${addr}/rewards`,
  opportunities: `${MERKL_API_BASE_URL}/opportunities`,
}

const { friendlyAddress, getTonConnectUI } = useTonConnect()

const address = ref('')
const isAPRsLoading = ref(false)
const isRewardsLoading = ref(true)
const rewards: Ref<Reward[]> = ref([])
const rewardTokens: Ref<RewardToken[]> = ref([])
const aprs: Ref<Record<string, number>> = ref({})

const updateAPRs = async () => {
  aprs.value = {}

  try {
    isAPRsLoading.value = true
    const { data } = await axios.get(endpoints.opportunities, {
      params: {
        items: 50,
        mainProtocolId: 'curve',
        chainId: 239,
      },
    })
    data.forEach((opportunity: Record<string, unknown>) => {
      aprs.value[(opportunity.identifier as string).toLowerCase()] = opportunity.apr as number
    })
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isAPRsLoading.value = false
  }
}
const updateRewards = async (isInitialLoading = true) => {
  rewards.value = []
  try {
    if (!address.value) {
      isRewardsLoading.value = false
      return
    }
    if (isInitialLoading) {
      isRewardsLoading.value = true
    }
    const { data } = await axios.get(endpoints.rewards(address.value), {
      params: {
        chainId: EVM_CHAIN_ID,
      },
    })

    const rewardsList: Reward[] = data
      .reduce((prev: Reward[], curr: RewardsResponseItem) => {
        return [...prev, ...curr.rewards]
      }, [] as Reward[])

    rewards.value = rewardsList.filter(reward => reward.token.symbol === 'WTAC' && (reward.claimed !== reward.amount))
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isRewardsLoading.value = false
  }
}
const claimReward = async (reward: Reward) => {
  const { isLoaded, getTacSdk } = useTac()
  await until(isLoaded).toBeTruthy()

  const encodedArguments = new ethers.AbiCoder().encode(
    ['tuple(address[],uint256[],bytes32[][],bool)'],
    [[
      [reward.token.address],
      [reward.amount],
      [reward.proofs],
      reward.token.symbol !== 'rEUL',
    ]],
  )
  const evmProxyMsg: EvmProxyMsg = {
    evmTargetAddress: MERKL_PROXY,
    methodName: 'claim(bytes,bytes)',
    encodedParameters: encodedArguments,
  }
  const sender = await SenderFactory.getSender({ tonConnect: getTonConnectUI() })

  const res = await getTacSdk().sendCrossChainTransaction(
    evmProxyMsg,
    sender,
  )

  const tsResult = res?.sendTransactionResult as {
    success: boolean
    error: Record<string, unknown>
  }
  getTacSdk().closeConnections()

  if (!tsResult?.success) {
    throw tsResult?.error?.info || 'Unknown error'
  }

  return res
}
const initMerkl = async (tvmAddress: string | undefined) => {
  address.value = ''
  updateAPRs()

  if (!tvmAddress) {
    return
  }

  try {
    const provider = ethers.getDefaultProvider(EVM_PROVIDER_URL)
    const tacFactoryAbi = ['function predictSmartAccountAddress(string, address) external view returns(address)']
    const addressContract = new ethers.Contract(TAC_SA_FACTORY_ADDRESS, tacFactoryAbi, provider)
    if (!addressContract?.predictSmartAccountAddress) {
      throw 'Unable to create contract with predictSmartAccountAddress method'
    }
    address.value = await addressContract.predictSmartAccountAddress(
      Address.parse(tvmAddress).toString({ bounceable: true }), MERKL_PROXY)
    updateRewards()
  }
  catch (e) {
    console.warn(e)
    address.value = ''
  }
}

watch(friendlyAddress, async (val) => {
  await initMerkl(val)
}, { immediate: true })

export const useMerkl = () => {
  return {
    aprs,
    rewards,
    rewardTokens,
    isAPRsLoading,
    isRewardsLoading,
    updateAPRs,
    claimReward,
    initMerkl,
    updateRewards,
  }
}
