import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, goerliUsdtAddress, goerliWethAddress } from "./contractAddresses";

export const tokens = [
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