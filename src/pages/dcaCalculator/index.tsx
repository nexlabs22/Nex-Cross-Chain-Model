'use client'

import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/Footer'
import { useChartDataStore } from '@/store/store'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Menu, MenuButton } from '@szhsin/react-menu'
import { GoChevronDown } from 'react-icons/go'
import { FormatToViewNumber } from '@/hooks/math'
import dynamic from 'next/dynamic'
import useToolPageStore from '@/store/toolStore'
import { dcaDataType, exportdcaDataType } from '@/types/toolTypes'
import DCACalculatorChart from '@/components/DCACalculatorChart'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { CSVLink } from 'react-csv'
import { Document, Page, pdfjs } from 'react-pdf'
import PDFUtils from '@/utils/pdfConfig'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function DCACalculator() {
	// const pdfContainer = useRef<HTMLDivElement | null>(null)

	const { ANFIData, CR5Data, fetchIndexData, loading } = useChartDataStore()
	const { selectedIndex, selectIndex } = useToolPageStore()

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	function filterFirstOfMonth(array: dcaDataType[]): dcaDataType[] {
		const result: dcaDataType[] = []

		for (let i = 0; i < array.length; i++) {
			const currentDate = new Date(array[i].time * 1000)
			const currentMonth = currentDate.getMonth()
			const currentYear = currentDate.getFullYear()

			// Check if the current entry is the first entry of the month
			if (!result.some((item) => new Date(item.time * 1000).getMonth() === currentMonth && new Date(item.time * 1000).getFullYear() === currentYear)) {
				const formattedDate = currentDate.toDateString()
				result.push({ ...array[i], date: formattedDate })
			}
		}

		return result
	}
	const indices = ['ANFI', 'CRYPTO5']
	const data = selectedIndex === 'ANFI' ? filterFirstOfMonth(ANFIData) : filterFirstOfMonth(CR5Data)
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const [initialAmount, setInitialAmount] = useState(1000)
	const [monthlyInvestment, setMonthlyInvestment] = useState(100)
	const [selectedStartMonth, selectStartMonth] = useState('January')
	const [selectedEndMonth, selectEndMonth] = useState('December')
	const [selectedStartYear, selectStartYear] = useState(2023)
	const [selectedEndYear, selectEndYear] = useState(2023)
	const [filteredIndexData, setFilteredIndexData] = useState<dcaDataType[]>([])

	const changeInitialAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInitialAmount(Number(e?.target?.value))
	}
	const changeMonthlyInvestment = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMonthlyInvestment(Number(e?.target?.value))
	}
	const changeStartYear = (e: React.ChangeEvent<HTMLInputElement>) => {
		selectStartYear(Number(e?.target?.value))
	}
	const changeEndYear = (e: React.ChangeEvent<HTMLInputElement>) => {
		selectEndYear(Number(e?.target?.value))
	}

	function findClosestTimestamp(data: dcaDataType[], targetMonth: string, targetYear: number): number {
		const targetDate = new Date(`${targetMonth} 1, ${targetYear}`).getTime() / 1000

		const closestItem = data.reduce((closest, current) => {
			const currentDiff = Math.abs(current.time - targetDate)
			const closestDiff = Math.abs(closest.time - targetDate)
			return currentDiff < closestDiff ? current : closest
		})

		return closestItem.time
	}

	function handleSubmit() {
		if (data.length > 0) {
			function filterDataByDateRange(data: dcaDataType[], startMonth: string, startYear: number, endMonth: string, endYear: number): dcaDataType[] {
				const startTimestamp = findClosestTimestamp(data, startMonth, startYear)
				const endTimestamp = findClosestTimestamp(data, endMonth, endYear)

				const filteredData = data.filter((item) => item.time >= startTimestamp && item.time <= endTimestamp)

				let totalInvested = initialAmount
				const percentageGainData: dcaDataType[] = filteredData.map((item, index) => {
					totalInvested += monthlyInvestment
					const tokenAmt = totalInvested / item.value
					const prevTokenAmt = index === 0 ? 0 : (totalInvested - monthlyInvestment) / filteredData[index - 1].value
					const total = index === 0 ? tokenAmt * item.value : prevTokenAmt * item.value + monthlyInvestment
					const percentageGain = ((total - totalInvested) / totalInvested) * 100
					const totalGain = total - totalInvested
					return { ...item, percentageGain, totalInvested, totalGain, total, tokenAmt }
				})
				return percentageGainData
			}

			const filteredData = filterDataByDateRange(data, selectedStartMonth, selectedStartYear, selectedEndMonth, selectedEndYear)

			setFilteredIndexData(filteredData)
		}
	}

	useEffect(() => {
		if (data.length > 0) {
			handleSubmit()
		}
	}, [selectedIndex, data.length])

	const csvData: any[][] = [
		['Date', 'Price', 'Percentage Gain', 'Invested Amount', 'Total Gain', 'Total'],
		...filteredIndexData.map((item) => [
			item.date || '', // Using empty string if date is undefined
			item.value || '',
			item.percentageGain || '',
			item.totalInvested || '',
			item.totalGain || '',
			item.total || '',
		]),
	]

	
	const columns: (keyof exportdcaDataType)[] = ['date', 'value', 'percentageGain', 'totalInvested', 'totalGain', 'total','initialAmount', 'monthlyInvestment', 'selectedStartMonth', 'selectedStartYear', 'selectedEndMonth', 'selectedEndYear']

	const columnMapping: Record<keyof exportdcaDataType, string> = {
		date: 'Date',
		value: 'Price',
		percentageGain: 'Percentage Gain',
		totalInvested: 'Total Invested',
		totalGain: 'Total Gain',
		total: 'Total',
		time: '', // don't want to include 'tokenAmt'
		tokenAmt: '', // don't want to include 'tokenAmt'
		initialAmount: 'Initial Investment',
		monthlyInvestment: 'Monthly Investment',
		selectedStartMonth: 'Starting Month',
		selectedStartYear: 'Starting Year',
		selectedEndMonth: 'Ending Month',
		selectedEndYear: 'Ending Month',
	}

	const pdfUtils = new PDFUtils<exportdcaDataType>()
	pdfUtils.setConfig()

	const timestampstring = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].split('T').join('')
	const fileName = `NEX-DCATool-${timestampstring}`

	function exportPdf() {
		const dataToExport: exportdcaDataType[] = filteredIndexData.map((data) => {
			return {
				...data,
				value: '$' + Number(data.value.toFixed(2)).toLocaleString(),
				percentageGain: data.percentageGain && data.percentageGain > 0 ? '+' + data.percentageGain?.toFixed(2) + '%' : data.percentageGain?.toFixed(2) + '%',
				totalInvested: data.totalInvested ? '$' + Number(data.totalInvested?.toFixed(2)).toLocaleString() : '0.00',
				totalGain: data.totalGain ? Number(data.totalGain?.toFixed(2)).toLocaleString() : '0.00',
				total: data.total ? '$' + Number(data.total?.toFixed(2)).toLocaleString() : '0.00',
				initialAmount: '$' + initialAmount,
				monthlyInvestment: '$' + monthlyInvestment,
				selectedStartMonth,
				selectedStartYear: selectedStartYear.toString(),
				selectedEndMonth,
				selectedEndYear: selectedEndYear.toString(),
			}
		})

		pdfUtils.exportToPDF(dataToExport, columns, columnMapping, fileName, 'chartId')
	}

	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen overflow-x-hidden h-fit w-screen ">
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit overflow-x-hidden flex flex-row  px-4 pt-10">
						<div className="w-1/3 h-fit flex flex-col gap-y-5 px-5">
							<div>
								<Menu
									menuButton={
										<MenuButton>
											<div className="w-[74vw] xl:w-[14vw] h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md bg-gradient-to-tr from-colorFour-500 to-colorSeven-500 hover:to-colorSeven-500 shadow-sm shadow-blackText-500 gap-8 cursor-pointer">
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-whiteBackground-500 titleShadow interBold uppercase">{selectedIndex}</h5>
												</div>
												<GoChevronDown color="#F2F2F2" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu"
								>
									{indices.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer hover:bg-[#7fa5b8]/50"
												onClick={() => {
													selectIndex(sub)
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-whiteBackground-500 interMedium uppercase whitespace-nowrap">{sub}</h5>
												</div>
												<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
											</div>
										)
									})}
								</Menu>
							</div>
							<div>
								<label className="mx-2">Initial Investment</label>
								<input
									type="number"
									placeholder="0.00"
									className="w-1/3 border-none text-sm text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-white active:border-none outline-none focus:border-none p-2"
									onChange={changeInitialAmount}
									value={initialAmount}
								/>
							</div>
							<div>
								<label className="mx-2">Monthly Investment</label>
								<input
									type="number"
									placeholder="0.00"
									className="w-1/3 border-none text-sm text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-white active:border-none outline-none focus:border-none p-2"
									onChange={changeMonthlyInvestment}
									value={monthlyInvestment}
								/>
							</div>
							<div>
								<label className="mx-2">Start Month</label>
								<Menu
									menuButton={
										<MenuButton>
											<div className="w-[74vw] xl:w-[14vw] h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md bg-white text-black gap-8 cursor-pointer">
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-blackText-500 interMedium uppercase">{selectedStartMonth}</h5>
												</div>
												<GoChevronDown color="#F2F2F2" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu"
								>
									{months.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer "
												onClick={() => {
													selectStartMonth(sub)
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-black interMedium uppercase whitespace-nowrap">{sub}</h5>
												</div>
												<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
											</div>
										)
									})}
								</Menu>
							</div>
							<div>
								<label className="mx-2">Start Year</label>
								<input
									type="number"
									placeholder="0.00"
									className="w-1/3 border-none text-sm text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-white active:border-none outline-none focus:border-none p-2"
									onChange={changeStartYear}
									value={selectedStartYear}
								/>
							</div>
							<div>
								<label className="mx-2">End Month</label>
								<Menu
									menuButton={
										<MenuButton>
											<div className="w-[74vw] xl:w-[14vw] h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md bg-white text-black gap-8 cursor-pointer">
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-blackText-500 interMedium uppercase">{selectedEndMonth}</h5>
												</div>
												<GoChevronDown color="#F2F2F2" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu"
								>
									{months.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer "
												onClick={() => {
													selectEndMonth(sub)
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-black interMedium uppercase whitespace-nowrap">{sub}</h5>
												</div>
												<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
											</div>
										)
									})}
								</Menu>
							</div>
							<div>
								<label className="mx-2">End Year</label>
								<input
									type="number"
									placeholder="0.00"
									className="w-1/3 border-none text-sm text-blackText-500 interMedium placeholder:text-2xl placeholder:text-gray-400 placeholder:pangram bg-white active:border-none outline-none focus:border-none p-2"
									onChange={changeEndYear}
									value={selectedEndYear}
								/>
							</div>
							<div>
								<button
									onClick={handleSubmit}
									className={`text-lg text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-1/2 px-2 py-3 rounded-lg
										cursor-pointer hover:from-colorFour-500 hover:to-colorSeven-500/90`}
								>
									Calculate
								</button>
							</div>
						</div>
						<div className="w-2/3 h-fit flex flex-col gap-y-5 pr-5">
							<div className="h-[70vh] w-full ">
								<DCACalculatorChart data={filteredIndexData} />
							</div>
							<div className="flex flex-row ml-auto z-10">
								<CSVLink
									data={csvData}
									className={`text-sm mr-2 text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-1/10 px-2 py-3 rounded-lg
										cursor-pointer hover:from-colorFour-500 hover:to-colorSeven-500/90`}
									filename={`${fileName}.csv`}
								>
									Download CSV
								</CSVLink>
								<button
									onClick={exportPdf}
									className={`text-sm text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-1/10 px-2 py-3 rounded-lg cursor-pointer hover:from-colorFour-500 hover:to-colorSeven-500/90`}
								>
									Download PDF
								</button>
							</div>

							<div className="w-full bg-transparent">
								<div className="max-h-[500px] overflow-y-scroll">
									<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
										<thead className="sticky top-0">
											<tr className="text-md interBold bg-colorSeven-500 text-whiteText-500">
												<th className="px-4 py-2 text-left">Time</th>
												<th className="px-4 py-2 text-right">Price</th>
												<th className="px-4 py-2 text-right">Percentage Gain</th>
												{/* <th className="px-4 py-2 text-right">Token AMT</th> */}
												<th className="px-4 py-2 text-right">Invested Amount</th>
												<th className="px-4 py-2 text-right">Total Gain</th>
												<th className="px-4 py-2 text-right">Total</th>
											</tr>
										</thead>
										<tbody className="overflow-x-hidden bg-gray-200">
											{filteredIndexData.map((data: dcaDataType, i: React.Key | null | undefined) => (
												<tr key={i} className="text-gray-700 interMedium text-base border-b  border-blackText-500">
													<td className={`px-4 text-left py-3 border-r border-blackText-500`}>{data.date}</td>
													<td className={`px-4 text-right py-3 border-r border-blackText-500`}>${FormatToViewNumber({ value: data.value, returnType: 'string' })}</td>
													<td
														className={`px-4 text-right py-3 border-r border-blackText-500 ${
															data.percentageGain ? (i != 0 ? (data.percentageGain > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500') : 'text-gray-500') : 'text-black'
														}`}
													>
														{data.percentageGain && data.percentageGain > 0 ? '+' + data.percentageGain?.toFixed(2) : data.percentageGain?.toFixed(2)}%
													</td>
													{/* <td className={`px-4 text-right py-3 border-r border-blackText-500`}>${data.tokenAmt ? Number(data.tokenAmt.toFixed(2)).toLocaleString() : '0.00'}</td> */}
													<td className={`px-4 text-right py-3 border-r border-blackText-500`}>${data.totalInvested ? Number(data.totalInvested.toFixed(2)).toLocaleString() : '0.00'}</td>
													<td className={`px-4 text-right py-3 border-r border-blackText-500`}>{data.totalGain ? data.totalGain.toFixed(2) : '0.00'}</td>
													<td className={`px-4 text-right py-3 `}>${data.total ? Number(data.total.toFixed(2)).toLocaleString() : '0.00'}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</section>
				</section>

				<div className="w-fit h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
			</main>
		</>
	)
}
