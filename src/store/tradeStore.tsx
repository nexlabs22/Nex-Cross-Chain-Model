"use client"; // This is a client component 👈🏽
import { create } from 'zustand'
import circle from '@assets/images/circle.png'

type Coin = {
	id: number
	logo: string
	name: string
	Symbol: string
}

type TradePageStore = {
	
	//dashboard default index
	defaultIndex: string
	changeDefaultIndex : (index: string) => void

	isChartSettingsModalOpen: boolean;
	setChartSettingsModalOpen: (open: boolean) => void

	isFromCurrencyModalOpen: boolean;
	setFromCurrencyModalOpen: (open: boolean) => void

	isToCurrencyModalOpen: boolean;
	setToCurrencyModalOpen: (open: boolean) => void

	// Swap from currency : 
	swapFromCur: Coin,
	changeSwapFromCur: (cur: Coin) => void

	// Swap from value :
	swapFromAmount: number,
	setSwapFromAmount: (amount: number) =>void

	// Swap to currency : 
	swapToCur: Coin,
	changeSwapToCur: (cur: Coin) => void

	// Swap to value :
	swapToAmount: number,
	setSwapToAmount: (amount: number) =>void

}

const useTradePageStore = create<TradePageStore>()((set) => ({

	defaultIndex: "CRYPTO5",
	changeDefaultIndex: (index: string) => set((state) => ({ defaultIndex: index })),

	isChartSettingsModalOpen: false,
	setChartSettingsModalOpen: (open: boolean) => set((state) => ({ isChartSettingsModalOpen: open })),

	isFromCurrencyModalOpen: false,
	setFromCurrencyModalOpen: (open: boolean) => set((state) => ({ isFromCurrencyModalOpen: open })),

	isToCurrencyModalOpen: false,
	setToCurrencyModalOpen: (open: boolean) => set((state) => ({ isToCurrencyModalOpen: open })),

	swapFromCur: {
		id: 0,
		logo: circle.src,
		name: 'CRYPTO5',
		Symbol: 'CR5',
	},
	changeSwapFromCur: (cur: Coin) => set((state) => ({ swapFromCur: cur })),

	swapToCur: {
		id: 1,
		logo: circle.src,
		name: 'ANFI',
		Symbol: 'AIF',
	},
	changeSwapToCur: (cur: Coin) => set((state) => ({ swapToCur: cur })),

	swapFromAmount: 0,
	setSwapFromAmount: (amount: number) => set((state) => ({ swapFromAmount: amount })),

	swapToAmount: 0,
	setSwapToAmount: (amount: number) => set((state) => ({ swapToAmount: amount })),

}))

export default useTradePageStore
