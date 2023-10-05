'use client' // This is a client component 👈🏽

// basics :
import Image from 'next/image'
import { useEffect, useState } from 'react'

// icons :
import { BiSolidChevronDown } from 'react-icons/bi'
import { AiOutlineSwap } from 'react-icons/ai'

// Store
import useTradePageStore from '@/store/tradeStore'

// Components:
import GenericModal from './GenericModal'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import axios from 'axios'

// Assets:
import circle from '@assets/images/circle.png'
import { it } from 'node:test'

type Coin = {
	id: number
	logo: string
	name: string
	Symbol: string
}

const Swap = () => {
	const { isFromCurrencyModalOpen, isToCurrencyModalOpen, setFromCurrencyModalOpen, setToCurrencyModalOpen, changeSwapFromCur, changeSwapToCur, swapFromCur, swapToCur } = useTradePageStore()

	const openFromCurrencyModal = () => {
		setFromCurrencyModalOpen(true)
	}

	const closeFromCurrencyModal = () => {
		setFromCurrencyModalOpen(false)
	}

	const openToCurrencyModal = () => {
		setToCurrencyModalOpen(true)
	}

	const closeToCurrencyModal = () => {
		setToCurrencyModalOpen(false)
	}

	const [coinsList, setCoinsList] = useState<Coin[]>([
		{
			id: 0,
			logo: circle.src,
			name: 'CRYPTO5',
			Symbol: 'CR5',
		},
		{
			id: 1,
			logo: circle.src,
			name: 'ANFI',
			Symbol: 'AIF',
		},
	])

	async function getCoins() {
		await axios.get('https://api.coincap.io/v2/assets/').then(function (response) {
			let coinsData = response.data.data
			console.log(coinsData)
			for (let id in coinsData) {
				let coinObject: Coin = {
					id: coinsData[id].rank + 1,
					name: coinsData[id].name,
					Symbol: coinsData[id].symbol,
					logo: 'https://assets.coincap.io/assets/icons/' + coinsData[id].symbol.toString().toLowerCase() + '@2x.png',
				}
				setCoinsList((prevState) => [...prevState, coinObject])
			}
		})
	}

	useEffect(() => {
		getCoins()
	}, [])

	const formatResult = (item: Coin) => {
		return (
			<div className="w-full h-10 cursor-pointer flex flex-row items-center justify-between px-2 py-1" key={item.id}>
				<div className="flex flex-row items-center justify-start gap-2">
					<Image src={item.logo} alt={item.name} width={15} height={15} className=" aspect-square scale-150"></Image>
					<h5 className="text-base text-blackText-500 pangram">{item.Symbol}</h5>
				</div>
				<h5 className="text-base text-gray-300 montrealBoldItalic">{item.Symbol}</h5>
			</div>
		)
	}

	return (
		<>
			<div className="h-full w-full rounded-xl border border-colorTwo-500/40 shadow shadow-colorTwo-500 flex flex-col items-start justify-start px-4 py-3">
				<h5 className="text-xl text-blackText-500 pangram mb-6 text-center w-full">Swap</h5>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<div className="w-full h-fit flex flex-row items-center justify-between mb-2">
						<p className="text-base montreal text-gray-500 w-1/3">You pay</p>
						<div className="w-2/3 h-fit flex flex-row items-center justify-end gap-1 px-2">
							<p className="text-xs text-blackText-500 pangram bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">MIN</p>
							<p className="text-xs text-blackText-500 pangram bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">HALF</p>
							<p className="text-xs text-blackText-500 pangram bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">MAX</p>
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-2">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 pangram placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
						/>
						<div
							className="w-1/3 p-2 h-10 flex flex-row items-center justify-between cursor-pointer"
							onClick={() => {
								openFromCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start">
								<Image src={swapFromCur.logo} alt={swapFromCur.Symbol} width={10} height={10} className="h-5 w-5 aspect-square mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 pangram">{swapFromCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>

					<p className="text-base montreal text-gray-500 pt-5">Balance: 2910 BTC</p>
				</div>

				<div className="w-full my-6 px-2 flex flex-row items-center justify-center">
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
					<div className="w-fit h-fit rounded-full mx-3 bg-blackText-500 p-2">
						<AiOutlineSwap color="#F2F2F2" size={20} className="rotate-90" />
					</div>
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
				</div>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<p className="text-base montreal text-gray-500 pb-2">You Recieve</p>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-2">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 pangram placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
						/>
						<div
							className="w-1/3 p-2 h-10 flex flex-row items-center justify-between  cursor-pointer"
							onClick={() => {
								openToCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start">
								<Image src={swapToCur.logo} alt={swapToCur.Symbol} width={10} height={10} className="h-5 w-5 aspect-square mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 pangram">{swapToCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>
					<p className="text-base montreal text-gray-500 pt-5">Balance: 2910 BTC</p>
				</div>
				<div className="h-fit w-full mt-6">
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangram text-black/70 pb-2">Gas Fees</p>
						<p className="text-sm pangram text-black/70 pb-2">0.01 ETH</p>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangram text-black/70 pb-2">Platform Fees</p>
						<p className="text-sm pangram text-black/70 pb-2">0.01 ETH (1%)</p>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangram text-black/70 pb-2">Total Transaction Cost</p>
						<p className="text-sm pangram text-black/70 pb-2">0.02 ETH</p>
					</div>
				</div>
			</div>
			<GenericModal isOpen={isFromCurrencyModalOpen} onRequestClose={closeFromCurrencyModal}>
				<div className="w-full h-fit px-2">
					<ReactSearchAutocomplete items={coinsList} formatResult={formatResult} autoFocus className="relative z-50" />
					<div className="w-full h-fit max-h-[50vh] bg-white overflow-hidden my-4 px-2">
						<div className="w-full h-fit max-h-[50vh] bg-white overflow-y-auto  py-2" id="coinsList">
							{coinsList.map((item, index) => {
								return (
									<div
										key={index}
										className="flex flex-row items-center justify-between mb-2 px-2 py-2 rounded-xl cursor-pointer hover:bg-slate-300"
										onClick={() => {
											changeSwapFromCur(item)
											closeFromCurrencyModal()
										}}
									>
										<div className="flex flex-row items-center justify-start gap-3">
											<Image src={item.logo} alt={item.name} width={15} height={15} className=" aspect-square scale-150 mt-1"></Image>
											<h5 className="text-base text-blackText-500 pangram">{item.Symbol}</h5>
										</div>
										<h5 className="text-sm text-gray-300 montreal italic">{item.Symbol}</h5>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</GenericModal>
			<GenericModal isOpen={isToCurrencyModalOpen} onRequestClose={closeToCurrencyModal}>
				<div className="w-full h-fit px-2">
					<ReactSearchAutocomplete items={coinsList} formatResult={formatResult} autoFocus className="relative z-50" />
					<div className="w-full h-fit max-h-[50vh] bg-white overflow-hidden my-4 px-2">
						<div className="w-full h-fit max-h-[50vh] bg-white overflow-y-auto px-2 py-2" id="coinsList">
							{coinsList.map((item, index) => {
								return (
									<div
										key={index}
										className="flex flex-row items-center justify-between mb-5 cursor-pointer"
										onClick={() => {
											changeSwapToCur(item)
											closeToCurrencyModal()
										}}
									>
										<div className="flex flex-row items-center justify-start gap-3">
											<Image src={item.logo} alt={item.name} width={15} height={15} className=" aspect-square scale-150 mt-1"></Image>
											<h5 className="text-base text-blackText-500 pangram">{item.Symbol}</h5>
										</div>
										<h5 className="text-sm text-gray-300 montreal italic">{item.Symbol}</h5>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</GenericModal>
		</>
	)
}

export default Swap
