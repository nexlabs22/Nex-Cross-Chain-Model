'use client'

import usePortfolioPageStore from '@/store/portfolioStore'
import React, { useEffect, useRef } from 'react'
import { Chart } from 'react-google-charts'
import { FaGalacticSenate } from 'react-icons/fa'

interface TreeMapChartProps {
	percentage: { anfi: number; cr5: number }
}

const GenericTreemapChart3D: React.FC<TreeMapChartProps> = ({ percentage }) => {
	const data = [
		['Asset', 'Category', 'Amount', 'Color'],
		['Global', null, 0, 0],
		['ANFI', 'Global', percentage.anfi, 10],
		['CRYPTO5', 'Global', percentage.cr5, 30],
		// ['Ethereum', 'Global', 15, 40],
		// ['MATIC', 'Global', 30, 50],
		// ['BTC', 'Global', 20, 60],
	]

	const options = {
		minColor: '#5E869B',
		midColor: '#8FB8CA',
		maxColor: '#91AC9A',

		headerHeight: 0,
		textStyle: {
			color: '#000',
			fontName: 'interBold',
			fontSize: 18,
		},
		enableHighlight: true,
		eventsConfig: {
			highlight: ['mouseover'],
			unhighlight: ['mouseout'],
			rollup: [],
			drilldown: [],
		},
	}

	const { setIndexSelectedInPie, indexSelectedInPie } = usePortfolioPageStore()
	const handleChartSelect = (Chart: any) => {
		const selectedItem = Chart.chart.getSelection()[0]
		if (selectedItem) {
			const selectedValue = Chart.chart.getDataTable().getValue(selectedItem.row, selectedItem.column)
			
			//   setSelectedData(selectedValue);
		}
	}

	return (
		<div className="interMedium text-2xl px-0 py-12 overflow-hidden h-fit w-fit">
			<Chart
				chartType="TreeMap"
				width="400px"
				height="400px"
				data={data}
				options={options}
				className=" interMedium text-3xl"
				chartEvents={[
					{
						eventName: 'select',
						callback: ({ chartWrapper }) => handleChartSelect(chartWrapper),
					},
				]}
			/>
		</div>
	)
}

export default GenericTreemapChart3D
