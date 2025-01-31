import { TokenObject } from "@/types/indexTypes";
import { tokenAddresses } from "./contractAddresses";

export const sepoliaTokens:TokenObject[] = [
    {
        logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
        name: 'Tether',
        symbol: 'USDT',        
        tokenAddresses: tokenAddresses.USDT,        
    },
    {
        logo: 'https://assets.coincap.io/assets/icons/usdc@2x.png',
        name: 'USD Coin',
        symbol: 'USDC',        
        tokenAddresses: tokenAddresses.USDC,        
    },
    {
        logo: 'https://assets.coincap.io/assets/icons/eth@2x.png',
        name: 'Ethereum',
        symbol: 'WETH',
        tokenAddresses: tokenAddresses.WETH,                
    }
]