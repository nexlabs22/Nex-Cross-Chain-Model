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
import { useChartDataStore } from '@/store/store';
import chartDataType from '@/store/storeTypes';
import { comparisonIndices } from '@/constants/comparisionIndices';


interface GradientAreaChartProps {
	data: { time: string | number | Date; value: number }[]
}

const GradientAreaChart: React.FC<GradientAreaChartProps> = ({ data }) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<any>(null)

	const chartData = useChartDataStore().chartData

	const minValue = Math.min(...data.map((point) => point.value))
	const maxValue = Math.max(...data.map((point) => point.value))
	const num = Object.keys(chartData).length

	

	useEffect(() => {
		console.log(chartContainerRef.current)

		if (chartContainerRef.current) {
			chartRef.current = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.offsetWidth,
				height: chartContainerRef.current.offsetHeight * 0.83,
				timeScale: {
					locked: true, // Lock the time scale to prevent dragging
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
				handleScroll: true,
				layout: {
					background: { color: '#F3F3F3' }
					// backgroundColor: 'red', // Set the background color to transparent
				} as DeepPartial<LayoutOptions>, // Use type assertion to specify the type
			})

			const areaSeries = chartRef.current.addLineSeries({
				lineStyle: LineStyle.Solid, // Use smooth line style
				base: minValue, // Set the base to maxValue
				color: 'black', // Set the line color as black
				lineWidth: 2,
				priceLineVisible: false,
			})

			const handleResize = () => {
				if(chartContainerRef.current){
					chartRef.current.applyOptions({ 
						width: chartContainerRef.current.offsetWidth,
						height: chartContainerRef.current.clientHeight * 0.83
					})
				}
			
			}

			areaSeries.setData(data)

			Object.entries(chartData).forEach(([key, value]) => {
				console.log(key, value)
				const indexDetails = comparisonIndices.find((item) => item.columnName === key);
				const areaSeries = chartRef.current.addLineSeries({
					lineWidth: 2,
					color: indexDetails?.color,
				})

				areaSeries.priceScale().applyOptions({
					drawTicks: true,
					scaleMargins: {
						top: 0.05,
						bottom: 0.05,
					},

				})

				const formatedLineData = value.map((data)=>{
					return {
						time: data.time,
						value: Number(data.open)
					}
				})
				formatedLineData.sort((a, b) => a.time - b.time);
				areaSeries.setData(formatedLineData)
			})
				// Hide axes
				chartRef.current.applyOptions({
					leftPriceScale: getAxesOptions(false),
					rightPriceScale: getAxesOptions(true),
				})

				chartRef.current.applyOptions({
					grid: {
						horzLines: { visible: false },
						vertLines: { visible: false },
					},
				})

				chartRef.current.timeScale().fitContent();
				window.addEventListener('resize', handleResize)

				return () => {
					window.removeEventListener('resize', handleResize)
					chartRef.current.remove()
				}
			}
	}, [chartData, data, maxValue, minValue, num])


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

export default GradientAreaChart

// Helper function to get PriceScaleOptions
function getAxesOptions(visible: boolean): PriceScaleOptions {
	return {
		mode: 2,
		visible: visible,
		autoScale: false, // You can set this to your desired value
		invertScale: false, // You can set this to your desired value
		alignLabels: false, // You can set this to your desired value
		scaleMargins: {
			top: 0, // You can set this to your desired value
			bottom: 0, // You can set this to your desired value
		},
		borderVisible: false, // You can set this to your desired value
		// drawTicks: false,
		ticksVisible: false,
		minimumWidth: 100,
		// borderColor: '#ffffff00',
		borderColor: '#00000000',
		entireTextOnly: true,

	}
}
