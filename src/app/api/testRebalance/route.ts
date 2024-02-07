import { NextResponse, NextRequest } from 'next/server'
export const preferredRegion = ['fra1']

interface Crypto {
    name: string;
    weight: number;
}

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
    'steth': 'STETHUSDT',
    // ** Unavailable cryptos
    // 'xaut': '',
    // 'monero': '',
    // 'steller:',
    // 'okb:',
    // 'bitcoincashsv:'
}

function shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const cryptos: string[] = ['bitcoin', 'ethereum', 'ripple', 'solana','litecoin', 'cardano', 'polkadot', 'chainlink', 'binancecoin', 'dogecoin'];

export async function GET() {
    try {

        let ip = ''
        let err = ''
        await fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => ip = data.ip)
            .catch(error => console.log(error))
        
        function getRandomCryptosWithWeights(cryptos: string[]): Crypto[] {
            const selectedCryptos: Crypto[] = [];
            let totalPercentage: number = 0;
        
            function getRandomDecimal(min: number, max: number): number {
                return parseFloat((Math.random() * (max - min) + min).toFixed(7));
            }
            
            shuffleArray(cryptos);

            // Select 5 random cryptos
            for (let i = 0; i < 5; i++) {
                if (i === 4) {
                    const lastWeight = parseFloat((1 - totalPercentage).toFixed(7));
                    selectedCryptos.push({ name: cryptos[i], weight: lastWeight });
                    totalPercentage += lastWeight;
                } else {
                    const weight = getRandomDecimal(0, 1 - totalPercentage);
                    selectedCryptos.push({ name: cryptos[i], weight });
                    totalPercentage += weight;
                }
            }
        
            const sortedSelectedCryptos = selectedCryptos.sort((a, b) => b.weight - a.weight)
            return sortedSelectedCryptos;
        }

        const data: { [key: string]: number | {} } = { timestamp: (new Date()).getTime() };
        const randomCryptosWithWeights: Crypto[] = getRandomCryptosWithWeights(cryptos);
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
        const symbolDetails_bybit = await fetch("https://api.bybit.com/spot/v3/public/symbols", options).then(response => response.json()).then(res => res.result.list).catch(error => err = error);
        const symbolDetails_binance = await fetch("https://api.binance.us/api/v3/exchangeInfo?symbol=BNBUSDT", options).then(response => response.json()).then(res => res.symbols[0].filters[0].minPrice).catch(error => console.log(error));
        const allocations: { name: string, weight: number, minTradeValue: { bitfinex: number | string, bybit: number | string }, selectedExchange: string }[] = [];
        randomCryptosWithWeights.forEach((pair: Crypto) => {
            const {name:cryptoName, weight} = pair;
            const detail_bitfinex = symbolDetails_bitfinex ? symbolDetails_bitfinex.filter((data: { pair: string }) => { return cryptoNametoSymbol_bitfinex[cryptoName] === data.pair })[0] : 'N/A'
            const detail_bybit = symbolDetails_bybit ? symbolDetails_bybit.filter((data: { name: string }) => { return cryptoNametoSymbol_bybit[cryptoName] === data.name })[0] : 'N/A'
            const minTradeValue = {
                bitfinex: cryptoNametoSymbol_bitfinex[cryptoName] ? (detail_bitfinex && typeof detail_bitfinex !== 'string' && detail_bitfinex.minimum_order_size ? Number(detail_bitfinex.minimum_order_size) : 'N/A') : 'Pair does not exist',
                bybit: cryptoNametoSymbol_bybit[cryptoName] ? (detail_bybit && typeof detail_bybit !== 'string' && detail_bybit.minTradeQty ? Number(detail_bybit.minTradeQty) : 'N/A') : 'Pair does not exist',
                binance: cryptoName === 'binancecoin' ? (symbolDetails_binance && typeof detail_bybit !== 'string' && symbolDetails_binance ? Number(symbolDetails_binance) : 'N/A') : 'Pair does not exist',
            }
            const obj = {
                name: cryptoName,
                weight: weight,
                minTradeValue,
                selectedExchange: typeof minTradeValue.binance === 'number' ? 'binance':typeof minTradeValue.bybit === 'number' ? 'bybit' : typeof minTradeValue.bitfinex === 'number' ? 'bitfinex' : 'none'
            }
            allocations.push(obj)
        });
        data.allocations = allocations

        return NextResponse.json(err ? { err, ip } :  data, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    }


}