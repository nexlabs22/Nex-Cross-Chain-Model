import { Pool } from '@uniswap/v3-sdk'
import { WETH9, Token } from '@uniswap/sdk-core'
import { goerliWethAddress } from '@/constants/contractAddresses'
import { FeeAmount } from '@uniswap/v3-sdk'
// import { CurrentConfig } from './configure'

export default function getPoolAddress(tokenAddress1: string, token1Decimal: number, isMainnet: boolean) {

    try {
        const FromToken = new Token(
            1,
            tokenAddress1,
            token1Decimal,
            "T1",
        )
        const GOERLI_WETH_TOKEN = new Token(
            1,
            goerliWethAddress,
            18,
            'WETH',
            'Wrapped ETH'
        )

        const tokenB = isMainnet ? WETH9[1] : GOERLI_WETH_TOKEN


        const fromTokenPoolAddress = Pool.getAddress(
            FromToken,
            tokenB,
            FeeAmount.MEDIUM
        )

        return fromTokenPoolAddress.toLowerCase()
    } catch (error) {
        console.error('Error fetching pool address:', error);
        return undefined;
    }
}