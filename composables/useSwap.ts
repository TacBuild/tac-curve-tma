import { toNano } from '@ton/ton';
import type { TonConnectUI } from '@tonconnect/ui';
import { Contract, ethers } from 'ethers';
import { CHAIN } from '@tonconnect/ui';
import type { JettonProxyMsgParameters } from 'tac-sdk';
import { TacSdk } from 'tac-sdk';
import { TONCENTER_URL_ENDPOINT } from '~/utils/ton-utils';

export const useSwap = () => {
  let contract: Contract;
  const config = useRuntimeConfig().public;

  const swap = async (tonConnect: TonConnectUI, fromAddress: string, tokenAddress: string, swapKeys: Array<number>, amount: number | string) => {
    const abi = new ethers.AbiCoder();
    const encodedParameters = abi.encode(
      ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
      [
        config.ethersContractAddress,
        swapKeys[0],
        swapKeys[1],
        Number(toNano(amount)),
        0
      ]
    );

    const params: JettonProxyMsgParameters = {
      fromAddress,
      jettonAmount: Number(amount),
      proxyMsg: {
        evmTargetAddress: config.swapPayloadJsonTarget,
        methodName: 'exchange(address,uint256,uint256,uint256,uint256)',
        encodedParameters
      },
      tokenAddress,
      tonConnect,
      tonAmount: 0.35
    };

    const tacSdk = new TacSdk({
      tonClientParameters: {
        endpoint: TONCENTER_URL_ENDPOINT
      },
      network: CHAIN.TESTNET
    });

    return await tacSdk.sendJettonWithProxyMsg(params);
  };
  const getContract = () => {
    const abi = [
      {
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

    return new ethers.Contract(config.ethersContractAddress, abi, provider);
  };
  const getSwapRates = (amount: string, swapKeys: Array<number>) => {
    if (!contract) {
      contract = getContract();
    }

    return contract.get_dy(swapKeys[0], swapKeys[1], amount);
  };

  return {
    swap,
    getSwapRates
  };
};
