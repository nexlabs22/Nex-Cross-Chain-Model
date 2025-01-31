'use client'

import { DataGrid, GridAutosizeOptions, GridColDef } from '@mui/x-data-grid';
import theme from '@/theme/theme';
import { Stack } from '@mui/material';

interface GenericTableProps {
  rows: Array<object>;
  columns: Array<GridColDef<object>>;
  rowHeight?: number;
  autoSizeOptions?: GridAutosizeOptions;
}

const GenericTable = ({ rows, columns, rowHeight, autoSizeOptions }: GenericTableProps) => {
  return (
    <Stack width={'100%'} sx={{ overflowX: 'auto', maxWidth: '100%' }}>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          autosizeOptions={autoSizeOptions}
          rowSelection={false}
          isRowSelectable={() => false}
          disableRowSelectionOnClick
          sx={{
            width: '100%',
            borderRadius: 2,
            border: `1px solid ${theme.palette.elevations.elevation700.main}`,
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.elevations.elevation900.main,
              paddingLeft: 2,
            },
            '& .MuiDataGrid-row': {
              backgroundColor: 'transparent',
              boxSizing: 'border-box',
              display: 'flex',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.elevations.elevation900.main,
            },
            '& .MuiDataGrid-cell': {
              paddingX: 2, // Horizontal padding
              boxSizing: 'border-box', // Ensure padding doesn't overflow
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap', // Prevent text from wrapping
              overflow: 'hidden', // Ensure the text doesn't overflow outside the cell
              textOverflow: 'ellipsis', // Add ellipsis for truncated text
              maxWidth: '100%', // Ensure cell expands with content
            },
            '& .MuiDataGrid-footerContainer': {
              display: 'none',
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '@media (max-width: 600px)': {
              '.MuiDataGrid-root': {
                minWidth: '100%', // Ensure the grid fits smaller screens
              }
            }
          }}
        />
      </div>
    </Stack>
  );
};

export default GenericTable;
