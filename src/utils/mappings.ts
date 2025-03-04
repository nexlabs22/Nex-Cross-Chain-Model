import { ChainNetwork, SideChainMap } from "@/types/indexTypes";
import { sepolia, arbitrum, arbitrumSepolia, ethereum, bsc } from "thirdweb/chains";

export const allowedChainNetworks: ChainNetwork[] = [
  {chainName: 'Ethereum', network: 'Sepolia', chain: sepolia},
  {chainName: 'Ethereum', network: 'Mainnet', chain: ethereum},
  {chainName: 'Arbitrum', network: 'Sepolia', chain: arbitrumSepolia},
  {chainName: 'Arbitrum', network: 'Mainnet', chain: arbitrum},
  {chainName: 'Binance', network: 'Mainnet', chain: bsc},
]

export const sideChainMap: SideChainMap = {
  Ethereum: {
    Sepolia: {
      ANFI: { chainName: "Arbitrum", network: "Sepolia", chain: arbitrumSepolia },
      CRYPTO5: { chainName: "Arbitrum", network: "Sepolia", chain: arbitrumSepolia },
    },
  },
  Arbitrum: {
    Mainnet: {
      ANFI: { chainName: "Ethereum", network: "Mainnet", chain: ethereum },
      CRYPTO5: { chainName: "Binance", network: "Mainnet", chain: bsc },
    },
  },
};

