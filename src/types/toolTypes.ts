export interface dcaDataType {
    time: number
    value: number
    date?: string
    percentageGain?: number
    tokenAmt?: number
    totalInvested?: number
    totalGain?: number
    total?: number
}

export interface exportdcaDataType {
    time: number
    value: string
    date?: string
    percentageGain?: string
    tokenAmt?: number
    totalInvested?: string
    totalGain?: string
    total?: string
    initialAmount : string, 
    monthlyInvestment : string, 
    selectedStartMonth : string, 
    selectedStartYear : string, 
    selectedEndMonth : string, 
    selectedEndYear : string
}
