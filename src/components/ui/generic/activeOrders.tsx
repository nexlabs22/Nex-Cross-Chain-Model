'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const ActiveOrders = () => {
    const columns: GridColDef[] = [
        { field: 'entryPrice', headerName: 'Entry Price', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'marketPrice', headerName: 'Market Price', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'size', headerName: 'Size', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'pnl', headerName: 'PNL', flex: 1.5, disableColumnMenu: true, resizable: false },

    ];


    return (
        <Stack width="100%" gap={2}>
            <GenericTable rows={[]} columns={columns} rowHeight={60} autoSizeOptions={{
                includeOutliers: true,
                includeHeaders: true,
                outliersFactor: 3,
                expand: true,
                columns: ['entryPrice', 'marketPrice', 'size', 'pnl'],
              }} />
        </Stack>
    )
}

export default ActiveOrders;
