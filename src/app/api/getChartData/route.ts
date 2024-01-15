import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';
// import { QueryforIndex } from '@/constants/query';
// import getANFIWeights from '@/utils/anfiWeights';
import axios from 'axios';
import getIndexData from '@/utils/indexCalculation';

export async function GET() {
    try{

        const inputData = await fetch("/api/spotDatabase?indexName=OurIndex&tableName=histcomp").then(res=> res.json()).catch(error => console.log(error))
        if (inputData) {
            const cr5IndexPrices = getIndexData('CRYPTO5', inputData.data, inputData?.top5Cryptos);
            const anfiIndexPrices = getIndexData('ANFI', inputData.data, inputData?.top5Cryptos);
            return NextResponse.json({ data: {cr5IndexPrices,anfiIndexPrices} }, { status: 200 })
        }
        
    }catch(err){
        console.log(err)
        // return NextResponse.json({ err }, { status: 400 })
    }

    
}