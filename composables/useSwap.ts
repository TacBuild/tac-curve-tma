import { Address, beginCell, toNano } from '@ton/ton';
import { Base64 } from '@tonconnect/protocol';
import type { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui';
import { ethers } from 'ethers';
import { CHAIN } from '@tonconnect/ui';
import { getUserJettonWalletAddress } from '~/utils/ton-utils';

export const useSwap = () => {
  const config = useRuntimeConfig().public;

  const getSwapPayload = (amount: string, fromAddress: string, swapKeys: Array<number>) => {
    const abi = new ethers.AbiCoder();
    const timestamp = Math.floor(+new Date() / 1000);
    // const randAppend = randomInt(1, 1000);
    const json = JSON.stringify({
      query_id: 0, // timestamp + randAppend
      timestamp,
      target: config.swapPayloadJsonTarget,
      methodName: 'exchange(address,uint256,uint256,uint256,uint256)',
      arguments: abi.encode(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
        [
          config.ethersContractAddress,
          swapKeys[0],
          swapKeys[1],
          Number(toNano(amount)),
          0
        ]
      ),
      caller: Address.parse(fromAddress).toString(),
      mint: [{
        token_address: config.swapPayloadJsonMintTokenAddress,
        amount: Number(toNano(amount))
      }],
      unlock: []
    });
    console.log('*****Parsed JSON for swap payload: ', JSON.parse(json));
    const l2Data = beginCell().storeStringTail(json).endCell();
    const forwardAmount = '0.2';

    const payload = beginCell()
      .storeUint(0xF8A7EA5, 32)
      .storeUint(0, 64) // timestamp + randAppend
      .storeCoins(toNano(amount))
      .storeAddress(Address.parse(config.swapPayloadToAddress || ''))
      .storeAddress(Address.parse(fromAddress)).storeBit(false).storeCoins(toNano(forwardAmount)).storeMaybeRef(l2Data).endCell();
    console.log('*****Cell payload: ', payload);
    console.log('*****Encoded payload: ', Base64.encode(payload.toBoc()));
    return Base64.encode(payload.toBoc());
  };

  const swap = async (tonConnect: TonConnectUI, fromAddress: string, tokenAddress: string, swapKeys: Array<number>, amount: string, commission = '0.35') => {
    console.log('*****Swapping*****');

    console.table({
      fromAddress,
      tokenAddress,
      swapKeys,
      amount,
      commission
    });

    const jettonAddress = await getUserJettonWalletAddress(fromAddress, tokenAddress);
    console.log('*****Received user\'s jetton address: ', jettonAddress);
    const transaction: SendTransactionRequest = {
      validUntil: +new Date() + 15 * 60 * 1000,
      messages: [
        {
          address: jettonAddress,
          amount: toNano(commission).toString(),
          payload: getSwapPayload(amount, fromAddress, swapKeys).toString()
        }
      ],
      network: CHAIN.TESTNET
    };

    console.log('*****Sending transaction: ', transaction);
    return await tonConnect.sendTransaction(transaction);
  };

  const getImplementationContract = () => {
    const implementationAbi = [{
      stateMutability: 'view',
      type: 'function',
      name: 'get_dy',
      inputs: [
        {
          name: 'i',
          type: 'uint256'
        },
        {
          name: 'j',
          type: 'uint256'
        },
        {
          name: 'dx',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ]
    },
    {
      stateMutability: 'view',
      type: 'function',
      name: 'coins',
      inputs: [
        {
          name: 'arg0',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ]
    }
    ];

    const provider = ethers.getDefaultProvider(config.ethersProviderUrl);
    return new ethers.Contract(config.ethersContractAddress, implementationAbi, provider);
  };

  const getSwapRates = (amount: string) => {
    const implementation = getImplementationContract();

    return implementation.get_dy(0, 1, amount);
  };

  return {
    getSwapPayload,
    swap,
    getImplementationContract,
    getSwapRates
  };
};
