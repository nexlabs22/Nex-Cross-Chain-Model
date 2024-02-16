import { symbolToColName } from '@/constants/symbolTocolName';
import { NextResponse, NextRequest } from 'next/server'

interface MarketCapData {
    symbol: string;
    date: string;
    marketCap: number;
}

interface CombinedMarketCapData {
    timestamp: string,
    top5: string
}

async function fetchMarketCapData(symbols: string[]): Promise<MarketCapData[][]> {
    const apiKey = process.env.FMP_KEY;
    const baseUrl = 'https://financialmodelingprep.com/api/v3/historical-market-capitalization/';
    const fetchPromises = symbols.map(symbol =>
        fetch(`${baseUrl}${symbol}?apikey=${apiKey}`)
            .then(response => response.json())
            .then((data: MarketCapData[]) => data)
    );

    return Promise.all(fetchPromises);
}

function combineMarketCapData(data: MarketCapData[][]): { timestamp: string; top5: string }[] {
    const combinedData: { timestamp: string; top5: string }[] = [];

    // Assuming each symbol has the same number of data points
    for (let i = 0; i < data[0].length; i++) {
        const timestamp = data[0][i].date;
        const top5 = data.map((symbolData, index) => `${symbolToColName[symbolData[i].symbol]}:${symbolData[i].marketCap}`).join(',');
        combinedData.push({ timestamp, top5 });
    }

    return combinedData;
}

function filterFirstEntryOfEachMonth(data:CombinedMarketCapData[]) {
    const filteredData:CombinedMarketCapData[] = [];
    const months:{[key:string]:boolean} = {};

    data.reverse().forEach(entry => {
        const month = entry.timestamp.slice(0, 7); // Extracting YYYY-MM part of the timestamp
        if (!(month in months)) {
            filteredData.push({timestamp: new Date(entry.timestamp).getTime().toString(), top5: entry.top5});
            months[month] = true;
        }
    });

    return filteredData;
}

export async function GET() {

    try{
        const symbols = ['AAPL', 'AMZN', 'GOOG', 'NVDA', 'MSFT'];
        const marketCapData = await fetchMarketCapData(symbols);
        const combinedData = combineMarketCapData(marketCapData);
        const filteredData = filterFirstEntryOfEachMonth(combinedData)
        return NextResponse.json(filteredData, { status: 200 })
    }catch(err){
        return NextResponse.json(err, { status: 400 })
    }

}

