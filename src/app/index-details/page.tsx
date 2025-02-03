'use client'

import { Box, Typography, Stack, Button, Link } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useDashboard } from "@/providers/DashboardProvider";
import GenericCard from "@/components/ui/generic/genericCard";
import { reduceAddress } from "@/utils/general";
import theme from "@/theme/theme";
import { Asset, TokenObject } from "@/types/indexTypes";
import IndexDetailsTabbedTablesView from "@/components/ui/index-details/indexDetailsTabbedViewTables";
import { useEffect, useState } from "react";

const Page = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const { nexTokens } = useDashboard();
  const [defaultToken, setDefaultToken] = useState<TokenObject>(nexTokens[0]);

  useEffect(() => {
    const getSearchParams = async () => {
      const params = await searchParams;
      const { index } = params;

      if (index) {
        const foundToken = nexTokens.find(token => token.symbol === index);
        setDefaultToken(foundToken || nexTokens[0]);
      }
    };

    getSearchParams();
  }, [nexTokens, searchParams]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Box width={60} height={60} borderRadius={1} sx={{
            backgroundImage: `url(${defaultToken?.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <Stack direction={'column'}>
            <Typography variant={'h3'}>{defaultToken?.name}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Typography variant="h6" color="primary" marginBottom={2}> {defaultToken?.description} </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <GenericCard>
          <Typography variant="h4" color="primary" marginBottom={2}>
            Chart space
          </Typography>
        </GenericCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <GenericCard>
          <Typography variant="h4" color="primary" marginBottom={2}>
            Market Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  Price
                </Typography>
                <Typography variant="h6">
                  ${defaultToken?.marketInfo?.price || 0}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  Market Cap
                </Typography>
                <Typography variant="h6">
                  ${defaultToken?.marketInfo?.marketCap || 0}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  24h Change
                </Typography>
                <Typography variant="h6">
                  {defaultToken?.marketInfo?.change24h || 0}%
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  Management Fees
                </Typography>
                <Typography variant="h6">
                  {defaultToken?.smartContractInfo?.managementFee || 0}%
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  Latest rebalance
                </Typography>
                <Typography variant="h6">
                  29/01/2025
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack alignItems={'start'} justifyContent={'start'} gap={1}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>
                  Token Address
                </Typography>
                <Typography variant="h6">
                  {reduceAddress(defaultToken?.tokenAddresses?.Ethereum?.Mainnet?.index?.address || '0x0000000000000000000000000000000000000000')}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Link href={`/trade?side=buy&index=${defaultToken?.symbol}`} style={{ textDecoration: 'none', width: '100%', cursor: 'pointer' }}>
                <Button fullWidth variant="contained" sx={{
                  backgroundColor: theme.palette.brand.nex1.main,
                  paddingY: 1,
                  paddingX: 1,
                  borderRadius: 2,
                  color: theme.palette.info.main,
                  textTransform: 'none',
                }}>
                  <Typography variant={'h6'}>Buy</Typography>
                </Button>
              </Link>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Link href={`/trade?side=buy&index=${defaultToken?.symbol}`} style={{ textDecoration: 'none', width: '100%', cursor: 'pointer' }}>
                <Button fullWidth variant="contained" sx={{
                  backgroundColor: theme.palette.brand.nex1.main,
                  paddingY: 1,
                  paddingX: 1,
                  borderRadius: 2,
                  color: theme.palette.info.main,
                  textTransform: 'none',
                }}>
                  <Typography variant={'h6'}>Sell</Typography>
                </Button>
              </Link>
            </Grid>
          </Grid>
        </GenericCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} marginTop={2}>
        <Typography variant="h4" color="primary" marginBottom={2}>Composition</Typography>
        <Grid container spacing={2}>
          {
            defaultToken?.smartContractInfo?.composition?.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)).map((asset: Asset, key) => (
              <Grid size={{ xs: 6, md: 4, lg: 2 }} key={key}>
                <Stack direction={'row'} gap={1} alignItems={'center'}>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={50} height={50} sx={{
                    backgroundColor: asset.bgColor,
                    borderRadius: '50%',
                  }} >
                    <Image src={asset.logoString || ''} alt={asset.symbol} width={50} height={50} />
                  </Box>
                  <Stack direction={'column'}>
                    <Typography variant="h6">{asset.symbol}</Typography>
                    <Typography variant="h6">{asset.weight}%</Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))
          }
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} marginTop={2}>
        <IndexDetailsTabbedTablesView />
      </Grid>
    </Grid>
  );
};

export default Page;
