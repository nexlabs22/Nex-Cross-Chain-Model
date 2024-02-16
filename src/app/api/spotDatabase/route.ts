import QueryCommaSplit, { QueryforIndex } from '@/constants/query'
import connectToSpotDb from '@/utils/connectToSpotDb'
//small change
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest, response: NextResponse) {
	const client = await connectToSpotDb()

	const url = request.url as string
	const { searchParams } = new URL(url)
	const indexName = searchParams.get('indexName') as string
	const tableName = searchParams.get('tableName') as string

	if (!indexName || typeof indexName !== 'string') {
		return NextResponse.json({ message: 'no indexName' }, { status: 400 })
	}

	try {
		let columnName = indexName
		// if (indexName === 'CRYPTO5') {
		// 	// columnName = 'btc,bnb,eth,ripple,sol'
		// 	columnName = 'bitcoin,binancecoin,ethereum,ripple,solana,litecoin, dogecoin,monero,stellar,ethereumclassic,bitcoincash,cardano,eos,bitcoincashsv,chainlink,polkadot,okb'
		// } else if (indexName === 'ANFI') {
			// 	columnName = 'bitcoin,gold'
			// }
		if(indexName === 'OurIndex'){
			columnName = 'bitcoin,gold,binancecoin,ethereum,ripple,solana,litecoin,dogecoin,monero,stellar,ethereumclassic,bitcoincash,cardano,eos,bitcoincashsv,chainlink,polkadot,okb,microsoft,apple,alphabet,amazon,nvidia'
		}	
		let query = ''
		if (indexName === 'OurIndex') {
			query = QueryforIndex(tableName, columnName)
		} else {
			query = QueryCommaSplit(tableName, columnName)
		}
		const res = await client.query(query)

		if (res.rows === undefined || Array.isArray(res.rows) === false || res.rows.length === 0) {
			return NextResponse.json({ message: 'no good fetch', data: res.rows }, { status: 400 })
		}

		if(indexName === 'OurIndex'){
			const top5Cryptos = await client.query(`Select timestamp,top5 from top5crypto WHERE timestamp >= '1401580800000' order by timestamp`).then((res)=> res.rows)
			return NextResponse.json({data:res.rows, top5Cryptos} ,{ status: 200 })
		}

		return NextResponse.json({data:res.rows}, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json(error, { status: 404 })
	} finally {
		await client.end()
	}
}
