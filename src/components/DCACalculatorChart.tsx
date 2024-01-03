
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { dcaDataType } from '@/types/toolTypes'

interface DCAChartProps {
	data: dcaDataType[]
}

const DCACalculatorChart: React.FC<DCAChartProps> = ({ data }) => {
	const dcaChartData: { time: number; value: number }[] = data.map(({ time, total }) => ({ time, value: total as number }))
	const finalStandings = data[data.length - 1]

	return (
		<>
			<section className="h-full w-full">
				<div id='chartId' className="h-full w-full p-3 rounded-2xl border border-gray-300/50 bg-[#E3E7E7] shadow-md shadow-gray-300">
					<div className="flex flex-row items-start justify-between px-2 mt-2 mb-6">
						<div className="flex flex-col">
							<h5>Total Amount Invested</h5>
							<strong className="text-2xl">${finalStandings && finalStandings.totalInvested ? Number(finalStandings.totalInvested?.toFixed(2)).toLocaleString() : '0.00'}</strong>
						</div>
						<div className="flex flex-col">
							<h5>Percent Gain</h5>
							<strong className={`text-2xl ${finalStandings && finalStandings.percentageGain && finalStandings.percentageGain < 0 ? 'text-nexLightRed-500' : 'text-nexLightGreen-500'}`}>
								{finalStandings && finalStandings.percentageGain ? finalStandings.percentageGain > 0 ? '+' + finalStandings.percentageGain?.toFixed(2): finalStandings.percentageGain?.toFixed(2): '0.00'}%
							</strong>
						</div>
						<div className="flex flex-col">
							<h5>Total Gain</h5>
							<strong className="text-2xl">${finalStandings && finalStandings.totalGain ? Number(finalStandings.totalGain?.toFixed(2)).toLocaleString(): '0.00'}</strong>
						</div>
						<div className="flex flex-col">
							<h5>Final Portfolio Value</h5>
							<strong className="text-2xl">${finalStandings && finalStandings.total ? Number(finalStandings.total?.toFixed(2)).toLocaleString(): '0.00'}</strong>
						</div>
					</div>
					<Chart data={dcaChartData} />
				</div>
			</section>
		</>
	)
}

export default DCACalculatorChart
