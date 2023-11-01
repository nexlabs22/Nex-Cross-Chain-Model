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

// Assets:
import circle from '@assets/images/circle.png'
import { it } from 'node:test'
import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { goerliAnfiFactory, goerliAnfiIndexToken, goerliUsdtAddress, zeroAddress } from '@/constants/contractAddresses'
import { indexFactoryAbi, indexTokenAbi, tokenAbi } from '@/constants/abi'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'
import PaymentModal from './PaymentModal'

import { Network, Alchemy } from 'alchemy-sdk'

import { BsInfoCircle } from 'react-icons/bs'

import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import cookingAnimation from '@assets/lottie/cooking.json'

import { GenericToast } from './GenericToast'

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
	apiKey: 'LOxUiFd7inEC7y9S-rxGH-_FmJjLlYC1', // Replace with your Alchemy API Key.
	network: Network.ETH_GOERLI, // Replace with your network.
}

const alchemy = new Alchemy(settings)

type Coin = {
	id: number
	logo: string
	name: string
	Symbol: string
	address: string
}

const Swap = () => {
	const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)
	const [isChecked, setChecked] = useState(false)

	const [firstInputValue, setFirstInputValue] = useState<number | null>(0)
	const [secondInputValue, setSecondInputValue] = useState<number | null>(0)

	const [cookingModalVisible, setCookingModalVisible] = useState<boolean>(false)

	const { isFromCurrencyModalOpen, isToCurrencyModalOpen, setFromCurrencyModalOpen, setToCurrencyModalOpen, changeSwapFromCur, changeSwapToCur, swapFromCur, swapToCur, nftImage, setNftImage } =
		useTradePageStore()

	const address = useAddress()

	//integration hooks
	const factoryContract = useContract(goerliAnfiFactory, indexFactoryAbi)

	const fromTokenContract = useContract(swapFromCur.address, tokenAbi)

	const toTokenContract = useContract(swapToCur.address, tokenAbi)

	const fromTokenBalance = useContractRead(fromTokenContract.contract, 'balanceOf', [address])
	const toTokenBalance = useContractRead(toTokenContract.contract, 'balanceOf', [address])
	const fromTokenAllowance = useContractRead(fromTokenContract.contract, 'allowance', [address, goerliAnfiFactory])

	const approveHook = useContractWrite(fromTokenContract.contract, 'approve')
	const mintRequestHook = useContractWrite(factoryContract.contract, 'addMintRequest')
	const burnRequestHook = useContractWrite(factoryContract.contract, 'burn')

	// useEffect(() => {
	// 	console.log("balance :", Number(indexTokenBalance.data)/1e18)
	// },[indexTokenBalance.data])

	useEffect(() => {
		if (approveHook.isSuccess) {
			fromTokenAllowance.refetch()
			approveHook.reset()
		}
	}, [approveHook.isSuccess, approveHook, fromTokenAllowance])

	useEffect(() => {
		if (mintRequestHook.isSuccess || burnRequestHook.isSuccess) {
			fromTokenBalance.refetch()
			toTokenBalance.refetch()
			fromTokenAllowance.refetch()
			mintRequestHook.reset()
			burnRequestHook.reset()
		}
	}, [mintRequestHook.isSuccess, burnRequestHook.isSuccess, mintRequestHook, burnRequestHook, fromTokenBalance, toTokenBalance, fromTokenAllowance])

	useEffect(() => {
		if (approveHook.isLoading) {
			console.log()
			toast.dismiss()
			// toast.loading('Approving ...')
			GenericToast({
				type: 'loading',
				message: 'Approving...',
			})
			// approveHook.reset()
		} else if (approveHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Approved Successfully!',
			})
			// approveHook.reset()
		} else if (approveHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: 'Approving Failed!',
			})
			// approveHook.reset()
		}
	}, [approveHook.isLoading, approveHook.isSuccess, approveHook.isError])

	useEffect(() => {
		if (mintRequestHook.isLoading) {
			console.log()
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Sending Request ...',
			})
			// approveHook.reset()
		} else if (mintRequestHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Sent Request Successfully!',
			})
			// approveHook.reset()
		} else if (mintRequestHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: 'Sending Request Failed!',
			})
			// approveHook.reset()
		}
	}, [mintRequestHook.isLoading, mintRequestHook.isSuccess, mintRequestHook.isError])

	useEffect(() => {
		if (burnRequestHook.isLoading) {
			console.log()
			toast.dismiss()

			GenericToast({
				type: 'loading',
				message: 'Sending Request ...',
			})
			// approveHook.reset()
		} else if (burnRequestHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Sent Request Successfully!',
			})
			// approveHook.reset()
		} else if (burnRequestHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: 'Sending Request Failed!',
			})
			// approveHook.reset()
		}
	}, [burnRequestHook.isLoading, burnRequestHook.isSuccess, burnRequestHook.isError])

	useEffect(() => {
		async function getUserNft() {
			if (address) {
				let response = await alchemy.nft.getNftsForOwner(address as string)
				const length = response.ownedNfts.length
				const image = response.ownedNfts[length - 1].rawMetadata?.image
				if (image) {
					setNftImage(image)
				}
			}
		}
		if (mintRequestHook.isSuccess || burnRequestHook.isSuccess) {
			getUserNft()
		}
	}, [mintRequestHook.isSuccess, burnRequestHook.isSuccess, address, nftImage, setNftImage])

	const toggleCheckbox = () => {
		setChecked(!isChecked)
	}

	const openPaymentModal = () => {
		setPaymentModalOpen(true)
	}

	const closePaymentModal = () => {
		setPaymentModalOpen(false)
	}

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
			logo: cr5Logo.src,
			name: 'CRYPTO5',
			Symbol: 'CR5',
			address: '',
		},
		{
			id: 1,
			logo: anfiLogo.src,
			name: 'ANFI',
			Symbol: 'ANFI',
			address: goerliAnfiIndexToken,
		},
		{
			id: 2,
			logo: 'https://assets.coincap.io/assets/icons/usdc@2x.png',
			name: 'USD Coin',
			Symbol: 'USDC',
			address: goerliUsdtAddress,
		},
	])

	function Switch() {
		let switchReserve: Coin = swapFromCur
		changeSwapFromCur(swapToCur)
		changeSwapToCur(switchReserve)
	}

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

	const changeFirstInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e?.target?.value) {
			setFirstInputValue(Number(e?.target?.value))
			setSecondInputValue(Number(e?.target?.value))
			// console.log('input', stakeAmount)
		} else {
			setFirstInputValue(null)
		}
	}

	const changeSecondInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(e?.target?.value)) {
			setSecondInputValue(Number(e?.target?.value))
			// console.log('input', stakeAmount)
		} else {
			setSecondInputValue(null)
			// setSecondInputValue(Number(e?.target?.value))
		}
	}

	async function approve() {
		try {
			if (isChecked) {
				openPaymentModal()
			} else {
				await approveHook.mutateAsync({ args: [goerliAnfiFactory, (Number(firstInputValue) * 1e18).toString()] })
			}
		} catch (error) {
			console.log('approve error', error)
		}
	}

	async function mintRequest() {
		try {
			if (isChecked) {
				openPaymentModal()
			} else {
				await mintRequestHook.mutateAsync({ args: [(Number(firstInputValue) * 1e18).toString()] })
			}
		} catch (error) {
			console.log('mint error', error)
		}
	}

	async function burnRequest() {
		try {
			if (isChecked) {
				openPaymentModal()
			} else {
				await burnRequestHook.mutateAsync({ args: [(Number(firstInputValue) * 1e18).toString()] })
			}
		} catch (error) {
			console.log('burn error', error)
		}
	}

	return (
		<>
			<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
			<div className="h-full w-full rounded-xl border border-colorTwo-500/40 shadow shadow-colorTwo-500 flex flex-col items-start justify-start px-4 py-3">
				<h5 className="text-xl text-blackText-500 montrealBold mb-3 text-center w-full">Swap</h5>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-base pangramLight text-gray-500 w-1/3">You pay</p>
						<div className="w-2/3 h-fit flex flex-row items-center justify-end gap-1 px-2">
							<p onClick={() => setFirstInputValue(1)} className="text-base lg:text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">
								MIN
							</p>
							<p
								onClick={() => setFirstInputValue(Number(fromTokenBalance.data) / 2e18)}
								className="text-base lg:text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30"
							>
								HALF
							</p>
							<p
								onClick={() => setFirstInputValue(Number(fromTokenBalance.data) / 1e18)}
								className="text-base lg:text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30"
							>
								MAX
							</p>
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-1">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 pangramMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
							onChange={changeFirstInputValue}
							value={firstInputValue ? (firstInputValue as number) : 0}
						/>
						<div
							className="w-2/5 lg:w-1/3 p-2 h-10 flex flex-row items-center justify-between cursor-pointer"
							onClick={() => {
								openFromCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start">
								<Image src={swapFromCur.logo} alt={swapFromCur.Symbol} width={20} height={20} className="mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 montrealBold pt-1">{swapFromCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>

					<p className="text-base pangramMedium text-gray-500 pt-3">
						Balance: {(Number(fromTokenBalance.data) / 1e18).toFixed(2)} {swapFromCur.Symbol}
					</p>
				</div>

				<div className="w-full my-2 px-2 flex flex-row items-center justify-center">
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
					<div
						className="w-fit h-fit rounded-full mx-3 bg-blackText-500 p-2 cursor-pointer"
						onClick={() => {
							Switch()
						}}
					>
						<AiOutlineSwap color="#F2F2F2" size={20} className="rotate-90" />
					</div>
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
				</div>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<p className="text-base pangramLight text-gray-500 pb-1">You Recieve</p>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-2">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 pangramMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
							onChange={changeSecondInputValue}
							value={secondInputValue ? (secondInputValue as number) : 0}
						/>
						<div
							className="w-2/5 lg:w-1/3 p-2 h-10 flex flex-row items-center justify-between  cursor-pointer"
							onClick={() => {
								openToCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start">
								<Image src={swapToCur.logo} alt={swapToCur.Symbol} width={20} height={20} className=" mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 montrealBold pt-1">{swapToCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>
					<p className="text-base pangramMedium text-gray-500 pt-3">
						Balance: {(Number(toTokenBalance.data) / 1e18).toFixed(2)} {swapToCur.Symbol}
					</p>
				</div>
				<div className="pt-2">
					<label className="inline-flex items-center space-x-2 cursor-pointer">
						<input type="checkbox" checked={isChecked} onChange={toggleCheckbox} className="form-checkbox h-5 w-5 text-blue-600" />
						<span className="text-gray-700">Use Fiat payment</span>
					</label>
				</div>
				<div className="h-fit w-full mt-6">
					<div className="w-full h-fit flex flex-row items-center justify-end gap-1 px-2 py-3 mb-3">
						{swapToCur.address == goerliAnfiIndexToken ? (
							<>
								{Number(fromTokenAllowance.data) / 1e18 < Number(firstInputValue) ? (
									<button onClick={approve} className="text-xl text-blackText-500 pangramMedium bg-blue-200 w-full px-2 py-3 rounded cursor-pointer hover:bg-colorTwo-500/30">
										Approve
									</button>
								) : (
									<button onClick={mintRequest} className="text-xl text-blackText-500 pangramMedium bg-colorOne-500 w-full px-2 py-3 rounded cursor-pointer hover:bg-colorTwo-500/30">
										Mint
									</button>
								)}
							</>
						) : (
							<button onClick={burnRequest} className="text-xl text-blackText-500 pangramMedium bg-colorOne-500 w-full px-2 py-3 rounded cursor-pointer hover:bg-colorTwo-500/30">
								Burn
							</button>
						)}
						{/* <p className="text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">HALF</p>
							<p className="text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">MAX</p> */}
					</div>
					{/* <div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangramMedium text-black/70 pb-2">Gas Fees</p>
						<p className="text-sm pangramLight text-black/70 pb-2">0.01 ETH</p>
					</div> */}
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangramMedium text-black/70 pb-2">Platform Fees</p>
						<div className="flex flex-row items-center justify-start gap-2">
							<p className="text-sm pangramLight text-black/70">{Number(firstInputValue) * 0.001} USD (0.1%)</p>
							<BsInfoCircle color="#2A2A2A" size={15} className="cursor-pointer"></BsInfoCircle>
						</div>
					</div>
					{/* <div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangramMedium text-black/70 pb-2">Total Transaction Cost</p>
						<p className="text-sm pangramLight text-black/70 pb-2">0.02 ETH</p>
					</div> */}
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
											<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
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
											<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
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
			<GenericModal isOpen={cookingModalVisible} onRequestClose={()=>{setCookingModalVisible(false)}}>
				<div className="w-full h-fit px-2 flex flex-col items-center justify-center">
					<Lottie
						animationData={cookingAnimation}
						loop={true}
						style={{
							height: 200,
							width: 400,
							overflow: 'hidden',
						}}
					/>
					<h5 className='montrealBold text-blackText-500 text-2xl text-center w-full -mt-6'>THE MAGIC IS HAPPENING...</h5>
					<h5 className='montreal text-blackText-500 text-lg text-center w-9/12 my-2'>Your NFT receipt is being minted. Once it is ready, you can find it the {"\""}Receipts{"\""} section.</h5>
				</div>
			</GenericModal>
		</>
	)
}

export default Swap
