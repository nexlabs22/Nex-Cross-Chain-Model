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
import apple from '@assets/images/apple.png'
import alphabet from '@assets/images/alphabet.png'
import amazon from '@assets/images/amazon.png'
import berkshirehathway from '@assets/images/berkshirehathway.png'
import chevron from '@assets/images/chevron.png'
import exxon_mobile from '@assets/images/exxon_mobile.png'
import jnj from '@assets/images/jnj.png'
import jpmorgan from '@assets/images/jpmorgan.png'
import lvmh from '@assets/images/lvmh.png'
import mastercard from '@assets/images/mastercard.png'
import meta from '@assets/images/meta.png'
import nvidia from '@assets/images/nvidia.png'
import silver from '@assets/images/silver.png'
import spy from '@assets/images/spy.png'
import tencent from '@assets/images/tencent.png'
import tesla from '@assets/images/tesla.png'
import tsmc from '@assets/images/tsmc.png'
import unitedhealth from '@assets/images/unitedhealth.png'
import visa from '@assets/images/visa.png'
import walmart from '@assets/images/walmart.png'

export const comparisonIndices = [
	{
		id: 1,
		name: 'S&P 500',
        shortName: 'GSPC',
		columnName: 'sandp',
		logo: sandp.src,
		price: 4402.21,
		change: '-0.94',
		category: 'indices',
		selectionColor: "#F23645" // Cherry Red
	},
	{
		id: 2,
		name: 'Dow 30',
        shortName: 'DJI',
		columnName: 'dow',
		logo: dow.src,
		price: 34440.89,
		change: '-0.22',
		category: 'indices',
		selectionColor: "#1666BA" //Blue
	},
	{
		id: 3,
		name: 'Nasdaq Composite',
        shortName: 'IXIC',
		columnName: 'nasdaq',
		logo: nasdaq.src,
		price: 13469.13,
		change: '-0.44',
		category: 'indices',
		selectionColor: "#a132ab" // purple
	},
	{
		id: 4,
		name: 'NYSE Composite',
        shortName: 'NYA',
		columnName: 'nyse',
		logo: nyse.src,
		price: 15859.61,
		change: '-0.44',
		category: 'indices',
		selectionColor: "#089981" //Teal
	},
	{
		id: 5,
		name: 'Bitcoin',
        shortName: 'BTC',
		columnName: 'bitcoin',
		logo: btc.src,
		price: 15859.61,
		change: '-0.44',
		category: 'cryptocurrencies',
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
		category: 'commodities',
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
		category: 'commodities',
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
		category: 'commodities',
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
		category: 'stocks',
		selectionColor: "#222D65"
	},
	{
		id: 9,
		name: 'Microsoft',
        shortName: 'MSFT',
		columnName: 'microsoft',
		logo: microsoft.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#7EBB00" //light green
	},
	{
		id: 10,
		name: 'Paypal',
        shortName: 'PYPL',
		columnName: 'paypal',
		logo: paypal.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
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
		category: 'commodities',
		selectionColor: "#349D3F" 
	},
	{
		id: 12,
		name: 'Apple',
        shortName: 'AAPL',
		columnName: 'apple',
		logo: apple.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 13,
		name: 'Alphabet',
        shortName: 'GOOGL',
		columnName: 'alphabet',
		logo: alphabet.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 14,
		name: 'Silver',
        shortName: 'Silver',
		columnName: 'silver',
		logo: silver.src,
		price: 15859.61,
		change: '-0.44',
		category: 'commodities',
		selectionColor: "#349D3F" 
	},
	{
		id: 15,
		name: 'Amazon',
        shortName: 'AMZN',
		columnName: 'amazon',
		logo: amazon.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 16,
		name: 'Tencet',
        shortName: 'TCEHY',
		columnName: 'tencent',
		logo: tencent.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 17,
		name: 'visa',
        shortName: 'V',
		columnName: 'visa',
		logo: visa.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 18,
		name: 'TSMC',
        shortName: 'TSM',
		columnName: 'tsmc',
		logo: tsmc.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 19,
		name: 'Exxon Mobile',
        shortName: 'XOM',
		columnName: 'exxon_mob',
		logo: exxon_mobile.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 20,
		name: 'UnitedHealth Group',
        shortName: 'UNH',
		columnName: 'exxon_mob',
		logo: unitedhealth.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 21,
		name: 'Nvidia',
        shortName: 'NVDA',
		columnName: 'nvidia',
		logo: nvidia.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 22,
		name: 'Johnson & Johnson',
        shortName: 'JNJ',
		columnName: 'johnson_n_johnson',
		logo: jnj.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 23,
		name: 'LVMH',
        shortName: 'LVMHF',
		columnName: 'lvmh',
		logo: lvmh.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 24,
		name: 'Tesla',
        shortName: 'TSLA',
		columnName: 'tesla',
		logo: tesla.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 25,
		name: 'JP Morgan',
        shortName: 'JPM',
		columnName: 'jpmorgan',
		logo: jpmorgan.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 26,
		name: 'Walmart',
        shortName: 'WMT',
		columnName: 'walmart',
		logo: walmart.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 27,
		name: 'Meta',
        shortName: 'META',
		columnName: 'meta',
		logo: meta.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 28,
		name: 'SPDR S&P 500',
        shortName: 'SPY',
		columnName: 'spdr',
		logo: spy.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 29,
		name: 'Mastercard',
        shortName: 'MA',
		columnName: 'mastercard',
		logo: mastercard.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 30,
		name: 'Chevron',
        shortName: 'CVX',
		columnName: 'chevron_corp',
		logo: chevron.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
	{
		id: 31,
		name: 'Berkshire Hathaway Inc',
        shortName: 'BRK-A',
		columnName: 'berkshire_hathaway',
		logo: berkshirehathway.src,
		price: 15859.61,
		change: '-0.44',
		category: 'stocks',
		selectionColor: "#349D3F" 
	},
]
