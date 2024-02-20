import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

interface Allocation {
    name: string;
    weight: number;
}

function roundPercentages(indexComposition: Allocation[]): Allocation[] {
    const roundedPercentages = indexComposition.map(({ name, weight }) => ({ name, weight: Math.round(weight) }));
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
        const cr5Data = await axios.get('https://app.nexlabs.io/api/getCR5Weights').then(res => res.data).catch(err => console.log(err))
        const anfiData = await axios.get('https://app.nexlabs.io/api/getAnfiWeights').then(res => res.data.data).catch(err => console.log(err))

        const cr5Weights: Allocation[] = cr5Data.allocations.map(({ name, weight }: { name: string, weight: number }) => ({ name, weight:weight*100 }));
        const anfiWeights: Allocation[] = anfiData.allocations.map(({ name, weight }: { name: string, weight: number }) => ({ name, weight:weight*100 }));

        const roundedCr5Weights: Allocation[] = roundPercentages(cr5Weights);
        const roundedAnfiWeights: Allocation[] = roundPercentages(anfiWeights);

        const data = { anfi: roundedAnfiWeights, cr5: roundedCr5Weights }
        return NextResponse.json(data, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 400 })
    }
}