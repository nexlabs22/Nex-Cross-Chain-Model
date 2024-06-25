import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, goerliUsdtAddress, goerliWethAddress, sepoliaAnfiV2Factory, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2Factory, sepoliaCrypto5V2IndexToken, sepoliaSciV2Factory, sepoliaSciV2IndexToken, sepoliaUsdtAddress, sepoliaWethAddress, zeroAddress } from "./contractAddresses";
import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import mag7 from '@assets/images/mag7.png'
import sciLogo from '@assets/images/sci.png'
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
        id: 1,
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
        id: 2,
        logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
        name: 'Tether',
        Symbol: 'USDT',
        isNexlabToken:false,
        address: sepoliaUsdtAddress,
        factoryAddress: '',
        decimals: 18,
    },
    {
        id: 3,
        logo: 'https://assets.coincap.io/assets/icons/eth@2x.png',
        name: 'Ethereum',
        isNexlabToken:false,
        Symbol: 'ETH',
        address: sepoliaWethAddress,
        factoryAddress: '',
        decimals: 18,
    },
    {
        id: 4,
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
        id: 4,
        logo: mag7.src,
        name: 'MAG7',
        Symbol: 'MAG7',
        isNexlabToken:true,
        address: zeroAddress,
        factoryAddress: zeroAddress,
        decimals: 18,
        indexType: 'crosschain'
    },
    // {
    //     id: 4,
    //     logo: sciLogo.src,
    //     name: 'SCI',
    //     Symbol: 'SCI',
    //     isNexlabToken:true,
    //     address: sepoliaSciV2IndexToken,
    //     factoryAddress: sepoliaSciV2Factory,
    //     decimals: 18,
    //     indexType: 'defi'
    // }
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