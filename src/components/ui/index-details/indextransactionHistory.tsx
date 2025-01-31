'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const IndexTransactionHistory = () => {
    const columns: GridColDef[] = [
        { field: 'time', headerName: 'Time', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'requestSide', headerName: 'Request Side', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'address', headerName: 'Address', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'inputAmount', headerName: 'Input Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'outputAmount', headerName: 'Output Amount', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];


    return (
        <Stack width="100%" gap={2}>
            <GenericTable rows={[]} columns={columns} rowHeight={60} autoSizeOptions={{
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
