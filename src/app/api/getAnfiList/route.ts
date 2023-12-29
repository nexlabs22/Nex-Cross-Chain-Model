//small change
import { NextResponse, NextRequest } from 'next/server'
import TestNFT from '../../../components/TestNFT';
import { NextApiResponse } from 'next';
import axios from 'axios';
import connectToSpotDb from '@/utils/connectToSpotDb';
import { QueryforIndex } from '@/constants/query';
import getIndexData from '@/utils/indexCalculation';
import getOracleIndexData from '@/utils/oracleIndexCalculation';

interface AnfiWeightObjType {
    date: string;
    weightBtc: number;
    weightGold: number;
    priceBtc: number;
    priceGold: number;
}
type AnfiWeightArrType = [number, AnfiWeightObjType[]]


export async function GET(request: NextRequest, response: NextResponse) {
	try {
        const assetList = [
            "0x99AB2160dDAe7003b46e09118aC5C379A4823E98", //goerli xaut token address
            "0xfeC3D2CEA6f85Cdf236c7205Fb8EdD4eBF29789D", //goerli wbtc token address
        ]

        const swapVersions = [
            3, //goerli xaut swap version
            3, //goerli wbtc swap version
        ]
        const client = await connectToSpotDb()
        const tableName ='histcomp'
        const indexName ='OurIndex'
        const columnName ='bitcoin,gold,binancecoin,ethereum,ripple,solana,litecoin, dogecoin,monero,stellar,ethereumclassic,bitcoincash,cardano,eos,bitcoincashsv,chainlink,polkadot,okb'
        
        let query = ''
        query = QueryforIndex(tableName, columnName)
        const res = await client.query(query)
        
        const top5Cryptos = await client.query(`Select timestamp,top5 from top5crypto WHERE timestamp >= '1401580800000' order by timestamp`).then((res)=> res.rows)
        const data = res.rows
        const anfiIndexPrices = getOracleIndexData('ANFI', data, top5Cryptos);


        if(anfiIndexPrices && anfiIndexPrices?.length > 0){
            const arr : AnfiWeightArrType = anfiIndexPrices[anfiIndexPrices.length - 1] as AnfiWeightArrType
            const weightGold = arr[1][0].weightGold
            const weightBtc = arr[1][0].weightBtc
            const percentages = [
                weightGold*100e18,
                weightBtc*100e18
            ]
        return NextResponse.json({assetList, percentages, swapVersions})
        }else {
            return NextResponse.json({data: anfiIndexPrices})
        }
		
	} catch (error) {
		console.log(error)
        return NextResponse.json(error)
	}
}
