import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, goerliUsdtAddress, goerliWethAddress, sepoliaAnfiV2Factory, sepoliaAnfiV2IndexToken, sepoliaArbeiIndexFactoryAddress, sepoliaArbeiIndexTokenAddress, sepoliaCrypto5V2Factory, sepoliaCrypto5V2IndexToken, sepoliaDianariUsdcAddress, sepoliaMag7Factory, sepoliaMag7FactoryStorage, sepoliaMAG7IndexTokenAddress, sepoliaUsdtAddress, sepoliaWethAddress, zeroAddress } from "./contractAddresses";
import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import mag7 from '@assets/images/mag7.png'
import sciLogo from '@assets/images/sci.png'
import arbLogo from '@assets/images/arb.png'
import { Coin } from "@/types/nexTokenData";

export const goerliTokens = [
    {
        symbol: 'ANFI',
        address: goerliAnfiV2IndexToken,
        decimals: 18
    },
    {
        symbol: 'CRYPTO5',
        address: goerliCrypto5IndexToken,
        decimals: 18
    },
    {
        symbol: 'USDT',
        address: goerliUsdtAddress,
        decimals: 18
    },
    {
        symbol: 'ETH',
        address: goerliWethAddress,
        decimals: 18
    },
]
export const sepoliaTokens:Coin[] = [
    {
        logo: anfiLogo.src,
        name: 'ANFI',
        Symbol: 'ANFI',
        isNexlabToken:true,
        address: sepoliaAnfiV2IndexToken,
        factoryAddress: sepoliaAnfiV2Factory,
        decimals: 18,
        indexType: 'defi'
    },
    {
        logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
        name: 'Tether',
        Symbol: 'USDT',
        isNexlabToken:false,
        address: sepoliaUsdtAddress,
        factoryAddress: '',
        decimals: 18,
    },
    {
        logo: 'https://assets.coincap.io/assets/icons/usdc@2x.png',
        name: 'USD Coin',
        Symbol: 'USDC',
        isNexlabToken:false,
        address: sepoliaDianariUsdcAddress,
        factoryAddress: '',
        decimals: 6
    },
    {
        logo: 'https://assets.coincap.io/assets/icons/eth@2x.png',
        name: 'Ethereum',
        isNexlabToken:false,
        Symbol: 'ETH',
        address: sepoliaWethAddress,
        factoryAddress: '',
        decimals: 18,
    },
    {
        logo: cr5Logo.src,
        name: 'CRYPTO5',
        Symbol: 'CRYPTO5',
        isNexlabToken:true,
        address: sepoliaCrypto5V2IndexToken,
        factoryAddress: sepoliaCrypto5V2Factory,
        decimals: 18,
        indexType: 'crosschain'
    },
    {        
        logo: mag7.src,
        name: 'MAG7',
        Symbol: 'MAG7',
        isNexlabToken:true,
        address: sepoliaMAG7IndexTokenAddress,
        factoryAddress: sepoliaMag7Factory,
        decimals: 18,
        indexType: 'stock'
    },
    {
        logo: arbLogo.src,
        name: 'Arbitrum Ecosystem Index',
        Symbol: 'ARBEI',
        isNexlabToken:true,
        address: sepoliaArbeiIndexTokenAddress,
        factoryAddress: sepoliaArbeiIndexFactoryAddress,
        decimals: 18,
        indexType: 'defi' 
    }
]
// export const sepoliaTokens = [
//     {
//         symbol: 'ANFI',
//         address: sepoliaAnfiV2IndexToken,
//         decimals: 18
//     },
//     {
//         symbol: 'CRYPTO5',
//         address: sepoliaCrypto5V2IndexToken,
//         decimals: 18
//     },
//     {
//         symbol: 'USDT',
//         address: sepoliaUsdtAddress,
//         decimals: 18
//     },
//     {
//         symbol: 'ETH',
//         address: sepoliaWethAddress,
//         decimals: 18
//     },
// ]