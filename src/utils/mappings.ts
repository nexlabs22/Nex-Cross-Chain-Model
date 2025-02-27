import { ChainNetwork } from "@/types/indexTypes";
import { sepolia, arbitrum, arbitrumSepolia, ethereum, bsc } from "thirdweb/chains";

export const allowedChainNetworks: ChainNetwork[] = [
  {chainName: 'Ethereum', network: 'Sepolia', chain: sepolia},
  {chainName: 'Ethereum', network: 'Mainnet', chain: ethereum},
  {chainName: 'Arbitrum', network: 'Sepolia', chain: arbitrumSepolia},
  {chainName: 'Arbitrum', network: 'Mainnet', chain: arbitrum},
  {chainName: 'Binance', network: 'Mainnet', chain: bsc},
]
