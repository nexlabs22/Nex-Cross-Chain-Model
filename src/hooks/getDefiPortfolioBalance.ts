import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, polygonMumbai, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, mumbaiChainSelector, mumbaiCrypto5V2IndexFactory, mumbaiCrypto5V2Vault, mumbaiWmaticAddress, sepoliaAnfiV2Factory, sepoliaCrypto5V2Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi, tokenAbi } from '@/constants/abi'
import useTradePageStore from '@/store/tradeStore'
import { sepoliaTokens } from '@/constants/testnetTokens'



export function GetDefiPortfolioBalance() {
	
	const [portfolioValue, setPortfolioValue] = useState<number>()
	const {swapFromCur, swapToCur} = useTradePageStore()

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))[0]

	const getPortfolioValue = useCallback(async () => {
		
		const sepoliaPublicClient = createPublicClient({
			chain: sepolia,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
		})

		let totalPortfolioBalance: number = 0;

		const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
			address: factoryAddresses[activeTicker],
			abi: indexFactoryV2Abi,
			functionName: 'getPortfolioBalance',
		  })
		totalPortfolioBalance += Number(sepoliaPortfolioBalance)
		
		setPortfolioValue(totalPortfolioBalance);
	}, [])

	useEffect(() => {
		getPortfolioValue()
	}, [getPortfolioValue])

	return {
		data: portfolioValue,
		reload: getPortfolioValue,
	}
}
