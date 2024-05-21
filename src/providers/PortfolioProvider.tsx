import React, { createContext, useState, useEffect, useContext } from 'react'; 
import { SmartContract, UseContractResult, useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import useTradePageStore from '@/store/tradeStore'
import {
    goerlianfiPoolAddress,
    zeroAddress,
    goerliLinkWethPoolAddress,
    sepoliaAnfiV2IndexToken,
    sepoliaCrypto5V2IndexToken,
} from '@/constants/contractAddresses'
import { indexTokenAbi, indexTokenV2Abi } from '@/constants/abi'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { nexTokens } from '@/constants/nexIndexTokens'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'

// Firebase : 
import { ref, onValue } from 'firebase/database'
import { database } from '@/utils/firebase'
import { PositionType } from '@/types/tradeTableTypes'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetTradeHistoryCrossChain } from '@/hooks/getTradeHistoryCrossChain'
import { useChartDataStore, useLandingPageStore } from "@/store/store";
import usePortfolioPageStore from '@/store/portfolioStore';
import { BaseContract } from 'ethers';
import { GenericToast } from '@/components/GenericToast';

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
}

interface PortfolioContextProps {
    user: User | null,
    showPortfolioData: boolean | null
    chartArr: { time: number; value: number; }[]
    indexPercent: { anfi: number, cr5: number } | null
    todayPortfolioPrice: number
    yesterdayPortfolioPrice: number
    portfolio24hChange: number
    anfiTokenContract: UseContractResult<SmartContract<BaseContract>> | null
    crypto5TokenContract: UseContractResult<SmartContract<BaseContract>> | null
    anfiPercent: number
    crypto5Percent: number
    anfiTokenBalance: any
    crypto5TokenBalance: any
    pieData: (string | number)[][]
    nexTokenAssetData: nexTokenDataType[]
    totalPortfolioBalance: any
    positionHistoryDefi: { data: PositionType[]; reload: () => Promise<void>; }
    positionHistoryCrosschain: { data: PositionType[]; reload: () => Promise<void>; }
    combinedData: PositionType[]
    latestObjectsMap: Map<string, PositionType>
    indexDetails: { index: string; smartContract: string; lastTnx: string; ownedAmount: string; }[]
    indexDetailsMap: Map<string, any>
    uploadedPPLink: string
    chosenPPType: string
    handleCopyFunction: () => void
    handleCopyIndexDetailsFunction: () => void
}

const PortfolioContext = createContext<PortfolioContextProps>({
    user: null,
    showPortfolioData: null,
    chartArr: [],
    indexPercent: null,
    todayPortfolioPrice: 0,
    yesterdayPortfolioPrice: 0,
    portfolio24hChange: 0,
    anfiTokenContract: null,
    crypto5TokenContract: null,
    anfiPercent: 0,
    crypto5Percent: 0,
    anfiTokenBalance: 0,
    crypto5TokenBalance: 0,
    pieData: [],
    nexTokenAssetData: [],
    totalPortfolioBalance: 0,
    positionHistoryDefi: {data: [],reload: () => Promise.resolve(),},
    positionHistoryCrosschain: {data: [],reload: () => Promise.resolve(),},
    combinedData: [],
    latestObjectsMap: new Map(),
    indexDetails: [],
    indexDetailsMap: new Map(),
    uploadedPPLink: "none",
    chosenPPType: "none",
    handleCopyFunction: () => { },
    handleCopyIndexDetailsFunction: () => { },
});

const usePortfolio = () => {
    return useContext(PortfolioContext);
};

const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
    const address = useAddress()
    const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex, setEthPriceInUsd, ethPriceInUsd } = useTradePageStore()
    const { portfolioData, setDayChange, indexSelectedInPie } = usePortfolioPageStore()
    const anfiTokenContract = useContract(sepoliaAnfiV2IndexToken, indexTokenV2Abi)
    const crypto5TokenContract = useContract(sepoliaCrypto5V2IndexToken, indexTokenAbi)
    // const anfiTokenContract = useContract(goerliAnfiV2IndexToken, indexTokenV2Abi)
    // const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

    const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
    const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
    const anfiPercent = (num(anfiTokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
    const crypto5Percent = (num(crypto5TokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100

    const {
        loading: loadingAnfi,
        error: errorAnfi,
        data: dataAnfi,
    } = useQuery(GET_HISTORICAL_PRICES, {
        // variables: { poolAddress: getPoolAddress(anfiDetails[0].address, anfiDetails[0].decimals, false ), startingDate: getTimestampDaysAgo(90), limit: 10, direction: 'asc' },
        variables: { poolAddress: goerlianfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
    })

    const {
        loading: loadingCR5,
        error: errorCR5,
        data: dataCR5,
    } = useQuery(GET_HISTORICAL_PRICES, {
        variables: { poolAddress: goerliLinkWethPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
    })

    // *** FUNCTION TO GET THE INDEX PRICE HISTORY *** // Commented for later use
    // useEffect(()=>{
    // 	async function getCR5PriceHistory() {
    // 		//  const cr5poolAddress = getPoolAddress(cr5Details[0].address, cr5Details[0].decimals, false )
    // 		const cr5poolAddress = '0x70393314c70C903ebf6ef073783B7F207cC9A5e2'
    // 		const numberOfDays = 45
    // 		const priceList = []
    // 		for  (let i=0; i<=numberOfDays; i++) {
    // 			const price = await getPriceHistory(cr5poolAddress as string, 86400 * i)
    // 			priceList.push({date : new Date().getTime() - (86400 * i), price})
    // 		}
    // 		console.log(priceList)
    // 		return priceList
    // 	}

    // 	// getCR5PriceHistory()
    // })

    let [chartArr, setChartArr] = useState<{ time: number; value: number }[]>([])
    const indexPercent = { anfi: anfiPercent, cr5: crypto5Percent }

    if (!loadingCR5 && !loadingAnfi && !errorCR5 && !errorAnfi && chartArr.length == 0 && (!!anfiPercent || !!crypto5Percent)) {
        const chartData: { time: number; value: number }[] = []
        const ANFIData = dataAnfi.poolDayDatas
        const CR5Data = dataCR5.poolDayDatas
        for (let i = 0; i <= ANFIData.length - 1; i++) {
            const chartObj: { time: number; value: number } = { time: 0, value: 0 }
            const value = num(anfiTokenBalance.data) * Number(ANFIData[i].token0Price) + num(crypto5TokenBalance.data) * Number(CR5Data[i]?.token0Price || 0)
            chartObj.time = ANFIData[i].date
            chartObj.value = value
            chartData.push(chartObj)
        }
        setChartArr(chartData)

        const anfiPrice = ANFIData[ANFIData.length - 1].token0Price * num(anfiTokenBalance.data)
        const cr5Price = CR5Data[CR5Data.length - 1].token0Price * num(crypto5TokenBalance.data)
        // setIndexPrices({ anfi: anfiPrice, cr5: cr5Price })

        const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price || 0
        const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price || 0
        const anfi24hChng = ((todayANFIPrice - yesterdayANFIPrice) / yesterdayANFIPrice) * 100

        const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price || 0
        const yesterdayCR5Price = CR5Data[CR5Data.length - 2]?.token0Price || 0
        const cr524hChng = ((todayCR5Price - yesterdayCR5Price) / yesterdayCR5Price) * 100

        setDayChange({ anfi: todayANFIPrice - yesterdayANFIPrice, cr5: todayCR5Price - yesterdayCR5Price })
    }

    const todayPortfolioPrice = chartArr[chartArr.length - 1]?.value
    const yesterdayPortfolioPrice = chartArr[chartArr.length - 2]?.value
    const portfolio24hChange = ((todayPortfolioPrice - yesterdayPortfolioPrice) / yesterdayPortfolioPrice) * 100

    const pieData = [
        ['Asset', 'Percentage'],
        ['CRYPTO5', crypto5Percent ? crypto5Percent : 0],
        ['ANFI', anfiPercent ? anfiPercent : 0],
        // ['FIAT', anfiPercent ? 0 : 5],
    ]

    const PieChartdata = [
        {
            label: 'ANFI',
            percentage: !!anfiPercent ? FormatToViewNumber({ value: anfiPercent, returnType: 'string' }) + '%' : '0%',
            color: '#133140',
        },
        {
            label: 'CRYPTO 5',
            percentage: !!crypto5Percent ? FormatToViewNumber({ value: crypto5Percent, returnType: 'string' }) + '%' : '0%',
            color: '#b5e7ff',
        },
    ]

    const showPortfolioData = address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? true : false

    const [assetData, setAssetData] = useState<nexTokenDataType[]>([])

    useEffect(() => {
        async function getTokenDetails() {
            const data = await Promise.all(
                nexTokens.map(async (item: nexTokenDataType) => {
                    const calculatedUsdValue = (await convertToUSD({ tokenAddress: item.address, tokenDecimals: item.decimals }, ethPriceInUsd, false)) || 0
                    const totalToken = item.symbol === 'ANFI' ? num(anfiTokenBalance.data) || 0 : item.symbol === 'CRYPTO5' ? num(crypto5TokenBalance.data) || 0 : 0
                    const totalTokenUsd = calculatedUsdValue * totalToken || 0
                    const percentage = (item.symbol === 'ANFI' ? anfiPercent : crypto5Percent) || 0

                    return {
                        ...item,
                        totalToken,
                        totalTokenUsd,
                        percentage,
                    }
                })
            )

            setAssetData(data)
        }

        getTokenDetails()
    }, [anfiTokenBalance.data, crypto5TokenBalance.data, ethPriceInUsd, anfiPercent, crypto5Percent])

    const totalPortfolioBalance = assetData.reduce((total, data) => total + Number(data.totalTokenUsd), 0)
    const positionHistoryDefi = GetPositionsHistoryDefi()
    const positionHistoryCrosschain = GetTradeHistoryCrossChain()
    const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.data)
    const latestObjectsMap: Map<string, PositionType> = new Map()

    for (const item of combinedData) {
        if (!latestObjectsMap.has(item.indexName)) {
            latestObjectsMap.set(item.indexName, item)
        }
    }

    const indexDetails = [
        {
            index: 'ANFI',
            smartContract: sepoliaAnfiV2IndexToken || 'N/A',
            lastTnx: latestObjectsMap.get('ANFI')?.txHash || 'N/A',
            ownedAmount: FormatToViewNumber({ value: num(anfiTokenBalance.data), returnType: 'string' }) + ' ANFI',
            // tnxHistory: ,
        },
        {
            index: 'CRYPTO5',
            smartContract: sepoliaCrypto5V2IndexToken || 'N/A',
            lastTnx: latestObjectsMap.get('CRYPTO5')?.txHash || 'N/A',
            ownedAmount: FormatToViewNumber({ value: num(crypto5TokenBalance.data), returnType: 'string' }) + ' CRYPTO5',
            // tnxHistory: ,
        },
    ]

    const indexDetailsMap: Map<string, any> = new Map()

    indexDetails.forEach((detail) => {
        indexDetailsMap.set(detail.index, detail)
    })

    chartArr = chartArr.filter((obj) => obj.time !== 1702512000)

    const { changeSelectedIndex } = useLandingPageStore()
    const { fetchIndexData, ANFIData, CR5Data } = useChartDataStore();
    useEffect(() => {
        fetchIndexData({ tableName: "histcomp", index: "OurIndex" });
    }, [fetchIndexData]);
    const dataForChart: { [key: string]: { time: string | number | Date; value: number }[] } = {
        ANFI: ANFIData.reverse().slice(30),
        CR5: CR5Data.reverse().slice(30)
    }

    const [uploadedPPLink, setUploadedPPLink] = useState('none')
    const [chosenPPType, setChosenPPType] = useState('none')

    const [connectedUser, setConnectedUser] = useState<User | null>(null)
    const [connectedUserId, setConnectedUserId] = useState('')

    useEffect(() => {
        function getUser() {
            const usersRef = ref(database, 'users/')
            onValue(usersRef, (snapshot) => {
                const users = snapshot.val()
                for (const key in users) {
                    // console.log(users[key])
                    const potentialUser: User = users[key]
                    if (address && potentialUser.main_wallet == address) {
                        setConnectedUser(potentialUser)
                        setConnectedUserId(key)
                    }
                }
            })
        }
        getUser()
    }, [address])


    const handleCopy = () => {
        if (address) {
            GenericToast({
                type: 'success',
                message: 'Copied !',
            })
        } else {
            GenericToast({
                type: 'error',
                message: 'Please connect your wallet !',
            })
        }
    }

    const handleCopyIndexDetails = () => {
        GenericToast({
            type: 'success',
            message: 'Copied !',
        })
    }

    const [t, setT] = useState<string>("kkkkkk");

    const contextValue = {
        user: connectedUser,
        showPortfolioData: showPortfolioData,
        chartArr: chartArr,
        indexPercent: indexPercent,
        todayPortfolioPrice: todayPortfolioPrice,
        yesterdayPortfolioPrice: yesterdayPortfolioPrice,
        portfolio24hChange: portfolio24hChange,
        anfiTokenContract: anfiTokenContract,
        crypto5TokenContract: crypto5TokenContract,
        anfiPercent: anfiPercent,
        crypto5Percent: crypto5Percent,
        anfiTokenBalance: anfiTokenBalance,
        crypto5TokenBalance: crypto5TokenBalance,
        pieData: pieData,
        nexTokenAssetData: assetData,
        totalPortfolioBalance: totalPortfolioBalance,
        positionHistoryDefi: positionHistoryDefi,
        positionHistoryCrosschain: positionHistoryCrosschain,
        combinedData: combinedData,
        latestObjectsMap: latestObjectsMap,
        indexDetails: indexDetails,
        indexDetailsMap: indexDetailsMap,
        uploadedPPLink: uploadedPPLink,
        chosenPPType: chosenPPType,
        handleCopyFunction: handleCopy,
        handleCopyIndexDetailsFunction: handleCopyIndexDetails
    };


    return (
        <PortfolioContext.Provider value={contextValue}>
            {children}
        </PortfolioContext.Provider>
    );
};

export { PortfolioProvider, PortfolioContext, usePortfolio }