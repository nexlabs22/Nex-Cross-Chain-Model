'use client' // This is a client component 👈🏽
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import circle from '@assets/images/circle.png'
import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import axios from 'axios'
import { goerliAnfiFactory, goerliAnfiIndexToken, goerliAnfiV2Factory, goerliAnfiV2IndexToken, goerliUsdtAddress, zeroAddress } from '@/constants/contractAddresses'

type Coin = {
	id: number
	logo: string
	name: string
	Symbol: string
	address: string
	factoryAddress: string
	decimals: number
}

type TradePageStore = {
	//dashboard default index
	defaultIndex: string
	changeDefaultIndex: (index: string) => void

	openMobileMenu: boolean
	setOpenMobileMenu: (open: boolean) => void

	isChartSettingsModalOpen: boolean
	setChartSettingsModalOpen: (open: boolean) => void

	isFromCurrencyModalOpen: boolean
	setFromCurrencyModalOpen: (open: boolean) => void

	isToCurrencyModalOpen: boolean
	setToCurrencyModalOpen: (open: boolean) => void

	selectedPortfolioChartSliceIndex: string
	setSelectedPortfolioChartSliceIndex: (index: string) => void

	// Swap from currency :
	swapFromCur: Coin
	changeSwapFromCur: (cur: Coin) => void

	// Swap from value :
	swapFromAmount: number
	setSwapFromAmount: (amount: number) => void

	// Swap to currency :
	swapToCur: Coin
	changeSwapToCur: (cur: Coin) => void

	// Swap to value :
	swapToAmount: number
	setSwapToAmount: (amount: number) => void

	// NFT Image:
	nftImage: string
	setNftImage: (image: string) => void

	selectedTradingCategory: string
	setSelectedTradingCategory: (category: string) => void

	selectedTradingProduct: string
	setSelectedTradingProduct: (product: string) => void

	tradeTableReload: boolean
	setTradeTableReload: (input: boolean) => void

	ethPriceInUsd: number
	setEthPriceInUsd: () => void
}

const useTradePageStore = create<TradePageStore>()((set) => ({

	selectedTradingProduct: 'ANFI',
	setSelectedTradingProduct: (product: string) => set((state) => ({ selectedTradingCategory: product })),

	selectedTradingCategory: 'defi',
	setSelectedTradingCategory: (category: string) => set((state) => ({ selectedTradingCategory: category })),
	
	selectedPortfolioChartSliceIndex: 'ANFI',
	setSelectedPortfolioChartSliceIndex: (index: string) => set((state) => ({ defaultIndex: index })),

	defaultIndex: 'CRYPTO5',
	changeDefaultIndex: (index: string) => set((state) => ({ defaultIndex: index })),

	isChartSettingsModalOpen: false,
	setChartSettingsModalOpen: (open: boolean) => set((state) => ({ isChartSettingsModalOpen: open })),

	openMobileMenu: false,
	setOpenMobileMenu: (open: boolean) => set((state) => ({ openMobileMenu: open })),

	isFromCurrencyModalOpen: false,
	setFromCurrencyModalOpen: (open: boolean) => set((state) => ({ isFromCurrencyModalOpen: open })),

	isToCurrencyModalOpen: false,
	setToCurrencyModalOpen: (open: boolean) => set((state) => ({ isToCurrencyModalOpen: open })),

	swapFromCur: {
		id: 2,
		logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
		name: 'Tether',
		Symbol: 'USDT',
		address: goerliUsdtAddress,
		factoryAddress: '',
		decimals: 18
	},
	changeSwapFromCur: (cur: Coin) => set((state) => ({ swapFromCur: cur })),

	swapToCur: {
		id: 1,
		logo: cr5Logo.src,
		name: 'ANFI',
		Symbol: 'ANFI',
		// address: goerliAnfiIndexToken,
		address: goerliAnfiV2IndexToken,
		// factoryAddress: goerliAnfiFactory,
		factoryAddress: goerliAnfiV2Factory,
		decimals: 18
	},
	changeSwapToCur: (cur: Coin) => set((state) => ({ swapToCur: cur })),

	swapFromAmount: 0,
	setSwapFromAmount: (amount: number) => set((state) => ({ swapFromAmount: amount })),

	swapToAmount: 0,
	setSwapToAmount: (amount: number) => set((state) => ({ swapToAmount: amount })),

	nftImage: '',
	setNftImage: (image: string) => set((state) => ({ nftImage: image })),
	
	tradeTableReload: false,
	setTradeTableReload: (input: boolean) => set({ tradeTableReload: input }),

	ethPriceInUsd: 0,
	setEthPriceInUsd: async () => {
		const wethPriceinUsd = await axios
			.get('https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd')
			.then((res) => res.data.weth.usd)
			.catch((err) => console.log(err))
			console.log(wethPriceinUsd)
		set({ ethPriceInUsd: wethPriceinUsd })
	},
}))

export default useTradePageStore
