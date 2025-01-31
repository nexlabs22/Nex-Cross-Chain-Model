'use client'

import GenericTable from "@/components/ui/generic/genericTable"
import { Box, Stack, Typography, IconButton, Button, Link, useMediaQuery, useTheme } from "@mui/material";
import { GridColDef } from '@mui/x-data-grid';
import { reduceAddress } from "@/utils/general";
import { useDashboard } from "@/providers/DashboardProvider";
import { formatToViewNumber } from "@/utils/conversionFunctions";
import { Address } from "@/types/indexTypes";
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup";
import { LuCopy } from "react-icons/lu";
import copy from 'copy-to-clipboard';

const CatalogueTable = () => {
    const { nexTokens } = useDashboard()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const mobileColumns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'Index',
            disableColumnMenu: true,
            resizable: false,
            flex: 2,
            renderCell: (params) => (
                <Stack direction={'row'} alignItems={'center'} gap={1}>
                    <Box width={40} height={40} borderRadius={1} sx={{
                        backgroundImage: `url(${params.row.logo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                    </Box>
                    <Stack direction={'column'}>
                        <Typography variant={'h6'}>{params.row.symbol}</Typography>
                    </Stack>
                </Stack>
            ),
        },
        { field: 'price', headerName: 'Price', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'change24h', headerName: '24h Change', flex: 1.5, disableColumnMenu: true, resizable: false },
    ];

    const desktopColumns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'Index',
            disableColumnMenu: true,
            resizable: false,
            flex: 2,
            renderCell: (params) => (
                <Stack direction={'row'} alignItems={'center'} gap={1} py={2}>
                    <Box width={40} height={40} borderRadius={1} sx={{
                        backgroundImage: `url(${params.row.logo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                    </Box>
                    <Stack direction={'column'} alignItems={'start'} justifyContent={'start'}>
                        <Typography variant={'h6'} display={{ xs: 'none', lg: 'block' }}>{params.row.name}</Typography>
                        <Typography variant={'h6'} display={{ xs: 'block', lg: 'none' }}>{params.row.symbol}</Typography>
                            <CompositionAvatarGroup index={params.row} size={20} borderColor={theme.palette.background.default} />
                    </Stack>
                </Stack>
            ),
        },
        { field: 'price', headerName: 'Price', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'totalSupply', headerName: 'Total Supply', flex: 1, disableColumnMenu: true, resizable: false },
        { field: 'change24h', headerName: '24h Change', flex: 1.5, disableColumnMenu: true, resizable: false },
        {
            field: 'address', headerName: 'Address', flex: 1.5, disableColumnMenu: true, resizable: false, renderCell: (params) => (
                <Stack direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1}>
                    <Typography variant={'body1'}>{reduceAddress(params.row.tokenAddresses?.Ethereum?.Sepolia?.index?.address as Address)}</Typography>
                    <IconButton sx={{cursor: 'pointer'}} onClick={() => {
                        copy(params.row.tokenAddresses?.Ethereum?.Sepolia?.index?.address as Address);
                    }}>
                        <LuCopy size={16} color={theme.palette.info.main} />
                    </IconButton>
                </Stack>
            )
        },
        {
            field: 'action',
            headerName: '',
            flex: 1,
            disableColumnMenu: true,
            resizable: false,
            sortable: false,
            renderCell: (params) => (
                <Stack direction={'row'} gap={1}>
                    <Link href={`/trade?side=buy&index=${params.row.symbol}`} style={{ textDecoration: 'none', width: '100%', cursor: 'pointer' }}>
                        <Button variant="contained" sx={{
                            backgroundColor: theme.palette.brand.nex1.main,
                            paddingY: 0.5,
                            paddingX: 1,
                            borderRadius: 2,
                            color: theme.palette.info.main,
                            textTransform: 'none',
                        }}>
                            <Typography variant={'h6'}>Trade</Typography>
                        </Button>
                    </Link>
                    <Link href={`/index-details?index=${params.row.symbol}`} style={{ textDecoration: 'none', width: '100%', cursor: 'pointer' }}>
                        <Button variant="contained" sx={{
                            backgroundColor: theme.palette.brand.nex1.main,
                            paddingY: 0.5,
                            paddingX: 1,
                            borderRadius: 2,
                            color: theme.palette.info.main,
                            textTransform: 'none',
                        }}>
                            <Typography variant={'h6'}>Details</Typography>
                        </Button>
                    </Link>
                </Stack>
            ),
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

    const rows = nexTokens.map((token, index) => ({
        id: index,
        ...token,
        price: token.smartContractInfo?.price ? `$${formatToViewNumber({ value: token.smartContractInfo.price, returnType: 'currency' })}` : '',
        totalSupply: token.smartContractInfo?.totalSupply ? `${formatToViewNumber({ value: token.smartContractInfo?.totalSupply, returnType: 'string' })}` : '',
        change24h: '+5%',
        address: reduceAddress(token.tokenAddresses?.Ethereum?.Sepolia?.index?.address as Address),
    }));

    return (
        <Stack width="100%" gap={2} paddingX={{ xs: '2px', lg: 0 }}>
            <GenericTable
                rows={rows}
                columns={columns}
                rowHeight={60}
                autoSizeOptions={{
                    includeOutliers: true,
                    includeHeaders: true,
                    outliersFactor: 3,
                    expand: true,
                    columns: isMobile ? ['index', 'price', 'change24h'] : ['index', 'price', 'totalSupply', 'change24h', 'address', 'action'],
                }}
            />
        </Stack>
    );
};

export default CatalogueTable;