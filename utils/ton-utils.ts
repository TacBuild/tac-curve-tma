import { Address, beginCell, toNano, TonClient } from '@ton/ton';
import type { ITonConnect } from '@tonconnect/ui';
import { randomInt } from '~/utils/number-utils';

const TONCENTER_URL_ENDPOINT = '/jsonRPC';

export const getUserJettonWalletAddress = async (userAddress: string, financialAddress: string) => {
  const client = new TonClient({
    endpoint: TONCENTER_URL_ENDPOINT
  });

  const address = Address.parse(userAddress);
  const cell = beginCell().storeAddress(address).endCell();
  console.log(address, cell);
  const result = await client.runMethod(Address.parse(financialAddress), 'get_wallet_address', [{
    type: 'slice',
    cell
  }]);

  return result.stack.readAddress().toString();
};

const getSwapToTACPayload = (amount: string, fromAddress: string, fromJettonAddress: string) => {
  const toAddress = 'EQBcB0XZEv-T_9tYnbJc-DoYqAFz71k5KUkZTLX1etwfuMIB';
  const timestamp = Math.floor(+new Date() / 1000);
  const randAppend = randomInt(1, 1000);
  const json = JSON.stringify({
    query_id: timestamp + randAppend,
    timestamp,
    target: '0xd350bf040068fbc509dbc9cb48bf5feeb1c7a707',
    methodName: 'exchange(address,uint256,uint256,uint256,uint256)',
    arguments: 'AAAAAAAAAAAAAAAAAT7UvbBC0pQBfF3AUnO4F+qzXvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABdIdugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    caller: fromAddress,
    mint: [{
      token_address: '0x2cb284c531fb21a70e2c24ede980239e643b7b5d',
      amount: toNano(amount).toString()
    }],
    unlock: []
  });
  const l2Data = beginCell().storeStringTail(json).endCell();
  const forwardAmount = '0.2';

  return beginCell()
    .storeUint(0xF8A7EA5, 32)
    .storeUint(timestamp + randAppend, 64)
    .storeCoins(toNano(amount))
    .storeAddress(Address.parse(toAddress))
    .storeAddress(Address.parse(fromAddress)).storeBit(false).storeCoins(toNano(forwardAmount)).storeMaybeRef(l2Data).endCell();
};

export const swapToTAC = async (connector: ITonConnect, fromAddress: string, amount: string, commission = '0.35') => {
  const stTonUserJettonAddress = await getUserJettonWalletAddress(fromAddress, 'EQDJfaGp5pgN8oVGyCQI0AvUPMiuMyzaWq7Ckdf_wVZYm1IY');
  const transaction = {
    validUntil: +new Date() + 15 * 60 * 1000,
    messages: [
      {
        address: stTonUserJettonAddress,
        amount: toNano(commission).toString(),
        payload: getSwapToTACPayload(amount, fromAddress, stTonUserJettonAddress).toString()
      }
    ]
  };

  return await connector.sendTransaction(transaction);
};
