import { dataFromDatabasetype } from '@store/storeTypes'
import { dateToEpoch, isSameDay } from './conversionFunctions';
const { subYears } = require("date-fns");

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



export default function getANFIWeights(data: dataFromDatabasetype[]) {

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
			data.sort((a, b) => b.time - a.time)

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
			data.sort((a, b) => a.time - b.time)

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

	const finalArray =Array.from(firstEntryOfEachMonth)


	return finalArray[finalArray.length -1];
}


