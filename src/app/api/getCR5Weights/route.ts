import connectToSpotDb from '@/utils/connectToSpotDb'
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

const cryptoNametoSymbol_bitfinex: { [key: string]: string } = {
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
    // ** Unavailable cryptos
    // 'binancecoin:', 
    // 'steth:'
    // 'steller:'
    // 'okb:',
    // 'bitcoincashsv:'
}
const cryptoNametoSymbol_bybit: { [key: string]: string } = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'solana': 'SOLUSDT',
    'litecoin': 'LTCUSDT',
    'binancecoin': 'BNBUSDT',
    'polkadot': 'DOTUSDT',
    'cardano': 'ADAUSDT',
    'eos': 'EOSUSDT',
    'chainlink': 'LINKUSDT',
    'dogecoin': 'DOGEUSDT',
    'bitcoincash': 'BCHUSDT',
    'ethereumclassic': 'ETCUSDT',
    'ripple': 'XRPUSDT',
    'steth':'STETHUSDT',
    // ** Unavailable cryptos
    // 'xaut': '',
    // 'monero': '',
    // 'steller:',
    // 'okb:',
    // 'bitcoincashsv:'
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

        let ip=''
        let err = ''
        await fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => ip = data.ip)
        .catch(error => console.log(error))

        // const symbolDetails_bitfinex: { pair: string, minimum_order_size: number }[] = await axios.get("https://api.bitfinex.com/v1/symbols_details").then(res => res.data).catch((err) => { console.log(err) })
        // const symbolDetails_bybit: { name: string, minTradeQty: string }[] = await axios.get("https://api.bybit.com/spot/v3/public/symbols").then(res => res.data.result.list).catch((err) => { console.log(err) }) 
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
        const symbolDetails_bitfinex = await fetch("https://api.bitfinex.com/v1/symbols_details", options).then(response => response.json()).catch(error => console.error(error));
        const symbolDetails_bybit = await fetch("https://api.bybit.com/spot/v3/public/symbols", options).then(response => response.json()).then(res=> res.result.list).catch(error => err=error);
        const allocations: { name: string, weight: number, minTradeValue:{bitfinex: number | string, bybit: number | string}, selectedExchange: string }[] = [];
        cryptoArray.forEach((pair: string) => {
            const [cryptoName, marketCap] = pair.split(':');
            const detail_bitfinex = symbolDetails_bitfinex ? symbolDetails_bitfinex.filter((data: { pair: string }) => { return cryptoNametoSymbol_bitfinex[cryptoName] === data.pair })[0]: 'N/A'
            const detail_bybit = symbolDetails_bybit ? symbolDetails_bybit.filter((data: { name: string }) => { return cryptoNametoSymbol_bybit[cryptoName] === data.name })[0]: 'N/A'
            const minTradeValue = {
                bitfinex: cryptoNametoSymbol_bitfinex[cryptoName] ? (detail_bitfinex && typeof detail_bitfinex !== 'string'  && detail_bitfinex.minimum_order_size ? Number(detail_bitfinex.minimum_order_size) : 'N/A') : 'Pair does not exist',
                bybit: cryptoNametoSymbol_bybit[cryptoName] ? (detail_bybit  && typeof detail_bybit !== 'string' && detail_bybit.minTradeQty ? Number(detail_bybit.minTradeQty) : 'N/A') : 'Pair does not exist'
            }
            // const minTradeValueBitfinex = cryptoNametoSymbol_bitfinex[cryptoName] ? (detail_bitfinex && typeof detail_bitfinex !== 'string'  && detail_bitfinex.minimum_order_size ? Number(detail_bitfinex.minimum_order_size) : 'N/A') : 'Pair does not exist'
            // const minTradeValueBybit = cryptoNametoSymbol_bybit[cryptoName] ? (detail_bybit  && typeof detail_bybit !== 'string' && detail_bybit.minTradeQty ? Number(detail_bybit.minTradeQty) : 'N/A') : 'Pair does not exist'
            const obj = {
                name: cryptoName,
                weight: Number(marketCap) / sumOfMarketCap,
                minTradeValue,
                selectedExchange: typeof minTradeValue.bitfinex === 'number' ? 'bitfinex' : typeof minTradeValue.bybit === 'number' ? 'bybit': 'none'
            }
            allocations.push(obj)
        });
        dataToReturn.allocations = allocations

        return NextResponse.json({ data: dataToReturn, ip, err}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    } finally {
        await client.end();
    }
}