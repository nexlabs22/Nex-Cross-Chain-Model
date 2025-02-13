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
    <Stack width="100%" sx={{ overflowX: 'auto' }}>
      <div style={{ width: 'fit-content', minWidth: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          autosizeOptions={autoSizeOptions}
          rowSelection={false}
          resizeThrottleMs={100}
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
              px: 2,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            },
            '& .MuiDataGrid-footerContainer': {
              display: 'none',
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '@media (max-width: 600px)': {
              '.MuiDataGrid-root': {
                // minWidth: '600px',
              }
            }
          }}
        />
      </div>
    </Stack>
  );
};

export default GenericTable;
