import React, { useEffect, useRef } from 'react'
import { createChart, DeepPartial, LayoutOptions, LineStyle, LineWidth, PriceScaleMode, PriceScaleOptions, TimeScaleOptions } from 'lightweight-charts'
import { useAddress } from '@thirdweb-dev/react'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import { useLandingPageStore } from '@/store/store'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'


interface GradientAreaChartProps {
	data: { time: string | number | Date; value: number }[]
	change: number
	totalPortfolioBalance: number
}

const PortfolioPNLChart: React.FC<GradientAreaChartProps> = ({ data, change,totalPortfolioBalance }) => {
	const { mode } = useLandingPageStore()
	const address = useAddress()
	const chartContainerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<any>(null)
	console.log(totalPortfolioBalance)

	const minValue = Math.min(...data.map((point) => point.value))
	const maxValue = Math.max(...data.map((point) => point.value))

	useEffect(() => {
		if (chartContainerRef.current) {
			chartRef.current = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.offsetWidth,
				height: 100,
				timeScale: {
					locked: true, // Lock the time scale to prevent dragging
					visible: false,
					rightOffset: 0, // Ensure the x-axis extends to the right edge of the chart
					leftOffset: 0, // Ensure the x-axis extends to the left edge of the chart
					fixLeftEdge: true, // Fix the left edge of the x-axis to the chart's left edge
					fixRightEdge: true, // Do not fix the right edge of the x-axis
					minBarSpacing: 0, // Set minimum bar spacing to 0 for smooth chart edges
					borderVisible: false, // Hide the x-axis border
					timeVisible: false, // Hide the time label on the x-axis
					tickVisible: false, // Hide tick marks on the x-axis
					maxRightOffset: 0, // Set maxRightOffset to 0
					minRightOffset: maxValue, // Set minRightOffset based on the data range
				} as DeepPartial<TimeScaleOptions>,
				handleScale: false,
				handleScroll: true,
				crosshair: {
					vertLine: {
						visible: false,
					},
					horzLine: {
						visible: false,
					},
					mode: 0,
				},
				layout: {
					background: { color: 'transparent' },
					// backgroundColor: 'red', // Set the background color to transparent
				} as DeepPartial<LayoutOptions>, // Use type assertion to specify the type
			})

			const areaSeries = chartRef.current.addAreaSeries({
				topColor: address && change < 0 ? '#F23645' : address && change > 0 ? '#089981' : '#F2F2F2', // Set the top color for the gradient
				bottomColor: '#F2F2F2', // Set the bottom color for the gradient as transparent
				lineStyle: LineStyle.Solid, // Use smooth line style
				base: minValue, // Set the base to maxValue
				lineColor: address && change < 0 ? '#F23645' : address && change > 0 ? '#089981' : '#000000', // Set the line color as transparent
				lineWidth: 1,
				priceLineVisible: false,
			})

			const modifiedData = data.map((point) => ({
				time: new Date(point.time), // Convert time to Date object
				value: point.value,
			}))

			areaSeries.setData(data)

			chartRef.current.timeScale().fitContent()

			// Hide axes
			chartRef.current.applyOptions({
				leftPriceScale: getAxesOptions(false),
				rightPriceScale: getAxesOptions(false),
			})

			chartRef.current.applyOptions({
				grid: {
					horzLines: { visible: false },
					vertLines: { visible: false },
				},
			})

			// Prevent default behavior of mouse wheel (scrolling)
			chartContainerRef.current.addEventListener('wheel', (e) => e.preventDefault(), { passive: false })
			return () => {
				// window.removeEventListener('resize', handleResize)
				// toolTip.innerHTML = ''
				chartRef.current.remove()
			}
		}
	}, [data, maxValue, minValue, address, change])

	return (
		<div className="relative w-full h-[15vh]">
			<div className="absolute top-0 left-0 w-full h-full z-50">
				{/* Content with text goes here */}
				<div className="py-4 px-[10%] flex flex-col items-end justify-start h-full w-full">
					<h1
						className={`text-2xl ${mode == "dark" ? " text-whiteText-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" : "text-blackText-500"} titleShadow interBold`}
						title={totalPortfolioBalance ? totalPortfolioBalance.toString(): '0.00'}
					>
						${totalPortfolioBalance ? (totalPortfolioBalance < 0.01 ? '≈ 0.00 ' : FormatToViewNumber({ value: totalPortfolioBalance, returnType: 'string' })) : '0.00'}
					</h1>
					<h1 className={`text-lg ${address && change > 0 ? 'text-nexLightGreen-500' : address && change < 0 ? 'text-nexLightRed-500' : 'text-black'} titleShadow interMedium`}>
						{address ? (change > 0 ? '+' + change.toFixed(2) : change.toFixed(2)) : '0.00'}%
					</h1>
					{/* Add any other text or components as needed */}
				</div>
			</div>

			<div
				ref={chartContainerRef}
				className="absolute top-0 left-0 w-full h-full z-0"
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden', // Hide scrollbars
				}}
			/>
		</div>
	)
}

export default PortfolioPNLChart

// Helper function to get PriceScaleOptions
function getAxesOptions(visible: boolean): PriceScaleOptions {
	return {
		mode: PriceScaleMode.Normal,
		visible: visible,
		autoScale: true, // You can set this to your desired value
		invertScale: false, // You can set this to your desired value
		alignLabels: false, // You can set this to your desired value
		scaleMargins: {
			top: 0.1, // You can set this to your desired value
			bottom: 0.2, // You can set this to your desired value
		},
		borderVisible: false, // You can set this to your desired value
		// drawTicks: false,
		ticksVisible: false,
		minimumWidth: 100,
		borderColor: '#ffffff00',
		entireTextOnly: true,
	}
}
