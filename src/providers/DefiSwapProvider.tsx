import React, { createContext, useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import Big from 'big.js';
// Store
import useTradePageStore from '@/store/tradeStore'
import { UseContractResult, useAddress, useContract, useContractRead, useContractWrite, useSigner } from '@thirdweb-dev/react'
import {
	sepoliaCrypto5V2Factory,
	sepoliaUsdtAddress,
	sepoliaWethAddress,
	sepoliaTokenFaucet,
	sepoliaMAG7IndexTokenAddress,
	sepoliaMag7Factory,
	sepoliaMag7FactoryStorage,
	sepoliaAnfiV2Factory,
	sepoliaArbeiIndexFactoryAddress,
} from '@/constants/contractAddresses'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi, stockFactoryABI, stockFactoryStorageABI, tokenAbi, tokenFaucetAbi } from '@/constants/abi'
import { toast } from 'react-toastify'
import { SmartContract } from '@thirdweb-dev/sdk'
import { BigNumber } from 'alchemy-sdk'
import { GenericToast } from '@/components/GenericToast'
import { createPublicClient, http, parseEther, zeroAddress } from 'viem'
import { FormatToViewNumber, formatNumber, num, numToWei, weiToNum } from '@/hooks/math'
import { ethers } from 'ethers'
import { GetCrossChainPortfolioBalance } from '@/hooks/getCrossChainPortfolioBalance'
import { sepolia } from 'viem/chains'
import { GetDefiPortfolioBalance } from '@/hooks/getDefiPortfolioBalance'
import { getNewCrossChainPortfolioBalance } from '@/hooks/getNewCrossChainPortfolioBalance'
import { useRouter } from 'next/router'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { Coin } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'
import { parseUnits } from 'ethers/lib/utils'
import { useHistory } from './HistoryProvider'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetPositionsHistoryCrossChain } from '@/hooks/getPositiontHistoryCrosschain'
import { GetPositionsHistoryStock } from '@/hooks/getPositiontHistoryStock'
import { getClient } from '@/app/api/client'

interface DeFiSwapContextProps {
	isPaymentModalOpen: boolean
	isChecked: boolean
	firstInputValue: string
	secondInputValue: string
	cookingModalVisible: boolean
	userEthBalance: number
	from1UsdPrice: number
	fromConvertedPrice: number
	to1UsdPrice: number
	toConvertedPrice: number
	coinsList: Coin[]
	loadingTokens: boolean
	currentArrayId: number
	mergedCoinList: Coin[][]
	mintFactoryContract: UseContractResult | null
	burnFactoryContract: UseContractResult | null
	faucetContract: UseContractResult | null
	fromTokenContract: UseContractResult<SmartContract<ethers.BaseContract>> | null
	toTokenContract: UseContractResult<SmartContract<ethers.BaseContract>> | null
	fromTokenBalance: any
	toTokenBalance: any
	fromTokenTotalSupply: any
	toTokenTotalSupply: any
	fromTokenAllowance: any
	approveHook: any
	mintRequestHook: any
	mintRequestEthHook: any
	burnRequestHook: any
	faucetHook: any
	feeRate: number
	setFirstInputValue: React.Dispatch<React.SetStateAction<string>>
	setSecondInputValue: React.Dispatch<React.SetStateAction<string>>
	setCookingModalVisible: React.Dispatch<React.SetStateAction<boolean>>
	toggleCheckbox: () => void
	toggleMainnetCheckbox: () => void
	openPaymentModal: () => void
	closePaymentModal: () => void
	openFromCurrencyModal: () => void
	closeFromCurrencyModal: () => void
	openToCurrencyModal: () => void
	closeToCurrencyModal: () => void
	openFromCurrencySheet: () => void
	closeFromCurrencySheet: () => void
	openToCurrencySheet: () => void
	closeToCurrencySheet: () => void
	fetchAllLiFiTokens: () => Promise<Coin[]>
	Switching(): void
	formatResult: (item: Coin) => JSX.Element
	changeFirstInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void
	changeSecondInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void
	getPrimaryBalance(): string | number
	getSecondaryBalance(): string | number
	approve(): Promise<void>
	mintRequest(): Promise<void>
	mintRequestTokens(): Promise<void>
	mintRequestEth(): Promise<void>
	burnRequest(): Promise<void>
	faucet(): Promise<void>
}

const DeFiSwapContext = createContext<DeFiSwapContextProps>({
	isPaymentModalOpen: false,
	isChecked: false,
	firstInputValue: '0',
	secondInputValue: '0',
	cookingModalVisible: false,
	userEthBalance: 0,
	from1UsdPrice: 0,
	fromConvertedPrice: 0,
	to1UsdPrice: 0,
	toConvertedPrice: 0,
	coinsList: [],
	loadingTokens: true,
	currentArrayId: 0,
	mergedCoinList: [],
	mintFactoryContract: null,
	burnFactoryContract: null,
	faucetContract: null,
	fromTokenContract: null,
	toTokenContract: null,
	fromTokenBalance: 0,
	toTokenBalance: 0,
	fromTokenTotalSupply: 0,
	toTokenTotalSupply: 0,
	fromTokenAllowance: 0,
	approveHook: 0,
	mintRequestHook: 0,
	mintRequestEthHook: 0,
	burnRequestHook: 0,
	faucetHook: 0,
	feeRate: 0,
	setFirstInputValue: () => {},
	setSecondInputValue: () => {},
	setCookingModalVisible: () => {},
	toggleCheckbox: () => {},
	toggleMainnetCheckbox: () => {},
	openPaymentModal: () => {},
	closePaymentModal: () => {},
	openFromCurrencyModal: () => {},
	closeFromCurrencyModal: () => {},
	openToCurrencyModal: () => {},
	closeToCurrencyModal: () => {},
	openFromCurrencySheet: () => {},
	closeFromCurrencySheet: () => {},
	openToCurrencySheet: () => {},
	closeToCurrencySheet: () => {},
	fetchAllLiFiTokens: () => Promise.resolve([]),
	Switching: () => {},
	formatResult: () => {
		return <></>
	},
	changeFirstInputValue: () => {},
	changeSecondInputValue: () => {},
	getPrimaryBalance: () => '',
	getSecondaryBalance: () => '',
	approve: () => Promise.resolve(),
	mintRequest: () => Promise.resolve(),
	mintRequestTokens: () => Promise.resolve(),
	mintRequestEth: () => Promise.resolve(),
	burnRequest: () => Promise.resolve(),
	faucet: () => Promise.resolve(),
})

const useDeFiSwap = () => {
	return useContext(DeFiSwapContext)
}

const DeFiSwapProvider = ({ children }: { children: React.ReactNode }) => {
	const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)
	const [isChecked, setChecked] = useState(false)
	const [firstInputValue, setFirstInputValue] = useState('0')
	const [secondInputValue, setSecondInputValue] = useState('0')
	const [cookingModalVisible, setCookingModalVisible] = useState(false)
	const [userEthBalance, setUserEthBalance] = useState(0)
	const [from1UsdPrice, setFrom1UsdPrice] = useState(0)
	const [fromConvertedPrice, setFromConvertedPrice] = useState(0)
	const [to1UsdPrice, setTo1UsdPrice] = useState(0)
	const [toConvertedPrice, setToConvertedPrice] = useState(0)
	const [coinsList, setCoinsList] = useState<Coin[]>([])
	const [loadingTokens, setLoadingTokens] = useState(true)
	const [currentArrayId, setCurrentArrayId] = useState(0)
	const [currentPortfolioValue, setCurrentPortfolioBalance] = useState(0)
	const [feeRate, setFeeRate] = useState(0)
	const [mergedCoinList, setMergedCoinList] = useState<Coin[][]>([[], []])
	const {
		isFromCurrencyModalOpen,
		isToCurrencyModalOpen,
		setFromCurrencyModalOpen,
		setToCurrencyModalOpen,
		isFromCurrencySheetOpen,
		isToCurrencySheetOpen,
		setFromCurrencySheetOpen,
		setToCurrencySheetOpen,
		changeSwapFromCur,
		changeSwapToCur,
		swapFromCur,
		swapToCur,
		setTradeTableReload,
		setEthPriceInUsd,
		ethPriceInUsd,
		isMainnet,
		setIsmainnet,
	} = useTradePageStore()

	const sepoliaPublicClient = getClient('sepolia')

	const feeRateFactoryContracts:{[key:string]: `0x${string}`} = {
		'ANFI': sepoliaAnfiV2Factory,
		'CRYPTO5' : sepoliaCrypto5V2Factory,
		'ARBEI' : sepoliaArbeiIndexFactoryAddress,
		'MAG7' : sepoliaMag7FactoryStorage
	}

	const address = useAddress()
	const signer = useSigner()
	const router = useRouter()
	const query = router.query

	useEffect(() => {
		const selectedCoin = query.index || 'ANFI'
		const coinDetails = sepoliaTokens.filter((coin: Coin) => {
			return coin.Symbol === selectedCoin
		})
		changeSwapToCur(coinDetails[0])
	}, [query.index])

	const mintFactoryContract: UseContractResult = useContract(
		swapToCur.factoryAddress,
		swapToCur.indexType === 'defi' ? indexFactoryV2Abi : swapToCur.indexType === 'stock' ? stockFactoryABI : crossChainIndexFactoryV2Abi
	)
	const burnFactoryContract: UseContractResult = useContract(
		swapFromCur.factoryAddress,
		swapFromCur.indexType === 'defi' ? indexFactoryV2Abi : swapFromCur.indexType === 'stock' ? stockFactoryABI : crossChainIndexFactoryV2Abi
	)
	const faucetContract: UseContractResult = useContract(sepoliaTokenFaucet, tokenFaucetAbi)
	const fromTokenContract = useContract(swapFromCur.address, tokenAbi)
	const toTokenContract = useContract(swapToCur.address, tokenAbi)
	const fromTokenBalance = useContractRead(fromTokenContract.contract, 'balanceOf', [address])
	const toTokenBalance = useContractRead(toTokenContract.contract, 'balanceOf', [address])
	const fromTokenTotalSupply = useContractRead(fromTokenContract.contract, 'totalSupply', [])
	const toTokenTotalSupply = useContractRead(toTokenContract.contract, 'totalSupply', [])
	const fromTokenAllowance = useContractRead(fromTokenContract.contract, 'allowance', [address, swapToCur.factoryAddress])
	const approveHook = useContractWrite(fromTokenContract.contract, 'approve')
	const mintRequestHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokens')
	const mintRequestEthHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokensWithEth')
	const burnRequestHook = useContractWrite(burnFactoryContract.contract, 'redemption')
	const faucetHook = useContractWrite(faucetContract.contract, 'getToken')
	const crossChainPortfolioValue = GetCrossChainPortfolioBalance()
	const defiPortfolioValue = GetDefiPortfolioBalance()

	useEffect(()=>{

		async function getFeeRate(){

			const activeSymbol = swapFromCur.isNexlabToken ? swapFromCur.Symbol : swapToCur.Symbol
			const feeRate = await sepoliaPublicClient.readContract({
				address: feeRateFactoryContracts[activeSymbol],
				abi: stockFactoryStorageABI,
				functionName: 'feeRate',
				args: [],
			})

			setFeeRate(Number(feeRate)/10000)			
		}

		getFeeRate()
			
	},[swapFromCur, swapToCur])


	useEffect(() => {
		const currentPortfolioValue = swapToCur.indexType === 'defi' || swapFromCur.indexType === 'defi' ? defiPortfolioValue.data : (crossChainPortfolioValue.data as number)
		setCurrentPortfolioBalance(currentPortfolioValue as number)
	}, [crossChainPortfolioValue.data, defiPortfolioValue.data, swapToCur.indexType, swapFromCur.indexType])

	useEffect(() => {
		async function getIssuanceOutput2() {
			try {
				const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0
				if (swapToCur.hasOwnProperty('indexType')) {
					const currentTotalSupply = Number(toTokenTotalSupply.data)
					let inputValue
					if (swapFromCur.address == sepoliaWethAddress) {
						inputValue = Number(firstInputValue) * 1e18
					} else {						
						if (swapToCur.indexType === 'stock') {
							const outAmount = await sepoliaPublicClient.readContract({
								address: sepoliaMag7FactoryStorage,
								abi: stockFactoryStorageABI,
								functionName: 'getIssuanceAmountOut',
								args: [numToWei(firstInputValue, swapFromCur.decimals)],
							})
							setSecondInputValue(weiToNum(outAmount, swapFromCur.decimals).toFixed(2))
						} else if (convertedInputValue) {
							const inputEthValue = await sepoliaPublicClient.readContract({
								address: sepoliaCrypto5V2Factory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'getAmountOut',
								args: [swapFromCur.address, sepoliaWethAddress, convertedInputValue, 3],
							})

							inputValue = Number(inputEthValue)

							let newPortfolioValue: number = 0
							if (swapToCur.indexType === 'crosschain') {
								newPortfolioValue = await getNewCrossChainPortfolioBalance(Number(currentPortfolioValue), Number(inputValue))
							} else {
								newPortfolioValue = Number(currentPortfolioValue) + Number(inputValue)
							}
							const newTotalSupply = (currentTotalSupply * newPortfolioValue) / Number(currentPortfolioValue)
							const amountToMint = newTotalSupply - currentTotalSupply							
							setSecondInputValue(num(amountToMint).toString())
						}
					}
				}
			} catch (error) {
				console.log('getIssuanceOutput error:', error)
			}
		}
		getIssuanceOutput2()
	}, [firstInputValue, swapFromCur.address, swapToCur.address, toTokenTotalSupply.data, swapToCur.factoryAddress, defiPortfolioValue.data, crossChainPortfolioValue.data])

	useEffect(() => {
		async function getRedemptionOutput2() {
			try {
				if (swapFromCur.hasOwnProperty('indexType')) {
					const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0
					let outputValue					
					const currentTotalSupply = Number(fromTokenTotalSupply.data)
					const newTotalSupply = currentTotalSupply - Number(convertedInputValue)
					const newPortfolioValue = (Number(currentPortfolioValue) * newTotalSupply) / currentTotalSupply
					const ethAmountOut = (Number(currentPortfolioValue) - newPortfolioValue) * 0.999
					if (swapToCur.address == sepoliaWethAddress) {
						outputValue = ethAmountOut
					} else {
						if (swapFromCur.indexType === 'stock') {
							const outAmount = await sepoliaPublicClient.readContract({
								address: sepoliaMag7FactoryStorage,
								abi: stockFactoryStorageABI,
								functionName: 'getRedemptionAmountOut',
								args: [parseEther(firstInputValue)],
							})

							setSecondInputValue(weiToNum(outAmount, swapFromCur.decimals).toString())
						} else {
							const outPutTokenValue = await sepoliaPublicClient.readContract({
								address: sepoliaCrypto5V2Factory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'getAmountOut',
								args: [sepoliaWethAddress, swapToCur.address, ethAmountOut.toFixed(0), 3],
							})
							outputValue = Number(outPutTokenValue)
							setSecondInputValue(weiToNum(outputValue, swapToCur.decimals).toString())
						}
					}
				}
			} catch (error) {
				console.log('getRedemptionOutput error:', error)
			}
		}
		getRedemptionOutput2()
	}, [firstInputValue, swapFromCur.address, swapToCur.address, swapFromCur.factoryAddress])

	async function fetchData(tokenDetails: Coin, place: string) {
		try {
			const price = await convertToUSD({ tokenAddress: tokenDetails.address, tokenDecimals: tokenDetails.decimals }, ethPriceInUsd, isMainnet)
			return price as number
		} catch (err) {
			console.error(`Error fetching ${place} price:`, err)
			throw err // Rethrow the error for consistent error handling
		}
	}

	async function fetchTokenPrices() {
		try {
			const [fromPrice, toPrice] = await Promise.all([
				swapFromCur.Symbol !== 'WETH' && swapFromCur.Symbol !== 'ETH' ? fetchData(swapFromCur, 'From') : ethPriceInUsd,
				swapToCur.Symbol !== 'WETH' && swapToCur.Symbol !== 'ETH' ? fetchData(swapToCur, 'To') : ethPriceInUsd,
			])
			setFrom1UsdPrice(fromPrice)
			setTo1UsdPrice(toPrice)
		} catch (error) {
			// Handle errors if needed
			console.error('Error fetching token prices:', error)
		}
	}

	// Call fetchTokenPrices when needed
	useEffect(() => {
		fetchTokenPrices()
	}, [swapFromCur, swapToCur, ethPriceInUsd, isMainnet])

	useEffect(() => {
		if (approveHook.isSuccess) {
			fromTokenAllowance.refetch()
			approveHook.reset()
		}
	}, [approveHook.isSuccess, approveHook, fromTokenAllowance])

	useEffect(() => {
		if (mintRequestHook.isSuccess || burnRequestHook.isSuccess) {
			setTradeTableReload(true)
			mintRequestHook.reset()
			burnRequestHook.reset()
		}
	}, [mintRequestHook, burnRequestHook, setTradeTableReload])

	useEffect(() => {
		if (faucetHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Receiving usdt...',
			})
		} else if (faucetHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'You received 1000 usdt Successfully!',
			})
		} else if (faucetHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Receiving Failed!`,
			})
		}
	}, [faucetHook.isLoading, faucetHook.isSuccess, faucetHook.isError])

	useEffect(() => {
		if (approveHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Approving...',
			})
		} else if (approveHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Approved Successfully!',
			})
		} else if (approveHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Approving Failed!`,
			})
		}
	}, [approveHook.isLoading, approveHook.isSuccess, approveHook.isError])

	useEffect(() => {
		if (mintRequestHook.isLoading || mintRequestEthHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Sending Request ...',
			})
		} else if (mintRequestHook.isSuccess || mintRequestEthHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Sent Request Successfully!',
			})
		} else if (mintRequestHook.isError || mintRequestEthHook.isError) {
			toast.dismiss()
			console.log(mintRequestHook.error)
			GenericToast({
				type: 'error',
				message: `Sending Request Failed!`,
			})
		}
	}, [mintRequestHook.isLoading, mintRequestEthHook.isLoading, mintRequestHook.isSuccess, mintRequestEthHook.isSuccess, mintRequestHook.isError, mintRequestEthHook.isError])

	useEffect(() => {
		if (burnRequestHook.isLoading) {
			toast.dismiss()

			GenericToast({
				type: 'loading',
				message: 'Sending Request ...',
			})
		} else if (burnRequestHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Sent Request Successfully!',
			})
		} else if (burnRequestHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: 'Sending Request Failed!',
			})
		}
	}, [burnRequestHook.isLoading, burnRequestHook.isSuccess, burnRequestHook.isError])

	const toggleCheckbox = () => {
		setChecked(!isChecked)
	}

	const toggleMainnetCheckbox = () => {
		setIsmainnet(!isMainnet)
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

	const openFromCurrencySheet = () => {
		setFromCurrencySheetOpen(true)
	}

	const closeFromCurrencySheet = () => {
		setFromCurrencySheetOpen(false)
	}

	const openToCurrencySheet = () => {
		setToCurrencySheetOpen(true)
	}

	const closeToCurrencySheet = () => {
		setToCurrencySheetOpen(false)
	}

	const fetchAllLiFiTokens = async () => {
		const options = {
			method: 'GET',
			headers: { accept: 'application/json' },
		}
		try {
			const response = await fetch(`https://li.quest/v1/tokens`, options)
			const data = await response.json()

			const tokenSets = data.tokens
			const coins: Coin[] = Object.keys(tokenSets).flatMap((key) => {
				const tokenSet = tokenSets[key]
				return tokenSet.map((coin: { address: any; logoURI: any; name: any; symbol: any; decimals: any }) => ({
					id: coin.address,
					logo: coin.logoURI && coin.logoURI != '' ? coin.logoURI : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkV1AbgRiM148jZcCVDvdFhjx_vfKVS055A&usqp=CAU',
					name: coin.name,
					Symbol: coin.symbol,
					address: coin.address,
					factoryAddress: '',
					decimals: coin.decimals,
				}))
			})
			return coins
		} catch (error) {
			console.error(error)
			return [] // Ensure a value is returned even in case of an error
		}
	}

	function chunkArray<T>(array: T[], chunkSize: number): T[][] {
		const chunks: T[][] = []
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize))
		}
		return chunks
	}

	useEffect(() => {
		const fetchData = async () => {
			const initialCoins = await fetchAllLiFiTokens()
			const dividedArrays = chunkArray(initialCoins, 100)
			// setAllCoinsList(dividedArrays)
			setCoinsList(dividedArrays[currentArrayId])
			setLoadingTokens(false)
		}

		fetchData()
	}, [currentArrayId])

	useEffect(() => {
		const finalCoinList = isMainnet ? coinsList : (sepoliaTokens as Coin[])
		const OurIndexCoinList: Coin[] = finalCoinList.filter((coin) => coin.isNexlabToken)
		let OtherCoinList: Coin[] = finalCoinList.filter((coin) => !coin.isNexlabToken)

		if (swapToCur.Symbol === 'MAG7' || swapFromCur.Symbol === ' MAG7') {
			OtherCoinList = OtherCoinList.filter((coin) => {
				return coin.Symbol !== 'USDT'
			})
			const usdcDetails = OtherCoinList.filter((coin) => {
				return coin.Symbol === 'USDC'
			})[0]
			const usdtDetails = OtherCoinList.filter((coin) => {
				return coin.Symbol === 'USDT'
			})[0]
			if (swapToCur.Symbol === 'MAG7') {
				changeSwapFromCur(usdcDetails)
			} else {
				changeSwapFromCur(usdtDetails)
			}

			// if (swapFromCur.Symbol === 'MAG7') {
			// 	changeSwapToCur(usdcDetails)
			// } else {
			// 	changeSwapToCur(usdtDetails)
			// }
		}
		setMergedCoinList([OtherCoinList, OurIndexCoinList])
	}, [isMainnet, swapToCur.Symbol, swapFromCur.Symbol])

	function Switching() {
		let switchReserve: Coin = swapFromCur
		changeSwapFromCur(swapToCur)
		changeSwapToCur(switchReserve)
		if (switchReserve.isNexlabToken) {
			if (mergedCoinList[0].some((obj) => obj.isNexlabToken)) {
				const newArray = [mergedCoinList[1], mergedCoinList[0]]
				setMergedCoinList(newArray)
			} else {
				const newArray = [mergedCoinList[0], mergedCoinList[1]]
				setMergedCoinList(newArray)
			}
		} else {
			if (mergedCoinList[0].some((obj) => obj.isNexlabToken)) {
				const newArray = [mergedCoinList[0], mergedCoinList[1]]
				setMergedCoinList(newArray)
			} else {
				const newArray = [mergedCoinList[1], mergedCoinList[0]]
				setMergedCoinList(newArray)
			}
		}
		setSecondInputValue(firstInputValue)
	}

	const formatResult = (item: Coin) => {
		return (
			<div className="w-full h-10 cursor-pointer flex flex-row items-center justify-between px-2 py-1">
				<div className="flex flex-row items-center justify-start gap-2">
					<Image src={item.logo} alt={item.name} width={15} height={15} className=" aspect-square scale-150" />
					<h5 className="text-base text-blackText-500 pangram">{item.Symbol}</h5>
				</div>
				<h5 className="text-base text-gray-300 montrealBoldItalic">{item.Symbol}</h5>
			</div>
		)
	}

	const changeFirstInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const enteredValue = e?.target?.value
		if (Number(enteredValue) != 0 && Number(enteredValue) < 0.00001) {
			GenericToast({
				type: 'error',
				message: 'Please enter the input value greater than this value...',
			})
			return
		}
		setFirstInputValue(e?.target?.value)
	}

	useEffect(() => {
		const fromNewPrice = Number(firstInputValue) * Number(from1UsdPrice)
		setFromConvertedPrice(fromNewPrice)
	}, [from1UsdPrice, firstInputValue, secondInputValue, to1UsdPrice])

	useEffect(() => {
		const toNewPrice = Number(secondInputValue) * Number(to1UsdPrice)
		setToConvertedPrice(toNewPrice)
	}, [secondInputValue, to1UsdPrice])

	useEffect(() => {
		const convertedAmout = (Number(from1UsdPrice) / Number(to1UsdPrice)) * Number(firstInputValue)
		if (isMainnet) {
			setSecondInputValue(convertedAmout.toString())
		}
	}, [from1UsdPrice, to1UsdPrice, firstInputValue, isMainnet])

	const changeSecondInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSecondInputValue(e?.target?.value)
	}

	function getPrimaryBalance() {
		if (swapFromCur.address == sepoliaWethAddress) {
			// return (Number(userEthBalance) / 1e18).toFixed(2)
			if (!userEthBalance) {
				return 0
			} else
				return FormatToViewNumber({
					// value: Number((userEthBalance))/1e18,
					value: Number(ethers.utils.formatEther(userEthBalance.toString())) as number,
					returnType: 'string',
				})
		} else {
			if (!fromTokenBalance.data) {
				return 0
			} else {
				const bal = FormatToViewNumber({
					value: Number(fromTokenBalance.data / Number(`1e${swapFromCur.decimals}`)) as number,
					returnType: 'string',
				}).toString()
				const balWithoutComma = bal.includes(',') ? bal.split(',').join('') : bal
				return balWithoutComma
			}
		}
	}

	function getSecondaryBalance() {
		if (swapToCur.address == sepoliaWethAddress) {
			// return (Number(userEthBalance) / 1e18).toFixed(2)
			if (!userEthBalance) {
				return 0
			} else
				return FormatToViewNumber({
					// value: Number((userEthBalance))/1e18,
					value: parseFloat(ethers.utils.formatEther(userEthBalance.toString())) as number,
					returnType: 'string',
				})
		} else {
			// return (Number(toTokenBalance.data) / 1e18).toFixed(2)
			if (!toTokenBalance.data) {
				return 0
			} else
				return FormatToViewNumber({
					// value: Number((userEthBalance))/1e18,
					// value: parseFloat(ethers.utils.formatEther(toTokenBalance.data)) as number,
					value: Number(toTokenBalance.data / Number(`1e${swapToCur.decimals}`)) as number,
					returnType: 'string',
				})
		}
	}

	useEffect(() => {
		const getEtherBalance = async () => {
			if (address && signer) {
				const balance = await signer?.provider?.getBalance(address as string)
				const convertedBalance = ethers.utils.formatEther(balance as BigNumber)
				// console.log('Balance converted', convertedBalance)
				setUserEthBalance(Number(balance))
			}
		}
		getEtherBalance()
	}, [signer, address])

	async function approve() {
		if (swapToCur.address == zeroAddress) {
			return GenericToast({ type: 'info', message: 'Index will be live for trading soon, Stay Tuned!' })
		}

		let dinariFeeAmount = 0
		if (swapToCur.indexType === 'stock') {
			const feeAmountBigNumber = (await sepoliaPublicClient.readContract({
				address: sepoliaMag7FactoryStorage,
				abi: stockFactoryStorageABI,
				functionName: 'calculateIssuanceFee',
				args: [numToWei(firstInputValue, swapFromCur.decimals)],
			})) as BigNumber

			dinariFeeAmount = weiToNum(feeAmountBigNumber, swapFromCur.decimals)
		}

		const firstInputValueNum = new Big(firstInputValue);
		const result = firstInputValueNum.times(1.001).plus(dinariFeeAmount);
		const valueWithCorrectDecimals = result.toFixed(swapFromCur.decimals);

		// Ensure the number has at most swapFromCur.decimals decimal places
		// const valueWithCorrectDecimals = (Number(firstInputValue) * 1.001 + dinariFeeAmount).toFixed(swapFromCur.decimals)

		// Convert to BigNumber using parseUnits
		const convertedValue = parseUnits(valueWithCorrectDecimals, swapFromCur.decimals)		

		try {
			if (isChecked) {
				openPaymentModal()
			} else {
				if (weiToNum(fromTokenBalance.data, swapFromCur.decimals) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to approve`,
					})
				} else if (Number(firstInputValue) <= 15 && swapToCur.indexType === 'stock') {
					return GenericToast({
						type: 'error',
						message: `Please enter amount greater than $15`,
					})
				}
				await approveHook.mutateAsync({ args: [swapToCur.factoryAddress, BigInt(convertedValue.toString())] })
			}
		} catch (error) {
			console.log('approve error', error)
		}
	}

	async function mintRequest() {
		if (swapToCur.address == zeroAddress) {
			return GenericToast({ type: 'info', message: 'Index will be live for trading soon, Stay Tuned!' })
		}

		if (swapFromCur.address == sepoliaWethAddress) {
			mintRequestEth()
		} else {
			mintRequestTokens()
		}
	}

	async function mintRequestTokens() {
		try {
			if (isChecked) {
				openPaymentModal()
			} else {				
				if (weiToNum(fromTokenBalance.data, swapFromCur.decimals) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to mint`,
					})
				} else if ((Number(firstInputValue) <= 15) && (swapToCur.indexType === 'stock')) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount greater than $15`,
					})
				}
				if (swapToCur.indexType === 'defi') {
					await mintRequestHook.mutateAsync({
						args: [swapFromCur.address, parseEther(Number(firstInputValue).toString()), '3'],
						overrides: {
							gasLimit: 2000000,
						},
					})
				} else if (swapToCur.indexType === 'stock') {
					await mintRequestHook.mutateAsync({
						args: [parseUnits(Number(firstInputValue).toString(), swapFromCur.decimals).toString()],
						overrides: {
							gasLimit: 5000000,
						},
					})
				} else {
					await mintRequestHook.mutateAsync({
						// args: [swapFromCur.address, (Number(firstInputValue) * 1e18).toString(), '0', '3'],
						args: [swapFromCur.address, parseEther(Number(firstInputValue).toString()), '0', '3'],
						overrides: {
							gasLimit: 3000000,
						},
					})
				}
			}
		} catch (error) {
			console.log('mint error', error)
		}
	}

	async function mintRequestEth() {
		try {
			const firstConvertedValue = parseEther(Number(firstInputValue).toString() as string)
			const convertedValue = parseEther(((Number(firstInputValue) * 1001) / 1000).toString() as string)
			if (isChecked) {
				openPaymentModal()
			} else {
				if (num(userEthBalance) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to mint`,
					})
				}
				if (swapToCur.indexType === 'defi') {
					await mintRequestEthHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString()],
						args: [parseEther(Number(firstInputValue).toString())],
						overrides: {
							gasLimit: 2000000,
							value: convertedValue,
						},
					})
				} else {
					await mintRequestEthHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString(), '0'],
						args: [parseEther(Number(firstInputValue).toString()), '0'],
						overrides: {
							gasLimit: 3000000,
							value: convertedValue,
						},
					})
				}
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
				if (weiToNum(fromTokenBalance.data, swapFromCur.decimals) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to burn`,
					})
				} else if ((Number(secondInputValue) <= 15) && (swapFromCur.indexType === 'stock')) {
					return GenericToast({
						type: 'error',
						message: `Minimum USDC that you can get is $15`,
					})
				}
				if (swapFromCur.indexType === 'defi') {
					await burnRequestHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString(), swapToCur.address, '3'],
						// args: [parseEther(Number(firstInputValue).toString()), swapFromCur.address, '3'],
						args: [parseEther(Number(firstInputValue).toString()), swapToCur.address, '3'],
						overrides: {
							gasLimit: 2000000,
						},
					})
				} else if (swapFromCur.indexType === 'stock') {
					await burnRequestHook.mutateAsync({
						args: [parseUnits(Number(firstInputValue).toString(), swapFromCur.decimals).toString()],
						overrides: {
							gasLimit: 5000000,
						},
					})
				} else {
					await burnRequestHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString(), '0', swapToCur.address, '3'],
						args: [parseEther(Number(firstInputValue).toString()), '0', swapFromCur.address, '3'],
						overrides: {
							gasLimit: 3000000,
						},
					})
				}
			}
		} catch (error) {
			console.log('burn error', error)
		}
	}

	async function faucet() {
		if (address) {
			try {
				await faucetHook.mutateAsync({ args: [sepoliaUsdtAddress] })
			} catch (error) {
				console.log('faucet error', error)
			}
		}
	}

	const contextValue = {
		isPaymentModalOpen: isPaymentModalOpen,
		isChecked: isChecked,
		firstInputValue: firstInputValue,
		secondInputValue: secondInputValue,
		cookingModalVisible: cookingModalVisible,
		userEthBalance: userEthBalance,
		from1UsdPrice: from1UsdPrice,
		fromConvertedPrice: fromConvertedPrice,
		to1UsdPrice: to1UsdPrice,
		toConvertedPrice: toConvertedPrice,
		coinsList: coinsList,
		loadingTokens: loadingTokens,
		currentArrayId: currentArrayId,
		mergedCoinList: mergedCoinList,
		mintFactoryContract: mintFactoryContract,
		burnFactoryContract: burnFactoryContract,
		faucetContract: faucetContract,
		fromTokenContract: fromTokenContract,
		toTokenContract: toTokenContract,
		fromTokenBalance: fromTokenBalance,
		toTokenBalance: toTokenBalance,
		fromTokenTotalSupply: fromTokenTotalSupply,
		toTokenTotalSupply: toTokenTotalSupply,
		fromTokenAllowance: fromTokenAllowance,
		approveHook: approveHook,
		mintRequestHook: mintRequestEthHook,
		mintRequestEthHook: mintRequestEthHook,
		burnRequestHook: burnRequestHook,
		faucetHook: faucetHook,
		feeRate: feeRate,
		setFirstInputValue: setFirstInputValue,
		setSecondInputValue: setSecondInputValue,
		setCookingModalVisible: setCookingModalVisible,
		toggleCheckbox: toggleCheckbox,
		toggleMainnetCheckbox: toggleMainnetCheckbox,
		openPaymentModal: openPaymentModal,
		closePaymentModal: closePaymentModal,
		openFromCurrencyModal: openFromCurrencyModal,
		closeFromCurrencyModal: closeFromCurrencyModal,
		openToCurrencyModal: openToCurrencyModal,
		closeToCurrencyModal: closeToCurrencyModal,
		openFromCurrencySheet: openFromCurrencySheet,
		closeFromCurrencySheet: closeFromCurrencySheet,
		openToCurrencySheet: openToCurrencySheet,
		closeToCurrencySheet: closeToCurrencySheet,
		fetchAllLiFiTokens: fetchAllLiFiTokens,
		Switching: Switching,
		formatResult: formatResult,
		changeFirstInputValue: changeFirstInputValue,
		changeSecondInputValue: changeSecondInputValue,
		getPrimaryBalance: getPrimaryBalance,
		getSecondaryBalance: getSecondaryBalance,
		approve: approve,
		mintRequest: mintRequest,
		mintRequestTokens: mintRequestTokens,
		mintRequestEth: mintRequestEth,
		burnRequest: burnRequest,
		faucet: faucet,
	}

	return <DeFiSwapContext.Provider value={contextValue}>{children}</DeFiSwapContext.Provider>
}

export { DeFiSwapProvider, DeFiSwapContext, useDeFiSwap }
