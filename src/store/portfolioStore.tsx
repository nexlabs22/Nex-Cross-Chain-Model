'use client'
import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken } from '@/constants/contractAddresses'
import { create } from 'zustand'
import useTradePageStore from './tradeStore'
import convertToUSD from '@/utils/convertToUsd'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { Positions } from '@/types/tradeTableTypes'
import { tokens } from '@/constants/goerliTokens'

interface User {
	email: string
	inst_name: string
	main_wallet: string
	name: string
	vatin: string
	address: string
	ppLink: string
	p1: boolean
	p2: boolean
	p3: boolean
	p4: boolean
	p5: boolean
	ppType: string
	creationDate: string
	showTradePopUp: boolean
}

type PortfolioPageStore = {
	ownedAssetInActivity: string
	setOwedAssetInActivity: (index: string) => void

	dayChange: { anfi: number; cr5: number }
	setDayChange: (change: { anfi: number; cr5: number }) => void

	portfolioData: { tradedBalance: { [key: string]: number; anfi: number; crypto5: number; total: number } }
	setPortfolioData: (positionHistoryData: Positions[]) => void

	globalConnectedUser: User,
	setGlobalConnectedUser: (user: User) => void
}



const usePortfolioPageStore = create<PortfolioPageStore>()((set) => ({
	ownedAssetInActivity: 'ANFI',
	setOwedAssetInActivity: (index: string) => set({ ownedAssetInActivity: index }),

	globalConnectedUser: {
		name: 'null',
		email: 'null',
		address: 'null',
		inst_name: 'null',
		main_wallet: 'null',
		vatin: 'null',
		ppLink: 'null',
		ppType: '',
		p1: false,
		p2: false,
		p3: false,
		p4: false,
		p5: false,
		creationDate: 'null',
		showTradePopUp: true
	},
	setGlobalConnectedUser: (user: User) => set({ globalConnectedUser: user }),

	dayChange: { anfi: 0, cr5: 0 },
	setDayChange: (change: { anfi: number; cr5: number }) => set({ dayChange: change }),

	portfolioData: { tradedBalance: { anfi: 0, crypto5: 0, total: 0 } },
	setPortfolioData: async (positionHistoryData: Positions[]) => {
		const ethPriceInUsd = useTradePageStore.getState().ethPriceInUsd
		const priceObj: { [key: string]: number } = {}

		const pricesInUsd: any = (
			await Promise.all(
				tokens.map(async (token) => {
					priceObj[token.address] = (await convertToUSD(token.address, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(priceObj).length === tokens.length - 1) {
						return priceObj
					}
				})
			)
		).filter((item) => item !== undefined)

		const anfiTotalTradeBalance = positionHistoryData.reduce((total, item) => {
			if (item.side === 'Mint Request' && item.indexName === 'ANFI') {
				return total + item.inputAmount * pricesInUsd[0][item.tokenAddress]
			}
			return total
		}, 0)
		const crypto5TotalTradeBalance = positionHistoryData.reduce((total, item) => {
			if (item.side === 'Mint Request' && item.indexName === 'CRYPTO5') {
				return total + item.inputAmount * pricesInUsd[0][item.tokenAddress]
			}
			return total
		}, 0)

		set({ portfolioData: { tradedBalance: { anfi: anfiTotalTradeBalance, crypto5: crypto5TotalTradeBalance, total: anfiTotalTradeBalance + crypto5TotalTradeBalance } } })
	},
}))

export default usePortfolioPageStore
