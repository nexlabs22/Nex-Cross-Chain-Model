import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, goerliUsdtAddress, goerliWethAddress, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken, sepoliaUsdtAddress, sepoliaWethAddress } from "./contractAddresses";

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
export const sepoliaTokens = [
    {
        symbol: 'ANFI',
        address: sepoliaAnfiV2IndexToken,
        decimals: 18
    },
    {
        symbol: 'CRYPTO5',
        address: sepoliaCrypto5V2IndexToken,
        decimals: 18
    },
    {
        symbol: 'USDT',
        address: sepoliaUsdtAddress,
        decimals: 18
    },
    {
        symbol: 'ETH',
        address: sepoliaWethAddress,
        decimals: 18
    },
]