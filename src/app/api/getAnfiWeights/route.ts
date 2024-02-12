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

        const cryptoSymbol: { [key: string]: string } = {
            'bitcoin': 'BTC',
            'gold': 'XAUT',
        }
        
        const dataToReturn: { [key: string]: number | {} } = { timestamp: Number(anfiWeights[0]) };

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
        const symbolDetails_bitfinex = await fetch("https://api.bitfinex.com/v1/symbols_details", options).then(response => response.json()).catch(error => console.log(error));
        const symbolDetails_bybit = await fetch("https://api.bybit.com/spot/v3/public/symbols", options).then(response => response.json()).then(res=> res.result.list).catch(error => console.error(error));
        // const symbolDetails_bybit: { name: string, minTradeQty: string }[] = await axios.get("https://api.bybit.com/spot/v3/public/symbols").then(res => res.data.result.list).catch((err) => { console.log(err) })

        
        const allocations: { name: string,symbol:string, weight: number|string, minTradeValue:{bitfinex: number | string, bybit: number | string}, selectedExchange: string }[] = [];
        underlyingAssetsArray.forEach((cryptoName: string) => {
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
                symbol: cryptoSymbol[cryptoName],
                weight: cryptoName === 'bitcoin'? anfiWeights[1][0].weightBtc: cryptoName === 'gold'? anfiWeights[1][0].weightGold: 'N/A',
                minTradeValue,
                selectedExchange: typeof minTradeValue.bitfinex === 'number' ? 'bitfinex' : typeof minTradeValue.bybit === 'number' ? 'bybit': 'none'
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
