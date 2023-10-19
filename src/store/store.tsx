import { create } from 'zustand'
import { chartDataType } from './storeTypes'
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
	chartData: { [key: string]: chartDataType[] },
	IndexData: { time: number, value: number }[],	
	selectedIndex: { time: number, open: number, high: number, low: number, close: number }[]
	loading: boolean,
	error: Error | null
	selectedDuration: number
	selectDuration: (duration: number) => void
	fetchIndexData: ({ tableName, index }: { tableName: string, index: string }) => void
	removeIndex: (indexName: string) => void
}

const useChartDataStore = create<chartDataStoreType>()((set) => ({
	chartData: {},
	IndexData: [],
	selectedIndex: [],
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
						IndexData: getIndexData(index, inputData),
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
	}
}))

export { useLandingPageStore, useChartDataStore }
