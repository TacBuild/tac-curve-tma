import { Address, beginCell, fromNano, toNano, TonClient } from '@ton/ton';
import type { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui';
import { Base64 } from '@tonconnect/protocol';
import { ethers } from 'ethers';
// import { randomInt } from '~/utils/number-utils';

const TONCENTER_URL_ENDPOINT = '/jsonRPC';

export const getUserJettonWalletAddress = async (userAddress: string, tokenAddress: string) => {
  const client = new TonClient({
    endpoint: TONCENTER_URL_ENDPOINT
  });

  const address = Address.parse(userAddress);
  const cell = beginCell().storeAddress(address).endCell();
  const result = await client.runMethod(Address.parse(tokenAddress), 'get_wallet_address', [{
    type: 'slice',
    cell
  }]);

  return result.stack.readAddress().toString();
};

const getSwapPayload = (amount: string, fromAddress: string, jsonArguments: string) => {
  const toAddress = 'EQBcB0XZEv-T_9tYnbJc-DoYqAFz71k5KUkZTLX1etwfuMIB';
  const timestamp = Math.floor(+new Date() / 1000);
  // const randAppend = randomInt(1, 1000);
  const json = JSON.stringify({
    query_id: 0, // timestamp + randAppend
    timestamp,
    target: '0xd350bf040068fbc509dbc9cb48bf5feeb1c7a707',
    methodName: 'exchange(address,uint256,uint256,uint256,uint256)',
    arguments: jsonArguments,
    caller: Address.parse(fromAddress).toString(),
    mint: [{
      token_address: '0x2cb284c531fb21a70e2c24ede980239e643b7b5d',
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
    .storeAddress(Address.parse(toAddress))
    .storeAddress(Address.parse(fromAddress)).storeBit(false).storeCoins(toNano(forwardAmount)).storeMaybeRef(l2Data).endCell();
  console.log('*****Cell payload: ', payload);
  console.log('*****Encoded payload: ', Base64.encode(payload.toBoc()));
  return Base64.encode(payload.toBoc());
};

export const swap = async (tonConnect: TonConnectUI, fromAddress: string, tokenAddress: string, jsonArguments: string, amount: string, commission = '0.35') => {
  console.log('*****Swapping*****');

  console.table({
    fromAddress,
    tokenAddress,
    jsonArguments,
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
        payload: getSwapPayload(amount, fromAddress, jsonArguments).toString()
      }
    ]
  };

  console.log('*****Sending transaction: ', transaction);
  return await tonConnect.sendTransaction(transaction);
};

export const getJettonBalance = async (address: string, tokenAddress: string) => {
  const jettonAddress = await getUserJettonWalletAddress(address, tokenAddress);
  const client = new TonClient({
    endpoint: '/jsonRPC'
  });

  const result = await client.runMethod(Address.parse(jettonAddress), 'get_wallet_data');
  return Number(fromNano(result.stack.readNumber()));
};

export const getImplementationContract = (poolAddress: string, providerAddress: string) => {
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

  const provider = ethers.getDefaultProvider(providerAddress);
  return new ethers.Contract(poolAddress, implementationAbi, provider);
};

export const getSwapRates = (amount: string, poolAddress: string, providerAddress: string) => {
  const implementation = getImplementationContract(poolAddress, providerAddress);

  return implementation.get_dy(0, 1, amount);
};
