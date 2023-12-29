import { dataFromDatabasetype } from '@store/storeTypes'
import { dateToEpoch, isSameDay, isSameMonth } from './conversionFunctions';
const { subYears, startOfDay } = require("date-fns");

type processedDataType = {
	date: string
	weight: number
	price: number
	token: string
}

type ANFIDataType = {
	date: string
	weightBtc: number
	weightGold: number
	priceBtc: number
	priceGold: number
}

function getGoldPrice(str: string): number {
	if (str.includes(',')) {
		return Number(str.split(',')[0]);
	} else {
		return Number(str);
	}
}

function getIndexValue(arr: processedDataType[], base: number, div: number) {
	const value = arr.reduce((accumulator, obj) => {
		return accumulator + (obj.weight * Number(obj.price) * base);
	}, 0);
	return value / div
}
function getANFIndexValue(arr: ANFIDataType[], base: number, div: number) {
	const selectedArr = arr[0]
	const value = ((selectedArr.priceBtc * selectedArr.weightBtc * base) + (selectedArr.priceGold * selectedArr.weightGold * base))
	return value / div
}

export default function getOracleIndexData(index: string, data: dataFromDatabasetype[], top5: { timestamp: string, top5: string }[]) {

	if (index === 'ANFI') {
		const ANFIData: { time: number; value: number }[] = []
		const anfiWeightMap = new Map<number, {
			date: string
			weightBtc: number
			weightGold: number
			priceBtc: number
			priceGold: number
		}[]>()

		data.map((closeData) => {
			const closeDate = closeData.time;
			const oneYearAgoDate = subYears(new Date(closeDate * 1000), 1); // Subtract one year
			const openDate = dateToEpoch(oneYearAgoDate)

			const openData = data.find((item) => {
				return isSameDay(item.time, openDate);
			});
			interface PriceChange {
				bitcoin: number; // Calculated Bitcoin price change
				gold: number; // Calculated Gold price change
			}

			function calculatePriceChange(data: dataFromDatabasetype[]): PriceChange {
				let totalBitcoinReturns = 0;
				let totalGoldReturns = 0;
				data.sort((a,b)=>b.time - a.time)

				for (let i = 1; i < data.length; i++) {
					const prevDayBitcoinPrice = data[i - 1].bitcoin;
					const currentDayBitcoinPrice = data[i].bitcoin;

					const prevDayGoldPrice = data[i - 1].gold.split(',').map(Number)[0];
					const currentDayGoldPrice = data[i].gold.split(',').map(Number)[0];

					const bitcoinReturn = (currentDayBitcoinPrice - prevDayBitcoinPrice) / prevDayBitcoinPrice * 100;
					const goldReturn = (currentDayGoldPrice - prevDayGoldPrice) / prevDayGoldPrice * 100;

					totalBitcoinReturns += Math.abs(bitcoinReturn);
					totalGoldReturns += Math.abs(goldReturn);
				}

				// Calculate average daily returns
				const averageBitcoinReturn = totalBitcoinReturns / data.length;
				const averageGoldReturn = totalGoldReturns / data.length;

				return { bitcoin: averageBitcoinReturn, gold: averageGoldReturn };
			}

			function findPriceDataInRange(data: dataFromDatabasetype[], closeDate: number, openDate: number): PriceChange {
				const result: dataFromDatabasetype[] = [];
				data.sort((a,b)=>a.time - b.time)

				let foundCloseDate = false;
				let openDateFound = false;

				for (let i = 0; i < data.length; i++) {
					const item = data[i];

					if (item.time === openDate) {
						openDateFound = true;
					}

					if (openDateFound) {
						result.push(item);

						if (item.time === closeDate) {
							foundCloseDate = true;
							break;
						}
					}
				}

				if (!foundCloseDate) {
					const closeDateIndex = data.findIndex(item => item.time > closeDate);

					if (closeDateIndex !== -1) {
						result.splice(closeDateIndex);
					}
				}
				
				return calculatePriceChange(result);
			}

		
			const { bitcoin, gold } = findPriceDataInRange(data, closeDate, openDate)

			if (bitcoin && gold) {

				const volatilityBtc = bitcoin / 100
				const volatilityGold = gold / 100
				
				const inverseVolatilityBtc = 1 / volatilityBtc
				const inverseVolatilityGold = 1 / volatilityGold
				
				
				const sumOfInverVol = inverseVolatilityBtc + inverseVolatilityGold
				const weightBTC = inverseVolatilityBtc / sumOfInverVol
				const weightGold = inverseVolatilityGold / sumOfInverVol

				const obj: {
					date: string
					weightBtc: number
					weightGold: number
					priceBtc: number
					priceGold: number
				} = { date: '', weightBtc: 0, weightGold: 0, priceBtc: 0, priceGold: 0 }

				let array = []
				obj.date = new Date(closeData.time * 1000).toDateString()
				obj.weightBtc = weightBTC
				obj.weightGold = weightGold
				obj.priceBtc = Number(closeData.bitcoin)
				obj.priceGold = getGoldPrice(closeData.gold)
				array.push(obj)
				anfiWeightMap.set(closeData.time, array)
			}
		})

		const sortedArray = Array.from(anfiWeightMap).sort((a, b) => a[0] - b[0]);
		const sortedMap = new Map(sortedArray);

		const firstEntryOfEachMonth: Map<number, ANFIDataType[]> = new Map();

		const seenMonths = new Set<string>();

		sortedMap.forEach((dataArr, timestamp) => {
			const firstTimeStamp = timestamp;

			const year = new Date(firstTimeStamp * 1000).getFullYear()
			const month = new Date(firstTimeStamp * 1000).getMonth()
			const monthYearKey = `${year}-${month}`;

			if (!seenMonths.has(monthYearKey)) {
				seenMonths.add(monthYearKey);
				firstEntryOfEachMonth.set(timestamp, dataArr);
			}
		});

		let isCreationDay = true;
		let divisor = 0
		const firstEntryKey = sortedMap.keys().next().value;
		const firstEntryValue = sortedMap.get(firstEntryKey);
		let enteredMonthTimestamp = firstEntryValue ? firstEntryValue[0].date : ''
		let baseMult = 1
		sortedMap.forEach((dataArr, timestamp) => {
			const anfiObj: { time: number; value: number, btcWeight: number, goldWeight: number } = { time: 0, value: 0 , btcWeight: 0, goldWeight: 0}
			let foundFirstData: ANFIDataType[] = [];
			firstEntryOfEachMonth.forEach((firstObj, firstTimestamp) => {
				if (isSameMonth(firstTimestamp, timestamp)) {
					foundFirstData = firstObj
				}
			})

			if (isCreationDay) {
				isCreationDay = false
				enteredMonthTimestamp = foundFirstData[0].date
				const arr = dataArr[0]
				divisor = ((arr.priceBtc * arr.weightBtc * 1) + (arr.priceGold * arr.weightGold * 1)) /100

				anfiObj.time = timestamp
				anfiObj.value = 100
                //new
                // anfiObj.btcWeight = arr.weightBtc;
                // anfiObj.goldWeight = arr.weightGold;

				ANFIData.push(anfiObj)

			} else {

				if (enteredMonthTimestamp !== foundFirstData[0].date) {
					enteredMonthTimestamp = foundFirstData[0].date
					let previousKey = null;

					for (const [key, value] of firstEntryOfEachMonth) {
						if (value === foundFirstData) {
							break;
						}
						previousKey = key;
					}

					if (previousKey !== null) {
						const previousValue = firstEntryOfEachMonth.get(previousKey);
						const alteredPrev = previousValue?.map((data, index) => {

							return { ...data, priceBtc: foundFirstData[index].priceBtc, priceGold: foundFirstData[index].priceGold }
						}) as ANFIDataType[]
						const oldBase = baseMult
						baseMult = getANFIndexValue(alteredPrev, oldBase, divisor) * (1 / getANFIndexValue(foundFirstData, oldBase, divisor))
					}
				}

				anfiObj.time = timestamp
				anfiObj.value = getANFIndexValue(dataArr, baseMult, divisor)
                // anfiObj.btcWeight = dataArr.weightBtc;
                // anfiObj.goldWeight = arr.weightGold;
                
				ANFIData.push(anfiObj)
			}

		});

		// return ANFIData
		return sortedArray;
	} else if (index === 'CRYPTO5') {
		type CRYPTO5 = { time: number; value: number }

		const CRYPTO5Data: CRYPTO5[] = []
		const processedData = new Map<number, processedDataType[]>()

		data.forEach((list) => {
			top5.forEach((top) => {
				if (isSameMonth(list.time, Number(top.timestamp))) {
					const time = Number(list?.time)
					const top5Arr: { token: string, marketCap: number }[] = []
					top.top5.split(',').map((tokenWithMarketcap) => {
						const arr = tokenWithMarketcap.split(':')
						const obj: { token: string, marketCap: number } = { token: '', marketCap: 0 };
						obj.token = arr[0]
						obj.marketCap = Number(arr[1])
						top5Arr.push(obj)
					})

					const sum = top5Arr.reduce((total, obj) => total + obj.marketCap, 0);

					top5Arr.map((data) => {
						const tokenName = data.token.includes('-') ? data.token.split('-').join('') : data.token
						const obj: {
							date: string
							weight: number
							price: number
							token: string
						} = { date: '', weight: 0, price: 0, token: '' }
						if (!(processedData.get(time))) {
							let array = []
							obj.token = tokenName
							obj.weight = data.marketCap / sum
							obj.price = Number(list[tokenName])
							obj.date = new Date(time * 1000).toDateString()
							array.push(obj)
							processedData.set(time, array)
						} else {
							const existingArray = processedData.get(time)
							obj.token = tokenName
							obj.weight = data.marketCap / sum
							obj.price = Number(list[tokenName])
							obj.date = new Date(time * 1000).toDateString()
							existingArray?.push(obj)
						}
					})
				}

			})
		})

		const sortedProcessedData = new Map(
			Array.from(processedData).sort((a, b) => a[0] - b[0])
		);

		const firstEntryOfEachMonth: Map<number, processedDataType[]> = new Map();

		const seenMonths = new Set<string>();

		sortedProcessedData.forEach((dataArr, timestamp) => {
			const firstTimeStamp = timestamp;

			const year = new Date(firstTimeStamp * 1000).getFullYear()
			const month = new Date(firstTimeStamp * 1000).getMonth()
			const monthYearKey = `${year}-${month}`;

			if (!seenMonths.has(monthYearKey)) {
				seenMonths.add(monthYearKey);
				firstEntryOfEachMonth.set(timestamp, dataArr);
			}
		});


		let isCreationDay = true;
		let divisor = 0
		const firstEntryKey = sortedProcessedData.keys().next().value;
		const firstEntryValue = sortedProcessedData.get(firstEntryKey);
		let enteredMonthTimestamp = firstEntryValue ? firstEntryValue[0].date : ''
		let baseMult = 1
		sortedProcessedData.forEach((dataArr, timestamp) => {
			const cr5Obj: { time: number; value: number } = { time: 0, value: 0 }
			let foundFirstData: processedDataType[] = [];
			firstEntryOfEachMonth.forEach((firstObj, firstTimestamp) => {
				if (isSameMonth(firstTimestamp, timestamp)) {
					foundFirstData = firstObj
				}
			})

			if (isCreationDay) {
				isCreationDay = false
				enteredMonthTimestamp = foundFirstData[0].date
				divisor = dataArr.reduce((accumulator, obj) => {
					return accumulator + (obj.weight * Number(obj.price) * 1); //base mul is 1 for the starting
				}, 0) / 100 	// Taking the index value as 100 for the starting

				cr5Obj.time = timestamp
				cr5Obj.value = 100
				CRYPTO5Data.push(cr5Obj)

			} else {

				if (enteredMonthTimestamp !== foundFirstData[0].date) {
					enteredMonthTimestamp = foundFirstData[0].date
					let previousKey = null;

					for (const [key, value] of firstEntryOfEachMonth) {
						if (value === foundFirstData) {
							break;
						}
						previousKey = key;
					}

					if (previousKey !== null) {
						const previousValue = firstEntryOfEachMonth.get(previousKey);
						const alteredPrev = previousValue?.map((data, index) => {

							return { ...data, price: foundFirstData[index].price }
						}) as processedDataType[]
						const oldBase = baseMult
						baseMult = getIndexValue(alteredPrev, oldBase, divisor) * (1 / getIndexValue(foundFirstData, oldBase, divisor))
					}
				}

				cr5Obj.time = timestamp
				cr5Obj.value = getIndexValue(dataArr, baseMult, divisor)
				CRYPTO5Data.push(cr5Obj)
			}

		});

		return CRYPTO5Data
	}
}
