'use client'
import { usePortfolio } from "@/providers/PortfolioProvider";
import { Stack, Typography } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import New3DPieChart from '@/components/new3DPieChart'

interface PieChart3DProps {
	data: (string | number)[][]
}

const PWA3DPieChart: React.FC<PieChart3DProps> = ({ data }) => {
	const { pieData } = usePortfolio()
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
			<Stack width={"100vw"} height={"25vh"} borderRadius={"1.2rem"} direction={"row"} alignItems={"center"} justifyContent={"center"} >
				{/*chartType == 'Pie Chart' ? <New3DPieChart data={pieData} /> : <TreemapChart percentage={indexPercent} />*/}
				<New3DPieChart data={pieData} />
			</Stack>
		</Stack>
	)
}

export default PWA3DPieChart
