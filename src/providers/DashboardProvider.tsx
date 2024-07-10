import React, { createContext, useState, useEffect, useContext, ReactElement } from 'react';
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { goerliCR5PoolAddress, goerlianfiPoolAddress, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken } from '@/constants/contractAddresses'
import { UseContractResult, useContract, useContractRead } from '@thirdweb-dev/react'
import { indexTokenV2Abi } from '@/constants/abi'
import axios from 'axios'
import { num } from '@/hooks/math'
import convertToUSD from '@/utils/convertToUsd'
import useTradePageStore from '@/store/tradeStore'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { sepoliaTokens } from '@/constants/testnetTokens'


// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Media && Icons : 
import { GrBitcoin } from 'react-icons/gr'
import { FaEthereum } from 'react-icons/fa'
import { SiTether, SiBinance, SiRipple } from 'react-icons/si'


import { TbCurrencySolana } from 'react-icons/tb'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'



import penpie from "@assets/icons/crypto/penpie.webp"

import { AAVELogo, CLIPPERLogo, PENDLELogo, SILOLogo, PANCAKELogo, DODOLogo, DXSALELogo, CONVEXLogo, JOELogo, BITCOINLogo, ETHLogo, SOLANALogo, XRPLogo, BNBLogo, XAUTLogo } from '@assets/icons/crypto/cryptoLogos'
import { AMAZONLogo, MICROSOFTLogo, GOOGLELogo, NVIDIALogo, TESLALogo, APPLELogo, METALogo } from '@/assets/icons/stocks/stocksLogos';


type underlyingAsset = {
    name: string
    percentage: number
    symbol: string
    logo: ReactElement
}

interface DashboardContextProps {
    mktPrice: {
        anfi: number;
        cr5: number;
    };
    dayChange: {
        anfi: string;
        cr5: string;
    };
    IndicesWithDetails: {
        name: string;
        logo: StaticImageData;
        symbol: string;
        shortSymbol: string;
        shortDescription: string;
        description: string;
        mktCap: number;
        mktPrice: number;
        chg24h: string;
        tokenAddress: string;
        managementFee: string;
        totalSupply: string;
        underlyingAssets: underlyingAsset[];
    }[];
    anfiIndexObject: {
        name: string;
        logo: StaticImageData | null;
        symbol: string;
        shortSymbol: string;
        shortDescription: string;
        description: string;
        mktCap: number;
        mktPrice: number;
        chg24h: string;
        tokenAddress: string;
        managementFee: string;
        totalSupply: string;
        underlyingAssets: underlyingAsset[]
    } | undefined;
    cr5IndexObject: {
        name: string;
        logo: StaticImageData | null;
        symbol: string;
        shortSymbol: string;
        shortDescription: string;
        description: string;
        mktCap: number;
        mktPrice: number;
        chg24h: string;
        tokenAddress: string;
        managementFee: string;
        totalSupply: string;
        underlyingAssets: underlyingAsset[]
    } | undefined;
    mag7IndexObject: {
        name: string;
        logo: StaticImageData | null;
        symbol: string;
        shortSymbol: string;
        shortDescription: string;
        description: string;
        mktCap: number;
        mktPrice: number;
        chg24h: string;
        tokenAddress: string;
        managementFee: string;
        totalSupply: string;
        underlyingAssets: underlyingAsset[]
    } | undefined;
    arbIndexObject: {
        name: string;
        logo: StaticImageData | null;
        symbol: string;
        shortSymbol: string;
        shortDescription: string;
        description: string;
        mktCap: number;
        mktPrice: number;
        chg24h: string;
        tokenAddress: string;
        managementFee: string;
        totalSupply: string;
        underlyingAssets: underlyingAsset[]
    } | undefined;
    IndexContract: UseContractResult | null;
    feeRate: number;
    totalSupply: any
    CR5UnderLyingAssets: underlyingAsset[];
    ANFIUnderLyingAssets: underlyingAsset[];
    MAG7UnderLyingAssets: underlyingAsset[];
    ARBInUnderLyingAssets: underlyingAsset[];
    SmallCR5UnderLyingAssets: underlyingAsset[];
    SmallANFIUnderLyingAssets: underlyingAsset[];
    SmallMAG7UnderLyingAssets: underlyingAsset[];
    SmallARBInUnderLyingAssets: underlyingAsset[];
    getANFIWeights(): Promise<void>
    getCR5Weights(): Promise<void>
    getMAG7Weights(): Promise<void>
    getARBInWeights(): Promise<void>
}



const DashboardContext = createContext<DashboardContextProps>({
    mktPrice: { anfi: 0, cr5: 0 },
    dayChange: { anfi: "0.00", cr5: "0.00" },
    IndicesWithDetails: [],
    anfiIndexObject: {
        name: "",
        logo: null,
        symbol: "",
        shortSymbol: "",
        shortDescription: "",
        description: "",
        mktCap: 0,
        mktPrice: 0,
        chg24h: "",
        tokenAddress: "",
        managementFee: "",
        totalSupply: "",
        underlyingAssets: [],
    },
    cr5IndexObject: {
        name: "",
        logo: null,
        symbol: "",
        shortSymbol: "",
        shortDescription: "",
        description: "",
        mktCap: 0,
        mktPrice: 0,
        chg24h: "",
        tokenAddress: "",
        managementFee: "",
        totalSupply: "",
        underlyingAssets: [],
    },
    mag7IndexObject: {
        name: "",
        logo: null,
        symbol: "",
        shortSymbol: "",
        shortDescription: "",
        description: "",
        mktCap: 0,
        mktPrice: 0,
        chg24h: "",
        tokenAddress: "",
        managementFee: "",
        totalSupply: "",
        underlyingAssets: [],
    },
    arbIndexObject: {
        name: "",
        logo: null,
        symbol: "",
        shortSymbol: "",
        shortDescription: "",
        description: "",
        mktCap: 0,
        mktPrice: 0,
        chg24h: "",
        tokenAddress: "",
        managementFee: "",
        totalSupply: "",
        underlyingAssets: [],
    },
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
    const { setANFIWeightage, fetchIndexData, setDayChangePer, loading, STOCK5Data } = useChartDataStore()
    const { ethPriceInUsd } = useTradePageStore()

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

    // here you go
    const [IndicesWithDetails, setIndicesWithDetails] = useState(
        [
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
            {
                name: 'Arbitrum Ecosystem Index',
                logo: arbLogo,
                symbol: 'ARBIn',
                shortSymbol: 'ARBIn',
                shortDescription:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                mktCap: 0,
                mktPrice: 0,
                chg24h: "0.00",
                tokenAddress: "N/A",
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
    )


    const anfiIndexObject = IndicesWithDetails.find((o) => o.symbol === 'ANFI')
    const cr5IndexObject = IndicesWithDetails.find((o) => o.symbol === 'CRYPTO5')
    const mag7IndexObject = IndicesWithDetails.find((o) => o.symbol === 'MAG7')
    const arbIndexObject = IndicesWithDetails.find((o) => o.symbol === 'ARBIn')

    const IndexContract: UseContractResult = useContract(anfiIndexObject?.tokenAddress, indexTokenV2Abi)
    const feeRate = useContractRead(IndexContract.contract, 'feeRatePerDayScaled').data / 1e18
    const totalSupply = useContractRead(IndexContract.contract, 'totalSupply')

    if (anfiIndexObject) {
        anfiIndexObject.managementFee = feeRate.toFixed(2)
        anfiIndexObject.totalSupply = num(totalSupply.data).toFixed(2)
        // console.log(num(totalSupply.data) * anfiIndexObject.mktPrice)
        anfiIndexObject.mktCap = num(totalSupply.data) * anfiIndexObject.mktPrice
    }

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
            const response = await axios.get('https://vercel-cron-xi.vercel.app/api/getMag7Weights')
            console.log("response: " + response)
            const RawMAG7UnderlyingAssets = response.data.data.allocations
            console.log("weights: " + RawMAG7UnderlyingAssets)

            setMAG7UnderLyingAssets([])

            const assets = RawMAG7UnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
                const Asset: underlyingAsset = {
                    name: underLyingAssetData.symbol.toUpperCase(),
                    // eslint-disable-next-line react/jsx-no-undef
                    logo: underLyingAssetData.symbol === 'AAPL' ? <APPLELogo /> : underLyingAssetData.symbol === 'GOOG' ? <GOOGLELogo /> : underLyingAssetData.symbol === 'MSFT' ? <MICROSOFTLogo /> : underLyingAssetData.symbol === 'NVDA' ? <NVIDIALogo /> : underLyingAssetData.symbol === 'AMZN' ? <AMAZONLogo /> : underLyingAssetData.symbol === 'META' ? <METALogo /> : <TESLALogo />,
                    symbol: underLyingAssetData.symbol,
                    percentage: underLyingAssetData.weight * 100,
                }
                return Asset
            })

            setMAG7UnderLyingAssets(assets)

            setSmallMAG7UnderLyingAssets([])
            const smallAssets = RawMAG7UnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
                const SmallAsset: underlyingAsset = {
                    name: underLyingAssetData.symbol.toUpperCase(),
                    // eslint-disable-next-line react/jsx-no-undef
                    logo: underLyingAssetData.symbol === 'AAPL' ? <APPLELogo /> : underLyingAssetData.symbol === 'GOOG' ? <GOOGLELogo /> : underLyingAssetData.symbol === 'MSFT' ? <MICROSOFTLogo /> : underLyingAssetData.symbol === 'NVDA' ? <NVIDIALogo /> : underLyingAssetData.symbol === 'AMZN' ? <AMAZONLogo /> : underLyingAssetData.symbol === 'META' ? <METALogo /> : <TESLALogo />,
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
            const response = await axios.get('https://vercel-cron-xi.vercel.app/api/getArbInWeights')
            const RawARBInUnderlyingAssets = response.data.data.allocations[1].allocation

            //Big logos for POR section :
            setARBInUnderLyingAssets([])

            const assets = RawARBInUnderlyingAssets.map((underLyingAssetData: { symbol: string; weight: any }) => {
                const Asset: underlyingAsset = {
                    name: underLyingAssetData.symbol.split("_")[0].toUpperCase(),
                    logo: underLyingAssetData.symbol === 'AAVE' ? <AAVELogo /> : underLyingAssetData.symbol === 'CLIPPER' ? <CLIPPERLogo /> : underLyingAssetData.symbol === 'PENDLE' ? <PENDLELogo /> : underLyingAssetData.symbol === 'SILO_FINANCE' ? <SILOLogo /> : underLyingAssetData.symbol === 'PANCAKESWAP_AMM' ? <PANCAKELogo /> : underLyingAssetData.symbol === 'DODO' ? <DODOLogo /> : underLyingAssetData.symbol === 'DXSALE' ? <DXSALELogo /> : underLyingAssetData.symbol == "PENPIE" ? <Image src={penpie} alt="PENPIE" width={60} height={60} style={{ scale: "1.2" }} /> : underLyingAssetData.symbol == "CONVEX_FINANCE" ? <CONVEXLogo /> : underLyingAssetData.symbol == "JOE_V21" ? <JOELogo /> : <span></span>,
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
                    name: underLyingAssetData.symbol.split("_")[0].toUpperCase(),
                    logo: underLyingAssetData.symbol === 'AAVE' ? <AAVELogo /> : underLyingAssetData.symbol === 'CLIPPER' ? <CLIPPERLogo /> : underLyingAssetData.symbol === 'PENDLE' ? <PENDLELogo /> : underLyingAssetData.symbol === 'SILO_FINANCE' ? <SILOLogo /> : underLyingAssetData.symbol === 'PANCAKESWAP_AMM' ? <PANCAKELogo /> : underLyingAssetData.symbol === 'DODO' ? <DODOLogo /> : underLyingAssetData.symbol === 'DXSALE' ? <DXSALELogo /> : underLyingAssetData.symbol == "PENPIE" ? <Image src={penpie} alt="PENPIE" width={60} height={60} style={{ scale: "1.2" }} /> : underLyingAssetData.symbol == "CONVEX_FINANCE" ? <CONVEXLogo /> : underLyingAssetData.symbol == "JOE_V21" ? <JOELogo /> : <span></span>,
                    symbol: underLyingAssetData.symbol,
                    percentage: underLyingAssetData.weight * 100,
                }
                return SmallAsset
            })

            setSmallARBInUnderLyingAssets(Smallassets)
        } catch (error) {
            console.error('Error fetching ARBIn weights:', error)
        }
    }

    useEffect(() => {
        getANFIWeights()
        getCR5Weights()
        getMAG7Weights()
        getARBInWeights()
        //setIndicesWithDetails((prevState)=>[...new Set(IndicesWithDetails)]);
    }, [])

    const contextValue = {
        mktPrice: mktPrice,
        dayChange: dayChange,
        IndicesWithDetails: IndicesWithDetails,
        anfiIndexObject: anfiIndexObject,
        cr5IndexObject: cr5IndexObject,
        mag7IndexObject: mag7IndexObject,
        arbIndexObject: arbIndexObject,
        IndexContract: IndexContract,
        feeRate: feeRate,
        totalSupply: totalSupply,
        CR5UnderLyingAssets: CR5UnderLyingAssets,
        ANFIUnderLyingAssets: ANFIUnderLyingAssets,
        MAG7UnderLyingAssets: MAG7UnderLyingAssets,
        ARBInUnderLyingAssets: ARBInUnderLyingAssets,
        SmallCR5UnderLyingAssets: SmallCR5UnderLyingAssets,
        SmallANFIUnderLyingAssets: SmallANFIUnderLyingAssets,
        SmallMAG7UnderLyingAssets: SmallMAG7UnderLyingAssets,
        SmallARBInUnderLyingAssets: SmallARBInUnderLyingAssets,
        getANFIWeights: getANFIWeights,
        getCR5Weights: getCR5Weights,
        getMAG7Weights: getMAG7Weights,
        getARBInWeights: getARBInWeights,
    }
    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    )
}

export { DashboardContext, DashboardProvider, useDashboard }