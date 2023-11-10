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
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { useChartDataStore, useLandingPageStore } from '@/store/store';
import { chartDataType, lineChartDataType } from '@/store/storeTypes';
import { comparisonIndices } from '@/constants/comparisionIndices';
import getTooltipDate, { convertTo13DigitsTimestamp, dateToEpoch } from '@/utils/conversionFunctions';


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
	const { selectedDuration } = useChartDataStore()

	useEffect(() => {
		if (chartContainerRef.current) {
			chartRef.current = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.offsetWidth,
				height: chartContainerRef.current.offsetHeight * 0.78,
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

			function historyRangeFilter(unsortedData: lineChartDataType[]) {
				const timeNow = Math.floor(Date.now() / 1000) //current epoc time
				let sortedData: lineChartDataType[] = []
				if (selectedDuration !== -1) {
					unsortedData.map((data) => {
						if (selectedDuration && timeNow - Number(data.time) < selectedDuration * 86400) { //86400sec in 1 day
							sortedData.push(data)
						}
					})
				} else {
					unsortedData.map((data) => {
						const timestampOfFirstDayOfYear = dateToEpoch(`01-01-${(new Date()).getFullYear()}`)
						if (selectedDuration && Number(data.time) > timestampOfFirstDayOfYear) {
							sortedData.push(data)
						}
					})
				}

				sortedData.sort((a, b) => Number(a.time) - Number(b.time))
				return sortedData
			}

			const handleResize = () => {
				if (chartContainerRef.current) {
					chartRef.current.applyOptions({
						width: chartContainerRef.current.offsetWidth,
						height: chartContainerRef.current.clientHeight * 0.5
					})
				}
				// console.log('inside handleResize function', chartContainerRef.current?.clientWidth)
				// chartRef.current.applyOptions({ width: Number(chartContainerRef.current?.clientWidth) * 0.90 })

			}

			areaSeries.setData(historyRangeFilter(data))

			const container = chartContainerRef.current
			container.style.position = 'relative'
			const chart = chartRef.current

			const toolTip = document.createElement('div');
			toolTip.style.width = '175px';
			toolTip.style.height = '65px';
			toolTip.style.position = 'absolute';
			toolTip.style.padding = '8px';
			toolTip.style.boxSizing = 'border-box';
			toolTip.style.fontSize = '12px';
			toolTip.style.textAlign = 'left';
			toolTip.style.zIndex = '1000';
			toolTip.style.top = '20px';
			toolTip.style.left = '20px';
			toolTip.style.pointerEvents = 'none';
			toolTip.style.background = 'transparent';
			toolTip.style.color = 'black';

			container.appendChild(toolTip);

			type CrosshairMoveEventParam = {
				seriesData: any;
				time?: TimePointIndex;
				point?: { x: number; y: number };
			};

			const selectedCompIndexes = Object.keys(chartData).filter((i) => {
				const res = comparisonIndices.find((item) => item.columnName === i )
				if (res) return true;
			})
			if (selectedCompIndexes.length > 0) {
				const incHeight = selectedCompIndexes.length * 25 as number
				toolTip.style.height = (Number(toolTip.style.height.split('px')[0]) + incHeight) + 'px'
			}

			let toolTipContentStatic =
				`<div style="font-size: 14px; z-index:100; margin: 4px 0px;  display: flex; flex-direction: row; color: ${'black'}">	
				<Image
				src="${defaultIndex === 'CRYPTO5' ? cr5Logo.src : anfiLogo.src}"
					alt="tooltip logo"
					style="width:22px;
					   height:22px; 
					   margin-right:5px ; 
					   border-radius:50%;">
				</Image>
				${defaultIndex}
			</div>`

			if (selectedCompIndexes.length > 0) {
				selectedCompIndexes.map((index) => {
					const indexDetails = comparisonIndices.find((item) => item.columnName === index );
					if (indexDetails) {

						toolTipContentStatic += `<div style="font-size: 14px; margin: 4px 0px; display: flex; flex-direction: row; color: ${indexDetails?.selectionColor}">`
						toolTipContentStatic += `<Image
						src=${indexDetails?.logo}
						alt="tooltip logo"
											style="width:22px;
												   height:22px; 
												   margin-right:5px ; 
												   border-radius:50%;">
										   </Image>`
						toolTipContentStatic += `${indexDetails?.shortName}`
						toolTipContentStatic += `</div>`
					}
				})
			}

			toolTip.innerHTML = toolTipContentStatic

			chart.subscribeCrosshairMove((param: CrosshairMoveEventParam) => {
				if (
					param.point === undefined ||
					!param.time ||
					param.point.x < 0 ||
					param.point.x > container.clientWidth ||
					param.point.y < 0 ||
					param.point.y > container.clientHeight
				) {
					let toolTipContent =
						`<div style="font-size: 14px; margin: 4px 0px;  display: flex; flex-direction: row; color: ${'black'}">	
						<Image
						src="${defaultIndex === 'CRYPTO5' ? cr5Logo.src : anfiLogo.src}"
							alt="tooltip logo"
							style="width:22px;
							   height:22px; 
							   margin-right:5px ; 
							   border-radius:50%;">
						</Image>
						${defaultIndex}
					</div>`

					if (selectedCompIndexes.length > 0) {
						selectedCompIndexes.map((index) => {
							const indexDetails = comparisonIndices.find((item) => item.columnName === index);
							toolTipContent += `<div style="font-size: 14px; margin: 4px 0px; display: flex; flex-direction: row; color: ${indexDetails?.selectionColor}">`
							toolTipContent += `<Image
													src=${indexDetails?.logo}
													alt="tooltip logo"
													style="width:22px;
														   height:22px; 
														   margin-right:5px ; 
														   border-radius:50%;">
												   </Image>`
							toolTipContent += `${indexDetails?.shortName}`
							toolTipContent += `</div>`
						})
					}

					toolTip.innerHTML = toolTipContent
				} else {
					const dateStr = param.time;
					toolTip.style.display = 'block';
					const data = param.seriesData.get(areaSeries);
					if (data && data !== undefined) {
						const price = data && data.value !== undefined ? data.value : data.close;
						let toolTipContent =
							`<div style="font-size: 14px; margin: 4px 0px;  display: flex; flex-direction: row; color: ${'black'}">	
						<Image
						src="${defaultIndex === 'CRYPTO5' ? cr5Logo.src : anfiLogo.src}"
							alt="tooltip logo"
							style="width:22px;
							   height:22px; 
							   margin-right:5px ; 
							   border-radius:50%;">
						</Image>
							   ${defaultIndex}: ${Math.round(100 * price) / 100}
							   </div>`

						if (param.seriesData.size > 1) {
							const mapEntries = Array.from((param.seriesData as Map<string, any>).entries());
							for (const [index, [, value]] of mapEntries.entries()) {
								if (index - 1 >= 0) {
									const indexDetails = comparisonIndices.find((item) => item.columnName === selectedCompIndexes[index - 1]);
									toolTipContent += `<div style="font-size: 14px; z-index: 100; margin: 4px 0px; display: flex; flex-direction: row; color: ${indexDetails?.selectionColor}">`
									toolTipContent += `<Image
								src=${indexDetails?.logo}
								alt="tooltip logo"
													style="width:22px;
														   height:22px; 
														   margin-right:5px ; 
														   border-radius:50%;">
												   </Image>`
									toolTipContent += `${indexDetails?.shortName}: ${Math.round(100 * value.value) / 100}`
									toolTipContent += `</div>`
								}
							}

						}

						toolTip.innerHTML = toolTipContent;
					}
				}
			});

			Object.entries(chartData).forEach(([key, value]) => {
				const indexDetails = comparisonIndices.find((item) => item.columnName === key);
				if (indexDetails) {

					const areaSeries = chartRef.current.addLineSeries({
						lineWidth: 2,
						color: indexDetails?.selectionColor,
					})

					areaSeries.priceScale().applyOptions({
						drawTicks: true,
						scaleMargins: {
							top: 0.05,
							bottom: 0.05,
						},

					})

					const formatedLineData = value.data.map((data) => {
						return {
							time: data.time,
							value: Number(data.open)
						}
					})
					formatedLineData.sort((a, b) => a.time - b.time);
					areaSeries.setData(historyRangeFilter(formatedLineData))
				}
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
				toolTip.innerHTML = ''
				chartRef.current.remove()
			}
		}
	}, [chartData, data, maxValue, minValue, num, defaultIndex, selectedDuration])


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
		// mode: 1,
		visible: visible,
		autoScale: true, // You can set this to your desired value
		invertScale: false, // You can set this to your desired value
		alignLabels: false, // You can set this to your desired value
		scaleMargins: {
			top: 0.2, // You can set this to your desired value
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
