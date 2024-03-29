import { uniswapV3PoolContractAbi } from '@/constants/abi'
import getPoolAddress from '@/uniswap/utils'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { SwapNumbers } from './general'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { Coin } from '@/types/nexTokenData'

export default async function convertToUSD(tokenData: { tokenAddress: string; tokenDecimals: number }, ethPrice: number, isMainnet: boolean) {
	try {
		let poolAddress
		let decimals

		let address
		if (!isMainnet) {
			const tokenDetails = sepoliaTokens.find((d) => d.address === tokenData.tokenAddress) as { address: string; decimals: number; Symbol: string }
			address = tokenDetails.address
			decimals = tokenDetails.decimals
			if (tokenDetails.Symbol === 'ETH') return ethPrice
			poolAddress = await getPoolAddress(tokenDetails.address, tokenDetails.decimals, isMainnet)
		} else {
			address = tokenData.tokenAddress
			decimals = tokenData.tokenDecimals
			poolAddress = await getPoolAddress(tokenData.tokenAddress, tokenData.tokenDecimals, isMainnet)
		}

		let isRevPool = false

		const chainName = isMainnet ? 'ethereum' : 'sepolia'
		const sdk = new ThirdwebSDK(chainName)
		const poolContract = await sdk.getContract(poolAddress as string, uniswapV3PoolContractAbi)

		const data = await poolContract.call('slot0', [])
		const token0 = await poolContract.call('token0', [])

		const fromSqrtPriceX96 = data.sqrtPriceX96

		let decimal0 = Number(decimals)
		let decimal1 = 18

		if (token0 !== address) {
			isRevPool = true;
			[decimal0, decimal1] = SwapNumbers(decimal0, decimal1)
		}

		const calculatedPrice = Math.pow(fromSqrtPriceX96 / 2 ** 96, 2) / (10 ** decimal1 / 10 ** decimal0)
		const calculatedPriceAsNumber = parseFloat(calculatedPrice.toFixed(decimal1))

		const priceInUSD = isRevPool ? calculatedPriceAsNumber / ethPrice : 1 / calculatedPriceAsNumber / ethPrice

		return priceInUSD as number 
	} catch (err) {
		console.log('Error in getting USD Price', err)
		return 1;
	}
}
