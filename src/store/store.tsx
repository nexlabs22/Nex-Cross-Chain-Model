import { create } from 'zustand'
import chartDataType from './storeTypes'
import getIndexData from '@utils/indexCalculation'

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

interface chartDataStoreType {
	chartData: { [key: string]: chartDataType[] }
	ANFIData: { time: number; value: number }[]
	CRYPTO5Data: { time: number; value: number }[]
	loading: boolean
	error: string | null
	fetchIndexData: ({ tableName, index }: { tableName: string; index: string }) => void
}

const useChartDataStore = create<chartDataStoreType>()((set) => ({
	chartData: {},
	ANFIData: [],
	CRYPTO5Data: [],
	loading: false,
	error: null,
	fetchIndexData: async ({ tableName, index }) => {
		try {
			set({ loading: true, error: null })
			let columnNames = 'btc,xaut,bnb,eth,usdt,usdc'
			if (index === 'CRYPTO5') {
				columnNames = 'btc,bnb,eth,usdt,usdc'
			} else if (index === 'ANFI') {
				columnNames = 'btc,xaut'
			}
			const response = await fetch(`/api/backend/spotDatabase?columnName=${columnNames}&tableName=${encodeURIComponent(tableName)}`)

			const inputData = await response.json()

			set((state) => {
				const updatedChartData = state.chartData
				updatedChartData[index] = inputData

				return {
					chartData: updatedChartData,
					ANFIData: getIndexData('ANFI', inputData),
					CRYPTO5Data: getIndexData('CRYPTO5', inputData),
				}
			})
		} catch (err) {}
	},
}))

export { useLandingPageStore, useChartDataStore }
