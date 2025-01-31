import { ethereum, sepolia, mumbai, Chain } from "thirdweb/chains";

export const networkToChain: { [key: string]: Chain } = {
  Mainnet: ethereum,
  Sepolia: sepolia,
  Mumbai: mumbai,
}
