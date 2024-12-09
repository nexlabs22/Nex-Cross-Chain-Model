import React, { createContext, useState, useEffect, useContext, ReactElement } from 'react'
import Image, { StaticImageData } from 'next/image'
import {
	sepoliaAnfiV2IndexToken,	
	sepoliaArbeiIndexTokenAddress,
	sepoliaCrypto5V2IndexToken,
	sepoliaMAG7IndexTokenAddress,
} from '@/constants/contractAddresses'
import { UseContractResult, useContract, useContractRead } from '@thirdweb-dev/react'
import { indexTokenV2Abi, tokenAbi } from '@/constants/abi'
import axios from 'axios'
import { FormatToViewNumber, num } from '@/hooks/math'
import convertToUSD from '@/utils/convertToUsd'
import useTradePageStore from '@/store/tradeStore'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { sepoliaTokens } from '@/constants/testnetTokens'

//Components
import DashboardChartBox from '@/components/dashboard/ChartBox'
import { Accordion, AccordionItem } from '@szhsin/react-accordion'
import GenericAddressTooltip from '@/components/GenericAddressTooltip'
import GenericTooltip from '@/components/GenericTooltip'

// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Media && Icons :
import managment from '@assets/images/managment.png'
import { GrBitcoin, GrFormClose } from 'react-icons/gr'
import { BsInfoCircle, BsNvidia } from 'react-icons/bs'
import { FaAmazon, FaApple, FaEthereum, FaGoogle } from 'react-icons/fa'
import { SiTether, SiBinance, SiRipple, SiTesla } from 'react-icons/si'
import { TfiMicrosoftAlt } from 'react-icons/tfi'

import { AiOutlinePlus } from 'react-icons/ai'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { CgArrowsExchange } from 'react-icons/cg'
import { TbCurrencySolana } from 'react-icons/tb'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'
import { GoArrowRight } from 'react-icons/go'
import mesh1 from '@assets/images/mesh1.png'
import { FaMeta } from 'react-icons/fa6'
import { LuSailboat } from 'react-icons/lu'

import arb from '@assets/images/arbitrum.png'
import aave from '@assets/images/aave.png'
import clipper from '@assets/images/clipper.png'
import pendle from '@assets/images/pendle.png'
import silo from '@assets/images/silo.png'
import pancake from '@assets/images/pancake.png'
import dodo from '@assets/images/dodo.png'
import dxsale from '@assets/images/dxsale.png'
import convex from '@assets/images/convex.png'
import joe from '@assets/images/joe.png'

import penpie from "@assets/icons/crypto/penpie.webp"

import { AAVELogo, CLIPPERLogo, PENDLELogo, SILOLogo, PANCAKELogo, DODOLogo, DXSALELogo, CONVEXLogo, JOELogo, BITCOINLogo, ETHLogo, SOLANALogo, XRPLogo, BNBLogo, XAUTLogo, ARBITRUMLogo } from '@assets/icons/crypto/cryptoLogos'
import { AMAZONLogo, MICROSOFTLogo, GOOGLELogo, NVIDIALogo, TESLALogo, APPLELogo, METALogo } from '@/assets/icons/stocks/stocksLogos';
import { indexDetailsType, indexWithDetailsType, Product, underlyingAsset } from '@/types/nexTokenData'
import { indexObjectEmpty, productsEmpty } from './initialvalues'
import { reduceAddress } from '@/utils/general'


interface DashboardContextProps {
	IndicesWithDetails: indexWithDetailsType[]
	anfiIndexObject:
		| indexDetailsType
		| undefined
	cr5IndexObject:
	| indexDetailsType
	| undefined
	mag7IndexObject:
	| indexDetailsType
	| undefined
	arbIndexObject:
	| indexDetailsType
	| undefined
	IndexContract: UseContractResult | null
	feeRate: number
	totalSupply: any
	CR5UnderLyingAssets: underlyingAsset[]
	ANFIUnderLyingAssets: underlyingAsset[]
	MAG7UnderLyingAssets: underlyingAsset[]
	ARBInUnderLyingAssets: underlyingAsset[]
	SmallCR5UnderLyingAssets: underlyingAsset[]
	SmallANFIUnderLyingAssets: underlyingAsset[]
	SmallMAG7UnderLyingAssets: underlyingAsset[]
	SmallARBInUnderLyingAssets: underlyingAsset[]
	indexDetailsMap: {[key:string]: indexDetailsType | undefined}
	indexUnderlyingAssetsMap: {[key:string]: underlyingAsset[]}
	products: Product[],
	getANFIWeights(): Promise<void>
	getCR5Weights(): Promise<void>
	getMAG7Weights(): Promise<void>
	getARBInWeights(): Promise<void>
}

const DashboardContext = createContext<DashboardContextProps>({
	IndicesWithDetails: [],
	anfiIndexObject: indexObjectEmpty,
	cr5IndexObject: indexObjectEmpty,
	mag7IndexObject: indexObjectEmpty,
	arbIndexObject: indexObjectEmpty,
	IndexContract: null,
	feeRate: 0,
	totalSupply: null,
	CR5UnderLyingAssets: [],
	ANFIUnderLyingAssets: [],
	MAG7UnderLyingAssets: [],
	ARBInUnderLyingAssets: [],
	SmallCR5UnderLyingAssets: [],
	SmallANFIUnderLyingAssets: [],
	SmallMAG7UnderLyingAssets: [],
	SmallARBInUnderLyingAssets: [],	
	indexDetailsMap: {},
	indexUnderlyingAssetsMap: {},
	products: productsEmpty,
	getANFIWeights: () => Promise.resolve(),
	getCR5Weights: () => Promise.resolve(),
	getMAG7Weights: () => Promise.resolve(),
	getARBInWeights: () => Promise.resolve(),
})

const useDashboard = () => {
	return useContext(DashboardContext)
}

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
	const { defaultIndex, changeDefaultIndex, theme } = useLandingPageStore()
	const { fetchIndexData, setDayChangePer, loading, STOCK5Data, indexChangePer } = useChartDataStore()
	const { ethPriceInUsd } = useTradePageStore()

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	useEffect(() => {
		setDayChangePer()
		// setANFIWeightage()
	}, [setDayChangePer])

	const [todayPrice, setTodayPrice] = useState<{ [key: string]: number }>({ anfi: 0, cr5: 0, mag7: 0, arbei: 0 })

	

	useEffect(() => {
		async function getPrice() {
			const anfiTokenData = sepoliaTokens.find((d) => d.address === sepoliaAnfiV2IndexToken) as { address: string; decimals: number }
			const cr5TokenData = sepoliaTokens.find((d) => d.address === sepoliaCrypto5V2IndexToken) as { address: string; decimals: number }
			const mag7TokenData = sepoliaTokens.find((d) => d.address === sepoliaMAG7IndexTokenAddress) as { address: string; decimals: number }
			const arbeiTokenData = sepoliaTokens.find((d) => d.address === sepoliaArbeiIndexTokenAddress) as { address: string; decimals: number }

			const marketPriceANFIUSD = await convertToUSD({ tokenAddress: anfiTokenData.address, tokenDecimals: anfiTokenData.decimals }, ethPriceInUsd, false)
			const marketPriceCR5USD = await convertToUSD({ tokenAddress: cr5TokenData.address, tokenDecimals: cr5TokenData.decimals }, ethPriceInUsd, false)
			const marketPriceMAG7USD = await convertToUSD({ tokenAddress: mag7TokenData.address, tokenDecimals: mag7TokenData.decimals }, ethPriceInUsd, false)
			const marketPriceARBEIUSD = await convertToUSD({ tokenAddress: arbeiTokenData.address, tokenDecimals: arbeiTokenData.decimals }, ethPriceInUsd, false)

			setTodayPrice({ anfi: marketPriceANFIUSD as number, cr5: marketPriceCR5USD as number, mag7: marketPriceMAG7USD, arbei: marketPriceARBEIUSD })
		}

		getPrice()
	}, [ethPriceInUsd])

	// here you go
	const [IndicesWithDetails, setIndicesWithDetails] = useState([
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
			mktPrice: 0,
			chg24h: indexChangePer.anfi,
			tokenAddress: sepoliaAnfiV2IndexToken,
			managementFee: '1.00',
			totalSupply: '78622.32',
			predictedIncome: 60,
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
			mktPrice: 0,
			chg24h: indexChangePer.cr5,
			tokenAddress: sepoliaCrypto5V2IndexToken,
			managementFee: '1.00',
			totalSupply: '78622.32',
			predictedIncome: 60,
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
		{
			name: 'Magnificent 7 Index',
			logo: mag7Logo,
			symbol: 'MAG7',
			shortSymbol: 'MAG7',
			shortDescription:
				'The Magnificent 7 (MG7) refers to the top seven tech-driven companies dominating the stock market: Meta Platforms, Amazon, Apple, Netflix, Alphabet, Microsoft, and Nvidia. These companies hold significant market power, robust pricing, and strong earnings potential. The term, coined in 2023 by Michael Hartnett of Bank of America, reflects their innovative capabilities and dominant positions. MG7 is the first tokenized stocks index of this type, offering new digital investment opportunities on blockchain platforms.',
			description:
				'The Magnificent 7 (MG7) refers to the top seven tech-driven companies dominating the stock market: Meta Platforms, Amazon, Apple, Netflix, Alphabet, Microsoft, and Nvidia. These companies hold significant market power, robust pricing, and strong earnings potential. The term, coined in 2023 by Michael Hartnett of Bank of America, reflects their innovative capabilities and dominant positions. MG7 is the first tokenized stocks index of this type, offering new digital investment opportunities on blockchain platforms.',
			mktCap: 0,
			mktPrice: 0,
			chg24h: indexChangePer.mag7,
			tokenAddress: sepoliaMAG7IndexTokenAddress,
			managementFee: '1.00',
			totalSupply: '78622.32',
			predictedIncome: 60,
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
		{
			name: 'Arbitrum Ecosystem Index',
			logo: arbLogo,
			symbol: 'ARBEI',
			shortSymbol: 'ARBEI',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			mktCap: 0,
			mktPrice: 0,
			chg24h: indexChangePer.arbei,
			tokenAddress: sepoliaArbeiIndexTokenAddress,
			managementFee: '1.00',
			totalSupply: '78622.32',
			predictedIncome: 60,
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
	])

	useEffect(() => {
		setIndicesWithDetails((prevState) =>
			prevState.map((item) => ({
				...item,
				chg24h: indexChangePer[item.shortSymbol.toLowerCase()],
				mktPrice: todayPrice[item.shortSymbol.toLowerCase()],
			}))
		)
	}, [indexChangePer, todayPrice])

	const anfiIndexObject = IndicesWithDetails.find((o) => o.symbol === 'ANFI')
	const cr5IndexObject = IndicesWithDetails.find((o) => o.symbol === 'CRYPTO5')
	const mag7IndexObject = IndicesWithDetails.find((o) => o.symbol === 'MAG7')
	const arbIndexObject = IndicesWithDetails.find((o) => o.symbol === 'ARBEI')

	const IndexContractANFI: UseContractResult = useContract(anfiIndexObject?.tokenAddress, indexTokenV2Abi)
	const feeRateANFI = useContractRead(IndexContractANFI.contract, 'feeRatePerDayScaled').data / 1e18
	const totalSupplyANFI = useContractRead(IndexContractANFI.contract, 'totalSupply')

	const IndexContractCR5: UseContractResult = useContract(cr5IndexObject?.tokenAddress, indexTokenV2Abi)
	const feeRateCR5 = useContractRead(IndexContractCR5.contract, 'feeRatePerDayScaled').data / 1e18
	const totalSupplyCR5 = useContractRead(IndexContractCR5.contract, 'totalSupply')
	
	const IndexContractMAG7: UseContractResult = useContract(mag7IndexObject?.tokenAddress, indexTokenV2Abi)
	const totalSupplyMAG7 = useContractRead(IndexContractMAG7.contract, 'totalSupply')

	const IndexContractARBEI: UseContractResult = useContract(arbIndexObject?.tokenAddress, indexTokenV2Abi)
	const totalSupplyARBEI = useContractRead(IndexContractARBEI.contract, 'totalSupply')


	if (anfiIndexObject) {
		anfiIndexObject.managementFee = !!feeRateANFI ? feeRateANFI.toFixed(2) : '1.00'
		anfiIndexObject.totalSupply = num(totalSupplyANFI.data).toFixed(2)
		anfiIndexObject.mktCap = num(totalSupplyANFI.data) * anfiIndexObject.mktPrice
	}
	if (cr5IndexObject) {
		cr5IndexObject.managementFee = feeRateCR5.toFixed(2)
		cr5IndexObject.totalSupply = num(totalSupplyCR5.data).toFixed(2)
		cr5IndexObject.mktCap = num(totalSupplyCR5.data) * cr5IndexObject.mktPrice
	}
	if (mag7IndexObject) {
		mag7IndexObject.totalSupply = num(totalSupplyMAG7.data).toFixed(2)
		mag7IndexObject.mktCap = num(totalSupplyMAG7.data) * mag7IndexObject.mktPrice
	}
	if (arbIndexObject) {
		arbIndexObject.totalSupply = num(totalSupplyARBEI.data).toFixed(2)
		arbIndexObject.mktCap = num(totalSupplyARBEI.data) * arbIndexObject.mktPrice
	}

	const products = [
		{
			name: 'CRYPTO 5',
			symbol: 'CRYPTO5',
			logo: cr5Logo.src,
			address: reduceAddress(sepoliaCrypto5V2IndexToken),
			totalSupply: FormatToViewNumber({value: num(totalSupplyCR5.data), returnType:'string'}) +' '+ 'CR5',
			category: ['cefi','defi'],
			subcategory: 'sub2',
		},
		{
			name: 'Anti Inflation Index',
			symbol: 'ANFI',
			logo: anfiLogo.src,
			address: reduceAddress(sepoliaAnfiV2IndexToken),
			totalSupply: FormatToViewNumber({value: num(totalSupplyANFI.data), returnType:'string'}) +' '+ 'ANFI',
			category: ['cefi','defi'],
			subcategory: 'sub1',
		},
		{
			name: 'Magnificent 7 Index',
			symbol: 'MAG7',
			logo: mag7Logo.src,
			address: reduceAddress(sepoliaMAG7IndexTokenAddress),
			totalSupply: FormatToViewNumber({value: num(totalSupplyMAG7.data), returnType:'string'}) +' '+ 'MAG7',
			category: ['cefi','defi'],
			subcategory: 'sub1',
		},
		{
			name: 'Arbitrum Ecosystem Index',
			symbol: 'ARBEI',
			logo: arbLogo.src,
			address: reduceAddress(sepoliaArbeiIndexTokenAddress),
			totalSupply: FormatToViewNumber({value: num(totalSupplyARBEI.data), returnType:'string'}) +' '+ 'ARBEI',
			category: ['cefi','defi'],
			subcategory: 'sub1',
		}
	]

	const [CR5UnderLyingAssets, setCR5UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [ANFIUnderLyingAssets, setANFIUnderLyingAssets] = useState<underlyingAsset[]>([])
	const [MAG7UnderLyingAssets, setMAG7UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [ARBInUnderLyingAssets, setARBInUnderLyingAssets] = useState<underlyingAsset[]>([])

	const [SmallCR5UnderLyingAssets, setSmallCR5UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [SmallANFIUnderLyingAssets, setSmallANFIUnderLyingAssets] = useState<underlyingAsset[]>([])
	const [SmallMAG7UnderLyingAssets, setSmallMAG7UnderLyingAssets] = useState<underlyingAsset[]>([])
	const [SmallARBInUnderLyingAssets, setSmallARBInUnderLyingAssets] = useState<underlyingAsset[]>([])

	async function getANFIWeights() {
		try {
			const response = await axios.get('/api/getWeights')
			const RawANFIUnderlyingAssets = response.data.anfi

			// Big logos for POR section :

			setANFIUnderLyingAssets([])

			const assets = RawANFIUnderlyingAssets.map((underLyingAssetData: { name: string; weight: any }) => {
				const Asset: underlyingAsset = {
					name: underLyingAssetData.name === 'bitcoin' ? 'Bitcoin' : 'Gold',
					logo: underLyingAssetData.name === 'bitcoin' ? <BITCOINLogo /> : <XAUTLogo />,
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
					logo: underLyingAssetData.name === 'bitcoin' ? <BITCOINLogo /> : <XAUTLogo />,
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
							<BITCOINLogo />
						) : underLyingAssetData.name === 'ethereum' ? (
							<ETHLogo />
						) : underLyingAssetData.name === 'binancecoin' ? (
							<BNBLogo />
						) : underLyingAssetData.name === 'ripple' ? (
							<XRPLogo />
						) : (
							<SOLANALogo />
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
							<BITCOINLogo />
						) : underLyingAssetData.name === 'ethereum' ? (
							<ETHLogo />
						) : underLyingAssetData.name === 'binancecoin' ? (
							<BNBLogo />
						) : underLyingAssetData.name === 'ripple' ? (
							<XRPLogo />
						) : (
							<SOLANALogo />
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

	async function getMAG7Weights() {
		try {
			const response = await axios.get('/api/getWeights')
			const RawMAG7UnderlyingAssets = response.data.mag7

			setMAG7UnderLyingAssets([])

			const assets = RawMAG7UnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
				const Asset: underlyingAsset = {
					name: underLyingAssetData.symbol.toUpperCase(),
					// eslint-disable-next-line react/jsx-no-undef
					logo:
						underLyingAssetData.symbol === 'AAPL' ? (
							<APPLELogo />
						) : underLyingAssetData.symbol === 'GOOG' ? (
							<GOOGLELogo />
						) : underLyingAssetData.symbol === 'MSFT' ? (
							<MICROSOFTLogo />
						) : underLyingAssetData.symbol === 'NVDA' ? (
							<NVIDIALogo />
						) : underLyingAssetData.symbol === 'AMZN' ? (
							<AMAZONLogo />
						) : underLyingAssetData.symbol === 'META' ? (
							<METALogo />
						) : (
							<TESLALogo />
						),
					symbol: underLyingAssetData.symbol,
					percentage: underLyingAssetData.weight,
				}
				return Asset
			})

			setMAG7UnderLyingAssets(assets)

			setSmallMAG7UnderLyingAssets([])
			const smallAssets = RawMAG7UnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
				const SmallAsset: underlyingAsset = {
					name: underLyingAssetData.symbol.toUpperCase(),
					// eslint-disable-next-line react/jsx-no-undef
					logo:
						underLyingAssetData.symbol === 'AAPL' ? (
							<APPLELogo />
						) : underLyingAssetData.symbol === 'GOOG' ? (
							<GOOGLELogo />
						) : underLyingAssetData.symbol === 'MSFT' ? (
							<MICROSOFTLogo />
						) : underLyingAssetData.symbol === 'NVDA' ? (
							<NVIDIALogo />
						) : underLyingAssetData.symbol === 'AMZN' ? (
							<AMAZONLogo />
						) : underLyingAssetData.symbol === 'META' ? (
							<METALogo />
						) : (
							<TESLALogo />
						),
					symbol: underLyingAssetData.symbol,
					percentage: underLyingAssetData.weight,
				}
				return SmallAsset
			})

			setSmallMAG7UnderLyingAssets(smallAssets)
		} catch (error) {
			console.error('Error fetching MAG7 weights:', error)
		}
	}

	async function getARBInWeights() {
		try {
			const response = await axios.get('/api/getWeights')
			const RawARBInUnderlyingAssets = response.data.arbei

			//Big logos for POR section :
			setARBInUnderLyingAssets([])

			const assets = RawARBInUnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
				const Asset: underlyingAsset = {
					name: underLyingAssetData.symbol.split('_')[0].toUpperCase(),
					logo:
						underLyingAssetData.symbol === 'ARB' ? (
							<ARBITRUMLogo />
						) : underLyingAssetData.symbol === 'AAVE' ? (
							<AAVELogo />
						) : underLyingAssetData.symbol === 'CLIPPER' ? (
							<CLIPPERLogo />
						) : underLyingAssetData.symbol === 'PENDLE' ? (
							<PENDLELogo />
						) : underLyingAssetData.symbol === 'SILO_FINANCE' ? (
							<SILOLogo />
						) : underLyingAssetData.symbol === 'PANCAKESWAP_AMM' ? (
							<PANCAKELogo />
						) : underLyingAssetData.symbol === 'DODO' ? (
							<DODOLogo />
						) : underLyingAssetData.symbol === 'DXSALE' ? (
							<DXSALELogo />
						) : underLyingAssetData.symbol == 'PENPIE' ? (
							<Image src={penpie} alt="PENPIE" width={60} height={60} style={{ scale: '1.2' }} />
						) : underLyingAssetData.symbol == 'CONVEX_FINANCE' ? (
							<CONVEXLogo />
						) : underLyingAssetData.symbol == 'JOE_V21' ? (
							<JOELogo />
						) : (
							<span></span>
						),
					symbol: underLyingAssetData.symbol,
					percentage: underLyingAssetData.weight,
				}
				return Asset
			})

			setARBInUnderLyingAssets(assets)

			// SMall logos for chart box card :
			setSmallARBInUnderLyingAssets([])
			const Smallassets = RawARBInUnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
				const SmallAsset: underlyingAsset = {
					name: underLyingAssetData.symbol.split('_')[0].toUpperCase(),
					logo:
						underLyingAssetData.symbol === 'ARB' ? (
							<ARBITRUMLogo />
						) : underLyingAssetData.symbol === 'AAVE' ? (
							<AAVELogo />
						) : underLyingAssetData.symbol === 'CLIPPER' ? (
							<CLIPPERLogo />
						) : underLyingAssetData.symbol === 'PENDLE' ? (
							<PENDLELogo />
						) : underLyingAssetData.symbol === 'SILO_FINANCE' ? (
							<SILOLogo />
						) : underLyingAssetData.symbol === 'PANCAKESWAP_AMM' ? (
							<PANCAKELogo />
						) : underLyingAssetData.symbol === 'DODO' ? (
							<DODOLogo />
						) : underLyingAssetData.symbol === 'DXSALE' ? (
							<DXSALELogo />
						) : underLyingAssetData.symbol == 'PENPIE' ? (
							<Image src={penpie} alt="PENPIE" width={60} height={60} style={{ scale: '1.2' }} />
						) : underLyingAssetData.symbol == 'CONVEX_FINANCE' ? (
							<CONVEXLogo />
						) : underLyingAssetData.symbol == 'JOE_V21' ? (
							<JOELogo />
						) : (
							<span></span>
						),
					symbol: underLyingAssetData.symbol,
					percentage: underLyingAssetData.weight,
				}
				return SmallAsset
			})

			setSmallARBInUnderLyingAssets(Smallassets)
		} catch (error) {
			console.error('Error fetching ARBIn weights:', error)
		}
	}

	const indexDetailsMap = {
		'ANFI': anfiIndexObject,
		'CRYPTO5' : cr5IndexObject,
		'MAG7' : mag7IndexObject,
		'ARBEI' : arbIndexObject
	}
	const indexUnderlyingAssetsMap = {
		'ANFI': ANFIUnderLyingAssets,
		'CRYPTO5' : CR5UnderLyingAssets,
		'MAG7' : MAG7UnderLyingAssets,
		'ARBEI' : ARBInUnderLyingAssets
	}

	useEffect(() => {
		getANFIWeights()
		getCR5Weights()
		getMAG7Weights()
		getARBInWeights()
		//setIndicesWithDetails((prevState)=>[...new Set(IndicesWithDetails)]);
	}, [])

	const contextValue = {
		IndicesWithDetails: IndicesWithDetails,
		anfiIndexObject: anfiIndexObject,
		cr5IndexObject: cr5IndexObject,
		mag7IndexObject: mag7IndexObject,
		arbIndexObject: arbIndexObject,
		IndexContract: IndexContractANFI,
		feeRate: feeRateANFI,
		totalSupply: totalSupplyANFI,
		CR5UnderLyingAssets: CR5UnderLyingAssets,
		ANFIUnderLyingAssets: ANFIUnderLyingAssets,
		MAG7UnderLyingAssets: MAG7UnderLyingAssets,
		ARBInUnderLyingAssets: ARBInUnderLyingAssets,
		SmallCR5UnderLyingAssets: SmallCR5UnderLyingAssets,
		SmallANFIUnderLyingAssets: SmallANFIUnderLyingAssets,
		SmallMAG7UnderLyingAssets: SmallMAG7UnderLyingAssets,
		SmallARBInUnderLyingAssets: SmallARBInUnderLyingAssets,
		indexDetailsMap: indexDetailsMap,
		indexUnderlyingAssetsMap: indexUnderlyingAssetsMap,
		products: products,
		getANFIWeights: getANFIWeights,
		getCR5Weights: getCR5Weights,
		getMAG7Weights: getMAG7Weights,
		getARBInWeights: getARBInWeights,
	}
	return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

export { DashboardContext, DashboardProvider, useDashboard }
