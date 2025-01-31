import connectToSpotDb from "@/utils/connectToSpotDB";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const client = await connectToSpotDb();

  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const ticker = params.ticker || 'ethereum'

    const queryToGetPrice = `SELECT ${ticker} as price, date from ${params.tableName || 'histcomp'} order by stampsec desc limit 1`;
    const indexDataHistcomp = await client
      .query(queryToGetPrice)
      .then((res) => res.rows[0]);

    return NextResponse.json(indexDataHistcomp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  } finally {
    await client.end();
  }
}
