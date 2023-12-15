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
import { UseContractResult, toWei, useAddress, useContract, useContractRead, useContractWrite, useSigner } from '@thirdweb-dev/react'
import {
	goerlianfiPoolAddress,
	goerliAnfiFactory,
	goerliAnfiIndexToken,
	goerliAnfiV2Factory,
	goerliAnfiV2IndexToken,
	goerliCrypto5Factory,
	goerliCrypto5IndexToken,
	goerliUsdtAddress,
	goerliWethAddress,
	zeroAddress,
} from '@/constants/contractAddresses'
import { indexFactoryAbi, indexFactoryV2Abi, indexTokenAbi, tokenAbi, uniswapV3PoolContractAbi } from '@/constants/abi'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'
import PaymentModal from './PaymentModal'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'

import { Network, Alchemy, BigNumber } from 'alchemy-sdk'

import { BsInfoCircle } from 'react-icons/bs'

import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import cookingAnimation from '@assets/lottie/cooking.json'

import { GenericToast } from './GenericToast'
import { parseEther } from 'viem'
import { FormatToViewNumber, num } from '@/hooks/math'
import { ethers } from 'ethers'
import { LiaWalletSolid } from 'react-icons/lia'
import Switch from 'react-switch'
import GenericTooltip from './GenericTooltip'
import getPoolAddress from '@/uniswap/utils'
// import { CurrentConfig } from '@/uniswap/configure'
import { SwapNumbers } from '@/utils/general'
import convertToUSD from '@/utils/convertToUsd'
import axios from 'axios'

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
	factoryAddress: string
	decimals: number
}

const SwapV2 = () => {
	const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)
	const [isChecked, setChecked] = useState(false)
	const [isMainnet, setIsmainnet] = useState(false)

	const [firstInputValue, setFirstInputValue] = useState<string>('0')
	const [secondInputValue, setSecondInputValue] = useState<string>('0')
	console.log('firstInputValue', firstInputValue)

	const [cookingModalVisible, setCookingModalVisible] = useState<boolean>(false)
	const [userEthBalance, setUserEthBalance] = useState<number>(0)

	const {
		isFromCurrencyModalOpen,
		isToCurrencyModalOpen,
		setFromCurrencyModalOpen,
		setToCurrencyModalOpen,
		changeSwapFromCur,
		changeSwapToCur,
		swapFromCur,
		swapToCur,
		nftImage,
		setNftImage,
		setTradeTableReload,
	} = useTradePageStore()

	const address = useAddress()
	const signer = useSigner()

	//integration hooks
	// const factoryContract = useContract(goerliAnfiFactory, indexFactoryAbi)
	const mintFactoryContract: UseContractResult = useContract(swapToCur.factoryAddress, indexFactoryV2Abi)
	const burnFactoryContract: UseContractResult = useContract(swapFromCur.factoryAddress, indexFactoryV2Abi)

	const fromTokenContract = useContract(swapFromCur.address, tokenAbi)

	const toTokenContract = useContract(swapToCur.address, tokenAbi)
	// const anfiFactoryContract = useContract(goerliAnfi, tokenAbi)

	const fromTokenBalance = useContractRead(fromTokenContract.contract, 'balanceOf', [address])
	const toTokenBalance = useContractRead(toTokenContract.contract, 'balanceOf', [address])
	const fromTokenAllowance = useContractRead(fromTokenContract.contract, 'allowance', [address, swapToCur.factoryAddress])
	const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0
	// const issuanceOutput = useContractRead(mintFactoryContract.contract, 'getIssuanceAmountOut', [convertedInputValue.toString(), swapFromCur.address ,"3"])
	// const redemptionOutput = useContractRead(burnFactoryContract.contract, 'getRedemptionAmountOut', [convertedInputValue.toString(), swapToCur.address,"3"])

	const approveHook = useContractWrite(fromTokenContract.contract, 'approve')
	const mintRequestHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokens')
	const mintRequestEthHook = useContractWrite(mintFactoryContract.contract, 'issuanceIndexTokensWithEth')
	const burnRequestHook = useContractWrite(burnFactoryContract.contract, 'redemption')

	useEffect(() => {
		// console.log("ERRR")
		async function getIssuanceOutput() {
			try {
				if (swapToCur.address == goerliAnfiV2IndexToken && convertedInputValue) {
					const provider = new ethers.providers.JsonRpcBatchProvider('https://eth-goerli.g.alchemy.com/v2/LOxUiFd7inEC7y9S-rxGH-_FmJjLlYC1')
					const issuanceContract = new ethers.Contract(swapToCur.factoryAddress, indexFactoryV2Abi, provider)
					const output = await issuanceContract.callStatic.getIssuanceAmountOut2(convertedInputValue.toString(), swapFromCur.address, '3')
					setSecondInputValue(num(output).toString())
				}
			} catch (error) {
				console.log('getIssuanceOutput error:', error)
			}
		}
		getIssuanceOutput()
	}, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapToCur.factoryAddress])

	useEffect(() => {
		async function getRedemptionOutput() {
			try {
				if (swapFromCur.address == goerliAnfiV2IndexToken && convertedInputValue) {
					const provider = new ethers.providers.JsonRpcBatchProvider('https://eth-goerli.g.alchemy.com/v2/LOxUiFd7inEC7y9S-rxGH-_FmJjLlYC1')
					const redemptionContract = new ethers.Contract(swapFromCur.factoryAddress, indexFactoryV2Abi, provider)
					const output = await redemptionContract.callStatic.getRedemptionAmountOut2(convertedInputValue.toString(), swapToCur.address, '3')
					setSecondInputValue(num(output).toString())
				}
			} catch (error) {
				console.log('getRedemptionOutput error:', error)
			}
		}
		getRedemptionOutput()
	}, [firstInputValue, convertedInputValue, swapFromCur.address, swapToCur.address, swapFromCur.factoryAddress])

	const [from1UsdPrice, setFrom1UsdPrice] = useState<number>()
	const [fromConvertedPrice, setFromConvertedPrice] = useState<number>(0)

	const [to1UsdPrice, setTo1UsdPrice] = useState<number>()
	const [toConvertedPrice, setToConvertedPrice] = useState<number>(0)
	const [ethPrice, setEthPrice] = useState(0)

	useEffect(() => {
		const handleWeth = async () => {
			const wethPriceinUsd = await axios
				.get('https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd')
				.then((res) => res.data.weth.usd)
				.catch((err) => console.log(err))

			setEthPrice(wethPriceinUsd)
		}

		handleWeth()
	}, [])

	// console.log(from1UsdPrice, to1UsdPrice)

	useEffect(() => {
		async function fetchData(tokenDetails: Coin, place: string) {
			try {
				const poolAddress = getPoolAddress(tokenDetails.address, tokenDetails.decimals, isMainnet)
				console.log(tokenDetails.Symbol, poolAddress)
				let isRevPool = false

				const chainName = isMainnet ? 'ethereum' : 'goerli'
				const sdk = new ThirdwebSDK(chainName)
				const poolContract = await sdk.getContract(poolAddress as string, uniswapV3PoolContractAbi)

				const data = await poolContract.call('slot0', [])
				const token0 = await poolContract.call('token0', [])

				const fromSqrtPriceX96 = data.sqrtPriceX96
				console.log(fromSqrtPriceX96.toString(), token0)

				let decimal0 = Number(tokenDetails.decimals)
				// let decimal1 = Number(tokenB.decimals);
				let decimal1 = 18

				if (token0 !== tokenDetails.address) {
					isRevPool = true
					;[decimal0, decimal1] = SwapNumbers(decimal0, decimal1)
				}

				const calculatedPrice = Math.pow(fromSqrtPriceX96 / 2 ** 96, 2) / (10 ** decimal1 / 10 ** decimal0)
				const calculatedPriceAsNumber = parseFloat(calculatedPrice.toFixed(decimal1))

				console.log(tokenDetails.Symbol, isRevPool, calculatedPriceAsNumber, 1 / calculatedPriceAsNumber)

				// WHEN isRev is true
				console.log(`1 WETH = ${calculatedPriceAsNumber} ${tokenDetails.Symbol}`)
				console.log(`1 ${tokenDetails.Symbol} = ${1 / calculatedPriceAsNumber} WETH`)

				//WHEN isRev is False
				console.log(`1 WETH = ${1 / calculatedPriceAsNumber} ${tokenDetails.Symbol}`)
				console.log(`1 ${tokenDetails.Symbol} = ${calculatedPriceAsNumber} WETH`)

				// console.log(`1 WETH = ${(1 / calculatedPriceAsNumber)/1e18} ${tokenDetails.Symbol}`)
				// console.log(`1 WETH = ${(calculatedPriceAsNumber)/1e18} ${tokenDetails.Symbol}`)

				// console.log('ethUSDPrice',ethUSDPrice)
				// const fromPriceInUSD = isRevPool ? await convertToUSD(calculatedPriceAsNumber) : await convertToUSD(1 / calculatedPriceAsNumber)
				const fromPriceInUSD = isRevPool ? calculatedPriceAsNumber / ethPrice : 1 / calculatedPriceAsNumber / ethPrice
				// console.log(tokenDetails.Symbol,isRevPool,await convertToUSD(calculatedPriceAsNumber), await convertToUSD(1 / calculatedPriceAsNumber))

				if (place === 'From') {
					setFrom1UsdPrice(fromPriceInUSD)
				} else {
					setTo1UsdPrice(fromPriceInUSD)
				}

				// if (swapFromCur.Symbol === 'WETH' || swapFromCur.Symbol === 'ETH') {
				// 	if (!isRevPool) setFrom1UsdPrice( calculatedPriceAsNumber)
				// 	else setFrom1UsdPrice(1 /calculatedPriceAsNumber)
				// }
				// if (swapToCur.Symbol === 'WETH' || swapToCur.Symbol === 'ETH') {
				// 	if (!isRevPool) setTo1UsdPrice(calculatedPriceAsNumber)
				// 	else setTo1UsdPrice(1 / calculatedPriceAsNumber)
				// }
				if (swapFromCur.Symbol === 'WETH' || swapFromCur.Symbol === 'ETH') {
					setFrom1UsdPrice(ethPrice)
					// if (!isRevPool) setFrom1UsdPrice(1 / calculatedPriceAsNumber)
					// else setFrom1UsdPrice(calculatedPriceAsNumber)
				}
				if (swapToCur.Symbol === 'WETH' || swapToCur.Symbol === 'ETH') {
					setTo1UsdPrice(ethPrice)
					// if (!isRevPool) setTo1UsdPrice(1 / calculatedPriceAsNumber)
					// else setTo1UsdPrice(calculatedPriceAsNumber)
				}
			} catch (err) {
				console.log(err)
			}
		}
		if (swapFromCur.Symbol !== 'WETH' && swapFromCur.Symbol !== 'ETH') {
			fetchData(swapFromCur, 'From')
		}
		if (swapToCur.Symbol !== 'WETH' && swapToCur.Symbol !== 'ETH') {
			fetchData(swapToCur, 'To')
		}
	}, [swapFromCur, swapToCur, ethPrice, isMainnet])

	// useEffect(()=>{
	// 	async function getPrice(tokenDetails1: Coin, tokenDetails2: Coin) {
	// 		try {
	// 			const fromPoolAddress = getPoolAddress(tokenDetails1.address, tokenDetails1.decimals, isMainnet)
	// 			const toPoolAddress = getPoolAddress(tokenDetails2.address, tokenDetails2.decimals, isMainnet)

	// 			console.log(fromPoolAddress)
	// 			console.log(toPoolAddress)
	// 			// console.log(tokenDetails1.address, tokenDetails2.address)
	// 			// console.log(tokenDetails1.address, tokenDetails2.address)
	// 			let isFromRevPool = false;
	// 			let isToRevPool = false;

	// 			const chainName = isMainnet ? 'ethereum': 'goerli' ;
	// 			// console.log("chainName--> ", chainName)
	// 			const sdk = new ThirdwebSDK(chainName);

	// 			const fromPoolContract = await sdk.getContract(fromPoolAddress ? fromPoolAddress: zeroAddress as string, uniswapV3PoolContractAbi);
	// 			const toPoolContract = await sdk.getContract(toPoolAddress as string, uniswapV3PoolContractAbi);

	// 			const fromData = await fromPoolContract.call("slot0", []);
	// 			const fromToken0 = await fromPoolContract.call('token0', [])

	// 			const toData = await toPoolContract.call("slot0", []);
	// 			const toToken0 = await toPoolContract.call('token0', [])

	// 			const fromSqrtPriceX96 = fromData.sqrtPriceX96;
	// 			const toSqrtPriceX96 = toData.sqrtPriceX96;

	// 			let fromDecimal0 = Number(tokenDetails1.decimals);
	// 			let fromDecimal1 = 18;
	// 			let toDecimal0 = Number(tokenDetails2.decimals);
	// 			let toDecimal1 = 18;

	// 			if (fromToken0 !== tokenDetails1.address) {
	// 				isFromRevPool = true;
	// 				[fromDecimal0, fromDecimal1] = SwapNumbers(fromDecimal0, fromDecimal1);
	// 			}
	// 			if (toToken0 !== tokenDetails2.address) {
	// 				isToRevPool = true;
	// 				[toDecimal0, toDecimal1] = SwapNumbers(toDecimal0, toDecimal1);
	// 			}

	// 			const fromCalculatedPrice = Math.pow(fromSqrtPriceX96 / 2 ** 96, 2) / (10 ** fromDecimal1 / 10 ** fromDecimal0);
	// 			const fromCalculatedPriceAsNumber = parseFloat(fromCalculatedPrice.toFixed(fromDecimal1));

	// 			const toCalculatedPrice = Math.pow(toSqrtPriceX96 / 2 ** 96, 2) / (10 ** toDecimal1 / 10 ** toDecimal0);
	// 			const toCalculatedPriceAsNumber = parseFloat(toCalculatedPrice.toFixed(toDecimal1));

	// 			// console.log('isFromRevPool', isFromRevPool)
	// 			// console.log('isToRevPool', isToRevPool)

	// 			// // WHEN isRev is true
	// 			// console.log(' ---- CASE 1 ------')
	// 			// console.log(`1 WETH = ${fromCalculatedPriceAsNumber} ${tokenDetails1.Symbol}`)
	// 			// console.log(`1 ${tokenDetails1.Symbol} = ${1/fromCalculatedPriceAsNumber} WETH`)

	// 			// //WHEN isRev is False
	// 			// console.log(' ---- CASE 2 ------')
	// 			// console.log(`1 WETH = ${1/fromCalculatedPriceAsNumber} ${tokenDetails1.Symbol}`)
	// 			// console.log(`1 ${tokenDetails1.Symbol} = ${fromCalculatedPriceAsNumber} WETH`)

	// 			// // WHEN isRev is true
	// 			// console.log(' ---- WHEN isRev is True ------')
	// 			// console.log(`1 WETH = ${toCalculatedPriceAsNumber} ${tokenDetails2.Symbol}`)
	// 			// console.log(`1 ${tokenDetails2.Symbol} = ${1/toCalculatedPriceAsNumber} WETH`)

	// 			// //WHEN isRev is False
	// 			// console.log(' ---- WHEN isRev is False ------')
	// 			// console.log(`1 WETH = ${1/toCalculatedPriceAsNumber} ${tokenDetails2.Symbol}`)
	// 			// console.log(`1 ${tokenDetails2.Symbol} = ${toCalculatedPriceAsNumber} WETH`)

	// 			// console.log(`1  ${tokenDetails1.Symbol} ${1/fromCalculatedPriceAsNumber} = ${toCalculatedPriceAsNumber} ${tokenDetails2.Symbol} `)

	// 			const fromPriceInUSD = await convertToUSD(isFromRevPool ? fromCalculatedPriceAsNumber : 1 / fromCalculatedPriceAsNumber)
	// 			const toPriceInUSD = await convertToUSD(isToRevPool ? toCalculatedPriceAsNumber : 1 / toCalculatedPriceAsNumber)

	// 			setFrom1UsdPrice(fromPriceInUSD)
	// 			setTo1UsdPrice(toPriceInUSD)

	// 			// console.log(toPriceInUSD)
	// 		} catch (err) {
	// 			console.log(err)
	// 		}

	// 	}

	// 	getPrice(swapFromCur, swapToCur);

	// },[swapFromCur, swapToCur, isMainnet])

	useEffect(() => {
		if (approveHook.isSuccess) {
			fromTokenAllowance.refetch()
			approveHook.reset()
		}
	}, [approveHook.isSuccess, approveHook, fromTokenAllowance])

	useEffect(() => {
		if (mintRequestHook.isSuccess || burnRequestHook.isSuccess || mintRequestEthHook.isSuccess) {
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
	])

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
				message: `Approving Failed!`,
			})
			// approveHook.reset()
		}
	}, [approveHook.isLoading, approveHook.isSuccess, approveHook.isError])

	useEffect(() => {
		if (mintRequestHook.isLoading || mintRequestEthHook.isLoading) {
			console.log()
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Sending Request ...',
			})
			// approveHook.reset()
		} else if (mintRequestHook.isSuccess || mintRequestEthHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Sent Request Successfully!',
			})
			// approveHook.reset()
		} else if (mintRequestHook.isError || mintRequestEthHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Sending Request Failed!`,
			})
			// approveHook.reset()
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

	// useEffect(() => {
	// 	async function getUserNft() {
	// 		if (address) {
	// 			let response = await alchemy.nft.getNftsForOwner(address as string)
	// 			const length = response.ownedNfts.length
	// 			const image = response.ownedNfts[length - 1].rawMetadata?.image
	// 			if (image) {
	// 				setNftImage(image)
	// 			}
	// 		}
	// 	}
	// 	if (mintRequestHook.isSuccess || burnRequestHook.isSuccess) {
	// 		getUserNft()
	// 	}
	// }, [mintRequestHook.isSuccess, burnRequestHook.isSuccess, address, nftImage, setNftImage])

	const toggleCheckbox = () => {
		setChecked(!isChecked)
	}

	const toggleMainnetCheckbox = () => {
		setIsmainnet(!isMainnet)
		console.log(!isMainnet)
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

	function Switching() {
		let switchReserve: Coin = swapFromCur
		changeSwapFromCur(swapToCur)
		changeSwapToCur(switchReserve)
		// let inputReserve = secondInputValue
		setSecondInputValue(firstInputValue)
		// setFirstInputValue(inputReserve)
	}

	const [reserveCoinsList, setreserveCoinsList] = useState<Coin[][]>([
		[
			// {
			// 	id: 0,
			// 	logo: cr5Logo.src,
			// 	name: 'CRYPTO5',
			// 	Symbol: 'CR5',
			// 	address: goerliCrypto5IndexToken,
			// 	factoryAddress: goerliCrypto5Factory,
			// 	decimals: 18
			// },
			{
				id: 1,
				logo: anfiLogo.src,
				name: 'ANFI',
				Symbol: 'ANFI',
				address: goerliAnfiV2IndexToken,
				factoryAddress: goerliAnfiV2Factory,
				decimals: 18,
			},
			{
				id: 2,
				logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
				name: 'Tether',
				Symbol: 'USDT',
				address: goerliUsdtAddress,
				factoryAddress: '',
				decimals: 18,
			},
			{
				id: 3,
				logo: 'https://assets.coincap.io/assets/icons/eth@2x.png',
				name: 'Ethereum',
				Symbol: 'ETH',
				address: goerliWethAddress,
				factoryAddress: '',
				decimals: 18,
			},
		],
	])

	const [allCoinsList, setAllCoinsList] = useState<Coin[][]>([
		[
			// {
			// 	id: 0,
			// 	logo: cr5Logo.src,
			// 	name: 'CRYPTO5',
			// 	Symbol: 'CR5',
			// 	address: goerliCrypto5IndexToken,
			// 	factoryAddress: goerliCrypto5Factory,
			// 	decimals: 18
			// },
			{
				id: 1,
				logo: anfiLogo.src,
				name: 'ANFI',
				Symbol: 'ANFI',
				address: goerliAnfiV2IndexToken,
				factoryAddress: goerliAnfiV2Factory,
				decimals: 18,
			},
			{
				id: 2,
				logo: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
				name: 'Tether',
				Symbol: 'USDT',
				address: goerliUsdtAddress,
				factoryAddress: '',
				decimals: 18,
			},
			{
				id: 3,
				logo: 'https://assets.coincap.io/assets/icons/eth@2x.png',
				name: 'Ethereum',
				Symbol: 'ETH',
				address: goerliWethAddress,
				factoryAddress: '',
				decimals: 18,
			},
		],
	])
	const [coinsList, setCoinsList] = useState<Coin[]>([])

	const [loadingTokens, setLoadingTokens] = useState<boolean>(true)
	const [currentArrayId, setCurrentArrayId] = useState<number>(0)

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
			setAllCoinsList(dividedArrays)
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
		setFirstInputValue(e?.target?.value)
	}

	useEffect(() => {
		const fromNewPrice = Number(firstInputValue) * Number(from1UsdPrice)
		setFromConvertedPrice(fromNewPrice)

		// console.log(Number(secondInputValue), Number(to1UsdPrice))
		// const toNewPrice = Number(secondInputValue) * Number(to1UsdPrice)
		// setToConvertedPrice(toNewPrice)
	}, [from1UsdPrice, firstInputValue, secondInputValue, to1UsdPrice])

	useEffect(() => {
		const toNewPrice = Number(secondInputValue) * Number(to1UsdPrice)
		setToConvertedPrice(toNewPrice)
	}, [secondInputValue, to1UsdPrice])

	useEffect(() => {
		// console.log((Number(from1UsdPrice) / Number(to1UsdPrice)), Number(firstInputValue))
		// console.log((Number(from1UsdPrice) / Number(to1UsdPrice)) * Number(firstInputValue))
		const convertedAmout = (Number(from1UsdPrice) / Number(to1UsdPrice)) * Number(firstInputValue)
		// console.log(convertedAmout)
		if (isMainnet) {
			setSecondInputValue(convertedAmout.toString())
		}
	}, [from1UsdPrice, to1UsdPrice, firstInputValue, isMainnet])

	const changeSecondInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		// if (Number(e?.target?.value)) {
		// setSecondInputValue(Number(e?.target?.value))
		setSecondInputValue(e?.target?.value)
		// }
	}

	function getPrimaryBalance() {
		if (swapFromCur.address == goerliWethAddress) {
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
			}
			// return (Number(fromTokenBalance.data) / 1e18).toFixed(2)
			else
				return FormatToViewNumber({
					// value: Number((fromTokenBalance.data))/1e18,
					value: Number(ethers.utils.formatEther(fromTokenBalance.data)) as number,
					returnType: 'string',
				})
		}
	}

	function getSecondaryBalance() {
		if (swapToCur.address == goerliWethAddress) {
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
				console.log('Balance converted', convertedBalance)
				setUserEthBalance(Number(balance))
			}
		}
		getEtherBalance()
	}, [signer, address])

	// useEffect(() => {
	//     const getEtherBalance = async() => {
	//         if (address && signer) {
	//             const balance = await signer?.provider?.getBalance(address as string);
	//             const convertedBalance = ethers.utils.formatEther(balance as BigNumber);
	//             console.log("Balance converted", convertedBalance)
	//             setUserEthBalance(Number(balance));
	//         }
	//     }
	//     getEtherBalance()
	// },[signer, address])

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
		if (swapFromCur.address == goerliWethAddress) {
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
				await mintRequestHook.mutateAsync({
					args: [swapFromCur.address, (Number(firstInputValue) * 1e18).toString(), '3'],
					overrides: {
						gasLimit: 1000000,
					},
				})
			}
		} catch (error) {
			console.log('mint error', error)
		}
	}

	async function mintRequestEth() {
		try {
			const convertedValue = parseEther(((Number(firstInputValue) * 1001) / 1000)?.toString() as string)
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
				await mintRequestEthHook.mutateAsync({
					args: [(Number(firstInputValue) * 1e18).toString()],
					overrides: {
						gasLimit: 1000000,
						value: convertedValue,
					},
				})
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
				await burnRequestHook.mutateAsync({
					args: [(Number(firstInputValue) * 1e18).toString(), swapToCur.address, '3'],
				})
			}
		} catch (error) {
			console.log('burn error', error)
		}
	}
	const finalCoinList = isMainnet ? coinsList : reserveCoinsList[0]
	const isButtonDisabled = isMainnet || (swapFromCur.Symbol !== 'ANFI' && swapToCur.Symbol !== 'ANFI') ? true : false
	console.log(isMainnet)

	return (
		<>
			<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
			<div className="h-full w-full rounded-xl shadow shadow-blackText-500 flex flex-col items-start justify-start px-4 py-3">
				<h5 className="text-xl text-blackText-500 interBlack mb-3 text-center w-full">Swap</h5>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-base interMedium text-gray-500 w-1/3">You pay</p>
						<div className="w-2/3 h-fit flex flex-row items-center justify-end gap-1 px-2">
							<p
								onClick={() => {
									if (swapFromCur.address == goerliWethAddress) {
										setFirstInputValue('0.00001')
									} else setFirstInputValue('1')
								}}
								className="text-base lg:text-xs text-blackText-500 interBold bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500 active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm"
							>
								MIN
							</p>
							<p
								// onClick={() => setFirstInputValue((Number(getPrimaryBalance()) / 2e18).toString())}
								onClick={() => setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())}
								className="text-base lg:text-xs text-blackText-500 interBold bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500 active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm"
							>
								HALF
							</p>
							<p
								onClick={() => setFirstInputValue(Number(getPrimaryBalance()).toString())}
								className="text-base lg:text-xs text-blackText-500 interBold bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500 active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm"
							>
								MAX
							</p>
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-1">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
							onChange={changeFirstInputValue}
							value={firstInputValue ? firstInputValue : ''}
						/>
						<div
							className="w-fit lg:w-fit gap-2 p-2 h-10 flex flex-row items-center justify-between cursor-pointer"
							onClick={() => {
								openFromCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start w-fit">
								<Image src={swapFromCur.logo} alt={swapFromCur.Symbol} width={20} height={20} className="mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 interBlack pt-1">{swapFromCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
						<span className="text-sm interMedium text-gray-500">≈ ${fromConvertedPrice ? fromConvertedPrice.toFixed(4) : '0.00'}</span>
						<div className="flex flex-row items-center justify-end gap-1">
							<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />
							<span className="text-sm interMedium text-gray-500">
								{getPrimaryBalance()} {swapFromCur.Symbol}
							</span>
						</div>
					</div>
				</div>

				<div className="w-full my-2 px-2 flex flex-row items-center justify-center">
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
					<div
						className="w-fit h-fit rounded-full mx-3 bg-blackText-500 p-2 cursor-pointer"
						onClick={() => {
							Switching()
						}}
					>
						<AiOutlineSwap color="#F2F2F2" size={20} className="rotate-90" />
					</div>
					<div className=" bg-blackText-500 w-2/5 h-[1px]"></div>
				</div>
				<div className="w-full h-fit flex flex-col items-start justify-start">
					<p className="text-base interMedium text-gray-500 pb-1">You Recieve</p>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-2">
						<input
							type="text"
							placeholder="0.00"
							className=" w-2/3 border-none text-2xl text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-transparent active:border-none outline-none focus:border-none p-2"
							onChange={changeSecondInputValue}
							value={secondInputValue && secondInputValue !== 'NaN' ? Number(secondInputValue).toFixed(6) : 0}
						/>
						<div
							className="w-fit lg:w-fit gap-2 p-2 h-10 flex flex-row items-center justify-between  cursor-pointer"
							onClick={() => {
								openToCurrencyModal()
							}}
						>
							<div className="flex flex-row items-center justify-start ">
								<Image src={swapToCur.logo} alt={swapToCur.Symbol} width={20} height={20} className=" mt-1 mr-1"></Image>
								<h5 className="text-xl text-blackText-500 interBlack pt-1">{swapToCur.Symbol}</h5>
							</div>
							<BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
						<span className="text-sm interMedium text-gray-500">≈ ${toConvertedPrice ? FormatToViewNumber({ value: toConvertedPrice, returnType: 'string' }) : '0.00'}</span>
						<div className="flex flex-row items-center justify-end gap-1">
							<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />
							<span className="text-sm interMedium text-gray-500">
								{getSecondaryBalance()} {swapToCur.Symbol}
							</span>
						</div>
					</div>
				</div>
				<div className="pt-8">
					<div className="flex flex-row items-center gap-2">
						<Switch onChange={toggleCheckbox} checked={isChecked} height={14} width={35} handleDiameter={20} />
						<div className="flex flex-row items-center justify-start gap-1">
							<span className="text-gray-700 interMedium text-sm">Use Fiat payment</span>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className=" text-whiteText-500 text-sm interBold mb-2">No cryptocurrencies in your wallet? No problem!</p>
											<p className=" text-whiteText-500 text-sm interMedium">
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
				</div>
				<div className="h-fit w-full mt-6">
					<div className={`w-full h-fit flex flex-row items-center justify-end gap-1 px-2 py-3 mb-3`}>
						{swapToCur.address == goerliAnfiV2IndexToken || swapToCur.address == goerliCrypto5IndexToken ? (
							<>
								{Number(fromTokenAllowance.data) / 1e18 < Number(firstInputValue) && swapFromCur.address != goerliWethAddress ? (
									<button
										onClick={approve}
										disabled={isButtonDisabled}
										className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-full px-2 py-3 rounded ${
											isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
										} hover:bg-colorTwo-500/30`}
									>
										Approve
									</button>
								) : (
									<button
										onClick={mintRequest}
										disabled={isButtonDisabled}
										className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-full px-2 py-3 rounded-lg ${
											isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
										} hover:from-colorFour-500 hover:to-colorSeven-500/90`}
									>
										Mint
									</button>
								)}
							</>
						) : (
							<button
								onClick={burnRequest}
								disabled={isButtonDisabled}
								className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-nexLightRed-500 to-nexLightRed-500/80 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-full px-2 py-3 rounded ${
									isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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
						<p className="text-sm interMedium text-black/70 pb-2">Platform Fees</p>
						<div className="flex flex-row items-center justify-start gap-2">
							<p className="text-sm interMedium text-black/70">
								{FormatToViewNumber({ value: Number(firstInputValue) * 0.001, returnType: 'string' })} {swapFromCur.Symbol} (0.1%)
							</p>
							<GenericTooltip
								color="#5E869B"
								content={
									<div>
										<p className=" text-whiteText-500 text-sm interMedium">
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
							className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${
								isMainnet ? 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 text-white titleShadow' : 'bg-gradient-to-tl from-gray-200 to-gray-100 text-gray-300'
							} interBold text-xl`}
						>
							Mainnet
						</button>
						<button
							onClick={toggleMainnetCheckbox}
							className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${
								!isMainnet ? 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 text-white titleShadow' : 'bg-gradient-to-tl from-gray-200 to-gray-100 text-gray-300'
							} interBold text-xl`}
						>
							Testnet
						</button>
					</div>

					<ReactSearchAutocomplete items={finalCoinList} formatResult={formatResult} autoFocus className="relative z-50" />
					<div className="w-full h-fit max-h-[50vh] bg-white overflow-hidden my-4 px-2">
						<div className="w-full h-fit max-h-[50vh] bg-white overflow-y-auto  py-2" id="coinsList">
							{finalCoinList.map((item, index) => {
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
											<h5 className="text-base text-blackText-500 interBold">{item.Symbol}</h5>
										</div>
										<h5 className="text-sm text-gray-300 inter italic">{item.Symbol}</h5>
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
							className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${
								isMainnet ? 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 text-white titleShadow' : 'bg-gradient-to-tl from-gray-200 to-gray-100 text-gray-300'
							} interBold text-xl`}
						>
							Mainnet
						</button>
						<button
							onClick={toggleMainnetCheckbox}
							className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${
								!isMainnet ? 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 text-white titleShadow' : 'bg-gradient-to-tl from-gray-200 to-gray-100 text-gray-300'
							} interBold text-xl`}
						>
							Testnet
						</button>
					</div>
					<ReactSearchAutocomplete items={finalCoinList} formatResult={formatResult} autoFocus className="relative z-50" />
					<div className="w-full h-fit max-h-[50vh] bg-white overflow-hidden my-4 px-2">
						<div className="w-full h-fit max-h-[50vh] bg-white overflow-y-auto px-2 py-2" id="coinsList">
							{finalCoinList.map((item, index) => {
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
											<h5 className="text-base text-blackText-500 interBold">{item.Symbol}</h5>
										</div>
										<h5 className="text-sm text-gray-300 inter italic">{item.Symbol}</h5>
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
					<Lottie
						animationData={cookingAnimation}
						loop={true}
						style={{
							height: 200,
							width: 400,
							overflow: 'hidden',
						}}
					/>
					<h5 className="InterBold text-blackText-500 text-2xl text-center w-full -mt-6">THE MAGIC IS HAPPENING...</h5>
					<h5 className="interMedium text-blackText-500 text-lg text-center w-9/12 my-2">
						Your NFT receipt is being minted. Once it is ready, you can find it the {'"'}Receipts{'"'} section.
					</h5>
				</div>
			</GenericModal>
		</>
	)
}

export default SwapV2
