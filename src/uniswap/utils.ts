import { Pool, computePoolAddress } from '@uniswap/v3-sdk'
import { WETH9, Token, SUPPORTED_CHAINS } from '@uniswap/sdk-core'
import { goerliWethAddress, sepoliaWethAddress } from '@/constants/contractAddresses'
import { FeeAmount } from '@uniswap/v3-sdk'
// import { CurrentConfig } from './configure'

export default function getPoolAddress(tokenAddress1: string, token1Decimal: number, isMainnet: boolean) {
    // console.log(SUPPORTED_CHAINS, SupportedChainId)


    try {
        const FromToken = new Token(
            11155111,
            tokenAddress1,
            token1Decimal,
            "T1",
        )
        const GOERLI_WETH_TOKEN = new Token(
            11155111,
            // goerliWethAddress,
            sepoliaWethAddress,
            18,
            'WETH',
            'Wrapped Ether'
        )

        const tokenB = isMainnet ? WETH9[1] : GOERLI_WETH_TOKEN

        const poolAddress = computePoolAddress({
            factoryAddress: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
            tokenA: FromToken,
            tokenB: tokenB,
            fee: FeeAmount.MEDIUM,
          })

        console.log("computePoolAddress",poolAddress, FromToken, GOERLI_WETH_TOKEN,FeeAmount.MEDIUM )

        const fromTokenPoolAddress = Pool.getAddress(
            FromToken,
            tokenB,
            FeeAmount.MEDIUM
        )
        console.log("fromTokenPoolAddress",fromTokenPoolAddress, FromToken, GOERLI_WETH_TOKEN,FeeAmount.MEDIUM )

        return poolAddress.toLowerCase()
    } catch (error) {
        console.error('Error fetching pool address:', error);
        return undefined;
    }
}