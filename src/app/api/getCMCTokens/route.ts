import { NextResponse } from 'next/server';
import axios from 'axios';

const COINMARKETCAP_MAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
const COINMARKETCAP_INFO_API_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';
const API_KEY = process.env.COINMARKETCAP_KEY;

export async function GET() {
  try {
    const mapResponse = await axios.get(COINMARKETCAP_MAP_API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY!,
      },
    });

    const coinMap = mapResponse.data.data;
    
    const limitedCoinMap = coinMap.slice(0, 500);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = limitedCoinMap.map((coin: any) => coin.id).join(',');
    console.log(ids)
    const infoResponse = await axios.get(COINMARKETCAP_INFO_API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY!,
      },
      params: {
        id: ids,
      },
    });

    const tokensMap = infoResponse.data.data;
    return NextResponse.json(tokensMap);
  } catch (error) {
    console.error('Error fetching tokens from CoinMarketCap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
