import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { dcaDataType } from '@/types/toolTypes'
import { useLandingPageStore } from '@/store/store'

interface DCAChartProps {
	data: dcaDataType[]
}

const DCACalculatorChart: React.FC<DCAChartProps> = ({ data }) => {
	const dcaChartData: { time: number; value: number }[] = data.map(({ time, total }) => ({ time, value: total as number }))
	const finalStandings = data[data.length - 1]
	const { mode } = useLandingPageStore()

	const h5Style = `interMedium ${mode === 'dark'? 'text-[#FFFFFF]':'text-blackText-500'}`
	const strongTagStyle = `text-2xl interBlack ${mode === 'dark'? 'text-[#FFFFFF]':'text-blackText-500'}`

	return (
		<>
			<section className="h-full w-full">
				<div id="chartId" className={`h-full w-full p-3 rounded-2xl border border-gray-300/50 ${mode === 'dark'? 'bg-[#161A25]':'bg-white'} shadow-sm shadow-gray-300`}>
					{/* <div className="flex flex-row items-start flex-wrap lg:flex-nowrap justify-between px-2 mt-2 mb-6"> */}
					<div className="flex flex-row items-start flex-wrap lg:flex-nowrap justify-between px-2 mt-2">
						<div className="flex flex-col w-1/2 lg:w-auto">
							<h5 className={`${h5Style}`}>Invested Amount</h5>
							<strong className={`${strongTagStyle}`}>
								${finalStandings && finalStandings.totalInvested ? Number(finalStandings.totalInvested?.toFixed(2)).toLocaleString() : '0.00'}
							</strong>
						</div>
						<div className="flex flex-col w-1/2 lg:w-auto">
							<h5 className={`${h5Style}`}>Percent Gain</h5>
							<strong
								className={`text-2xl interBlack ${finalStandings && finalStandings.percentageGain && finalStandings.percentageGain < 0 ? 'text-nexLightRed-500' : 'text-nexLightGreen-500'}`}
							>
								{finalStandings && finalStandings.percentageGain
									? finalStandings.percentageGain > 0
										? '+' + finalStandings.percentageGain?.toFixed(2)
										: finalStandings.percentageGain?.toFixed(2)
									: '0.00'}
								%
							</strong>
						</div>
						<div className="flex flex-col w-1/2 lg:w-auto">
							<h5 className={`${h5Style}`}>Total Gain</h5>
							<strong className={`${strongTagStyle}`}>
								${finalStandings && finalStandings.totalGain ? Number(finalStandings.totalGain?.toFixed(2)).toLocaleString() : '0.00'}
							</strong>
						</div>
						<div className="flex flex-col w-1/2 lg:w-auto">
							<h5 className={`${h5Style}`}>Final Portfolio Value</h5>
							<strong className={`${strongTagStyle}`}>${finalStandings && finalStandings.total ? Number(finalStandings.total?.toFixed(2)).toLocaleString() : '0.00'}</strong>
						</div>
					</div>
					<div className="w-full h-[60vh] mt-8 ">
						<Chart data={dcaChartData} />
					</div>
				</div>
			</section>
		</>
	)
}

export default DCACalculatorChart
