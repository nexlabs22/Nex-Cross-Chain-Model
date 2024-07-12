import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

interface Allocation {
    name: string;
    symbol:string;
    weight: number;
}

function roundPercentages(indexComposition: Allocation[]): Allocation[] {
    const roundedPercentages = indexComposition.map(({ name,symbol, weight }) => ({ name,symbol, weight: Math.round(weight) }));
    const roundedTotal = roundedPercentages.reduce((acc, { weight }) => acc + weight, 0);
    const lastAllocationIndex = roundedPercentages.length - 1;
    const lastAllocation = roundedPercentages[lastAllocationIndex];

    if (lastAllocation && roundedTotal !== 100) {
        lastAllocation.weight += 100 - roundedTotal;
    }

    return roundedPercentages;
}



export async function GET() {
    try {
        const cr5Data = await axios.get('https://vercel-cron-xi.vercel.app/api/getCR5Weights').then(res => res.data.data).catch(err => console.log(err))
        const anfiData = await axios.get('https://app.nexlabs.io/api/getAnfiWeights').then(res => res.data.data).catch(err => console.log(err))
        const mag7Data = await axios.get('https://vercel-cron-xi.vercel.app/api/getMag7Weights').then(res => res.data.data).catch(err => console.log(err))
        const arbeiData = await axios.get('https://vercel-cron-xi.vercel.app/api/getArbInWeights').then(res => res.data.data).catch(err => console.log(err))
        
        const cr5Weights: Allocation[] = cr5Data.allocations.map(({ name, weight }: { name: string, weight: number }) => ({ name, weight:weight*100 }));
        const anfiWeights: Allocation[] = anfiData.allocations.map(({ name, weight }: { name: string, weight: number }) => ({ name, weight:weight*100 }));
        const mag7Weights: Allocation[] = mag7Data.allocations.map(({ symbol, weight }: { symbol: string, weight: number }) => ({ symbol, weight:weight*100 }));
        const arbeiWeights: Allocation[] = arbeiData.allocations.map(({ symbol, weight }: { symbol: string, weight: number }) => ({ symbol, weight:Number(weight.toFixed(2)) }));
        
        const roundedCr5Weights: Allocation[] = roundPercentages(cr5Weights);
        const roundedAnfiWeights: Allocation[] = roundPercentages(anfiWeights);
        const roundedMag7Weights: Allocation[] = roundPercentages(mag7Weights);
        const roundeArbeiWeights: Allocation[] = arbeiWeights;

        const data = { anfi: roundedAnfiWeights, cr5: roundedCr5Weights, mag7: roundedMag7Weights, arbei: roundeArbeiWeights }
        return NextResponse.json(data, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 400 })
    }
}