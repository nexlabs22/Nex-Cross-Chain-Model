import { Pool, computePoolAddress } from '@uniswap/v3-sdk'
import { WETH9, Token, SUPPORTED_CHAINS } from '@uniswap/sdk-core'
import { MainnetUniswapV3FactoryAddress, goerliWethAddress, sepoliaUniswapV3FactoryAddress, sepoliaWethAddress } from '@/constants/contractAddresses'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { uniswapV3FactoryAbi } from '@/constants/abi'
// import { CurrentConfig } from './configure'

export default async function getPoolAddress(tokenAddress1: string, token1Decimal: number, isMainnet: boolean) {

    const chainID = isMainnet ? 1: 11155111;
    try {
        const FromToken = new Token(
            chainID,
            tokenAddress1,
            token1Decimal,
            "T1",
        )
        const TESTENT_WETH_TOKEN = new Token(
            11155111,
            sepoliaWethAddress,
            18,
            'WETH',
            'Wrapped Ether'
        )

        const tokenB = isMainnet ? WETH9[1] : TESTENT_WETH_TOKEN

        // const poolAddress = computePoolAddress({
        //     // factoryAddress: sepoliaUniswapV3FactoryAddress,
        //     factoryAddress: MainnetUniswapV3FactoryAddress,
        //     tokenA: FromToken,
        //     tokenB: tokenB,
        //     fee: FeeAmount.MEDIUM,
        //   })

        // const fromTokenPoolAddress = Pool.getAddress(
        //     FromToken,
        //     tokenB,
        //     FeeAmount.MEDIUM
        // )

        const factoryContractAddress = isMainnet ? MainnetUniswapV3FactoryAddress :sepoliaUniswapV3FactoryAddress
        const chainName = isMainnet ? 'ethereum' : 'sepolia'
        const sdk = new ThirdwebSDK(chainName)
        const factoryContract = await sdk.getContract(factoryContractAddress as string, uniswapV3FactoryAbi)
        const poolAddress =  await factoryContract.call('getPool', [FromToken.address,tokenB.address,3000])

        return poolAddress.toLowerCase()
    } catch (error) {
        console.error('Error fetching pool address:', error);
        return undefined;
    }
}