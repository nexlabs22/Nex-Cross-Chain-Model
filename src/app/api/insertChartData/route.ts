import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';
// import { QueryforIndex } from '@/constants/query';
// import getANFIWeights from '@/utils/anfiWeights';
import axios from 'axios';
import getIndexData from '@/utils/indexCalculation';

export async function GET() {
    return NextResponse.json({ message: 'called' }, { status: 200 })
    // const client = await connectToSpotDb()
    // try{

    //     const inputData = await fetch("http://localhost:3000/api/spotDatabase?indexName=OurIndex&tableName=histcomp").then(res=> res.json()).catch(error => console.log(error))
    //     if (inputData) {
    //         const CRYPTO5 = getIndexData('CRYPTO5', inputData.data, inputData?.top5Cryptos);
    //         const ANFI = getIndexData('ANFI', inputData.data, inputData?.top5Cryptos);
    //         const anfi = ANFI
    //         const crypto5 = CRYPTO5
    //         const mergedArray: { time: number, anfi: number | null, crypto5: number | null }[] = [];

    //         const timestampMap = new Map();

    //         anfi?.forEach(({ time, value }) => {
    //             timestampMap.set(time, { anfi: value.toFixed(4), crypto5: null });
    //         });

    //         crypto5?.forEach(({ time, value }) => {
    //             if (timestampMap.has(time)) {
    //                 timestampMap.get(time).crypto5 =  value.toFixed(4);
    //             } else {
    //                 timestampMap.set(time, { anfi: null, crypto5:  value.toFixed(4) });
    //             }
    //         });

    //         timestampMap.forEach((value, time) => {
    //             mergedArray.push({ stampsec:time.toString(), ...value });
    //         });

    //         mergedArray.sort((a, b) => a.time - b.time)
    //         // console.log("mergedArray", mergedArray)

    //         const insertionQueries = mergedArray.map(async (data) => {
    //             const keys = Object.keys(data);
    //             const values = Object.values(data);
    
    //             const placeholders = Array.from({ length: keys.length }, (_, i) => `$${i + 1}`).join(', ');
    
    //             const query = `INSERT INTO nexlabindex(${keys.join(', ')})
    //                            VALUES(${placeholders})`;
    
    //             // return client.query(query, values);

    //             // console.log(keys.join(', '))
    //             // console.log(placeholders)
    //             // console.log(values)
    //             return true
    //         });
    
    //         const results = await Promise.all(insertionQueries);
    //         const allInsertionsSuccessful = results.every((result) => !!result);
    
    //         if (allInsertionsSuccessful) {
    //             console.log('Data Inserted successfully!');
    //         } else {
    //             console.log('Error in insertion');
    //         }

    //         return NextResponse.json({CRYPTO5,ANFI,mergedArray }, { status: 200 })
    //     }
        
    // }catch(err){
    //     console.log(err)
    //     // return NextResponse.json({ err }, { status: 400 })
    // }finally{
    //     await client.end()
    // }

    
}