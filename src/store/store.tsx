import { create } from 'zustand'
import { chartDataType, dayChangeType } from './storeTypes'
import getIndexData from '@utils/indexCalculation'
import axios from 'axios'
import { isSameDay } from '@/utils/conversionFunctions'
import { dayChangeInitial } from './storeInitialValues'
import get24hDayChangePer from '@utils/get24hDayChangePer'

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
	data: chartDataType[]
}

interface chartDataStoreType {
	chartData: { [key: string]: value },
	IndexData: { time: number, value: number }[],
	ANFIData: { time: number, value: number }[],
	CR5Data: { time: number, value: number }[],
	selectedIndex: { time: number, open: number, high: number, low: number, close: number }[],
	ANFIWeightage: { time: number, btc: number, gold: number }[],
	dayChange: dayChangeType,
	loading: boolean,
	error: Error | null
	selectedDuration: number
	selectDuration: (duration: number) => void
	fetchIndexData: ({ tableName, index }: { tableName: string, index: string }) => void
	removeIndex: (indexName: string) => void
	setANFIWeightage: () => void
	setDayChangePer: () => void
}

const useChartDataStore = create<chartDataStoreType>()((set) => ({
	chartData: {},
	IndexData: [],
	ANFIData: [],
	CR5Data: [],
	selectedIndex: [],
	ANFIWeightage: [],
	dayChange: dayChangeInitial,
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
				if (index === 'OurIndex') {
					const cr5IndexPrices = getIndexData('CRYPTO5', inputData.data, inputData?.top5Cryptos);
					const anfiIndexPrices = getIndexData('ANFI', inputData.data, inputData?.top5Cryptos);
					return {
						ANFIData: anfiIndexPrices,
						CR5Data: cr5IndexPrices,
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
			.then((res) => res.filter((timestamp: number[]) => {
				const date = new Date(timestamp[0]);
				return date.getDate() === 1;
			}))
		const goldMarketCaps = await axios.get(goldMC_URL)
			.then((res) => res.data.market_caps)
			.then((res) => res.filter((timestamp: number[]) => {
				const date = new Date(timestamp[0]);
				return date.getDate() === 1;
			}))

		const weightageResult: { time: number, btc: number, gold: number }[] = []

		bitcoinMarketCaps.map((btc: number[]) => {
			goldMarketCaps.map((gold: number[]) => {
				const obj: { time: number, btc: number, gold: number } = { time: 0, btc: 0, gold: 0 }
				if (isSameDay(btc[0], gold[0])) {
					obj.time = btc[0];
					obj.btc = (btc[1] / (btc[1] + gold[1]));
					obj.gold = (gold[1] / (btc[1] + gold[1]));
					weightageResult.push(obj);
				}
			})
		})

		set({ ANFIWeightage: weightageResult })
	},
	setDayChangePer: async () => {
		const response = await fetch(
			`/api/get24Change`
		)
		const data = await response.json()
		set({ dayChange: data.changes })
	},
}))

export { useLandingPageStore, useChartDataStore }
