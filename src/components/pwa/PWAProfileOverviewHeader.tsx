import { usePortfolio } from "@/providers/PortfolioProvider";
import { Stack, Typography } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { PWAGradientStack } from "@/theme/overrides";
import dynamic from "next/dynamic";
import { useAddress } from '@thirdweb-dev/react'
const PWAPNLChart = dynamic(() => import('@/components/pwa/PWAPNLChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { emptyData } from '@/constants/emptyChartData'


const PWAProfileOverviewHeader = () => {
    const address = useAddress()
	const { 
		testValue, 
		user, 
		showPortfolioData, 
		chartArr,
		indexPercent, 
		todayPortfolioPrice, 
		yesterdayPortfolioPrice, 
		portfolio24hChange,
		anfiTokenContract,
		crypto5TokenContract,
		anfiTokenBalance,
		crypto5TokenBalance,
		anfiPercent,
		crypto5Percent,
		pieData,
		nexTokenAssetData,
		totalPortfolioBalance,
		positionHistoryDefi,
		positionHistoryCrosschain,
		combinedData,
		latestObjectsMap,
		indexDetails,
		indexDetailsMap,
		uploadedPPLink,
        chosenPPType,
		isStandalone,
		browser,
		os,
		handleCopyFunction,
		handleCopyIndexDetailsFunction
	} = usePortfolio()


    return (
        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"stretch"} justifyContent={"space-between"} position={"relative"} overflow={"hidden"} marginTop={3} marginBottom={1} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
				<Stack direction={"column"} alignItems={"start"} justifyContent={"center"} width={"fit-content"} minWidth={"50%"} height={"fit-content"} >
					<Typography variant="caption" marginBottom={1} sx={{
						color: lightTheme.palette.text.primary
					}}>
						My Portfolio
					</Typography>
					<Typography variant="body1" width={"95%"} sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 600,

					}}>
						$
						{showPortfolioData && totalPortfolioBalance
							? totalPortfolioBalance < 0.01 && totalPortfolioBalance > 0
								? '≈ 0.00 '
								: FormatToViewNumber({ value: totalPortfolioBalance, returnType: 'string' })
							: '0.00'}
					</Typography>
					<Typography variant="caption" width={"95%"} sx={{
						color: portfolio24hChange > 0 ? lightTheme.palette.nexGreen.main : portfolio24hChange < 0 ? lightTheme.palette.nexRed.main : lightTheme.palette.text.primary,
						fontWeight: 400,

					}}>
						{portfolio24hChange < 0 ? "-" : "+"}
						$
						{showPortfolioData && chartArr && chartArr[chartArr.length - 1]
							? Math.abs(chartArr[chartArr.length - 1].value - (chartArr[chartArr.length - 2].value || 0)).toFixed(2)
							: '0.00'}
					</Typography>
				</Stack>
				<Stack width={"45%"} maxWidth={"45%"} flexGrow={1} borderRadius={"0.8rem"}>
					<PWAPNLChart data={showPortfolioData ? chartArr : emptyData} totalPortfolioBalance={totalPortfolioBalance} change={showPortfolioData ? portfolio24hChange : 0} />
				</Stack>
			</Stack>
    )
}

export default PWAProfileOverviewHeader