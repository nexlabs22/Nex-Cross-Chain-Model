'use client'

import Grid from '@mui/material/Grid2';
import Swap from "@/components/ui/trade/swap";
import TabbedTablesView from '@/components/ui/trade/tabbedViewTables';
import { useDashboard } from "@/providers/DashboardProvider";
import TradingViewChart from "@/components/ui/chart/TradingViewChart";
import { Stack } from '@mui/material';
import { PiHouseBold } from 'react-icons/pi';
import { BreadcrumbItem } from '@/utils/breadcrumbsItems';
import { TbArrowsExchange } from "react-icons/tb";
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { nexTokens } = useDashboard()
  const { side, index } = searchParams;
  let selectedIndex = nexTokens[0];
  if (index) {
    const foundToken = nexTokens.find(token => token.symbol === index);
    selectedIndex = foundToken || nexTokens[0];
  }

  const selectedSide = side && side === 'buy' ? 'buy' : 'sell';

  const breadcrumbsItems: BreadcrumbItem[] = [
    { icon: PiHouseBold, label: "Home", link: "/", available: true },
    { icon: TbArrowsExchange, label: "Trade", link: `/trade?side=buy&index=ANFI`, available: true },
    { label: selectedIndex.symbol.toLocaleUpperCase(), link: `/trade?side=${side}&index=${selectedIndex.symbol}`, available: true }
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Stack width="100%" height="100%" borderRadius={2} overflow="hidden">
            <TradingViewChart index={selectedIndex.symbol} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Swap side={selectedSide} selectedIndex={selectedIndex} />
        </Grid>
      </Grid>
      <TabbedTablesView />
    </>
  );
};

export default Page;