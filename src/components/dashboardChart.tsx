import React, { useEffect, useRef } from 'react'
import {
	createChart,
	DeepPartial,
	LayoutOptions,
	LineStyle,
	TimePointIndex,
	PriceScaleMode,
	PriceScaleOptions,
	TimeScaleOptions,
} from 'lightweight-charts'
import { useChartDataStore, useLandingPageStore } from '@/store/store';
import chartDataType from '@/store/storeTypes';
import { comparisonIndices } from '@/constants/comparisionIndices';
import getTooltipDate, { convertTo13DigitsTimestamp } from '@/utils/conversionFunctions';


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
	const { defaultIndex } = useLandingPageStore()

	useEffect(() => {
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
				if (chartContainerRef.current) {
					chartRef.current.applyOptions({
						width: chartContainerRef.current.offsetWidth,
						height: chartContainerRef.current.clientHeight * 0.83
					})
				}

			}

			areaSeries.setData(data)

			const toolTipWidth = 80;
			const toolTipHeight = 80;
			const toolTipMargin = 15;
			const container = chartContainerRef.current
			const chart = chartRef.current

			const toolTip = document.createElement('div');
			toolTip.style.width = '175px';
			toolTip.style.height = '65px';
			toolTip.style.position = 'absolute';
			toolTip.style.display = 'none';
			toolTip.style.padding = '8px';
			toolTip.style.boxSizing = 'border-box';
			toolTip.style.fontSize = '12px';
			toolTip.style.textAlign = 'left';
			toolTip.style.zIndex = '1000';
			toolTip.style.top = '12px';
			toolTip.style.left = '12px';
			toolTip.style.pointerEvents = 'none';
			toolTip.style.border = '1px solid';
			toolTip.style.borderRadius = '10px';
			toolTip.style.background = 'white';
			toolTip.style.color = 'black';
			toolTip.style.borderColor = 'black';

			container.appendChild(toolTip);

			type CrosshairMoveEventParam = {
				seriesData: any;
				time?: TimePointIndex;
				point?: { x: number; y: number };
			};

			const selectedCompIndexes = Object.keys(chartData)
			if(selectedCompIndexes.length >0){
				const incHeight = selectedCompIndexes.length*25 as number
				toolTip.style.height = (Number(toolTip.style.height.split('px')[0]) + incHeight) + 'px'
			}

			chart.subscribeCrosshairMove((param: CrosshairMoveEventParam) => {	
				if (
					param.point === undefined ||
					!param.time ||
					param.point.x < 0 ||
					param.point.x > container.clientWidth ||
					param.point.y < 0 ||
					param.point.y > container.clientHeight
				) {
					toolTip.style.display = 'none';
				} else {
					const dateStr = param.time;
					toolTip.style.display = 'block';
					const data = param.seriesData.get(areaSeries);
					const price = data.value !== undefined ? data.value : data.close;
					let toolTipContent = 
					`<div style="color: ${'black'}">
						${getTooltipDate(convertTo13DigitsTimestamp(dateStr))}
					</div>
					<div style="font-size: 14px; margin: 4px 0px;  display: flex; flex-direction: row; color: ${'black'}">	
						<Image
							src={test}
							alt="tooltip logo"
							style="width:22px;
							   height:22px; 
							   margin-right:5px ; 
							   margin-left:0.75rem; 
							   border-radius:50%;">
						</Image>
						${defaultIndex}: ${Math.round(100 * price) / 100}
					</div>`

					if (param.seriesData.size > 1) {
						const mapEntries = Array.from((param.seriesData as Map<string, any>).entries());  
						for (const [index, [, value]] of mapEntries.entries()) {
							if(index-1>=0){
								const indexDetails = comparisonIndices.find((item) => item.columnName === selectedCompIndexes[index-1]);
								toolTipContent += `<div style="font-size: 14px; margin: 4px 0px; display: flex; flex-direction: row; color: ${indexDetails?.color}">`
								toolTipContent += `<Image
													src=${indexDetails?.logo}
													alt="tooltip logo"
													style="width:22px;
														   height:22px; 
														   margin-right:5px ; 
														   margin-left:0.75rem; 
														   border-radius:50%;">
												   </Image>`
								toolTipContent += `${indexDetails?.shortName}: ${Math.round(100 * value.value) / 100}`
								toolTipContent += `</div>`
							}
						}
						
					}

					toolTip.innerHTML =toolTipContent;

					const y = param.point.y;
					let left = param.point.x + toolTipMargin;
					if (left > container.clientWidth - toolTipWidth) {
						left = param.point.x - toolTipMargin - toolTipWidth;
					}

					let top = y + toolTipMargin;
					if (top > container.clientHeight - toolTipHeight) {
						top = y - toolTipHeight - toolTipMargin;
					}
					toolTip.style.left = left + 'px';
					toolTip.style.top = top + 'px';
				}
			});


			Object.entries(chartData).forEach(([key, value]) => {
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

				const formatedLineData = value.map((data) => {
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
	}, [chartData, data, maxValue, minValue, num, defaultIndex])


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
