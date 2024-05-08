import connectToSpotDb from "@/utils/connectToSpotDb";
import getIndexData from "@/utils/indexCalculation";


export default async function getChartData() {
    const client = await connectToSpotDb()
    try {
        const queryNexlabs = 'SELECT * FROM nexlabindex order by stampsec desc'
        const indexDataNexlabs = await client.query(queryNexlabs)
        const inputArray = indexDataNexlabs.rows

            const CRYPTO5: { time: number, value: number }[] = [];
            const ANFI: { time: number, value: number }[] = [];

            inputArray.forEach(item => {
                const time = parseInt(item.stampsec, 10);

                CRYPTO5.push({
                    time: time,
                    value: parseFloat(item.crypto5),
                });

                if (item.anfi !== null) {
                    ANFI.push({
                        time: time,
                        value: parseFloat(item.anfi),
                    });
                }
            });

            return { CRYPTO5, ANFI }

    } catch (err) {
        console.log(err)
    }finally{
        await client.end();
        
    }
}