import connectToSpotDb from '@/utils/connectToSpotDb'
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

const cryptoNametoSymbol: { [key: string]: string } = {
    'bitcoin': 'btcusd',
    'ethereum': 'ethusd',
    'solana': 'solusd',
    'litecoin': 'ltcusd',
    'monero': 'xmrusd',
    'polkadot': 'dotusd',
    'cardano': 'adausd',
    'eos': 'eosusd',
    'chainlink': 'link:usd',
    'dogecoin': 'doge:usd',
    'bitcoincash': 'bchn:usd',
    'ethereumclassic': 'etcust',
    'xaut': 'xaut:usd',
    'ripple': 'xrpusd'
    // 'binancecoin': 'bnb:usd', *********
    // 'steth:'
    // 'steller':
    // 'okb',
    // 'bitcoincashsv'
}

export async function GET() {
    const client = await connectToSpotDb();
    try {
        const query = `SELECT * from top5crypto order by timestamp desc limit 1`
        const result = await client.query(query).then((res => res.rows[0]))

        const cryptoString = result.top5;
        const cryptoArray = cryptoString.split(',');

        const dataToReturn: { [key: string]: number | {} } = { timestamp: Number(result.timestamp) };

        let sumOfMarketCap = 0
        cryptoArray.forEach((pair: string) => {
            sumOfMarketCap += Number(pair.split(':')[1]);
        });

        const symbolDetails:{pair:string,minimum_order_size:number}[] = await axios.get("https://api.bitfinex.com/v1/symbols_details").then(res => res.data).catch((err) => { console.log(err) })

        cryptoArray.forEach((pair: string) => {
            const [cryptoName, marketCap] = pair.split(':');
            const detail = symbolDetails.filter((data: { pair: string }) => { return cryptoNametoSymbol[cryptoName] === data.pair })[0]
            dataToReturn[cryptoName] = {
                weight: Number(marketCap) / sumOfMarketCap,
                minTradeValueBitfinex: cryptoNametoSymbol[cryptoName] ? (detail && detail.minimum_order_size ? Number(detail.minimum_order_size) : 'N/A'): 'Pair does not exist'
            };
        });

        return NextResponse.json({ data: dataToReturn }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    } finally {
        await client.end();
    }
}