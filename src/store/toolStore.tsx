'use client'
import { create } from 'zustand'

type ToolPageStore = {

	selectedIndex: string
	selectIndex: (index: string) => void

}

const useToolPageStore = create<ToolPageStore>()((set) => ({

	selectedIndex: 'ANFI',
	selectIndex: (index: string) => set({ selectedIndex: index }),

}))

export default useToolPageStore
