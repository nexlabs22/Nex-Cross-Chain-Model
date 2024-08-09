import { createPublicClient, http } from 'viem'
import {  arbitrumSepolia, goerli, sepolia } from 'viem/chains'


const clients = {
    goerli: createPublicClient({
        chain: goerli,
        transport: http(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_KEY}`),
    }),
    sepolia: createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
    }),
    arbitrumSepolia: createPublicClient({
        chain: arbitrumSepolia,
        transport: http(`https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ARBITRUM_SEPOLIA_KEY}`),
    }),
    
}

type Chain = 'goerli' | 'sepolia' | 'arbitrumSepolia' 

export const getClient = (chain: Chain) => {
    return clients[chain]
} 
