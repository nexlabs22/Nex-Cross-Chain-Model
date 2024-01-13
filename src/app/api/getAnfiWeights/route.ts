import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';
import { QueryforIndex } from '@/constants/query';
import getANFIWeights from '@/utils/anfiWeights';
import axios from 'axios';

export async function GET(request: NextRequest, response: NextResponse) {
    const client = await connectToSpotDb()
    try {

        const tableName = 'histcomp'
        const columnName = 'bitcoin,gold,binancecoin,ethereum,ripple,solana,litecoin, dogecoin,monero,stellar,ethereumclassic,bitcoincash,cardano,eos,bitcoincashsv,chainlink,polkadot,okb'

        let query = ''
        query = QueryforIndex(tableName, columnName)
        const res = await client.query(query)
        const data = res.rows
        const anfiWeights = getANFIWeights(data);

        const underlyingAssetsArray = ['bitcoin', 'gold']

        const cryptoNametoSymbol_bitfinex: { [key: string]: string } = {
            'bitcoin': 'btcusd',
            'gold': 'xaut:usd'
        }
        const cryptoNametoSymbol_bybit: { [key: string]: string } = {
            'bitcoin': 'BTCUSDT',
            // ** Unavailable cryptos
            // 'gold': '',
        }
        
        const dataToReturn: { [key: string]: number | {} } = { timestamp: Number(anfiWeights[0]) };

        const symbolDetails_bitfinex: { pair: string, minimum_order_size: number }[] = await axios.get("https://api.bitfinex.com/v1/symbols_details").then(res => res.data).catch((err) => { console.log(err) })
        const symbolDetails_bybit: { name: string, minTradeQty: string }[] = await axios.get("https://api.bybit.com/spot/v3/public/symbols").then(res => res.data.result.list).catch((err) => { console.log(err) })

        
        const allocations: { name: string, weight: number|string, minTradeValueBitfinex: number | string, minTradeValueBybit: number | string, selectedExchange: string }[] = [];
        underlyingAssetsArray.forEach((cryptoName: string) => {
            const detail_bitfinex = symbolDetails_bitfinex.filter((data: { pair: string }) => { return cryptoNametoSymbol_bitfinex[cryptoName] === data.pair })[0]
            const detail_bybit = symbolDetails_bybit.filter((data: { name: string }) => { return cryptoNametoSymbol_bybit[cryptoName] === data.name })[0]
            const minTradeValueBitfinex = cryptoNametoSymbol_bitfinex[cryptoName] ? (detail_bitfinex && detail_bitfinex.minimum_order_size ? Number(detail_bitfinex.minimum_order_size) : 'N/A') : 'Pair does not exist'
            const minTradeValueBybit = cryptoNametoSymbol_bybit[cryptoName] ? (detail_bybit && detail_bybit.minTradeQty ? Number(detail_bybit.minTradeQty) : 'N/A') : 'Pair does not exist'
            const obj = {
                name: cryptoName,
                weight: cryptoName === 'bitcoin'? anfiWeights[1][0].weightBtc: cryptoName === 'gold'? anfiWeights[1][0].weightGold: 'N/A',
                minTradeValueBitfinex,
                minTradeValueBybit,
                selectedExchange: typeof minTradeValueBitfinex === 'number' ? 'bitfinex' : typeof minTradeValueBybit === 'number' ? 'bybit': 'none'
            }
            allocations.push(obj)
        });
        dataToReturn.allocations = allocations

        return NextResponse.json({ data: dataToReturn }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    } finally {
        await client.end();
    }
}
