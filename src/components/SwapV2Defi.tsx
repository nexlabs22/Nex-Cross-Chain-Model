// This is the DEFI swap component

'use client' // This is a client component 👈🏽

// basics :
import Image from 'next/image'
import { useEffect, useState } from 'react'

// icons :
import { BiSolidChevronDown } from 'react-icons/bi'
import { AiOutlineSwap } from 'react-icons/ai'

// Store
import useTradePageStore from '@/store/tradeStore'
import { useLandingPageStore } from '@/store/store'

// Components:
import GenericModal from './GenericModal'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

// Assets:
import mesh1 from '@assets/images/mesh1.png'
import { UseContractResult, toWei, useAddress, useContract, useContractRead, useContractWrite, useSigner } from '@thirdweb-dev/react'
import {
	sepoliaCrypto5V2IndexToken,
	sepoliaCrypto5V2Factory,
	sepoliaUsdtAddress,
	sepoliaWethAddress,
	sepoliaAnfiV2IndexToken,
	sepoliaAnfiV2Factory,
	sepoliaTokenFaucet,
} from '@/constants/contractAddresses'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi, tokenAbi, tokenFaucetAbi, uniswapV3PoolContractAbi } from '@/constants/abi'
import { toast } from 'react-toastify'
import PaymentModal from './PaymentModal'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'

import { BigNumber } from 'alchemy-sdk'

import { BsInfoCircle } from 'react-icons/bs'

import { GenericToast } from './GenericToast'
import { createPublicClient, http, parseEther } from 'viem'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { ethers } from 'ethers'
import { LiaWalletSolid } from 'react-icons/lia'
import Switch from 'react-switch'
import GenericTooltip from './GenericTooltip'
import { GetCrossChainPortfolioBalance } from '@/hooks/getCrossChainPortfolioBalance'
import { sepolia } from 'viem/chains'
import { GetDefiPortfolioBalance } from '@/hooks/getDefiPortfolioBalance'
import { getNewCrossChainPortfolioBalance } from '@/hooks/getNewCrossChainPortfolioBalance'
import { useRouter } from 'next/router'
import { GoArrowUpRight } from 'react-icons/go'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { Coin } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'

import { IOSSwitch, PWAProfileTextField } from "@/theme/overrides";
import { IoIosArrowBack } from "react-icons/io";
import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from 'next/link'
import Sheet from 'react-modal-sheet';

const SwapV2Defi = ({ initialStandalone = false }: { initialStandalone?: boolean }) => {

	const [isStandalone, setIsStandalone] = useState(initialStandalone);
	const [os, setOs] = useState<String>("")
	const [browser, setBrowser] = useState<String>("")

	function detectMobileBrowserOS() {
		const userAgent = navigator.userAgent;

		let browser: string | undefined;
		let os: string | undefined;

		browser = ""
		os = ""
		// Check for popular mobile browsers
		if (/CriOS/i.test(userAgent)) {
			browser = 'Chrome';
		} else if (/FxiOS/i.test(userAgent)) {
			browser = 'Firefox';
		} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
			browser = 'Safari';
		}

		// Check for common mobile operating systems
		if (/iP(ad|hone|od)/i.test(userAgent)) {
			os = 'iOS';
		} else if (/Android/i.test(userAgent)) {
			os = 'Android';
		}

		setOs(os.toString());
		setBrowser(browser.toString())
	}

	useEffect(() => {
		detectMobileBrowserOS()
	}, [])

	useEffect(() => {
		// Client-side detection using window.matchMedia (optional)
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(display-mode: standalone)');
			const handleChange = (event: MediaQueryListEvent) => setIsStandalone(event.matches);
			mediaQuery.addEventListener('change', handleChange);
			setIsStandalone(mediaQuery.matches); // Set initial client-side state
			//alert(mediaQuery.matches)
			return () => mediaQuery.removeEventListener('change', handleChange);
		}
	}, []);

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
	}, [])

	const mintFactoryContract: UseContractResult = useContract(swapToCur.factoryAddress, swapToCur.indexType === 'defi' ? indexFactoryV2Abi : crossChainIndexFactoryV2Abi)
	const burnFactoryContract: UseContractResult = useContract(swapFromCur.factoryAddress, swapFromCur.indexType === 'defi' ? indexFactoryV2Abi : crossChainIndexFactoryV2Abi)
	const faucetContract: UseContractResult = useContract(sepoliaTokenFaucet, tokenFaucetAbi)

	const fromTokenContract = useContract(swapFromCur.address, tokenAbi)
	const toTokenContract = useContract(swapToCur.address, tokenAbi)

	const fromTokenBalance = useContractRead(fromTokenContract.contract, 'balanceOf', [address])
	const toTokenBalance = useContractRead(toTokenContract.contract, 'balanceOf', [address])
	const fromTokenTotalSupply = useContractRead(fromTokenContract.contract, 'totalSupply', [])
	const toTokenTotalSupply = useContractRead(toTokenContract.contract, 'totalSupply', [])
	const fromTokenAllowance = useContractRead(fromTokenContract.contract, 'allowance', [address, swapToCur.factoryAddress])
	const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0

	const approveHook = useContractWrite(fromTokenContract.contract, 'approve')
	const mintRequestHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokens')
	const mintRequestEthHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokensWithEth')
	const burnRequestHook = useContractWrite(burnFactoryContract.contract, 'redemption')
	const faucetHook = useContractWrite(faucetContract.contract, 'getToken')

	const curr = swapFromCur.factoryAddress ? swapFromCur : swapToCur
	const IndexContract: UseContractResult = useContract(curr.factoryAddress, indexFactoryV2Abi)
	const feeRate = useContractRead(IndexContract.contract, 'feeRate').data / 10000

	const { mode } = useLandingPageStore()

	const crossChainPortfolioValue = GetCrossChainPortfolioBalance()
	const defiPortfolioValue = GetDefiPortfolioBalance()

	// useEffect(() => {
	// 	async function getIssuanceOutput() {
	// 		try {
	// 			if (swapToCur.address == sepoliaAnfiV2IndexToken && convertedInputValue) {
	// 				// const provider = new ethers.providers.JsonRpcBatchProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)
	// 				const provider = new ethers.providers.JsonRpcBatchProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
	// 				const issuanceContract = new ethers.Contract(swapToCur.factoryAddress, indexFactoryV2Abi, provider)
	// 				const output = await issuanceContract.callStatic.getIssuanceAmountOut2(convertedInputValue.toString(), swapFromCur.address, '3')

	// 				setSecondInputValue(num(output).toString())
	// 			}
	// 		} catch (error) {
	// 			// console.log('getIssuanceOutput error:', error)
	// 		}
	// 	}
	// 	// getIssuanceOutput()
	// }, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapToCur.factoryAddress])

	useEffect(() => {
		async function getIssuanceOutput2() {
			console.log('getIssuanceOutput2******************')
			try {
				if (swapToCur.hasOwnProperty('indexType') && convertedInputValue) {
					console.log('INSIDE ISSUANCE IF CLAUSE: ', swapToCur)
					const currentPortfolioValue = swapToCur.indexType === 'defi' ? defiPortfolioValue.data : crossChainPortfolioValue.data
					const currentTotalSupply = Number(toTokenTotalSupply.data)
					let inputValue
					if (swapFromCur.address == sepoliaWethAddress) {
						inputValue = Number(firstInputValue) * 1e18
					} else {
						const sepoliaPublicClient = createPublicClient({
							chain: sepolia,
							transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
						})
						const inputEthValue = await sepoliaPublicClient.readContract({
							address: sepoliaCrypto5V2Factory,
							abi: crossChainIndexFactoryV2Abi,
							functionName: 'getAmountOut',
							args: [swapFromCur.address, sepoliaWethAddress, convertedInputValue, 3],
						})
						inputValue = Number(inputEthValue)
					}
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
			} catch (error) {
				console.log('getIssuanceOutput error:', error)
			}
		}
		getIssuanceOutput2()
	}, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapToCur.factoryAddress])

	// useEffect(() => {
	// 	async function getRedemptionOutput() {
	// 		try {
	// 			if (swapFromCur.address == sepoliaAnfiV2IndexToken && convertedInputValue) {
	// 				const provider = new ethers.providers.JsonRpcBatchProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
	// 				const redemptionContract = new ethers.Contract(swapFromCur.factoryAddress, indexFactoryV2Abi, provider)
	// 				const output = await redemptionContract.callStatic.getRedemptionAmountOut2(convertedInputValue.toString(), swapToCur.address, '3')
	// 				setSecondInputValue(num(output).toString())
	// 			}
	// 		} catch (error) {
	// 			console.log('getRedemptionOutput error:', error)
	// 		}
	// 	}
	// 	// getRedemptionOutput()
	// }, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapFromCur.factoryAddress])

	useEffect(() => {
		async function getRedemptionOutput2() {
			console.log('getRedemptionOutput2------------------------------------')
			try {
				if (swapFromCur.hasOwnProperty('indexType') && convertedInputValue) {
					console.log('INSIDE REDEMPTION IF CLAUSE: ', swapFromCur)
					let outputValue
					const currentPortfolioValue = swapFromCur.indexType === 'defi' ? defiPortfolioValue.data : crossChainPortfolioValue.data
					const currentTotalSupply = Number(fromTokenTotalSupply.data)
					const newTotalSupply = currentTotalSupply - Number(convertedInputValue)
					const newPortfolioValue = (Number(currentPortfolioValue) * newTotalSupply) / currentTotalSupply
					const ethAmountOut = (Number(currentPortfolioValue) - newPortfolioValue) * 0.999
					if (swapToCur.address == sepoliaWethAddress) {
						outputValue = ethAmountOut
					} else {
						const sepoliaPublicClient = createPublicClient({
							chain: sepolia,
							// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
							transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
						})
						const outPutTokenValue = await sepoliaPublicClient.readContract({
							address: sepoliaCrypto5V2Factory,
							abi: crossChainIndexFactoryV2Abi,
							functionName: 'getAmountOut',
							args: [sepoliaWethAddress, swapToCur.address, ethAmountOut.toFixed(0), 3],
						})
						outputValue = Number(outPutTokenValue)
					}
					setSecondInputValue(num(outputValue).toString())
				}
			} catch (error) {
				console.log('getRedemptionOutput error:', error)
			}
		}
		getRedemptionOutput2()
	}, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapFromCur.factoryAddress])

	async function fetchData(tokenDetails: Coin, place: string) {
		try {
			const price = await convertToUSD({ tokenAddress: tokenDetails.address, tokenDecimals: tokenDetails.decimals }, ethPriceInUsd, isMainnet);
			return price as number;
		} catch (err) {
			console.error(`Error fetching ${place} price:`, err);
			throw err; // Rethrow the error for consistent error handling
		}
	}

	async function fetchTokenPrices() {
		try {
			const [fromPrice, toPrice] = await Promise.all([
				swapFromCur.Symbol !== 'WETH' && swapFromCur.Symbol !== 'ETH' ? fetchData(swapFromCur, 'From') : ethPriceInUsd,
				swapToCur.Symbol !== 'WETH' && swapToCur.Symbol !== 'ETH' ? fetchData(swapToCur, 'To') : ethPriceInUsd
			]);

			setFrom1UsdPrice(fromPrice);
			setTo1UsdPrice(toPrice);
		} catch (error) {
			// Handle errors if needed
			console.error('Error fetching token prices:', error);
		}
	}

	// Call fetchTokenPrices when needed
	useEffect(() => {
		fetchTokenPrices();
	}, [swapFromCur, swapToCur, ethPriceInUsd, isMainnet])

	useEffect(() => {
		if (approveHook.isSuccess) {
			fromTokenAllowance.refetch()
			approveHook.reset()
		}
	}, [approveHook.isSuccess, approveHook, fromTokenAllowance])

	useEffect(() => {
		if (mintRequestHook.isSuccess || burnRequestHook.isSuccess || mintRequestEthHook.isSuccess || mintRequestEthHook.isSuccess) {
			fromTokenBalance.refetch()
			toTokenBalance.refetch()
			fromTokenAllowance.refetch()
			mintRequestHook.reset()
			mintRequestEthHook.reset()
			burnRequestHook.reset()
			setTradeTableReload(true)
		}
	}, [
		mintRequestHook.isSuccess,
		mintRequestEthHook.isSuccess,
		burnRequestHook.isSuccess,
		mintRequestHook,
		mintRequestEthHook,
		burnRequestHook,
		fromTokenBalance,
		toTokenBalance,
		fromTokenAllowance,
		setTradeTableReload,
		swapToCur,
		faucetHook,
	])

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
			console.log()
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
			console.log()
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

	// function Switch() {
	// 	let switchReserve: Coin = swapFromCur
	// 	changeSwapFromCur(swapToCur)
	// 	changeSwapToCur(switchReserve)
	// }

	// const finalCoinList = isMainnet ? coinsList : testnetCoinsList[0]
	// const OurIndexCoinList: Coin[] = finalCoinList.filter(coin => OurIndexCoins.includes(coin.Symbol));
	// const OtherCoinList: Coin[] = finalCoinList.filter(coin => !OurIndexCoins.includes(coin.Symbol));
	// const [mergedCoinList, setMergedCoinList] = useState<Coin[][]>([OurIndexCoinList, OtherCoinList])

	useEffect(() => {
		const finalCoinList = isMainnet ? coinsList : (sepoliaTokens as Coin[])
		const OurIndexCoinList: Coin[] = finalCoinList.filter((coin) => coin.isNexlabToken)
		const OtherCoinList: Coin[] = finalCoinList.filter((coin) => !coin.isNexlabToken)
		setMergedCoinList([OtherCoinList, OurIndexCoinList])
	}, [isMainnet])

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
					value: Number(ethers.utils.formatEther(fromTokenBalance.data)) as number,
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
					value: parseFloat(ethers.utils.formatEther(toTokenBalance.data)) as number,
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
		const convertedValue = parseEther(((Number(firstInputValue) * 1001) / 1000)?.toString() as string)
		// const convertedValue = BigNumber.from(3*1001/1000)
		try {
			if (isChecked) {
				openPaymentModal()
			} else {
				if (num(fromTokenBalance.data) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to approve`,
					})
				}
				await approveHook.mutateAsync({ args: [swapToCur.factoryAddress, convertedValue] })
			}
		} catch (error) {
			console.log('approve error', error)
		}
	}

	async function mintRequest() {
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
				if (num(fromTokenBalance.data) < Number(firstInputValue)) {
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
					await mintRequestHook.mutateAsync({
						// args: [swapFromCur.address, (Number(firstInputValue) * 1e18).toString(), '3'],
						args: [swapFromCur.address, parseEther(Number(firstInputValue).toString()), '3'],
						overrides: {
							gasLimit: 2000000,
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
			console.log(parseEther(Number(firstInputValue).toString()))
			// console.log(parseEther(Number(firstInputValue)))
			console.log(Number(firstInputValue))
			console.log(firstInputValue)
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
				if (num(fromTokenBalance.data) < Number(firstInputValue)) {
					return GenericToast({
						type: 'error',
						message: `You don't have enough ${swapFromCur.Symbol} balance!`,
					})
				} else if (Number(firstInputValue) <= 0) {
					return GenericToast({
						type: 'error',
						message: `Please enter amount you want to burn`,
					})
				}
				console.log(swapFromCur)
				if (swapFromCur.indexType === 'defi') {
					await burnRequestHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString(), swapToCur.address, '3'],
						args: [parseEther(Number(firstInputValue).toString()), swapToCur.address, '3'],
						overrides: {
							gasLimit: 2000000,
						},
					})
				} else {
					await burnRequestHook.mutateAsync({
						// args: [(Number(firstInputValue) * 1e18).toString(), '0', swapToCur.address, '3'],
						args: [parseEther(Number(firstInputValue).toString()), '0', swapToCur.address, '3'],
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

	const isButtonDisabled = isMainnet || (!swapFromCur.isNexlabToken && !swapToCur.isNexlabToken) ? true : false

	return (
		<>
			{
				isStandalone ? (
					<>
						<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
						<Box width={"100vw"} height={"fit-content"} minHeight={"100vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingBottom={4} paddingX={2} bgcolor={lightTheme.palette.background.default}>
							<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} >
								<Stack width={"fit-content"} height={"fit-content"} paddingTop={4} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={8}>
									<Link href={"/pwa_tradeIndex"} className="w-fit h-fit flex flex-row items-center justify-center">
										<IoIosArrowBack size={30} color={lightTheme.palette.text.primary}></IoIosArrowBack>
										<Typography variant="body1" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											textTransform: "capitalize",
											marginLeft: "0.8rem",
											whiteSpace: "nowrap"
										}}>
											Trading ANFI
										</Typography>
									</Link>
								</Stack>

							</Stack>
							<Stack width={"100%"} height={"fit-content"} direction="row" alignItems={"center"} justifyContent={"space-between"} paddingTop={4} paddingBottom={3}>
								<Typography variant="caption" sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 500,
									fontSize: "0.8rem"
								}}>
									You Pay
								</Typography>
								<Stack width={"80%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={1}>
									<Typography variant="caption"
										onClick={() => {
											if (swapFromCur.address == sepoliaWethAddress) {
												setFirstInputValue('0.00001')
											} else setFirstInputValue('1')
										}}
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											backgroundColor: lightTheme.palette.pageBackground.main,
											paddingX: "1.2rem",
											paddingY: "0.4rem",
											borderRadius: "1rem",
											border: "solid 1px rgba(37, 37, 37, 0.5)",
											boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
										}}
									>
										MIN
									</Typography>
									<Typography variant="caption"
										onClick={() => {
											setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
										}}
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											backgroundColor: lightTheme.palette.pageBackground.main,
											paddingX: "1.2rem",
											paddingY: "0.4rem",
											borderRadius: "1rem",
											border: "solid 1px rgba(37, 37, 37, 0.5)",
											boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
										}}
									>
										HALF
									</Typography>
									<Typography variant="caption"
										onClick={() => {
											console.log(Number(getPrimaryBalance()).toString())
											setFirstInputValue(Number(getPrimaryBalance()).toString())
										}}
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											backgroundColor: lightTheme.palette.pageBackground.main,
											paddingX: "1.2rem",
											paddingY: "0.4rem",
											borderRadius: "1rem",
											border: "solid 1px rgba(37, 37, 37, 0.5)",
											boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
										}}
									>
										MAX
									</Typography>
								</Stack>
							</Stack>
							<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={3}>
								<Stack width={"50%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"}>


									<input
										type="number"
										className=" bg-transparent border-none w-1/2 h-fit pt-4 pb-2 interMedium outline-none text-black text-4xl"
										placeholder="0.0"
										onChange={changeFirstInputValue}
										value={firstInputValue ? firstInputValue : ''}
									/>
									<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingRight={3}>
										<Typography variant="subtitle1" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 500,
											marginTop: ".6rem"
										}}>
											≈$0.0
										</Typography>
										<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={1} paddingX={3}>
											<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} className="mt-3" />
											<Typography variant="subtitle1" sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 600,
												paddingTop: "1rem"
											}}>
												{getPrimaryBalance()} {swapFromCur.Symbol}
											</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Link href="" onClick={(event) => { event.preventDefault(); openFromCurrencySheet(); }} className='w-fit h-fit flex flex-row items-center justify-center relative z-50'>
									<Stack
										height={"12vw"}
										width={"12vw"}
										borderRadius={"9999px"}
										sx={{
											marginTop: "-2rem",
											backgroundImage: `url('${swapFromCur.logo}')`,
											backgroundPosition: "center",
											backgroundRepeat: "no-repeat",
											backgroundSize: "cover"
										}}

									></Stack>
								</Link>

							</Stack>
							<Stack width={"100%"} paddingX={1} paddingY={2} direction="row" alignItems={"center"} justifyContent={"center"} className="w-full my-2 px-2 flex flex-row items-center justify-center">
								<Stack width={"40%"} height={"1px"} bgcolor={lightTheme.palette.text.primary}></Stack>
								<Stack
									width={"fit-content"} height={"fit-content"} borderRadius={"9999px"} marginX={1.5} border={`solid 1px ${lightTheme.palette.text.primary}`} padding={1}
									onClick={() => {
										//Switching()
									}}
								>
									<AiOutlineSwap color={lightTheme.palette.text.primary} size={20} className="rotate-90" />
								</Stack>
								<Stack width={"40%"} height={"1px"} bgcolor={lightTheme.palette.text.primary}></Stack>
							</Stack>
							<Stack width={"100%"} height={"fit-content"} direction="row" alignItems={"center"} justifyContent={"space-between"} paddingY={1}>
								<Typography variant="caption" sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 500,
									fontSize: "0.8rem"
								}}>
									You Recieve
								</Typography>

							</Stack>
							<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={3}>
								<Stack width={"50%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"}>


									<input
										type="number"
										className=" bg-transparent border-none w-1/2 h-fit pt-4 pb-2 interMedium outline-none text-black text-4xl"
										placeholder="0.0"
										onChange={changeSecondInputValue}
										value={secondInputValue && secondInputValue !== 'NaN' ? formatNumber(Number(secondInputValue)) : 0}
									/>
									<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingRight={3}>
										<Typography variant="subtitle1" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 500,
											marginTop: ".6rem"
										}}>
											≈$0.0
										</Typography>
										<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={1} paddingX={3}>
											<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} className="mt-3" />
											<Typography variant="subtitle1" sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 600,
												paddingTop: "1rem"
											}}>
												{getSecondaryBalance()} {swapToCur.Symbol}
											</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Link href="" onClick={(event) => { event.preventDefault(); openToCurrencySheet() }} className='w-fit h-fit flex flex-row items-center justify-center'>
									<Stack
										height={"12vw"}
										width={"12vw"}
										borderRadius={"9999px"}
										sx={{
											marginTop: "-2rem",
											backgroundImage: `url('${swapToCur.logo}')`,
											backgroundPosition: "center",
											backgroundRepeat: "no-repeat",
											backgroundSize: "cover"
										}}

									></Stack>
								</Link>
							</Stack>

							<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={1.5} paddingTop={3}>
								<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={1}>
									<IOSSwitch sx={{ m: 1 }} checked={isChecked} onChange={toggleCheckbox} />
									<Typography variant="caption" sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 500,
									}}>
										FIAT Payment
									</Typography>

								</Stack>
								<Stack
									direction={"row"}
									alignItems={"center"}
									justifyContent={"start"}
									width={"fit-content"}
									height={"fit-content"}
									gap={1}
									onClick={() => faucet()}
								>
									<Typography
										variant="caption"
										sx={{
											color: "#5E869B",
											fontWeight: 500,
										}}
									>
										Testnet USDT
									</Typography>
									<GoArrowUpRight color={"#5E869B"} size={20} />
								</Stack>
							</Stack>
							<Stack width={"100vw"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={2.5} paddingTop={3}>
								<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={1}>
									<Typography variant="subtitle1" sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 500,
									}}>
										Platform Fees
									</Typography>

								</Stack>
								<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={1}>
									<Typography variant="subtitle1" sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 500,
									}}>
										1%
									</Typography>
								</Stack>
							</Stack>
							<Button onClick={() => {
								//changePWATradeoperation("sell")
								//router.push('/pwa_trade_console_defi')
							}}
								sx={{
									width: "100%",
									paddingY: "1rem",
									background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
									boxShadow: "none",
									marginTop: "2.4rem"
								}}>
								<Typography variant="h3" component="h3" className="w-full" sx={{
									color: lightTheme.palette.text.primary,
									fontSize: "1.6rem",
									textShadow: "none"
								}} >
									Mint
								</Typography>
							</Button>
						</Box>
						<Sheet
							isOpen={isFromCurrencySheetOpen}
							onClose={() => setFromCurrencySheetOpen(false)}
							snapPoints={[500, 500, 0, 0]}
							initialSnap={1}
						>
							<Sheet.Container>
								<Sheet.Header />
								<Sheet.Content>
									<Stack direction={"column"} height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"space-between"} paddingX={2} paddingY={2}>
										<Typography variant="h6" align="center" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 700
										}}>
											Swap From
										</Typography>
										<Stack direction={"column"} height={"fit-content"} width={"100%"} alignItems={"center"} justifyContent={"end"} gap={1}>
										<Stack width={"100%"} height={"30vh"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={3} sx={{ overflowY: "scroll", overflowX: "hidden" }}>
												{
													mergedCoinList[0].map((item, index) => {
														return (
															<Link href="" key={index} className='w-full h-fit flex flex-row items-center justify-center relative z-50' onClick={(event)=>{event.preventDefault(); changeSwapFromCur(item); closeFromCurrencySheet()}}>
																<Stack key={index} width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
																<Stack
																	height={"12vw"}
																	width={"12vw"}
																	borderRadius={"9999px"}
																	sx={{

																		backgroundImage: `url('${item.logo}')`,
																		backgroundPosition: "center",
																		backgroundRepeat: "no-repeat",
																		backgroundSize: "cover"
																	}}

																></Stack>
																<Stack direction="row" alignItems={"center"} justifyContent={"end"} width={"fit-content"} height={"fit-content"} gap={0.5}>
																	<Typography variant="body1" align="center" sx={{
																		color: lightTheme.palette.text.primary,
																		fontWeight: 700
																	}}>
																		{item.name}
																	</Typography>
																	<Typography variant="caption" align="center" sx={{
																		color: "#878787",
																		fontWeight: 500
																	}}>
																		({item.Symbol})
																	</Typography>
																</Stack>
															</Stack>
															</Link>
														)
													})
												}
											</Stack>
											<Stack width={"100%"} height={"fit-content"} marginY={1.5} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
												<Button onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													toggleMainnetCheckbox()
												}}
													sx={{
														width: "50%",
														paddingY: "1rem",
														background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
														boxShadow: "none"
													}}>
													<Typography variant="h3" component="h3" className="w-full" sx={{
														color: lightTheme.palette.text.primary,
														fontSize: "1.6rem",
														textShadow: "none"
													}} >
														Mainnet
													</Typography>
												</Button>
												<Button onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													toggleMainnetCheckbox()
												}}
													sx={{
														width: "50%",
														paddingY: "1rem",
														background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
														boxShadow: "none"
													}}>
													<Typography variant="h3" component="h3" className="w-full" sx={{
														color: lightTheme.palette.text.primary,
														fontSize: "1.6rem",
														textShadow: "none"
													}} >
														Testnet
													</Typography>
												</Button>
											</Stack>
										</Stack>
									</Stack>
								</Sheet.Content>
							</Sheet.Container>
							<Sheet.Backdrop />
						</Sheet>
						<Sheet
							isOpen={isToCurrencySheetOpen}
							onClose={() => setToCurrencySheetOpen(false)}
							snapPoints={[500, 500, 0, 0]}
							initialSnap={1}
						>
							<Sheet.Container>
								<Sheet.Header />
								<Sheet.Content>
									<Stack direction={"column"} height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"space-between"} paddingX={2} paddingY={2}>
										<Typography variant="h6" align="center" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 700
										}}>
											Swap To
										</Typography>
										<Stack direction={"column"} height={"fit-content"} width={"100%"} alignItems={"center"} justifyContent={"end"} gap={1}>
											<Stack width={"100%"} height={"30vh"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={3} sx={{ overflowY: "scroll", overflowX: "hidden" }}>
												{
													mergedCoinList[0].map((item, index) => {
														return (
															<Link href="" key={index} className='w-full h-fit flex flex-row items-center justify-center relative z-50' onClick={(event)=>{event.preventDefault(); changeSwapToCur(item); closeToCurrencySheet()}}>
																<Stack key={index} width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
																<Stack
																	height={"12vw"}
																	width={"12vw"}
																	borderRadius={"9999px"}
																	sx={{

																		backgroundImage: `url('${item.logo}')`,
																		backgroundPosition: "center",
																		backgroundRepeat: "no-repeat",
																		backgroundSize: "cover"
																	}}

																></Stack>
																<Stack direction="row" alignItems={"center"} justifyContent={"end"} width={"fit-content"} height={"fit-content"} gap={0.5}>
																	<Typography variant="body1" align="center" sx={{
																		color: lightTheme.palette.text.primary,
																		fontWeight: 700
																	}}>
																		{item.name}
																	</Typography>
																	<Typography variant="caption" align="center" sx={{
																		color: "#878787",
																		fontWeight: 500
																	}}>
																		({item.Symbol})
																	</Typography>
																</Stack>
															</Stack>
															</Link>
														)
													})
												}
											</Stack>
											<Stack width={"100%"} height={"fit-content"} marginY={1.5} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
												<Button onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													toggleMainnetCheckbox()
												}}
													sx={{
														width: "50%",
														paddingY: "1rem",
														background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
														boxShadow: "none"
													}}>
													<Typography variant="h3" component="h3" className="w-full" sx={{
														color: lightTheme.palette.text.primary,
														fontSize: "1.6rem",
														textShadow: "none"
													}} >
														Mainnet
													</Typography>
												</Button>
												<Button onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													toggleMainnetCheckbox()
												}}
													sx={{
														width: "50%",
														paddingY: "1rem",
														background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
														boxShadow: "none"
													}}>
													<Typography variant="h3" component="h3" className="w-full" sx={{
														color: lightTheme.palette.text.primary,
														fontSize: "1.6rem",
														textShadow: "none"
													}} >
														Testnet
													</Typography>
												</Button>
											</Stack>
										</Stack>
									</Stack>

								</Sheet.Content>
							</Sheet.Container>
							<Sheet.Backdrop />
						</Sheet>
					</>
				) : (
					<>
						<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
						<div
							className={`h-fit w-full rounded-xl ${mode == 'dark' ? '' : 'shadow shadow-blackText-500'} flex flex-col items-start justify-start px-4 py-3`}
							style={{
								boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
							}}
						>
							<h5 className={`text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500 '} interBlack mb-3 text-center w-full`}>Buy/Sell</h5>
							<div className="w-full h-fit flex flex-col items-start justify-start">
								<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
									<p className={`text-base interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'}  w-1/3`}>You pay</p>
									<div className="w-2/3 h-fit flex flex-row items-center justify-end gap-1 px-2">
										<p
											onClick={() => {
												if (swapFromCur.address == sepoliaWethAddress) {
													setFirstInputValue('0.00001')
												} else setFirstInputValue('1')
											}}
											className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
												} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
											MIN
										</p>
										<p
											// onClick={() => setFirstInputValue((Number(getPrimaryBalance()) / 2e18).toString())}
											onClick={() => {
												setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
											}}
											className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
												} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
											HALF
										</p>
										<p
											onClick={() => {
												console.log(Number(getPrimaryBalance()).toString())
												setFirstInputValue(Number(getPrimaryBalance()).toString())
											}}
											className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
												} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
											MAX
										</p>
									</div>
								</div>
								<div className="w-full h-fit flex flex-row items-center justify-end gap-1">
									<input
										type="text"
										placeholder="0.00"
										className={`w-1/2 border-none text-2xl ${mode == 'dark' ? ' text-whiteText-500 placeholder:text-whiteText-500' : 'text-blackText-500 placeholder:text-gray-400'
											}  interMedium placeholder:text-2xl  placeholder:interMedium bg-transparent active:border-none outline-none focus:border-none p-2`}
										onChange={changeFirstInputValue}
										value={firstInputValue ? firstInputValue : ''}
									/>
									<div
										className="w-fit lg:w-1/2 gap-2 p-2 h-10 flex flex-row items-center justify-end cursor-pointer"
										onClick={() => {
											openFromCurrencyModal()
										}}
									>
										<div className="flex flex-row items-center justify-start w-fit">
											<Image src={swapFromCur.logo} alt={swapFromCur.Symbol} quality={100} width={30} height={30} className=" relative z-20 rounded-full mt-1 mr-1"></Image>
											<h5 className={`text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBlack pt-1`}>{swapFromCur.Symbol}</h5>
										</div>
										{mode == 'dark' ? <BiSolidChevronDown color={'#FFFFFF'} size={18} className="mt-1" /> : <BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />}
									</div>
								</div>
								<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
									<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
										{isMainnet && <>≈ ${fromConvertedPrice ? FormatToViewNumber({ value: fromConvertedPrice, returnType: 'string' }) : '0.00'}</>}
									</span>
									<div className="flex flex-row items-center justify-end gap-1">
										{mode == 'dark' ? <LiaWalletSolid color="#FFFFFF" size={20} strokeWidth={1.2} /> : <LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />}

										<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
											{getPrimaryBalance()} {swapFromCur.Symbol}
										</span>
									</div>
								</div>
							</div>

							<div className="w-full my-2 px-2 flex flex-row items-center justify-center">
								<div className={`${mode == 'dark' ? ' bg-whiteText-500' : 'bg-blackText-500'} w-2/5 h-[1px]`}></div>
								<div
									className={`w-fit h-fit rounded-full mx-3 ${mode == 'dark' ? '  bg-transparent border border-whiteText-500' : 'bg-blackText-500'}  p-2 cursor-pointer`}
									onClick={() => {
										Switching()
									}}
								>
									<AiOutlineSwap color="#F2F2F2" size={20} className="rotate-90" />
								</div>
								<div className={`${mode == 'dark' ? ' bg-whiteText-500' : 'bg-blackText-500'} w-2/5 h-[1px]`}></div>
							</div>
							<div className="w-full h-fit flex flex-col items-start justify-end">
								<p className={`text-base interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'}  pb-1`}>You Recieve</p>
								<div className="w-full h-fit flex flex-row items-center justify-end gap-2">
									<input
										type="text"
										placeholder="0.00"
										className={`w-1/2 border-none text-2xl ${mode == 'dark' ? ' text-whiteText-500 placeholder:text-whiteText-500' : 'text-blackText-500 placeholder:text-gray-400'
											}  interMedium placeholder:text-2xl  placeholder:interMedium bg-transparent active:border-none outline-none focus:border-none p-2`}
										onChange={changeSecondInputValue}
										value={secondInputValue && secondInputValue !== 'NaN' ? formatNumber(Number(secondInputValue)) : 0}
									/>
									<div
										className="w-fit lg:w-1/2 gap-2 p-2 h-10 flex flex-row items-center justify-end  cursor-pointer"
										onClick={() => {
											openToCurrencyModal()
										}}
									>
										<div className="flex flex-row items-center justify-end ">
											<Image src={swapToCur.logo} alt={swapToCur.Symbol} quality={100} width={30} height={30} className=" relative z-20 rounded-full mt-1 mr-1"></Image>
											<h5 className={`text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500 '} interBlack pt-1`}>{swapToCur.Symbol}</h5>
										</div>
										{mode == 'dark' ? <BiSolidChevronDown color={'#FFFFFF'} size={18} className="mt-1" /> : <BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />}
									</div>
								</div>
								<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
									<span className={`text-sm interMedium ${mode == 'dark' ? 'text-whiteText-500' : 'text-gray-500'}`}>
										<span className={`text-sm interMedium ${mode == 'dark' ? 'text-whiteText-500' : 'text-gray-500'}`}>
											{isMainnet && <>≈ ${toConvertedPrice ? FormatToViewNumber({ value: toConvertedPrice, returnType: 'string' }) : '0.00'}</>}
										</span>
									</span>

									<div className="flex flex-row items-center justify-end gap-1">
										{mode == 'dark' ? <LiaWalletSolid color="#FFFFFF" size={20} strokeWidth={1.2} /> : <LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />}
										<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
											{getSecondaryBalance()} {swapToCur.Symbol}
										</span>
									</div>
								</div>
							</div>
							<div className="pt-8 flex flex-row w-full items-center justify-between">
								<div className="flex flex-row items-center gap-2">
									<Switch onChange={toggleCheckbox} checked={isChecked} height={14} width={35} handleDiameter={20} />
									<div className="flex flex-row items-center justify-start gap-1">
										<span className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-700'} interMedium text-sm`}>Fiat payment</span>
										<span>
											<GenericTooltip
												color="#5E869B"
												content={
													<div>
														<p className={`${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-2`}>No cryptocurrencies in your wallet? No problem!</p>
														<p className={`${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
															Revolutionize your trading experience with Nex Labs – introducing fiat payments for the first time, providing you seamless and convenient transactions in
															traditional currencies.
														</p>
													</div>
												}
											>
												<BsInfoCircle color="#5E869B" size={14} className="cursor-pointer" />
											</GenericTooltip>
										</span>
									</div>
								</div>
								<div className={`flex flex-row items-center justify-end`}>
									<span onClick={() => faucet()} className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-700'} interMedium text-sm cursor-pointer`}>
										Testnet USDT
									</span>
									<GoArrowUpRight color={mode == 'dark' ? '#FFFFFF' : '#252525'} size={20} />
								</div>
							</div>
							<div className="h-fit w-full mt-6">
								<div className={`w-full h-fit flex flex-row items-center justify-end gap-1 px-2 py-3 mb-3`}>
									{swapToCur.hasOwnProperty('indexType') ? (
										<>
											{Number(fromTokenAllowance.data) / 1e18 < Number(firstInputValue) && swapFromCur.address != sepoliaWethAddress ? (
												<button
													onClick={approve}
													disabled={isButtonDisabled}
													className={`text-xl titleShadow interBold ${mode == 'dark'
														? ' text-whiteText-500 bg-cover border-transparent bg-center bg-no-repeat'
														: ' text-blackText-500 bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
														} active:translate-y-[1px] active:shadow-black w-full px-2 py-3 rounded ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
														} hover:bg-colorTwo-500/30`}
													style={{
														boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
														backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
													}}
												>
													Approve
												</button>
											) : (
												<button
													onClick={mintRequest}
													disabled={isButtonDisabled}
													className={`text-xl titleShadow interBold ${mode == 'dark'
														? ' text-whiteText-500 bg-cover border-transparent bg-center bg-no-repeat'
														: ' text-blackText-500 bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
														}  active:translate-y-[1px] active:shadow-black w-full px-2 py-3 rounded-lg ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
														} hover:from-colorFour-500 hover:to-colorSeven-500/90`}
													style={{
														boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
														backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
													}}
												>
													Mint
												</button>
											)}
										</>
									) : (
										<button
											onClick={burnRequest}
											disabled={isButtonDisabled}
											className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-nexLightRed-500 to-nexLightRed-500/80 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-full px-2 py-3 rounded ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
												} hover:bg-colorTwo-500/30`}
										>
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
									<p className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-black/70'}  pb-2`}>Platform Fees</p>
									<div className="flex flex-row items-center justify-start gap-2">
										<p className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-black/70'} `}>
											{FormatToViewNumber({ value: Number(firstInputValue) * feeRate, returnType: 'string' })} {swapFromCur.Symbol} ({feeRate * 100} %)
										</p>
										<GenericTooltip
											color="#5E869B"
											content={
												<div>
													<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
														Platform fees support ongoing development and security, ensuring a sustainable and innovative decentralized financial ecosystem.
													</p>
												</div>
											}
										>
											<BsInfoCircle color="#5E869B" size={14} className="cursor-pointer" />
										</GenericTooltip>
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
								<div className="w-full h-fit flex flex-row items-center justify-between gap-1 my-4">
									<button
										onClick={toggleMainnetCheckbox}
										className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
											} interBold text-xl`}
										style={{
											boxShadow: mode == 'dark' && isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' && isMainnet ? `url('${mesh1.src}')` : '',
										}}
									>
										Mainnet
									</button>
									<button
										onClick={toggleMainnetCheckbox}
										className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${!isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
											} interBold text-xl`}
										style={{
											boxShadow: mode == 'dark' && !isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' && !isMainnet ? `url('${mesh1.src}')` : '',
										}}
									>
										Testnet
									</button>
								</div>

								<ReactSearchAutocomplete items={mergedCoinList[0]} formatResult={formatResult} autoFocus className="relative z-50" />
								<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'}  overflow-hidden my-4 px-2`}>
									<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'} overflow-y-auto  py-2`} id="coinsList">
										{mergedCoinList[0].map((item, index) => {
											return (
												<div
													key={index}
													className={`flex ${item.Symbol == 'eth' || item.Symbol == 'ETH' ? 'hidden' : ''
														} flex-row items-center justify-between mb-2 px-2 py-2 rounded-xl cursor-pointer hover:bg-slate-300`}
													onClick={() => {
														changeSwapFromCur(item)
														closeFromCurrencyModal()
													}}
												>
													<div className="flex flex-row items-center justify-start gap-3">
														<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
														<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBold`}>{item.Symbol}</h5>
													</div>
													<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-300'} inter italic`}>{item.Symbol}</h5>
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</GenericModal>
						<GenericModal isOpen={isToCurrencyModalOpen} onRequestClose={closeToCurrencyModal}>
							<div className="w-full h-fit px-2">
								<div className="w-full h-fit flex flex-row items-center justify-between gap-1 my-4">
									<button
										onClick={toggleMainnetCheckbox}
										className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
											} interBold text-xl`}
										style={{
											boxShadow: mode == 'dark' && isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' && isMainnet ? `url('${mesh1.src}')` : '',
										}}
									>
										Mainnet
									</button>
									<button
										onClick={toggleMainnetCheckbox}
										className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${!isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
											} interBold text-xl`}
										style={{
											boxShadow: mode == 'dark' && !isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' && !isMainnet ? `url('${mesh1.src}')` : '',
										}}
									>
										Testnet
									</button>
								</div>
								<ReactSearchAutocomplete items={mergedCoinList[1]} formatResult={formatResult} autoFocus className="relative z-50" />
								<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'}  overflow-hidden my-4 px-2`}>
									<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'} overflow-y-auto  py-2`} id="coinsList">
										{mergedCoinList[1].map((item, index) => {
											return (
												<div
													key={index}
													className={`flex ${item.Symbol == 'eth' || item.Symbol == 'ETH' ? 'hidden' : ''} flex-row items-center justify-between mb-5 cursor-pointer`}
													onClick={() => {
														changeSwapToCur(item)
														closeToCurrencyModal()
													}}
												>
													<div className="flex flex-row items-center justify-start gap-3">
														<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
														<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBold`}>{item.Symbol}</h5>
													</div>
													<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'ext-gray-300'} t inter italic`}>{item.Symbol}</h5>
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</GenericModal>
						<GenericModal
							isOpen={cookingModalVisible}
							onRequestClose={() => {
								setCookingModalVisible(false)
							}}
						>
							<div className="w-full h-fit px-2 flex flex-col items-center justify-center">
								{/*
						<Lottie
						animationData={cookingAnimation}
						loop={true}
						style={{
							height: 200,
							width: 400,
							overflow: 'hidden',
						}}
					/>
						*/}
								<h5 className="InterBold text-blackText-500 text-2xl text-center w-full -mt-6">THE MAGIC IS HAPPENING...</h5>
								<h5 className="interMedium text-blackText-500 text-lg text-center w-9/12 my-2">
									Your NFT receipt is being minted. Once it is ready, you can find it the {'"'}Receipts{'"'} section.
								</h5>
							</div>
						</GenericModal>
					</>
				)
			}

		</>
	)
}

export default SwapV2Defi
