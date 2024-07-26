import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAIndexChartBox from "@/components/pwa/PWAIndexChartBox";
import PWAIndexComparisonBox from "@/components/pwa/PWAIndexComparisonBox";
import { useChartDataStore, useLandingPageStore } from "@/store/store";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { CiStar } from "react-icons/ci";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'
import { IoIosArrowDown, IoMdArrowForward } from "react-icons/io";
import { TbCurrencySolana } from "react-icons/tb";
import { SiBinance, SiRipple, SiTether } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { GrBitcoin } from "react-icons/gr";
import { MdMoreHoriz } from "react-icons/md";
import { GiMetalBar } from "react-icons/gi";
// import HistoryTable from "@/components/TradeTable";
import { NewHistoryTable as HistoryTable } from "@/components/NewHistoryTable";
import { ReactElement, useEffect, useState } from "react";
import Sheet from 'react-modal-sheet';



import logo from "@assets/images/xlogo2.png"
import router from "next/router";
import axios from "axios";
import useTradePageStore from "@/store/tradeStore";
import { goerliAnfiV2IndexToken, goerliCR5PoolAddress, goerliCrypto5IndexToken, goerlianfiPoolAddress, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken, sepoliaWethAddress } from '@/constants/contractAddresses'
import { UseContractResult, useContract, useContractRead } from '@thirdweb-dev/react'
import { indexTokenV2Abi } from '@/constants/abi'
import { reduceAddress } from '@/utils/general'
import { FormatToViewNumber, num } from '@/hooks/math'
import convertToUSD from '@/utils/convertToUsd'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { sepoliaTokens } from '@/constants/testnetTokens'
import getPoolAddress from '@/utils/getPoolAddress'
import { AssetChips, PWAGradientStack } from "@/theme/overrides";
import Link from "next/link";
import { Shimmer } from 'react-shimmer'
import Skeleton from '@mui/material/Skeleton';


type underlyingAsset = {
    name: string
    percentage: number
    symbol: string
    logo: ReactElement
}


export default function PWATradeIndex() {

    const [isSheetOpen, setSheetOpen] = useState<boolean>(false);
    const [isReadMore, setIsReadMore] = useState<boolean>(true)
    const { changePWATradeoperation, selectedIndex, changeSelectedIndex } = useLandingPageStore()
    const { indexChangePer } = useChartDataStore()
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const { fetchIndexData, setDayChangePer, loading, STOCK5Data } = useChartDataStore()
    const { ethPriceInUsd, changeDefaultIndex } = useTradePageStore()
    useEffect(() => {
        fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
    }, [fetchIndexData])

    useEffect(() => {
        setDayChangePer()
        // setANFIWeightage()
    }, [setDayChangePer])
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
            const anfiTokenData = sepoliaTokens.find((d) => d.address === sepoliaAnfiV2IndexToken) as { address: string, decimals: number }
            const cr5TokenData = sepoliaTokens.find((d) => d.address === sepoliaCrypto5V2IndexToken) as { address: string, decimals: number }

            const marketPriceANFIUSD = await convertToUSD({ tokenAddress: anfiTokenData.address, tokenDecimals: anfiTokenData.decimals }, ethPriceInUsd, false)
            const marketPriceCR5USD = await convertToUSD({ tokenAddress: cr5TokenData.address, tokenDecimals: cr5TokenData.decimals }, ethPriceInUsd, false)

            setMktPrice({ anfi: marketPriceANFIUSD as number, cr5: marketPriceCR5USD as number })
        }

        getPrice()
    }, [ethPriceInUsd])

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
			mktPrice: 0,
			chg24h: indexChangePer.anfi,
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
			mktPrice: 0,
			chg24h: indexChangePer.cr5,
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
			tokenAddress: "0x955b3F0091414E7DBbe7bdf2c39d73695CDcDd95",
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
			tokenAddress: "0x58484111fC370bdb19AeaE6336cDb745A3006b4d",
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

    const defaultIndexObject = IndicesWithDetails.find((o) => o.shortSymbol === selectedIndex || o.symbol === selectedIndex || o.name === selectedIndex)

    const IndexContract: UseContractResult = useContract(defaultIndexObject?.tokenAddress, indexTokenV2Abi)
    const feeRate = useContractRead(IndexContract.contract, 'feeRatePerDayScaled').data / 1e18
    const totalSupply = useContractRead(IndexContract.contract, 'totalSupply')

    if (defaultIndexObject) {
        defaultIndexObject.managementFee = feeRate.toFixed(2)
        defaultIndexObject.totalSupply = num(totalSupply.data).toFixed(2)
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



    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingTop={5} paddingBottom={2} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <Stack width={"100%"} height={"fit-content"} paddingTop={2} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>

                <Stack direction={"row"} width={"100%"} height={"fit-content"} alignItems={"center"} justifyContent={"space-between"}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"}>
                        <Typography variant="h6" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700
                        }}>
                            {defaultIndexObject?.symbol}
                        </Typography>
                        <Stack marginX={1} direction="row" alignItems="center" justifyContent="start" onClick={() => { setSheetOpen(true) }}>
                            {
                                selectedIndex == "ANFI" ? (
                                    <Stack direction="row" alignItems="center" justifyContent="start">
                                        {[...ANFIUnderLyingAssets].sort((a, b) => b.percentage - a.percentage).slice(0, 2).map((asset, key) => {
                                            return (
                                                <Stack
                                                    key={key}
                                                    padding={"4px"}
                                                    marginLeft={`${(key * -1 * 8) / 2}px`}
                                                    zIndex={key * 10}
                                                    width={"fit-content"}
                                                    borderRadius={"0.5rem"}
                                                    sx={AssetChips}
                                                >
                                                    <span className={`text-whiteText-500`}>
                                                        {asset.logo}
                                                    </span>
                                                </Stack>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Stack direction="row" alignItems="center" justifyContent="start">
                                        {[...CR5UnderLyingAssets].sort((a, b) => b.percentage - a.percentage).slice(0, 2).map((asset, key) => {
                                            return (
                                                <Stack
                                                    key={key}
                                                    padding={"4px"}
                                                    marginLeft={`${(key * -1 * 8) / 2}px`}
                                                    zIndex={key * 10}
                                                    width={"fit-content"}
                                                    borderRadius={"0.5rem"}
                                                    sx={AssetChips}
                                                >
                                                    <span className={`text-whiteText-500`}>
                                                        {asset.logo}
                                                    </span>
                                                </Stack>
                                            );
                                        })}
                                    </Stack>
                                )
                            }
                        </Stack>
                        <MdMoreHoriz size={25} color={lightTheme.palette.text.primary} className=" mt-4" onClick={() => { setSheetOpen(true) }} />
                    </Stack>
                    {
                        isFavorite ?
                            (<MdOutlineStar size={28} color="#ffd700" className="mb-[2px]" onClick={() => { setIsFavorite(!isFavorite) }} />)
                            : (<MdOutlineStarBorder size={28} color={lightTheme.palette.text.primary} className="mb-[2px]" onClick={() => { setIsFavorite(!isFavorite) }} />)
                    }

                </Stack>
            </Stack>
            <PWAIndexComparisonBox/>
            <PWAIndexChartBox/>
            <Stack width={"100%"} height={"fit-content"} marginY={1} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                <Button onClick={() => {
                    //changePWATradeoperation("sell") 
                    if (defaultIndexObject?.shortDescription) {
                        changeDefaultIndex(defaultIndexObject.shortSymbol.toString())
                        changeSelectedIndex(defaultIndexObject.symbol.toString())
                    }
                    router.push('/pwa_trade_console_defi')
                }}
                    sx={{
                        width: "100%",
                        paddingY: "1rem",
                        background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                        boxShadow: "none"
                    }}>
                    <Typography variant="h3" component="h3" className="w-full" sx={{
                        color: lightTheme.palette.text.primary,
                        fontSize: "1.6rem",
                        textShadow: "none"
                    }} >
                        Trade
                    </Typography>
                </Button>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    More About {defaultIndexObject?.symbol.toString().toUpperCase()}
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500
                }}>
                    {
                        isReadMore ? defaultIndexObject?.description.slice(0, 100) + "..." : defaultIndexObject?.description
                    }

                </Typography>
                <Link className="w-full h-fit flex flex-row items-center justify-center" href="" onClick={(e) => { e.preventDefault(); setIsReadMore(!isReadMore) }}>
                    {
                        isReadMore ? (
                            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={0.5} padding={0} marginTop={"0.6rem"}>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.gradientHeroBg,
                                    fontWeight: 700,
                                }}>
                                    Show More
                                </Typography>
                                <IoChevronDownOutline color={lightTheme.palette.gradientHeroBg} size={20} />
                            </Stack>
                        ) : (
                            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={0.5}>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.gradientHeroBg,
                                    fontWeight: 700,
                                }}>
                                    Show Less
                                </Typography>
                                <IoChevronUpOutline color={lightTheme.palette.gradientHeroBg} size={20} />
                            </Stack>
                        )
                    }
                </Link>

            </Stack>

            <Stack width={"100%"} height={"fit-content"} marginY={2} direction={"column"} alignItems={"center"} justifyContent={"start"} paddingY={"1rem"} paddingX={"0.8rem"} borderRadius={"1.2rem"} marginTop={"1.4rem"} sx={PWAGradientStack}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700,
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "1rem"
                }}>
                    Key Information
                </Typography>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Market Cap
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: "#374952",
                        fontWeight: 500
                    }}>
                        {
                            defaultIndexObject?.mktCap ? (
                                <>
                                    {FormatToViewNumber({ value: Number(defaultIndexObject?.mktCap), returnType: 'string' }) + ' ' + defaultIndexObject?.shortSymbol}
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: "#D4D4D4" }} />
                                </>
                            )
                        }


                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"0.5px"} marginY={"0.8rem"} sx={{backgroundColor: "#000000"}}/>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Market Price
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: "#374952",
                        fontWeight: 500
                    }}>
                        {
                            defaultIndexObject?.mktPrice ? (
                                <>
                                    ${FormatToViewNumber({ value: Number(defaultIndexObject?.mktPrice), returnType: 'string' })}
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: "#D4D4D4" }} />
                                </>
                            )
                        }

                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"0.5px"} marginY={"0.8rem"} sx={{backgroundColor: "#000000"}}/>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        24h Change
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: defaultIndexObject?.chg24h && Number(defaultIndexObject?.chg24h) < 0 ? "#F23645" : "#089981",
                        fontWeight: 600,
                        fontSize: ".8rem",
                        backgroundColor: lightTheme.palette.pageBackground.main,
                        paddingX: "0.8rem",
                        paddingY: "0.2rem",
                        borderRadius: "1rem",
                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"

                    }}>
                        {
                            defaultIndexObject?.chg24h ? (
                                <>
                                    {defaultIndexObject?.chg24h}%
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: "#D4D4D4" }} />
                                </>
                            )
                        }

                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"0.5px"} marginY={"0.8rem"} sx={{backgroundColor: "#000000"}}/>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Token Address
                    </Typography>
                    <Link target="_blank" href={`https://sepolia.etherscan.io/token/${defaultIndexObject?.tokenAddress}`}>
                        <Typography variant="caption" sx={{
                            color: "#374952",
                            fontWeight: 500,
                        }}>
                            {
                                defaultIndexObject?.tokenAddress ? (
                                    <>
                                        {reduceAddress(defaultIndexObject?.tokenAddress as string)}
                                    </>
                                ) : (
                                    <>
                                        <Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: "#D4D4D4" }} />
                                    </>
                                )
                            }

                        </Typography>
                    </Link>

                </Stack>
                <Stack width={"100%"} height={"0.5px"} marginY={"0.8rem"} sx={{backgroundColor: "#000000"}}/>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Managment Fees
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: "#374952",
                        fontWeight: 500
                    }}>
                        {
                            defaultIndexObject?.managementFee ? (
                                <>
                                    {defaultIndexObject?.managementFee} %
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: "#D4D4D4" }} />
                                </>
                            )
                        }

                    </Typography>
                </Stack>
            </Stack>
            <HistoryTable maxPWAHeight={false}/>
            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                snapPoints={selectedIndex == "ANFI" ? [250, 250, 0, 0] : [370, 370, 0, 0]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Stack direction={"column"} height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"start"} paddingX={2} paddingY={1}>
                            <Typography variant="h6" align="center" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 700
                            }}>
                                {defaultIndexObject?.symbol} Composition
                            </Typography>


                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} marginY={3} id="haha" >
                                {
                                    selectedIndex == "ANFI" ? (
                                        <Stack direction="column" alignItems="center" justifyContent="start" width={"100%"} gap={1.5} >
                                            {[...ANFIUnderLyingAssets].sort((a, b) => b.percentage - a.percentage).map((asset, key) => {
                                                return (
                                                    <Stack key={key} direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                                                        <Stack width={"fit-content"} height={"fit-content"} direction="row" alignItems={"center"} justifyContent={"center"} gap={1}>
                                                            <Stack
                                                                key={key}
                                                                padding={"4px"}
                                                                marginLeft={`${(key * -1 * 3) / 2}px`}
                                                                zIndex={key * 10}
                                                                width={"fit-content"}
                                                                borderRadius={"0.5rem"}
                                                                sx={AssetChips}
                                                            >
                                                                <span className={`text-whiteText-500`}>
                                                                    {asset.logo}
                                                                </span>
                                                            </Stack>
                                                            <Typography variant="body1" sx={{
                                                                color: lightTheme.palette.text.primary,
                                                                fontWeight: 700
                                                            }}>
                                                                {asset.name}
                                                            </Typography>
                                                        </Stack>

                                                        <Typography variant="body1" sx={{
                                                            color: lightTheme.palette.gradientHeroBg,
                                                            fontWeight: 600
                                                        }}>
                                                            {asset.percentage}%
                                                        </Typography>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Stack direction="column" alignItems="center" justifyContent="start" width={"100%"} gap={1.5}>
                                            {[...CR5UnderLyingAssets].sort((a, b) => b.percentage - a.percentage).map((asset, key) => {
                                                return (
                                                    <Stack key={key} direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                                                        <Stack width={"fit-content"} height={"fit-content"} direction="row" alignItems={"center"} justifyContent={"center"} gap={1}>
                                                            <Stack
                                                                key={key}
                                                                padding={"4px"}
                                                                marginLeft={`${(key * -1 * 3) / 2}px`}
                                                                zIndex={key * 10}
                                                                width={"fit-content"}
                                                                borderRadius={"0.5rem"}
                                                                sx={AssetChips}
                                                            >
                                                                <span className={`text-whiteText-500`}>
                                                                    {asset.logo}
                                                                </span>
                                                            </Stack>
                                                            <Typography variant="body1" sx={{
                                                                color: lightTheme.palette.text.primary,
                                                                fontWeight: 700
                                                            }}>
                                                                {asset.name}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="body1" sx={{
                                                            color: lightTheme.palette.gradientHeroBg,
                                                            fontWeight: 600
                                                        }}>
                                                            {asset.percentage}%
                                                        </Typography>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    )
                                }

                            </Stack>
                        </Stack>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => { setSheetOpen(false) }} />
            </Sheet>
            <PWABottomNav/>
        </Box>
    )
}