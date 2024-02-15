import connectToSpotDb from "@/utils/connectToSpotDb";
import getIndexData from "@/utils/indexCalculation";


export default async function getChartData() {
    // const client = await connectToSpotDb()
    try {

        const inputData = await fetch("/api/spotDatabase?indexName=OurIndex&tableName=histcomp").then(res => res.json()).catch(error => console.log(error))
        if (inputData) {
            const CRYPTO5 = getIndexData('CRYPTO5', inputData.data, inputData?.top5Cryptos);
            const ANFI = getIndexData('ANFI', inputData.data, inputData?.top5Cryptos);
            const anfi = ANFI
            const crypto5 = CRYPTO5
            const mergedArray: { time: number, anfi: number | null, crypto5: number | null }[] = [];

            const timestampMap = new Map();

            anfi?.forEach(({ time, value }) => {
                timestampMap.set(time, { anfi: value, crypto5: null });
            });

            crypto5?.forEach(({ time, value }) => {
                if (timestampMap.has(time)) {
                    timestampMap.get(time).crypto5 = value;
                } else {
                    timestampMap.set(time, { anfi: null, crypto5: value });
                }
            });

            timestampMap.forEach((value, time) => {
                mergedArray.push({ time, ...value });
            });

            console.log("mergedArray", mergedArray.sort((a, b) => a.time - b.time))

            // const insertionQueries = mergedArray.map(async (data) => {
            //     const keys = Object.keys(data);
            //     const values = Object.values(data);
    
            //     const placeholders = Array.from({ length: keys.length }, (_, i) => `$${i + 1}`).join(', ');
    
            //     const query = `INSERT INTO naxlabsindex(${keys.join(', ')})
            //                    VALUES(${placeholders})`;
    
            //     return client.query(query, values);
            // });
    
            // const results = await Promise.all(insertionQueries);
            // const allInsertionsSuccessful = results.every((result) => !!result);
    
            // if (allInsertionsSuccessful) {
            //     console.log('Data Inserted successfully!');
            // } else {
            //     console.log('Error in insertion');
            // }

            return { CRYPTO5, ANFI }
        }

    } catch (err) {
        console.log(err)
    }finally{
        // await client.end();
        
    }
}