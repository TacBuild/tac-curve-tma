import { EVM_PROVIDER_URL, MERKL_PROXY, TAC_SA_FACTORY_ADDRESS } from './config'
import { Contract, JsonRpcProvider } from 'ethers'
import { Address } from '@ton/ton'

export const fetchSmartAccountAddress = (tvmAddress: string) => {
  const provider = new JsonRpcProvider(EVM_PROVIDER_URL)
  const contract = new Contract(TAC_SA_FACTORY_ADDRESS, [
    {
      stateMutability: 'view',
      name: 'predictSmartAccountAddress',
      type: 'function',
      outputs: [
        {
          type: 'address',
        },
      ],
      inputs: [
        {
          type: 'string',
        },
        {
          type: 'address',
        },
      ],
    },
  ], provider)

  if (!contract?.predictSmartAccountAddress) {
    throw new Error(`Can't predict smart account address because contract method is not available.`)
  }

  return contract.predictSmartAccountAddress(Address.parse(tvmAddress).toString({
    bounceable: true,
  }), MERKL_PROXY)
}
