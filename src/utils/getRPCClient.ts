import { Chains, ChainSelectorMap, Networks } from '@/types/indexTypes'
import { createPublicClient, http } from 'viem'
import { arbitrumSepolia, sepolia, arbitrum } from 'viem/chains'

const clients: ChainSelectorMap = {
    Ethereum: {
        Sepolia: createPublicClient({
            chain: sepolia,
            transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY}`),
        }),
    },
    Arbitrum: {
        Sepolia: createPublicClient({
            chain: arbitrumSepolia,
            transport: http(`https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_SEPOLIA_KEY}`),
        }),
        Mainnet: createPublicClient({
            chain: arbitrum,
            transport: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_SEPOLIA_KEY}`),
        })
    }

}

export const getClient = (chain: Chains, network: Networks)=> {
    return clients?.[chain]?.[network]
} 
