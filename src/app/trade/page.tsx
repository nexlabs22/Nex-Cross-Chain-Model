'use client'

import Grid from '@mui/material/Grid2';
import Swap from "@/components/ui/trade/swap";
import TabbedTablesView from '@/components/ui/trade/tabbedViewTables';
import { useDashboard } from "@/providers/DashboardProvider";
import TradingViewChart from "@/components/ui/chart/TradingViewChart";

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { nexTokens } = useDashboard()
  const { index } = searchParams;
  let selectedIndex = nexTokens[0];
  if (index) {
    const foundToken = nexTokens.find(token => token.symbol === index);
    selectedIndex = foundToken || nexTokens[0];
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TradingViewChart index={selectedIndex.symbol}/>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Swap/>
        </Grid>
      </Grid>
      <TabbedTablesView />
    </>
  );
};

export default Page;