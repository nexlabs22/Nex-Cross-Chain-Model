import btc from '@assets/images/btc.png'
import gold from '@assets/images/gold.jpg'
import oil from '@assets/images/oil.jpg'
import sandp from '@assets/images/s&p.jpeg'
import dow from '@assets/images/dow.png'
import nasdaq from '@assets/images/nasdaq.jpg'
import nyse from '@assets/images/nyse.png'
import microsoft from '@assets/images/microsoft.png'
import paypal from '@assets/images/paypal.png'
import asml from '@assets/images/asml.png'
import copper from '@assets/images/copper.png'
import lithium from '@assets/images/lithium.png'

export const comparisonIndices = [
	{
		id: 1,
		name: 'S&P 500',
        shortName: 'S&P',
		columnName: 'sandp',
		logo: sandp.src,
		price: 4402.21,
		change: '-0.94',
		selectionColor: "#F23645" // Cherry Red
	},
	{
		id: 2,
		name: 'Dow 30',
        shortName: 'Dow 30',
		columnName: 'dow',
		logo: dow.src,
		price: 34440.89,
		change: '-0.22',
		selectionColor: "#1666BA" //Blue
	},
	{
		id: 3,
		name: 'Nasdaq Composite',
        shortName: 'Nasdaq',
		columnName: 'nasdaq',
		logo: nasdaq.src,
		price: 13469.13,
		change: '-0.44',
		selectionColor: "#a132ab" // purple
	},
	{
		id: 4,
		name: 'NYSE Composite',
        shortName: 'NYSE',
		columnName: 'nyse',
		logo: nyse.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#089981" //Teal
	},
	{
		id: 5,
		name: 'Bitcoin',
        shortName: 'Bitcoin',
		columnName: 'bitcoin',
		logo: btc.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#16b5ba" //Cyan
	},
	{
		id: 6,
		name: 'Gold',
        shortName: 'Gold',
		columnName: 'gold',
		logo: gold.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#FFA024" // Yellow golden
	},
	{
		id: 7,
		name: 'Oil',
        shortName: 'Oil',
		columnName: 'oil',
		logo: oil.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#4d614c" //Dark green
	},
	{
		id: 8,
		name: 'Copper',
        shortName: 'Copper',
		columnName: 'copper',
		logo: copper.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#B36F30" //copper brown
	},
	{
		id: 8,
		name: 'ASML',
        shortName: 'ASML',
		columnName: 'asml',
		logo: asml.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#222D65"
	},
	{
		id: 9,
		name: 'Microsoft',
        shortName: 'Microsoft',
		columnName: 'microsoft',
		logo: microsoft.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#7EBB00" //light green
	},
	{
		id: 10,
		name: 'Paypal',
        shortName: 'Paypal',
		columnName: 'paypal',
		logo: paypal.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#20A6DA" 
	},
	{
		id: 11,
		name: 'Lithium',
        shortName: 'Lithium',
		columnName: 'lithium',
		logo: lithium.src,
		price: 15859.61,
		change: '-0.44',
		selectionColor: "#349D3F" 
	}
]
