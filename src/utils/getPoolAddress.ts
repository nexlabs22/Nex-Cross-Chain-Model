import { WETH9 } from "@uniswap/sdk-core";
import {
  factoryAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses";
import { getContract, readContract } from "thirdweb";
import { client } from "./thirdWebClient";
import { Address, Networks } from "@/types/indexTypes";
import { networkToChain } from "./mappings";

export default async function getPoolAddress(
  tokenAddress1: string,  
  network: Networks
) {
  const tokenA = tokenAddress1;
  const wethSepolia = tokenAddresses.WETH?.Ethereum?.Sepolia?.index?.address;

  const tokenB = network === 'Mainnet' ? WETH9[1].address : (wethSepolia as Address);
  const uniswapFactory = factoryAddresses.UNISWAP.Ethereum;

  const factoryContractAddress = network === 'Mainnet'
    ? uniswapFactory.Mainnet
    : uniswapFactory.Sepolia;

  const chain = networkToChain[network];

  const factoryContract = getContract({
    address: factoryContractAddress as string,
    chain,
    client,
  });

  const poolAddress = await readContract({
    contract: factoryContract,
    method: "function getPool(address, address, uint24) returns (address)",
    params: [tokenA, tokenB, 3000],
  });

  return poolAddress.toLowerCase();
}
