import { WETH9 } from "@uniswap/sdk-core";
import {
  factoryAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses";
import { getContract, readContract } from "thirdweb";
import { client } from "./thirdWebClient";
import { Address, ChainNetwork } from "@/types/indexTypes";

export default async function getPoolAddress(
  tokenAddress1: string,  
  allowedChainNetworks: ChainNetwork
) {
  const {network, chain} = allowedChainNetworks
  const tokenA = tokenAddress1;
  const wethSepolia = tokenAddresses.WETH?.Ethereum?.Sepolia?.token?.address;

  const tokenB = network === 'Mainnet' ? WETH9[chain.id].address : (wethSepolia as Address);
  const uniswapFactory = factoryAddresses.UNISWAP.Ethereum;

  const factoryContractAddress = network === 'Mainnet'
    ? uniswapFactory.Mainnet
    : uniswapFactory.Sepolia;    

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
