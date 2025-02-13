'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { useHistory } from "@/providers/HistoryProvider";
import { formatToViewNumber } from "@/utils/conversionFunctions";
import { convertTime, getTokenSymbolByAddress } from "@/utils/general";
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const TransactionHistory = () => {

    const { positionHistoryData } = useHistory()


    const columns: GridColDef[] = [
        { field: 'time', headerName: 'Time', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'requestSide', headerName: 'Request Side', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'pair', headerName: 'Pair', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'inputAmount', headerName: 'Input Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'outputAmount', headerName: 'Output Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'status', headerName: 'Status', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];

    const dataToShow = positionHistoryData.map((data, index)=>{

        const tokenAddressSymbol = getTokenSymbolByAddress(data.tokenAddress)

        const inputTokenSymbol = data.tokenAddress ? (data.side.includes('Mint') ? tokenAddressSymbol : data.indexName) : ''
        const outTokenSymbol = data.tokenAddress ? (data.side.includes('Burn') ? tokenAddressSymbol : data.indexName) : ''

        return {
            id: index,
            time: convertTime(data.timestamp),
            requestSide: data.side,
            pair: data.indexName,
            inputAmount: `${formatToViewNumber({value: data.inputAmount,returnType: 'currency'})}  ${inputTokenSymbol}`,
            outputAmount: `${formatToViewNumber({value: data.outputAmount,returnType: 'currency'})} ${outTokenSymbol}`,
            status: data.sendStatus
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

export default TransactionHistory;
