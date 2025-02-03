'use client'

// src/app/trade/[operation]/[index]/page.tsx

import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import GenericCard from "@/components/ui/generic/genericCard";
import Swap from "@/components/ui/trade/swap";
import TabbedTablesView from '@/components/ui/trade/tabbedViewTables';
import { useDashboard } from "@/providers/DashboardProvider";

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { nexTokens } = useDashboard()
  const { side, index } = searchParams;
  let defaultToken = nexTokens[0];
  if (index) {
    const foundToken = nexTokens.find(token => token.symbol === index);
    defaultToken = foundToken || nexTokens[0];
  }

  const selectedSide = side && side === 'buy' ? 'buy' : 'sell';

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <GenericCard>
            <Typography variant="h4" color="primary" marginBottom={2}>
              Chart space
            </Typography>
          </GenericCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Swap side={selectedSide} defaultToken={defaultToken} />
        </Grid>
      </Grid>
      <TabbedTablesView />
    </>
  );
};

export default Page;