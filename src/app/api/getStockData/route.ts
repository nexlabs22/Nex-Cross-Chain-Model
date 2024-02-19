import { NextResponse, NextRequest } from 'next/server'

type dataType = {
    name: string | null;
    marketCap: number;
}

export async function GET() {
    try {

        let data = await fetch(`https://financialmodelingprep.com/api/v3/symbol/NASDAQ?apikey=${process.env.FMP_KEY}`).then(res => res.json()).catch(err => console.log(err))
        data.sort((a: dataType, b: dataType) => b.marketCap - a.marketCap)
        const wordsToRemove: string[] = ['vanguard', 'index'];

        // Filter out objects with words to remove in their name and remove duplicates
        const uniqueArray: dataType[] = [];
        const encounteredNames: Set<string> = new Set();
        data.forEach((obj: dataType) => {
            if (obj.name === null || obj.name === undefined) {
                uniqueArray.push(obj);
            } else {
                const lowerCaseName = obj.name.toLowerCase();
                if (!wordsToRemove.some(word => lowerCaseName.includes(word.toLowerCase()))) {
                    if (!encounteredNames.has(lowerCaseName)) {
                        uniqueArray.push(obj);
                        encounteredNames.add(lowerCaseName);
                    }
                }
            }
        });

        const top5stocks = uniqueArray.slice(0, 5)
        return NextResponse.json(top5stocks, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    }


}