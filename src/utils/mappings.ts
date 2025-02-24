import { ChainNetwork } from "@/types/indexTypes";
import { sepolia, arbitrum } from "thirdweb/chains";

export const allowedChainNetworks: ChainNetwork[] = [
  {chainName: 'Ethereum', network: 'Sepolia', chain: sepolia},
  {chainName: 'Arbitrum', network: 'Mainnet', chain: arbitrum},
]
