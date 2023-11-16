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
} from 'lightweight-charts'

interface GradientAreaChartProps {
	data: { time: string | number | Date; value: number }[]
}

const PortfolioPNLChart: React.FC<GradientAreaChartProps> = ({ data }) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<any>(null)

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
					horzLine:{
						visible: false,
					},
                    mode: 0
				},
				layout: {
					background: { color: 'transparent' }
					// backgroundColor: 'red', // Set the background color to transparent
				} as DeepPartial<LayoutOptions>, // Use type assertion to specify the type
			})

			const areaSeries = chartRef.current.addAreaSeries({
				topColor: '#089981', // Set the top color for the gradient
				bottomColor: 'white', // Set the bottom color for the gradient as transparent
				lineStyle: LineStyle.Solid, // Use smooth line style
				base: minValue, // Set the base to maxValue
				lineColor: '#089981', // Set the line color as transparent
				lineWidth: 1,
				priceLineVisible: false,
			})

			const modifiedData = data.map((point) => ({
				time: new Date(point.time), // Convert time to Date object
				value: point.value,
			}))

			areaSeries.setData(data)

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
            return () => {
				// window.removeEventListener('resize', handleResize)
				// toolTip.innerHTML = ''
				chartRef.current.remove()
			}
		}
	}, [data])

	return (
		<div
			ref={chartContainerRef}
			className="w-screen"
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden', // Hide scrollbars
			}}
		/>
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
