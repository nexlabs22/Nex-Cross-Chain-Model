import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import PWA3DPieChart from "./PWA3DPieChart";
import dynamic from "next/dynamic";
const TreemapChart = dynamic(() => import('@/components/GenericTreemapChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import usePortfolioPageStore from "@/store/portfolioStore";
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'

import useTradePageStore from '@/store/tradeStore'

import bg2 from '@assets/images/bg-2.png'
import HistoryTable from '@/components/TradeTable'
import TopHolders from '@/components/topHolders'
import { reduceAddress } from '@/utils/general'
import { GoArrowRight, GoChevronDown } from 'react-icons/go'
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io'
import { NewHistoryTable } from '@/components/NewHistoryTable'
import { useSearchParams } from 'next/navigation'
import { nexTokens } from '@/constants/nexIndexTokens'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'
import {
    goerliAnfiIndexToken,
    goerliCrypto5IndexToken,
    crypto5PoolAddress,
    goerlianfiPoolAddress,
    zeroAddress,
    goerliAnfiV2IndexToken,
    goerliUsdtAddress,
    goerliLinkAddress,
    goerliLinkWethPoolAddress,
    sepoliaAnfiV2IndexToken,
    sepoliaCrypto5V2IndexToken,
    goerliCR5PoolAddress,
} from '@/constants/contractAddresses'
import { indexTokenAbi, indexTokenV2Abi } from '@/constants/abi'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetTradeHistoryCrossChain } from '@/hooks/getTradeHistoryCrossChain'
import { emptyData } from '@/constants/emptyChartData'
import { useLandingPageStore } from "@/store/store";
import { PositionType } from '@/types/tradeTableTypes'

const PWA3DChartBox = () => {

    const [chartType, setChartType] = useState<string>("Pie Chart")
    const address = useAddress()

    const [QRModalVisible, setQRModalVisible] = useState(false)
    const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex, setEthPriceInUsd, ethPriceInUsd } = useTradePageStore()
    const { portfolioData, setDayChange, indexSelectedInPie } = usePortfolioPageStore()
    const { mode } = useLandingPageStore()

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

    const pieData = [
        ['Asset', 'Percentage'],
        ['CRYPTO5', crypto5Percent ? crypto5Percent : 0],
        ['ANFI', anfiPercent ? anfiPercent : 0],
        ['NONE', !anfiPercent || !crypto5Percent ? 100 : 0],
    ]

    const PieChartdata = [
        {
            label: `ANFI (${!!anfiPercent ? FormatToViewNumber({ value: anfiPercent, returnType: 'string' }) + '%' : '0%'})`,
            percentage: !!anfiPercent ? FormatToViewNumber({ value: anfiPercent, returnType: 'string' }) + '%' : '0%',
            color: '#133140',
        },
        {
            label: `CRYPTO5 (${!!crypto5Percent ? FormatToViewNumber({ value: crypto5Percent, returnType: 'string' }) + '%' : '0%'})`,
            percentage: !!crypto5Percent ? FormatToViewNumber({ value: crypto5Percent, returnType: 'string' }) + '%' : '0%',
            color: '#b5e7ff',
        },
        {
            label: "No Data",
            percentage: "No Data",
            color: "#878787"
        }
    ]

    const options = {
        is3D: true,
        fontName: 'interBold',
        slices: [{ color: '#9c4f29' }, { color: '#d3bf24' }, { color: '#73cbf3' }],
        tooltip: { text: 'label' },
        backgroundColor: 'transparent',
        legend: {
            position: 'right', // Set the legend position to the right
            alignment: 'center', // Horizontally center the legend
        },
    }    
    
    return (
        <Stack id="PWAPNLChartBox" width={"100%"} height={"fit-content"} marginTop={0} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1} paddingY={2}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    marginBottom: "1.2rem"
                }}>
                    Porftolio Distribution
                </Typography>


            </Stack>
            <Stack width={"100vw"} height={"25vh"} borderRadius={"1.2rem"} direction={"row"} alignItems={"center"} justifyContent={"center"}>
                {/*chartType == 'Pie Chart' ? <New3DPieChart data={pieData} /> : <TreemapChart percentage={indexPercent} />*/}
                <PWA3DPieChart data={pieData} />
            </Stack>
        </Stack>
    )
}

export default PWA3DChartBox
