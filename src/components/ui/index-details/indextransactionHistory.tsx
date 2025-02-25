'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { useHistory } from "@/providers/HistoryProvider";
import { formatToViewNumber } from "@/utils/conversionFunctions";
import { convertTime, getTokenInfoByAddress } from "@/utils/general";
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const IndexTransactionHistory = () => {

    const { positionHistoryData } = useHistory()


    const columns: GridColDef[] = [
        { field: 'time', headerName: 'Time', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'requestSide', headerName: 'Request Side', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'address', headerName: 'Address', flex: 2, disableColumnMenu: true, resizable: false },
        { field: 'inputAmount', headerName: 'Input Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'outputAmount', headerName: 'Output Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];

    const dataToShow = positionHistoryData.map((data, index)=>{

        const tokenAddressSymbol = getTokenInfoByAddress(data.tokenAddress, 'symbol')

        const inputTokenSymbol = data.tokenAddress ? (data.side.includes('Mint') ? tokenAddressSymbol : data.tokenName) : ''
        const outTokenSymbol = data.tokenAddress ? (data.side.includes('Burn') ? tokenAddressSymbol : data.tokenName) : ''

        return {
            id: index,
            time: convertTime(data.timestamp),
            requestSide: data.side,
            address: data.userAddress,            
            inputAmount: `${formatToViewNumber({value: Number(data.inputAmount),returnType: 'currency'})}  ${inputTokenSymbol}`,
            outputAmount: `${formatToViewNumber({value: Number(data.outputAmount),returnType: 'currency'})} ${outTokenSymbol}`            
        }
    })
    return (
        <Stack width="100%" gap={2}>
            <GenericTable rows={dataToShow} columns={columns} rowHeight={60} autoSizeOptions={{
                includeOutliers: true,
                includeHeaders: true,
                outliersFactor: 3,
                expand: true,
                columns: ['time', 'requestSide', 'pair', 'inputAmount', 'outputAmount', 'status'],
              }} />
        </Stack>
    )
}

export default IndexTransactionHistory;
