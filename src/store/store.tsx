import { create } from 'zustand'
import { chartDataType } from './storeTypes'
import getIndexData from '@utils/indexCalculation'
import axios from 'axios'
import { isSameDay } from '@/utils/conversionFunctions'

type LandingPageStore = {
	//Select slide index
	selectedSlideIndex: number
	changeSelectedSlideIndex: (percentage: number) => void

	//dashboard default index
	defaultIndex: string
	changeDefaultIndex: (index: string) => void
}

const useLandingPageStore = create<LandingPageStore>()((set) => ({
	//Select slide index
	selectedSlideIndex: 0,
	changeSelectedSlideIndex: (index: number) => set((state) => ({ selectedSlideIndex: index })),

	defaultIndex: 'CRYPTO5',
	changeDefaultIndex: (index: string) => set((state) => ({ defaultIndex: index })),
}))

interface value {
	data:chartDataType[]
}

interface chartDataStoreType {
	chartData: { [key: string]: value },
	IndexData: { time: number, value: number }[],
	selectedIndex: { time: number, open: number, high: number, low: number, close: number }[],
	ANFIWeightage: {time:number, btc:number, gold:number}[],
	loading: boolean,
	error: Error | null
	selectedDuration: number
	selectDuration: (duration: number) => void
	fetchIndexData: ({ tableName, index }: { tableName: string, index: string }) => void
	removeIndex: (indexName: string) => void
	setANFIWeightage: () => void
}

const useChartDataStore = create<chartDataStoreType>()((set) => ({
	chartData: {},
	IndexData: [],
	selectedIndex: [],
	ANFIWeightage: [],
	loading: false,
	error: null,
	selectedDuration: 360,
	selectDuration: (duration: number) => set((state) => ({ selectedDuration: duration })),
	fetchIndexData: async ({ tableName, index }) => {
		try {
			set({ loading: true, error: null })
			const response = await fetch(
				`/api/spotDatabase?indexName=${index}&tableName=${encodeURIComponent(tableName)}`
			)

			const inputData = await response.json()

			set((state) => {
				if (index === 'ANFI' || index === 'CRYPTO5') {
					return {
						IndexData: getIndexData(index, inputData.data, state.ANFIWeightage, inputData?.top5Cryptos),
						loading: false
					}
				} else {
					const updatedChartData = state.chartData
					updatedChartData[index] = inputData
					return {
						chartData: updatedChartData,
						loading: false
					}
				}
			})
		} catch (error) {
			if (error instanceof Error) {
				set({ error })
			} else {
				set({ error: new Error('Error fetching chart data') })
			}
		} finally {
			set({ loading: false })
		}
	},
	removeIndex: async (indexName: string) => {
		set((state) => {
			const activeIndex = state.chartData
			delete activeIndex[indexName];

			return ({ chartData: activeIndex })
		})
	},
	setANFIWeightage: async () => {
		const bitcoinMC_URL = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max`;
		const goldMC_URL = `https://api.coingecko.com/api/v3/coins/tether-gold/market_chart?vs_currency=usd&days=max`;
		const bitcoinMarketCaps = await axios.get(bitcoinMC_URL)
		.then((res) => res.data.market_caps)
		.then((res)=> res.filter((timestamp: number[])=> {
			const date = new Date(timestamp[0]);
			return date.getDate() === 1;
		}))
		const goldMarketCaps = await axios.get(goldMC_URL)
		.then((res) => res.data.market_caps)
		.then((res)=> res.filter((timestamp: number[])=> {
			const date = new Date(timestamp[0]);
			return date.getDate() === 1;
		}))

		const weightageResult:{time:number, btc:number, gold:number}[]  = []

		bitcoinMarketCaps.map((btc:number[])=>{
			goldMarketCaps.map((gold: number[])=>{
				const obj:{time:number, btc:number, gold:number} = {time:0,btc:0,gold:0}
				if(isSameDay(btc[0],gold[0])){
					obj.time = btc[0];
					obj.btc = (btc[1]/(btc[1]+gold[1]));
					obj.gold = (gold[1]/(btc[1]+gold[1]));
					weightageResult.push(obj);					
				}
			})
		})

		set({ANFIWeightage: weightageResult})
	}
}))

export { useLandingPageStore, useChartDataStore }
