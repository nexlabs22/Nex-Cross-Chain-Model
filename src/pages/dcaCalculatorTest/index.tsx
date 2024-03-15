'use client'

import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import Image from 'next/image'
import { useChartDataStore } from '@/store/store'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Menu, MenuButton } from '@szhsin/react-menu'
import Switch from 'react-switch'
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
import { GenericToast } from '@/components/GenericToast'
import { toast } from 'react-toastify'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
import logo from '@assets/images/xlogo_s.png'

// Firebase :
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'

interface User {
	email: string
	inst_name: string
	main_wallet: string
	name: string
	vatin: string
	address: string
	ppLink: string
	p1: boolean
	p2: boolean
	p3: boolean
	p4: boolean
	p5: boolean
	ppType: string
	creationDate: string
}

import usePortfolioPageStore from '@/store/portfolioStore'
import { useAddress } from '@thirdweb-dev/react'
import { isSameMonth } from '@/utils/conversionFunctions'
import exportDCATable from '@/utils/exportDCATable'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function DCACalculatorTest() {
	const { mode } = useLandingPageStore()
	// const pdfContainer = useRef<HTMLDivElement | null>(null)

	const address = useAddress()
	const [connectedUser, setConnectedUser] = useState<User>()
	const [connectedUserId, setConnectedUserId] = useState('')

	useEffect(() => {
		function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				for (const key in users) {
					console.log(users[key])
					const potentialUser: User = users[key]
					if (address && potentialUser.main_wallet == address) {
						setConnectedUser(potentialUser)
						setConnectedUserId(key)
					}
				}
			})
		}
		getUser()
	}, [address])

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
	// const data = selectedIndex === 'ANFI' ? filterFirstOfMonth(ANFIData) : filterFirstOfMonth(CR5Data)
	const data: dcaDataType[] = selectedIndex === 'ANFI' ? ANFIData : CR5Data
	// console.log("data-->",data)
	const validationDates = {
		minMonth: data && data[0] && data[0].date ? new Date(data[0].date).getMonth() : -1,
		minYear: data && data[0] && data[0] ? Number(data[0].date?.split(' ')[3]) : -1,
		maxMonth: data && data[0] && data[data.length - 1]?.date ? new Date(data[data.length - 1].date as string).getMonth() : -1,
		maxYear: data && data[0] && data[data.length - 1] ? Number(data[data.length - 1].date?.split(' ')[3]) : -1,
	}
	// console.log(validationDates)
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const [startMonths, setStartMonths] = useState<string[]>(months)
	const [endMonths, setEndMonths] = useState<string[]>(months)

	const [initialAmount, setInitialAmount] = useState(1000)
	const [initialAmount2, setInitialAmount2] = useState(1000)
	const [monthlyInvestment, setMonthlyInvestment] = useState(100)
	const [selectedStartMonth, selectStartMonth] = useState('January')
	const [selectedEndMonth, selectEndMonth] = useState('December')
	const [selectedStartYear, selectStartYear] = useState(2023)
	const [selectedEndYear, selectEndYear] = useState(2023)
	const [filteredIndexDataChart, setFilteredIndexDataChart] = useState<dcaDataType[]>([])
	const [filteredIndexData, setFilteredIndexData] = useState<dcaDataType[]>([])
	const [isChecked, setChecked] = useState(true)

	useEffect(() => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		if (selectedStartYear < validationDates.minYear) {
			setStartMonths(['No option'])
			selectStartMonth('No option')
		} else {
			const start = selectedStartYear === validationDates.minYear ? validationDates.minMonth : 0
			setStartMonths(months.slice(start))
		}

		if (validationDates.maxYear !== -1 && selectedEndYear > validationDates.maxYear) {
			console.log(selectedEndYear, validationDates.maxYear)
			setEndMonths(['No option'])
			selectEndMonth('No option')
		} else {
			const end = selectedEndYear === validationDates.maxYear ? validationDates.maxMonth + 1 : months.length
			setEndMonths(months.slice(0, end))
		}
	}, [selectedStartYear, selectedEndYear, validationDates.minYear, validationDates.minMonth, validationDates.maxYear, validationDates.maxMonth])

	const changeInitialAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isChecked) {
			setInitialAmount(Number(e?.target?.value))
		} else {
			setInitialAmount2(Number(e?.target?.value))
		}
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

	function getNextMonthAndYear(currentMonth: string, year: number): { nextMonth: string; nextYear: number } {
		// Validate input month
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		const monthIndex = monthNames.findIndex((month) => month.toLowerCase() === currentMonth.toLowerCase())
		if (monthIndex === -1) {
			throw new Error('Invalid month. Please provide a valid month name.')
		}

		// Calculate next month and year
		let nextMonthIndex: number
		let nextYear: number

		if (monthIndex === 11) {
			nextMonthIndex = 0
			nextYear = year + 1
		} else {
			nextMonthIndex = monthIndex + 1
			nextYear = year
		}

		const nextMonth = monthNames[nextMonthIndex]

		return { nextMonth, nextYear }
	}

	function handleSubmit(initialAmt?: number) {
		const firstMonthData: dcaDataType[] = filterFirstOfMonth(data)
		if (data.length > 0) {
			if (selectedStartMonth !== 'No option' && selectedEndMonth !== 'No option') {
				function filterDataByDateRange(data: dcaDataType[], startMonth: string, startYear: number, endMonth: string, endYear: number): dcaDataType[] {
					const startTimestamp = findClosestTimestamp(data, startMonth, startYear)
					const { nextMonth, nextYear } = getNextMonthAndYear(endMonth, endYear)
					const endTimestamp = findClosestTimestamp(data, nextMonth, nextYear)

					const filteredData = data.filter((item) => item.time > startTimestamp && item.time < endTimestamp)
					const firstMonthData: dcaDataType[] = filterFirstOfMonth(filteredData)
					let totalInvested = initialAmt && !isChecked ? initialAmt : initialAmount
					let seenMonth = ''
					const percentageGainData: dcaDataType[] = filteredData.map((item, index) => {
						const filtering = firstMonthData.filter((d) => {
							return isSameMonth(d.time, item.time)
						})
						if (isChecked && seenMonth !== filtering[0].date) {
							totalInvested += monthlyInvestment
						}
						seenMonth = filtering[0].date as string

						const date = new Date(item.time * 1000).toDateString()
						const tokenAmt = totalInvested / item.value
						const prevTokenAmt = index === 0 ? 0 : (totalInvested - monthlyInvestment) / filteredData[index - 1].value
						const total = index === 0 ? tokenAmt * item.value : prevTokenAmt * item.value + monthlyInvestment
						const percentageGain = ((total - totalInvested) / totalInvested) * 100
						const totalGain = total - totalInvested
						return { ...item, percentageGain, totalInvested, totalGain, total, tokenAmt, date }
					})
					return percentageGainData
				}

				const filteredData = filterDataByDateRange(firstMonthData, selectedStartMonth, selectedStartYear, selectedEndMonth, selectedEndYear)
				const filteredDataChart = filterDataByDateRange(data, selectedStartMonth, selectedStartYear, selectedEndMonth, selectedEndYear)

				setFilteredIndexData(filteredDataChart)
				setFilteredIndexDataChart(filteredDataChart)
			} else {
				GenericToast({ type: 'error', message: 'Please choose start or end month' })
			}
		}
	}

	useEffect(() => {
		if (data.length > 0) {
			if (!isChecked) {
				console.log(filteredIndexData[filteredIndexData.length - 1].totalInvested)
				setInitialAmount2(filteredIndexData[filteredIndexData.length - 1].totalInvested as number)
				handleSubmit(filteredIndexData[filteredIndexData.length - 1].totalInvested)
			} else {
				handleSubmit()
			}
		}
	}, [selectedIndex, data.length, isChecked])

	const csvData: any[][] = [
		['Date', 'Price', 'Percentage Change', 'Invested Amount', 'Total Change', 'Total'],
		...filteredIndexData.map((item) => [
			item.date || '', // Using empty string if date is undefined
			item.value || '',
			item.percentageGain || '',
			item.totalInvested || '',
			item.totalGain || '',
			item.total || '',
		]),
	]

	const columns: (keyof exportdcaDataType)[] = [
		'date',
		'value',
		'percentageGain',
		'totalInvested',
		'totalGain',
		'total',
		'initialAmount',
		'monthlyInvestment',
		'selectedStartMonth',
		'selectedStartYear',
		'selectedEndMonth',
		'selectedEndYear',
	]

	const columnMapping: Record<keyof exportdcaDataType, string> = {
		date: 'Date',
		value: 'Price',
		percentageGain: 'Percentage Change',
		totalInvested: 'Total Invested',
		totalGain: 'Total Change',
		total: 'Total',
		time: '', // don't want to include 'time'
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

	async function exportPdf() {
		GenericToast({
			type: 'loading',
			message: 'Exporting DCA Data as a PDF file..',
		})

		const dataToExport = []
		const heading = ['Date', 'Price', 'Percentage Change', 'Total Invested', 'Total Change', 'Total']
		dataToExport.push(heading)
		filteredIndexData.forEach((data) => {
			dataToExport.push([
				data.date,
				'$' + Number(data.value.toFixed(2)).toLocaleString(),
				// { text: side, bold: true, color: 'white', alignment: 'center', fillColor: side.toLowerCase() === 'mint' ? '#089981' : '#F23645' },
				{
					text: data.percentageGain && data.percentageGain > 0 ? '+' + data.percentageGain?.toFixed(2) + '%' : data.percentageGain?.toFixed(2) + '%',
					color: data.percentageGain && data.percentageGain > 0 ? '#089981' : data.percentageGain && data.percentageGain < 0 ? '#F23645' : 'black',
				},
				data.totalInvested ? '$' + Number(data.totalInvested?.toFixed(2)).toLocaleString() : '0.00',
				data.totalGain ? Number(data.totalGain?.toFixed(2)).toLocaleString() : '0.00',
				data.total ? '$' + Number(data.total?.toFixed(2)).toLocaleString() : '0.00',

				// {
				// 	text: [
				// 		`${FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} ${
				// 			side.toLowerCase() === 'mint' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				// 		}`,
				// 		// \n`,
				// 		// {
				// 		// 	text: `≈ $ ${
				// 		// 		usdPrices
				// 		// 			? side.toLowerCase() === 'mint'
				// 		// 				? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
				// 		// 				: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
				// 		// 			: 0
				// 		// 		}`,
				// 		// 	color: 'gray',
				// 		// 	italics: true,
				// 		// },
				// 	],
				// },
				// {
				// 	text: [
				// 		`${FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} ${
				// 			side.toLowerCase() === 'burn' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				// 		}`,
				// 		// \n`,
				// 		// {
				// 		// 	text: `≈ $ ${
				// 		// 		usdPrices
				// 		// 		? side.toLowerCase() === 'burn'
				// 		// 		? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
				// 		// 		: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
				// 		// 		: 0
				// 		// 	}`,
				// 		// 	color: 'gray',
				// 		// 	italics: true,
				// 		// },
				// 	],
				// },
				// position.txHash,
			])
		})
		const tableData = dataToExport

		const userDetails = {
			initialAmount: '$' + (isChecked ? initialAmount : initialAmount2),
			monthlyInvestment: '$' + monthlyInvestment,
			selectedStartMonth,
			selectedStartYear: selectedStartYear.toString(),
			selectedEndMonth,
			selectedEndYear: selectedEndYear.toString(),
		}

		exportDCATable(tableData, 'portrait', fileName, userDetails, isChecked)
	}

	function exportCSV() {
		toast.dismiss()
		GenericToast({
			type: 'success',
			message: 'CSV file downloaded successfully...',
		})
	}

	const toggleCheckbox = () => {
		setChecked(!isChecked)
	}

	return (
		<>
			<Head>
				<title>Nex Labs - DCA Calculator</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'bg-gradient-to-tl from-[#050505] to-[#050505]' : 'bg-whiteBackground-500'} p-0 overflow-x-hidden`}>
				<section className="h-full w-fit overflow-x-hidden flex flex-col items-center">
					<DappNavbar />
					<div className="flex items-center mt-4">
						{' '}
						{/* Added flex and items-center */}
						<span className="mr-2">All at once</span>
						<Switch onChange={toggleCheckbox} checked={isChecked} height={14} width={35} handleDiameter={20} />
						<span className="ml-2">Using DCA Stratergy</span>
					</div>

					<section className="w-screen h-fit flex flex-col xl:flex-row  items-stretch justify-start px-4 pt-10 pb-12">
						<div className="w-full xl:w-3/12 flex-grow flex flex-col  justify-between">
							<Menu
								menuButton={
									<MenuButton>
										<div
											className={`w-11/12 h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md ${
												mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tr from-colorFour-500 to-colorSeven-500 hover:to-colorSeven-500'
											}  shadow-sm shadow-blackText-500 gap-8 cursor-pointer`}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
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
								className="subCatgoriesMenu w-full"
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
							<div className="flex flex-col items-start justify-start gap-1 w-full">
								<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>Initial Investment</label>
								<input
									type="number"
									placeholder="0.00"
									className={`w-11/12 text-sm ${
										mode == 'dark'
											? ' bg-transparent border border-whiteText-500 text-whiteText-500 placeholder:text-whiteText-500'
											: ' text-blackText-500 bg-whiteBackground-50 placeholder:text-blackText-500'
									} interMedium placeholder:text-2xl shadow-sm shadow-black rounded-lg p-2 ${!isChecked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
									onChange={changeInitialAmount}
									disabled={!isChecked}
									value={isChecked ? initialAmount : initialAmount2}
								/>
							</div>
							{isChecked && (
								<div className="flex flex-col items-start justify-start gap-1">
									<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>Monthly Investment</label>
									<input
										type="number"
										placeholder="0.00"
										className={`w-11/12 text-sm ${
											mode == 'dark'
												? ' bg-transparent border border-whiteText-500 text-whiteText-500 placeholder:text-whiteText-500'
												: ' text-blackText-500 bg-whiteBackground-50 placeholder:text-blackText-500'
										} interMedium placeholder:text-2xl shadow-sm shadow-black rounded-lg p-2`}
										onChange={changeMonthlyInvestment}
										value={monthlyInvestment}
									/>
								</div>
							)}
							<div className="flex flex-col items-start justify-start gap-1 w-full h-fit">
								<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>Start Month</label>
								<Menu
									menuButton={
										<MenuButton className="w-full">
											<div
												className={`w-11/12 shadow-sm shadow-black h-fit px-2 py-2 flex flex-row items-center justify-between rounded-lg ${
													mode == 'dark' ? ' bg-transparent border border-whiteText-500 text-whiteText-500' : 'bg-white text-blackText-500'
												} gap-8 cursor-pointer`}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} interMedium `}>{selectedStartMonth}</h5>
												</div>
												<GoChevronDown color="#2A2A2A" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu w-full"
								>
									{startMonths.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer "
												onClick={() => {
													if (sub !== 'No option') {
														selectStartMonth(sub)
													}
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-black interMedium whitespace-nowrap">{sub}</h5>
												</div>
											</div>
										)
									})}
								</Menu>
							</div>
							<div className="flex flex-col items-start justify-start gap-1">
								<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>Start Year</label>
								<input
									type="number"
									placeholder="0.00"
									className={`w-11/12 text-sm ${
										mode == 'dark'
											? ' bg-transparent border border-whiteText-500 text-whiteText-500 placeholder:text-whiteText-500'
											: ' text-blackText-500 bg-whiteBackground-50 placeholder:text-blackText-500'
									} interMedium placeholder:text-2xl shadow-sm shadow-black rounded-lg p-2`}
									onChange={changeStartYear}
									value={selectedStartYear}
								/>
							</div>
							<div className="flex flex-col items-start justify-start gap-1">
								<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>End Month</label>
								<Menu
									menuButton={
										<MenuButton className="w-full">
											<div
												className={`w-11/12 shadow-sm shadow-black h-fit px-2 py-2 flex flex-row items-center justify-between rounded-lg ${
													mode == 'dark' ? ' bg-transparent border border-whiteText-500 text-whiteText-500' : 'bg-white text-blackText-500'
												} gap-8 cursor-pointer`}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} interMedium`}>{selectedEndMonth}</h5>
												</div>
												<GoChevronDown color="#2A2A2A" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu w-full"
								>
									{endMonths.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer "
												onClick={() => {
													if (sub !== 'No option') {
														selectEndMonth(sub)
													}
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm text-black interMedium whitespace-nowrap">{sub}</h5>
												</div>
												<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
											</div>
										)
									})}
								</Menu>
							</div>
							<div className="flex flex-col items-start justify-start gap-1">
								<label className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>End Year</label>
								<input
									type="number"
									placeholder="0.00"
									className={`w-11/12 text-sm ${
										mode == 'dark'
											? ' bg-transparent border border-whiteText-500 text-whiteText-500 placeholder:text-whiteText-500'
											: ' text-blackText-500 bg-whiteBackground-50 placeholder:text-blackText-500'
									} interMedium placeholder:text-2xl shadow-sm shadow-black rounded-lg p-2`}
									onChange={changeEndYear}
									value={selectedEndYear}
								/>
							</div>
							<button
								onClick={() => handleSubmit()}
								className={`text-lg mt-4 text-white titleShadow interBold ${
									mode == 'dark'
										? 'bg-cover border-transparent bg-center bg-no-repeat'
										: 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 hover:from-colorFour-500 hover:to-colorSeven-500/90'
								} active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-11/12 px-2 py-3 rounded-lg
								${!isChecked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
								disabled={!isChecked}
								style={{
									boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
									backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
								}}
							>
								Calculate
							</button>
						</div>
						<div className="w-full xl:w-9/12 flex-grow flex flex-col ">
							<div className="h-full w-full ">
								<DCACalculatorChart data={filteredIndexDataChart} />
							</div>
						</div>
					</section>
					<section className="w-full h-fit px-4 overflow-hidden lg:px-10 flex flex-col items-center justify-start gap-3">
						<div className="flex flex-row ml-auto z-10 w-full">
							<CSVLink
								data={csvData}
								className={`text-sm mr-2 text-white titleShadow interBold ${
									mode == 'dark'
										? 'bg-cover border-transparent bg-center bg-no-repeat'
										: 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 hover:from-colorFour-500 hover:to-colorSeven-500/90'
								} active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-1/10 px-2 py-3 rounded-lg
										cursor-pointer `}
								style={{
									boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
									backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
								}}
								filename={`${fileName}.csv`}
								onClick={exportCSV}
							>
								Download CSV
							</CSVLink>
							<button
								onClick={exportPdf}
								className={`text-sm mr-2 text-white titleShadow interBold ${
									mode == 'dark'
										? 'bg-cover border-transparent bg-center bg-no-repeat'
										: 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 hover:from-colorFour-500 hover:to-colorSeven-500/90'
								} active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-1/10 px-2 py-3 rounded-lg
								cursor-pointer `}
								style={{
									boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
									backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
								}}
							>
								Download PDF
							</button>
						</div>

						<div className="w-full h-full overflow-hidden">
							<div className="h-full border w-full border-gray-300 rounded-2xl overflow-x-hidden overflow-y-auto max-h-[500px]">
								<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] table-fixed border-collapse w-full rounded-xl dark:border-[#161C10] min-w-[700px]">
									<thead className="sticky top-0 rounded-t-xl border-b border-b-white ">
										<tr className={`text-md interBold ${mode == 'dark' ? ' bg-[#000000] border-b border-b-white' : 'bg-colorSeven-500'} text-whiteText-500`}>
											<th className="px-4 py-2 text-left">Time</th>
											<th className="px-4 py-2 text-right">Price</th>
											<th className="px-4 py-2 text-right">Percentage Change</th>
											{/* <th className="px-4 py-2 text-right">Token AMT</th> */}
											<th className="px-4 py-2 text-right">Invested Amount</th>
											<th className="px-4 py-2 text-right">Total Change</th>
											<th className="px-4 py-2 text-right">Total</th>
										</tr>
									</thead>
									<tbody className={`overflow-x-hidden overflow-y-auto ${mode == 'dark' ? ' bg-transparent' : ' bg-gray-200'} `}>
										{filteredIndexData.map((data: dcaDataType, i: React.Key | null | undefined) => (
											<tr key={i} className={` ${mode == 'dark' ? ' text-whiteText-500' : ' text-gray-700'} interMedium text-base border-b  border-blackText-500`}>
												<td className={`px-4 text-left py-3 `}>{data.date}</td>
												<td className={`px-4 text-right py-3 `}>${FormatToViewNumber({ value: data.value, returnType: 'string' })}</td>
												<td
													className={`px-4 text-right py-3  ${
														i != 0
															? data.percentageGain && data.percentageGain > 0
																? 'text-nexLightGreen-500'
																: 'text-nexLightRed-500'
															: mode === 'dark'
															? 'text-gray-50'
															: 'text-gray-500'
													}`}
												>
													{data.percentageGain && data.percentageGain > 0 ? '+' + data.percentageGain?.toFixed(2) : data.percentageGain?.toFixed(2)}%
												</td>
												{/* <td className={`px-4 text-right py-3 border-r border-blackText-500`}>${data.tokenAmt ? Number(data.tokenAmt.toFixed(2)).toLocaleString() : '0.00'}</td> */}
												<td className={`px-4 text-right py-3 `}>${data.totalInvested ? Number(data.totalInvested.toFixed(2)).toLocaleString() : '0.00'}</td>
												<td className={`px-4 text-right py-3 `}>{data.totalGain ? data.totalGain.toFixed(2) : '0.00'}</td>
												<td className={`px-4 text-right py-3 `}>${data.total ? Number(data.total.toFixed(2)).toLocaleString() : '0.00'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="w-full bg-transparent rounded-xl overscroll-x-auto">
							<div className="max-h-[500px] overflow-y-scroll w-full"></div>
						</div>
					</section>
				</section>

				<div className="w-full mx-auto h-0 px-2 flex flex-col items-start overflow-hidden justify-between">
					<div className="w-full h-fit" id="pdfHeader">
						<div className="w-11/12 mx-auto h-fit py-10  flex flex-row items-center overflow-hidden justify-between">
							<Image src={logo} alt="logo" className="h-20 w-20"></Image>
							<h5 className="interBold text-2xl text-blackText-500">DCA Report</h5>
						</div>
						<div className="w-11/12 mx-auto h-fit py-10 flex flex-col items-start overflow-hidden justify-between">
							<h5 className="interBold text-2xl text-blackText-500">
								User : &nbsp;
								{connectedUser ? connectedUser?.inst_name : ''}
							</h5>
							<h5 className="interBold text-2xl text-blackText-500">
								Date : &nbsp;
								{new Date().getDate().toString() + '/' + (new Date().getMonth() + 1).toString() + '/' + new Date().getFullYear().toString()}
							</h5>
						</div>
					</div>
				</div>

				<div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
				<div className="block xl:hidden">
					<MobileFooterSection />
				</div>
			</main>
		</>
	)
}
