'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const Leaderboard = () => {
    const columns: GridColDef[] = [
        { field: 'address', headerName: 'Address', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'quantity', headerName: 'Quantity', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'percentage', headerName: 'Percentage', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: '7dchange', headerName: '7d Change', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: '30dchange', headerName: '30d Change', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'lasttxn', headerName: 'Last Txn', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];


    return (
        <Stack width="100%" gap={2}>
            <GenericTable rows={[]} columns={columns} rowHeight={60} autoSizeOptions={{
                includeOutliers: true,
                includeHeaders: true,
                outliersFactor: 3,
                expand: true,
                columns: ['address', 'quantity', 'percentage', '7dchange', '30dchange', 'lasttxn'],
              }} />
        </Stack>
    )
}

export default Leaderboard;
