export type DcaData = {
  time: number
  value: number
  date?: string
  percentageGain?: number
  tokenAmt?: number
  totalInvested?: number
  totalGain?: number
  total?: number
}

export type DCASettings = {
  initialAmount: string
  monthlyInvestment: string
  selectedStartMonth: string
  selectedStartYear: string
  selectedEndMonth: string
  selectedEndYear: string
}

export type DCAState = {
  data: DcaData[]
  settings: DCASettings
}
