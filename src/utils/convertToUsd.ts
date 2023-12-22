
import { uniswapV3PoolContractAbi } from '@/constants/abi'
import getPoolAddress from '@/uniswap/utils'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { SwapNumbers } from './general'
import { tokens } from '@/constants/goerliTokens'

export default async function convertToUSD( tokenAddress:string, ethPrice: number, isMainnet: boolean ) {
	const tokenDetails = tokens.find((d)=> d.address === tokenAddress) as {address: string, decimals: number, symbol: string}

	if(tokenDetails.symbol === 'ETH') return ethPrice;

	const poolAddress = getPoolAddress(tokenDetails.address, tokenDetails.decimals, isMainnet)
	let isRevPool = false

	const chainName = isMainnet ? 'ethereum' : 'goerli'
	const sdk = new ThirdwebSDK(chainName)
	const poolContract = await sdk.getContract(poolAddress as string, uniswapV3PoolContractAbi)

	const data = await poolContract.call('slot0', [])
	const token0 = await poolContract.call('token0', [])

	const fromSqrtPriceX96 = data.sqrtPriceX96

	let decimal0 = Number(tokenDetails.decimals)
	let decimal1 = 18

	if (token0 !== tokenDetails.address) {
		isRevPool = true;
		[decimal0, decimal1] = SwapNumbers(decimal0, decimal1)
	}

	const calculatedPrice = Math.pow(fromSqrtPriceX96 / 2 ** 96, 2) / (10 ** decimal1 / 10 ** decimal0)
	const calculatedPriceAsNumber = parseFloat(calculatedPrice.toFixed(decimal1))

	const priceInUSD = isRevPool ? calculatedPriceAsNumber / ethPrice : 1 / calculatedPriceAsNumber / ethPrice

	return priceInUSD;

}