import btc from '@assets/images/btc.png'
import gold from '@assets/images/gold.jpg'
import oil from '@assets/images/oil.jpg'
import sandp from '@assets/images/s&p.jpeg'
import dow from '@assets/images/dow.png'
import nasdaq from '@assets/images/nasdaq.jpg'
import nyse from '@assets/images/nyse.png'
export const comparisonIndices = [
	{
		id: 1,
		name: 'S&P 500',
        shortName: 'S&P',
		columnName: 'sandp',
		logo: sandp.src,
		price: 4402.21,
		change: '-0.94',
		parentClass: 'CRYPTO5',
		selectionColor: "#F23645"
	},
	{
		id: 2,
		name: 'Dow 30',
        shortName: 'Dow 30',
		columnName: 'dow',
		logo: dow.src,
		price: 34440.89,
		change: '-0.22',
		parentClass: 'CRYPTO5',
		selectionColor: "#1666BA"
	},
	{
		id: 3,
		name: 'Nasdaq Composite',
        shortName: 'Nasdaq',
		columnName: 'nasdaq',
		logo: nasdaq.src,
		price: 13469.13,
		change: '-0.44',
		parentClass: 'CRYPTO5',
		selectionColor: "#FFA024"
	},
	{
		id: 4,
		name: 'NYSE Composite',
        shortName: 'NYSE',
		columnName: 'nyse',
		logo: nyse.src,
		price: 15859.61,
		change: '-0.44',
		parentClass: 'CRYPTO5',
		selectionColor: "#089981"
	},
	{
		id: 5,
		name: 'Bitcoin',
        shortName: 'Bitcoin',
		columnName: 'bitcoin',
		logo: btc.src,
		price: 15859.61,
		change: '-0.44',
		parentClass: 'ANFI',
		selectionColor: "#1666BA"
	},
	{
		id: 6,
		name: 'Gold',
        shortName: 'Gold',
		columnName: 'gold',
		logo: gold.src,
		price: 15859.61,
		change: '-0.44',
		parentClass: 'ANFI',
		selectionColor: "#FFA024"
	},
	{
		id: 7,
		name: 'Oil',
        shortName: 'Oil',
		columnName: 'oil',
		logo: oil.src,
		price: 15859.61,
		change: '-0.44',
		parentClass: 'ANFI',
		selectionColor: "#4d614c"
	}
]
