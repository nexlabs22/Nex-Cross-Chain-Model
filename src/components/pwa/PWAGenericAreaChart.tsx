import React, { useEffect, useRef } from 'react'
import {
	createChart,
	DeepPartial,
	LayoutOptions,
	LineStyle,
	LineWidth,
	PriceScaleMode,
	PriceScaleOptions,
	TimeScaleOptions,
	CrosshairMode
} from 'lightweight-charts'

interface GradientAreaChartProps {
	data: { time: string | number | Date; value: number }[]
}

const GradientAreaChart: React.FC<GradientAreaChartProps> = ({ data }) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<any>(null)

	const minValue = Math.min(...data.map((point) => point.value))
	const maxValue = Math.max(...data.map((point) => point.value))

	useEffect(() => {
		if (chartContainerRef.current && data) {
			chartRef.current = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.offsetWidth ,
				height: chartContainerRef.current.offsetHeight,
				timeScale: {
					locked: true, // Lock the time scale to prevent dragging
					visible: false,
					rightOffset: 0, // Ensure the x-axis extends to the right edge of the chart
					leftOffset: 0, // Ensure the x-axis extends to the left edge of the chart
					fixLeftEdge: true, // Fix the left edge of the x-axis to the chart's left edge
					fixRightEdge: false, // Do not fix the right edge of the x-axis
					minBarSpacing: 0, // Set minimum bar spacing to 0 for smooth chart edges
					borderVisible: false, // Hide the x-axis border
					timeVisible: false, // Hide the time label on the x-axis
					tickVisible: false, // Hide tick marks on the x-axis
					maxRightOffset: 0, // Set maxRightOffset to 0
					minRightOffset: maxValue, // Set minRightOffset based on the data range

				} as DeepPartial<TimeScaleOptions>,
				handleScale: false,
				handleScroll: false,
				crosshair: {
					vertLine: {
						visible: false,
					},
					horzLine:{
						visible: false,
					}
				},
				layout: {
					background: { color: 'transparent' }
					// backgroundColor: 'transparent', // Set the background color to transparent
				} as DeepPartial<LayoutOptions>, // Use type assertion to specify the type
			})

			const areaSeries = chartRef.current.addAreaSeries({
				topColor: 'rgba(51, 122, 116, 0.5)', // Set the top color for the gradient
				bottomColor: 'rgba(35, 158, 154, 0.2)', // Set the bottom color for the gradient (transparent)
				lineColor: '#79b3ad', // Set the line color
				lineWidth: 2,
				priceLineVisible: false,
			});
			const modifiedData = data.map((point) => ({
				time: new Date(point.time), // Convert time to Date object
				value: point.value,
			}))

			const dataForChart = data.slice(-30)
			dataForChart.sort((a, b) => Number(a.time) - Number(b.time))
			areaSeries.setData(dataForChart)

			// Calculate the desired visible range (e.g., show the last 30 minutes of data)
			const lastTime = data[data.length - 1]?.time as Date
			const endDate = new Date(lastTime);
			const startDate = new Date(endDate);
			startDate.setMinutes(startDate.getMinutes() - 1);

			// Use timeScale.setVisibleRange to set the visible range
			// chartRef.current.timeScale().setVisibleRange({
			// 	from: startDate.getTime() / 1000, // Convert to seconds
			// 	to: endDate.getTime() / 1000,     // Convert to seconds
			// });

			chartRef.current.timeScale().fitContent();

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
		}
		return () => {
			chartRef.current.remove()
		}
	}, [data, maxValue, minValue])

	return (
		<div
			ref={chartContainerRef}
			className="w-full flex flex-col items-center justify-center"
			style={{
				width: '100%',
				height: '100%',
                marginLeft: "0px",
				overflow: 'hidden', // Hide scrollbars
			}}
		/>
	)
}

export default GradientAreaChart

// Helper function to get PriceScaleOptions
function getAxesOptions(visible: boolean): PriceScaleOptions {
	return {
		mode: PriceScaleMode.Normal,
		visible: false,
		autoScale: true, // You can set this to your desired value
		invertScale: false, // You can set this to your desired value
		alignLabels: false, // You can set this to your desired value
		scaleMargins: {
			top: 0, // You can set this to your desired value
			bottom: 0.1, // You can set this to your desired value
		},
		borderVisible: false, // You can set this to your desired value
		// drawTicks: false,
		ticksVisible: false,
		borderColor: '#ffffff00',
		//borderColor: '#FFFFFF',
		entireTextOnly: true,
		minimumWidth: 100,

	}
}

export {GradientAreaChart};
