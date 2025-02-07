// app/api/coinmarketcap/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

const COINMARKETCAP_MAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
const COINMARKETCAP_INFO_API_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';
const API_KEY = process.env.COINMARKETCAP_KEY;

export async function GET() {
  try {
    // First, fetch the mapping data which contains the coin IDs
    const mapResponse = await axios.get(COINMARKETCAP_MAP_API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY!,
      },
    });

    // Extract the coin mapping array from the response
    const coinMap = mapResponse.data.data;
    
    // Optionally, limit the number of coins.
    // For example, using the first 100 coins:
    const limitedCoinMap = coinMap.slice(0, 500);
    
    // Extract the IDs and create a comma-separated string.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = limitedCoinMap.map((coin: any) => coin.id).join(',');
    console.log(ids)
    // Now, use these IDs to call the info endpoint.
    const infoResponse = await axios.get(COINMARKETCAP_INFO_API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY!,
      },
      params: {
        id: ids, // Axios automatically URL-encodes this string.
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
