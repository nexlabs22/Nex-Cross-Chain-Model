'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { Stack } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';

const IndexTopHolders = () => {
    const columns: GridColDef[] = [
        { field: 'address', headerName: 'Address', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'balance', headerName: 'Balance', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'percentage', headerName: 'Percentage', flex: 1.5, disableColumnMenu: true, resizable: false },
        { field: 'lastTxn', headerName: 'Last Txn', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];


    return (
        <Stack width="100%" gap={2}>
            <GenericTable rows={[]} columns={columns} rowHeight={60} autoSizeOptions={{
                includeOutliers: true,
                includeHeaders: true,
                outliersFactor: 3,
                expand: true,
                columns: ['address', 'balance', 'percentage', 'lastTxn'],
              }} />
        </Stack>
    )
}

export default IndexTopHolders;
