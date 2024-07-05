import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';

export async function GET() {
    const client = await connectToSpotDb()

    try {
        const queryNexlabs = 'SELECT * FROM nexlabindex order by stampsec'
        const indexDataNexlabs = await client.query(queryNexlabs)
        const inputArray = indexDataNexlabs.rows


            const CRYPTO5: { time: number, value: number }[] = [];
            const ANFI: { time: number, value: number }[] = [];
            const MAG7: { time: number, value: number }[] = [];
            const ARBEI: { time: number, value: number }[] = [];

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

                if (item.mag7 !== null) {
                    MAG7.push({
                        time: time,
                        value: parseFloat(item.mag7),
                    });
                }
                if (item.arb10 !== null) {
                    ARBEI.push({
                        time: time,
                        value: parseFloat(item.arb10),
                    });
                }
            });

            const data = { CRYPTO5, ANFI, MAG7, ARBEI };

            return NextResponse.json(data, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    } finally {
        await client.end()
    }


}