'use client'

import Image from 'next/image'
import Link from 'next/link'

//Components
import DashboardChartBox from './ChartBox'
import { Accordion, AccordionItem } from '@szhsin/react-accordion'
import GenericAddressTooltip from '../GenericAddressTooltip'
import TradingViewChart from '@/components/TradingViewChart'

// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Logos and icons :
import { GrBitcoin, GrFormClose } from 'react-icons/gr'
import { BsInfoCircle } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { SiTether, SiBinance, SiRipple } from 'react-icons/si'
import { AiOutlinePlus } from 'react-icons/ai'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { IoCopyOutline, IoClose } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { CgArrowsExchange } from 'react-icons/cg'
import { TbCurrencySolana } from 'react-icons/tb'
import { ReactElement, useEffect, useState } from 'react'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import etherscanLogo from '@assets/images/etherscan.png'
import managment from '@assets/images/managment.png'
import GenericTooltip from '../GenericTooltip'
import { goerliAnfiV2IndexToken, goerliCR5PoolAddress, goerliCrypto5IndexToken, goerlianfiPoolAddress, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken, sepoliaWethAddress } from '@/constants/contractAddresses'
import { UseContractResult, useContract, useContractRead } from '@thirdweb-dev/react'
import { indexTokenV2Abi } from '@/constants/abi'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import getANFIWeights from '@/utils/anfiWeights'

import { GoArrowRight } from 'react-icons/go'
import { stringify } from 'querystring'

import axios from 'axios'
import { reduceAddress } from '@/utils/general'
import { FormatToViewNumber, num } from '@/hooks/math'
import convertToUSD from '@/utils/convertToUsd'
import useTradePageStore from '@/store/tradeStore'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { sepoliaTokens } from '@/constants/testnetTokens'
import getPoolAddress from '@/utils/getPoolAddress'

type underlyingAsset = {
	name: string
	percentage: number
	symbol: string
	logo: ReactElement
}

const TopIndexData = () => {
	const { mode } = useLandingPageStore()
	const { defaultIndex, changeDefaultIndex } = useLandingPageStore()
	const { setANFIWeightage, fetchIndexData, setDayChangePer, loading, STOCK5Data } = useChartDataStore() 
	const { ethPriceInUsd } = useTradePageStore()

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	useEffect(() => {
		setDayChangePer()
		// setANFIWeightage()
	}, [setANFIWeightage, setDayChangePer])

	const [mktPrice, setMktPrice] = useState({ anfi: 0, cr5: 0 })
	const [dayChange, setDayChange] = useState({ anfi: '0.00', cr5: '0.00' })
	const {
		loading: loadingAnfi,
		error: errorAnfi,
		data: dataAnfi,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerlianfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	const {
		loading: loadingCR5,
		error: errorCR5,
		data: dataCR5,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerliCR5PoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	useEffect(() => {
		async function get24hDayChangePer() {
			if (!loadingCR5 && !loadingAnfi && !errorCR5 && !errorAnfi) {
				const ANFIData = dataAnfi.poolDayDatas
				const CR5Data = dataCR5.poolDayDatas

				const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price || 0
				const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price || 0
				const anfi24hChng = ((todayANFIPrice - yesterdayANFIPrice) / yesterdayANFIPrice) * 100

				const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price || 0
				const yesterdayCR5Price = CR5Data[CR5Data.length - 2]?.token0Price || 0
				const cr524hChng = ((todayCR5Price - yesterdayCR5Price) / yesterdayCR5Price) * 100

				// setDayChange({ anfi: todayANFIPrice - yesterdayANFIPrice, cr5: todayCR5Price - yesterdayCR5Price })
				setDayChange({ anfi: anfi24hChng.toFixed(2), cr5: cr524hChng.toFixed(2) })
			}
		}

		get24hDayChangePer()
	}, [loadingCR5, loadingAnfi, errorCR5, errorAnfi])

	useEffect(() => {
		async function getPrice() {
			const anfiTokenData = sepoliaTokens.find((d) => d.address === sepoliaAnfiV2IndexToken) as {address:string, decimals:number}
			const cr5TokenData = sepoliaTokens.find((d) => d.address === sepoliaCrypto5V2IndexToken) as {address:string, decimals:number}

			const marketPriceANFIUSD = await convertToUSD({tokenAddress:anfiTokenData.address, tokenDecimals:anfiTokenData.decimals}, ethPriceInUsd, false)
			const marketPriceCR5USD = await convertToUSD({tokenAddress:cr5TokenData.address, tokenDecimals:cr5TokenData.decimals}, ethPriceInUsd, false)
			
			setMktPrice({ anfi: marketPriceANFIUSD as number, cr5: marketPriceCR5USD as number })
		}

		getPrice()
	}, [ethPriceInUsd])

	// useEffect(() => {
	// 	async function getPrice() {
	// 		try {
	// 			const anfiTokenData = sepoliaTokens.find((d) => d.address === sepoliaAnfiV2IndexToken) as { address: string, decimals: number };
	// 			const cr5TokenData = sepoliaTokens.find((d) => d.address === sepoliaCrypto5V2IndexToken) as { address: string, decimals: number };
	
	// 			console.log("anfiTokenData:", anfiTokenData);
	// 			console.log("anfiTokenData:", { tokenAddress: anfiTokenData.address, tokenDecimals: anfiTokenData.decimals });
	// 			console.log("cr5TokenData:", cr5TokenData);
	// 			console.log("cr5TokenData:", { tokenAddress: cr5TokenData.address, tokenDecimals: cr5TokenData.decimals });
	
	// 			if (!anfiTokenData || !cr5TokenData) {
	// 				console.error("Token data not found.");
	// 				return;
	// 			}

	// 			const marketPriceANFIUSD = await convertToUSD({ tokenAddress: anfiTokenData.address, tokenDecimals: anfiTokenData.decimals }, ethPriceInUsd, false) as number
	// 			const marketPriceCR5USD = await convertToUSD({ tokenAddress: cr5TokenData.address, tokenDecimals: cr5TokenData.decimals }, ethPriceInUsd, false) as number
	
	// 			console.log("marketPriceANFIUSD:", marketPriceANFIUSD);
	// 			console.log("marketPriceCR5USD:", marketPriceCR5USD);
	
	// 			if (isNaN(marketPriceANFIUSD) || isNaN(marketPriceCR5USD)) {
	// 				console.error("Invalid market price data.");
	// 				return;
	// 			}
	
	// 			setMktPrice({ anfi: marketPriceANFIUSD, cr5: marketPriceCR5USD });
	// 		} catch (error) {
	// 			console.error("Error fetching market prices:", error);
	// 		}
	// 	}
	
	// 	getPrice();
	// }, [ethPriceInUsd, sepoliaTokens, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken]);
	

	const IndicesWithDetails = [
		{
			name: 'ANFI',
			logo: anfiLogo,
			symbol: 'ANFI',
			shortSymbol: 'ANFI',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				"The Anti-inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures.\nGold has traditionally been a reliable investment. Nevertheless, it's worth considering that Bitcoin, often referred to as 'digital gold,' has the potential to assume a prominent role in everyday life in the future.",
			mktCap: 0,
			mktPrice: mktPrice.anfi,
			chg24h: dayChange.anfi,
			tokenAddress: sepoliaAnfiV2IndexToken,
			managementFee: '1.00',
			totalSupply: '78622.32',
			underlyingAssets: [
				{
					symbol: 'XAUT',
					name: 'gold',
					percentage: 70,
					bgColor: '#A9C3B6',
					hoverColor: '#D4B460',
					logo: <SiTether size={20} color="#F2F2F2" />,
				},
				{
					symbol: 'BTC',
					name: 'bitcoin',
					percentage: 30,
					bgColor: '#BBC8C2',
					hoverColor: '#F7931A',
					logo: <GrBitcoin color="#F2F2F2" size={20} />,
				},
			],
		},
		{
			name: 'CRYPTO 5',
			logo: cr5Logo,
			symbol: 'CRYPTO5',
			shortSymbol: 'CR5',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				'The "Crypto 5 Index" represents a meticulously curated basket of assets designed to provide investors with a secure and diversified entry into the digital assets industry. It not only offers stability through its carefully selected assets but also presents substantial growth potential. This makes it an ideal choice for crypto investors seeking a balanced and reliable investment option in the ever-evolving cryptocurrency landscape.',
			mktCap: 0,
			mktPrice: mktPrice.cr5,
			chg24h: dayChange.cr5,
			tokenAddress: sepoliaCrypto5V2IndexToken,
			managementFee: '1.00',
			totalSupply: '78622.32',
			underlyingAssets: [
				{
					symbol: 'BTC',
					name: 'bitcoin',
					percentage: 50,
					bgColor: '#A9C3B6',
					hoverColor: '#F7931A',
					logo: <GrBitcoin color="#F2F2F2" size={20} />,
				},
				{
					symbol: 'ETH',
					name: 'ethereum',
					percentage: 25,
					bgColor: '#BBC8C2',
					hoverColor: '#627EEA',
					logo: <FaEthereum color="#F2F2F2" size={19} />,
				},
				{
					symbol: 'BNB',
					name: 'binancecoin',
					percentage: 8,
					bgColor: '#C7CECA',
					hoverColor: '#FCD535',
					logo: <SiBinance color="#F2F2F2" size={19} />,
				},
				{
					symbol: 'XRP',
					name: 'riplle',
					percentage: 12,
					bgColor: '#C7CECA',
					hoverColor: '#009393',
					logo: <SiRipple color="#F2F2F2" size={19} />,
				},

				{
					symbol: 'SOL',
					name: 'solana',
					percentage: 5,
					bgColor: '#C7CECA',
					hoverColor: '#2775CA',
					logo: <TbCurrencySolana color="#F2F2F2" size={19} />,
				},
			],
		},
	]

	const defaultIndexObject = IndicesWithDetails.find((o) => o.symbol === defaultIndex)
	const othertIndexObject = IndicesWithDetails.find((o) => o.symbol != defaultIndex)

	const IndexContract: UseContractResult = useContract(defaultIndexObject?.tokenAddress, indexTokenV2Abi)
	const feeRate = useContractRead(IndexContract.contract, 'feeRatePerDayScaled').data / 1e18
	const totalSupply = useContractRead(IndexContract.contract, 'totalSupply')
	// console.log(num(totalSupply.data))

	if (defaultIndexObject) {
		defaultIndexObject.managementFee = feeRate.toFixed(2)
		defaultIndexObject.totalSupply = num(totalSupply.data).toFixed(2)
		// console.log(num(totalSupply.data) * defaultIndexObject.mktPrice)
		defaultIndexObject.mktCap = num(totalSupply.data) * defaultIndexObject.mktPrice
	}
	const [CR5UnderLyingAssets, setCR5UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [ANFIUnderLyingAssets, setANFIUnderLyingAssets] = useState<underlyingAsset[]>([])

	const [SmallCR5UnderLyingAssets, setSmallCR5UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [SmallANFIUnderLyingAssets, setSmallANFIUnderLyingAssets] = useState<underlyingAsset[]>([])

	async function getANFIWeights() {
		try {
			const response = await axios.get('/api/getWeights')
			const RawANFIUnderlyingAssets = response.data.anfi

			// Big logos for POR section :

			setANFIUnderLyingAssets([])

			const assets = RawANFIUnderlyingAssets.map((underLyingAssetData: { name: string; weight: any }) => {
				const Asset: underlyingAsset = {
					name: underLyingAssetData.name === 'bitcoin' ? 'Bitcoin' : 'Gold',
					logo: underLyingAssetData.name === 'bitcoin' ? <GrBitcoin color="#FFFFFF" size={20} /> : <SiTether color="#FFFFFF" size={20} />,
					symbol: underLyingAssetData.name === 'bitcoin' ? 'BTC' : 'XAUT',
					percentage: underLyingAssetData.weight,
				}
				return Asset
			})

			setANFIUnderLyingAssets(assets)

			// Small Logos for chart box card :
			setSmallANFIUnderLyingAssets([])
			const Smallassets = RawANFIUnderlyingAssets.map((underLyingAssetData: { name: string; weight: any }) => {
				const SmallAsset: underlyingAsset = {
					name: underLyingAssetData.name === 'bitcoin' ? 'Bitcoin' : 'Gold',
					logo: underLyingAssetData.name === 'bitcoin' ? <GrBitcoin color="#FFFFFF" size={22} /> : <SiTether color="#FFFFFF" size={22} />,
					symbol: underLyingAssetData.name === 'bitcoin' ? 'BTC' : 'XAUT',
					percentage: underLyingAssetData.weight,
				}
				return SmallAsset
			})

			setSmallANFIUnderLyingAssets(Smallassets)
		} catch (error) {
			console.error('Error fetching ANFI weights:', error)
		}
	}
	async function getCR5Weights() {
		try {
			const response = await axios.get('/api/getWeights')
			const RawCR5UnderlyingAssets = response.data.cr5

			//Big logos for POR section :
			setCR5UnderLyingAssets([])

			const assets = RawCR5UnderlyingAssets.map((underLyingAssetData: { name: string; weight: any }) => {
				const Asset: underlyingAsset = {
					name:
						underLyingAssetData.name === 'bitcoin'
							? 'Bitcoin'
							: underLyingAssetData.name === 'ethereum'
							? 'Ethereum'
							: underLyingAssetData.name === 'binancecoin'
							? 'Binance Coin'
							: underLyingAssetData.name === 'ripple'
							? 'Ripple XRP'
							: 'Solana',
					logo:
						underLyingAssetData.name === 'bitcoin' ? (
							<GrBitcoin color="#FFFFFF" size={20} />
						) : underLyingAssetData.name === 'ethereum' ? (
							<FaEthereum color="#FFFFFF" size={20} />
						) : underLyingAssetData.name === 'binancecoin' ? (
							<SiBinance color="#FFFFFF" size={20} />
						) : underLyingAssetData.name === 'ripple' ? (
							<SiRipple color="#FFFFFF" size={20} />
						) : (
							<TbCurrencySolana color="#FFFFFF" size={20} />
						),
					symbol:
						underLyingAssetData.name === 'bitcoin'
							? 'BTC'
							: underLyingAssetData.name === 'ethereum'
							? 'ETH'
							: underLyingAssetData.name === 'binancecoin'
							? 'BNB'
							: underLyingAssetData.name === 'ripple'
							? 'XRP'
							: 'SOL',
					percentage: underLyingAssetData.weight,
				}
				return Asset
			})

			setCR5UnderLyingAssets(assets)

			// SMall logos for chart box card :
			setSmallCR5UnderLyingAssets([])
			const Smallassets = RawCR5UnderlyingAssets.map((underLyingAssetData: { name: string; weight: any }) => {
				const SmallAsset: underlyingAsset = {
					name:
						underLyingAssetData.name === 'bitcoin'
							? 'Bitcoin'
							: underLyingAssetData.name === 'ethereum'
							? 'Ethereum'
							: underLyingAssetData.name === 'binancecoin'
							? 'Binance Coin'
							: underLyingAssetData.name === 'ripple'
							? 'Ripple XRP'
							: 'Solana',
					logo:
						underLyingAssetData.name === 'bitcoin' ? (
							<GrBitcoin color="#FFFFFF" size={22} />
						) : underLyingAssetData.name === 'ethereum' ? (
							<FaEthereum color="#FFFFFF" size={22} />
						) : underLyingAssetData.name === 'binancecoin' ? (
							<SiBinance color="#FFFFFF" size={22} />
						) : underLyingAssetData.name === 'ripple' ? (
							<SiRipple color="#FFFFFF" size={22} />
						) : (
							<TbCurrencySolana color="#FFFFFF" size={22} />
						),
					symbol:
						underLyingAssetData.name === 'bitcoin'
							? 'BTC'
							: underLyingAssetData.name === 'ethereum'
							? 'ETH'
							: underLyingAssetData.name === 'binancecoin'
							? 'BNB'
							: underLyingAssetData.name === 'ripple'
							? 'XRP'
							: 'SOL',
					percentage: underLyingAssetData.weight,
				}
				return SmallAsset
			})

			setSmallCR5UnderLyingAssets(Smallassets)
		} catch (error) {
			console.error('Error fetching CR5 weights:', error)
		}
	}

	useEffect(() => {
		getANFIWeights()
		getCR5Weights()
	}, [])

	// useEffect(() => {
	// 	console.log('CR5 : ', CR5UnderLyingAssets)
	// }, [CR5UnderLyingAssets])

	// useEffect(() => {
	// 	console.log('CR5 : ', SmallCR5UnderLyingAssets)
	// }, [SmallCR5UnderLyingAssets])

	// useEffect(() => {
	// 	console.log('ANFI :', ANFIUnderLyingAssets)
	// }, [ANFIUnderLyingAssets])

	// useEffect(() => {
	// 	console.log('ANFI :', SmallANFIUnderLyingAssets)
	// }, [SmallANFIUnderLyingAssets])

	return (
		<section className="px-2 h-fit lg:px-10 py-6 xl:pt-16">
			<div className="flex h-fit xl:h-fit flex-row items-stretch justify-between gap-1 xl:gap-4 mb-6">
				<div
					className={`w-full lg:w-1/2 xl:flex-grow xl:min-h-full rounded-2xl py-3 xl:py-6 ${
						mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-md shadow-blackText-500/50'
					} `}
					style={{
						boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
						backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
					}}
				>
					<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
						<div className="flex flex-row items-center justify-start">
							<Image src={defaultIndexObject?.logo ? defaultIndexObject?.logo : ''} alt="" height={35} width={35} className="mr-2"></Image>
							<h5 className={`interBlack mr-3 text-lg xl:text-2xl lg:text-4xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} titleShadow`}>{defaultIndexObject?.name}</h5>
						</div>
					</div>
					<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
						{defaultIndexObject?.symbol == 'ANFI' ? (
							<div className="flex flex-row items-center justify-start">
								{[...ANFIUnderLyingAssets]
									.sort((a, b) => b.percentage - a.percentage)
									.map((asset, i) => {
										const zindex = i * 10
										return (
											<div
												key={i}
												className={`aspect-square w-fit rounded-lg ${
													mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
												}  p-[4px] `}
												style={{
													zIndex: `'${zindex}'`,
													marginLeft: '-2%',
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
											</div>
										)
									})}
							</div>
						) : (
							<div className="flex flex-row items-center justify-start">
								{[...CR5UnderLyingAssets]
									.sort((a, b) => b.percentage - a.percentage)
									.map((asset, i) => {
										const zindex = i * 10
										return (
											<div
												key={i}
												className={`aspect-square w-fit rounded-lg ${
													mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
												}  p-[4px] `}
												style={{
													zIndex: `'${zindex}'`,
													marginLeft: '-2%',
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
											</div>
										)
									})}
							</div>
						)}
					</div>
					<div className={`hidden xl:block w-full h-[1px] ${mode == 'dark' ? 'bg-gray-300' : 'bg-blackText-500'}  my-4`}></div>
					<h5 className={`interMedium hidden xl:block px-6 w-full text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} titleShadow`}>{defaultIndexObject?.description}</h5>
				</div>
				<div
					className={`w-full lg:w-1/2 xl:flex-grow xl:min-h-full rounded-2xl py-3 xl:py-6 border-[2px] ${
						mode == 'dark' ? ' border-gray-400/50 hover:shadow-gray-400/50' : 'border-gray-300 hover:shadow-gray-200'
					} cursor-pointer hover:shadow-md  shadow-md shadow-blackText-500/50`}
					onClick={() => {
						if (defaultIndexObject && defaultIndexObject.symbol == 'CRYPTO5') {
							changeDefaultIndex('ANFI')
						} else {
							changeDefaultIndex('CRYPTO5')
						}
					}}
				>
					<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
						<div className="flex flex-row items-center justify-start">
							<Image src={othertIndexObject?.logo ? othertIndexObject?.logo : ''} alt="" height={35} width={35} className="mr-2"></Image>
							<h5 className={`interBlack mr-3 text-lg xl:text-2xl lg:text-4xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{othertIndexObject?.name} </h5>
						</div>
						<div
							className={`hidden xl:flex flex-row items-center justify-center gap-1 ${
								mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
							} active:translate-y-[1px] active:shadow-black  py-2 px-4 rounded-full`}
							style={{
								boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
								backgroundSize: mode == 'dark' ? '120%' : '',
							}}
						>
							<h5 className="text-sm interMedium text-whiteText-500">See {othertIndexObject?.name}</h5>
						</div>
					</div>
					<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
						{othertIndexObject?.symbol == 'ANFI' ? (
							<div className="flex flex-row items-center justify-start">
								{[...ANFIUnderLyingAssets]
									.sort((a, b) => b.percentage - a.percentage)
									.map((asset, i) => {
										const zindex = i * 10
										return (
											<div
												key={i}
												className={`aspect-square w-fit rounded-lg ${
													mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
												}  p-[4px] `}
												style={{
													zIndex: `'${zindex}'`,
													marginLeft: '-2%',
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
											</div>
										)
									})}
							</div>
						) : (
							<div className="flex flex-row items-center justify-start">
								{[...CR5UnderLyingAssets]
									.sort((a, b) => b.percentage - a.percentage)
									.map((asset, i) => {
										const zindex = i * 10
										return (
											<div
												key={i}
												className={`aspect-square w-fit rounded-lg ${
													mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
												}  p-[4px] `}
												style={{
													zIndex: `'${zindex}'`,
													marginLeft: '-2%',
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
											</div>
										)
									})}
							</div>
						)}
					</div>
					<div className="w-full hidden xl:block h-[1px] bg-gray-300 my-4"></div>
					<h5 className={`interMedium hidden xl:block px-6 w-full text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{othertIndexObject?.description}</h5>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-center">
				<div className={`h-[1px] w-full ${mode == 'dark' ? ' bg-whiteBackground-500/80' : 'bg-blackText-500/20'} `}></div>
			</div>
			<div className="hidden my-2 lg:flex flex-row items-stretch justify-between gap-24">
				<div className="flex w-2/6 py-12 flex-grow flex-row items-center justify-between">
					<div>
						<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Market Cap</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Market Cap:</p>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
												The total value of a cryptocurrency, calculated by multiplying its price by the circulating supply. It indicates the cryptocurrency{"'"}s significance in the
												market.
											</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
							</span>
						</div>

						<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>
							{FormatToViewNumber({ value: Number(defaultIndexObject?.mktCap), returnType: 'string' }) + ' ' + defaultIndexObject?.shortSymbol}
						</h5>
					</div>
					<div>
						<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Market Price</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Market Price:</p>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
												The current value of a single unit of cryptocurrency in the market, indicating its buying or selling cost.
											</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
							</span>
						</div>
						<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>
							${FormatToViewNumber({ value: Number(defaultIndexObject?.mktPrice), returnType: 'string' })}
						</h5>
					</div>
					<div>
						<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>24h Change</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>24h Change:</p>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
												the percentage difference in a cryptocurrency{"'"}s price over the past day, reflecting recent price performance.
											</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
							</span>
						</div>
						<h5 className={`interMedium text-base  ${defaultIndexObject?.chg24h && Number(defaultIndexObject?.chg24h) > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500'}`}>
							{defaultIndexObject?.chg24h}%
						</h5>
					</div>
				</div>
				<div className="w-4/6 flex-grow flex flex-row items-stretch justify-between">
					<div className="flex-grow w-1/3 flex flex-col items-start justify-center">
						<div className="mb-5 flex w-full flex-row items-center justify-start gap-1">
							<div className="mr-5 flex min-w-max flex-row items-center justify-between">
								<CiGlobe color="#9CAAC6" size={20} />
								<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : ' text-blackText-500'} `}>Token address</h5>
							</div>
							<div className="flex flex-row items-center justify-between gap-1">
								<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} `}>{reduceAddress(defaultIndexObject?.tokenAddress as string)}</h5>
								<GenericAddressTooltip
									color="#5E869B"
									address={defaultIndexObject?.tokenAddress as string}
									totalSupply={defaultIndexObject?.totalSupply as string}
									name={defaultIndexObject?.name as string}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
								</GenericAddressTooltip>
							</div>
						</div>
						<div className="flex w-full flex-row items-center justify-start">
							<div className="mr-5 flex flex-row items-center justify-between">
								<CiStreamOn color="#9CAAC6" size={20} />
								<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Management Fees</h5>
							</div>
							<div className="flex flex-row items-center justify-between gap-1">
								<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{defaultIndexObject?.managementFee} %</h5>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Management Fees:</p>
											<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
												We charge a competitive 1.5% annual management fee on assets under management, similar to traditional ETF providers.
											</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
								</GenericTooltip>
							</div>
						</div>
					</div>
					<div className="flex-grow min-h-full p-2 w-2/3 flex flex-row items-center justify-end">
						<div
							className={`w-2/3 relative overflow-hidden h-full ${
								mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'
							} rounded-2xl`}
							style={{
								boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
							}}
						>
							<Image src={managment} alt="managment section" className="absolute z-10 -right-32 -bottom-40 scale-50"></Image>
							<div className="absolute h-full top-0 left-0 w-4/5 z-50 flex flex-col items-start justify-start p-4">
								<h5 className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} titleShadow text-2xl mb-3`}>Nexlabs Fees</h5>

								<Link href={'https://nex-labs.gitbook.io/nex-dex/protocol-structure/fees'}>
									<button
										className={`interBold flex h-fit mt-3 w-fit flex-row items-center justify-center gap-1 rounded-2xl bg-gradient-to-tl ${
											mode == 'dark' ? 'titleShadow bg-cover bg-center bg-no-repeat text-whiteText-500' : 'from-colorFour-500 to-colorSeven-500 text-blackText-500'
										}  px-5 py-3 text-2xl shadow-sm shadow-blackText-500 active:translate-y-[1px] active:shadow-black `}
										style={{
											backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
										}}
									>
										<span>Learn More</span>
										{mode == 'dark' ? <GoArrowRight color="#FFFFFF" size={30} /> : <GoArrowRight color="#252525" size={30} />}
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="block xl:hidden w-full h-fit text-blackText-500 py-6">
				<Accordion className="w-full">
					<AccordionItem
						header={
							<div className="w-full h-fit flex flex-row items-center justify-between px-2">
								<h5 className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-xl interBlack`}>{'More About ' + defaultIndexObject?.name.toString()}</h5>
								{mode == 'dark' ? <AiOutlinePlus color="#FFFFFF" size={25}></AiOutlinePlus> : <AiOutlinePlus color="#000000" size={25}></AiOutlinePlus>}
							</div>
						}
					>
						<div className="w-full h-fit flex flex-col items-start justify-start gap-2 px-2 py-3">
							<h5 className={`interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-xl`}>{defaultIndexObject?.description}</h5>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 grid-col gap-y-5 lg:hidden px-2 py-5">
							<div className="flex flex-col items-center justify-center">
								<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Market Cap</h5>
								<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Market Price</h5>
								<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>24h Change</h5>
								<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Managment Fees</h5>
								<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
							</div>
						</div>
						<div className="flex flex-row items-center justify-center gap-1 lg:hidden px-2">
							<CiGlobe color="#9CAAC6" size={20} />
							<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Token address</h5>
						</div>
						<div className="flex flex-row items-center justify-center gap-2 lg:hidden px-2 py-2">
							<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A</h5>

							<BsInfoCircle color="#5E869B" size={25} />
						</div>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="flex w-full flex-row items-center justify-center">
				<div className={`h-[1px] w-full ${mode == 'dark' ? ' bg-whiteBackground-500/80' : 'bg-blackText-500/20'} `}></div>
			</div>

			<div>
				<div className="w-full h-fit flex flex-row items-center justify-between">
					<div className="mt-6 xl:mt-10 mb-5 flex flex-row items-center justify-center lg:justify-start">
						<h5 className={`interBlack  text-xl lg:text-2xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{defaultIndexObject?.symbol}</h5>
						{mode == 'dark' ? <CgArrowsExchange color="#FFFFFF" size={35} className="mx-2" /> : <CgArrowsExchange color="#5E869B" size={35} className="mx-2" />}

						<h5 className={`interBlack  text-xl lg:text-2xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>World{"'"}s best assets</h5>
						<div
							className={`w-fit h-fit p-3 ml-2 hidden lg:flex flex-row items-center justify-center gap-2 rounded-3xl ${
								mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
							} `}
							style={{
								boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
							}}
						>
							<h5 className={`text-sm interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>{defaultIndexObject?.name}</h5>
						</div>
					</div>
				</div>

				<div className="h-fit w-full">
					<DashboardChartBox />
					{/* <TradingViewChart index={defaultIndex}/> */}
				</div>
			</div>
		</section>
	)
}

export default TopIndexData
