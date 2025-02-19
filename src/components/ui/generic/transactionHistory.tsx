'use client'

import GenericTable from "@/components/ui/generic/genericTable";
import { useHistory } from "@/providers/HistoryProvider";
import { formatToViewNumber } from "@/utils/conversionFunctions";
import { convertTime, getTokenInfoByAddress } from "@/utils/general";
import { Stack, Tooltip } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';


const TransactionHistory = () => {
    const { positionHistoryData } = useHistory();

    const columns: GridColDef[] = [
        { field: 'time', headerName: 'Time', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'requestSide', headerName: 'Request Side', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'pair', headerName: 'Pair', flex: 1.5, disableColumnMenu: true, resizable: false },
        {
            field: 'inputAmount',
            headerName: 'Input Amount',
            flex: 1.5,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (params) => (
                <Tooltip title={params.value.rawValue} arrow>
                    <span>{params.value.displayValue}</span>
                </Tooltip>
            ),
        },
        {
            field: 'outputAmount',
            headerName: 'Output Amount',
            flex: 1.5,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (params) => (
                <Tooltip title={params.value.rawValue} arrow>
                    <span>{params.value.displayValue}</span>
                </Tooltip>
            ),
        },
        // { field: 'status', headerName: 'Status', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];

    const dataToShow = positionHistoryData.map((data, index) => {
        const tokenAddressSymbol = getTokenInfoByAddress(data.tokenAddress, 'symbol');

        const inputTokenSymbol = data.tokenAddress ? (data.side.includes('Mint') ? tokenAddressSymbol : data.tokenName) : '';
        const outTokenSymbol = data.tokenAddress ? (data.side.includes('Burn') ? tokenAddressSymbol : data.tokenName) : '';

        const inputAmountValue = Number(data.inputAmount);
        const outputAmountValue = Number(data.outputAmount);

        return {
            id: index,
            time: convertTime(data.timestamp),
            requestSide: data.side,
            pair: data.tokenName,
            inputAmount: {
                rawValue: `${inputAmountValue} ${inputTokenSymbol}`,
                displayValue: inputAmountValue > 0 && inputAmountValue < 0.01
                    ? `<0.01 ${inputTokenSymbol}`
                    : `${formatToViewNumber({ value: inputAmountValue, returnType: 'currency' })} ${inputTokenSymbol}`,
            },
            outputAmount: {
                rawValue: `${outputAmountValue} ${outTokenSymbol}`,
                displayValue: outputAmountValue > 0 && outputAmountValue < 0.01
                    ? `<0.01 ${outTokenSymbol}`
                    : `${formatToViewNumber({ value: outputAmountValue, returnType: 'currency' })} ${outTokenSymbol}`,
            },
            // status: data.sendStatus,
        };
    });

    return (
        <Stack width="100%" gap={2}>

            <GenericTable
                rows={dataToShow}
                columns={columns}
                rowHeight={60}
                autoSizeOptions={{
                    includeOutliers: true,
                    includeHeaders: true,
                    outliersFactor: 3,
                    expand: true,
                    columns: ['time', 'requestSide', 'pair', 'inputAmount', 'outputAmount', 'status'],
                }}
            />
        </Stack>
    );
};

export default TransactionHistory;
