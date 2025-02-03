import { Stack, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
// project imports : 
import PortfolioBalanceCard from "@/components/ui/portfolio/balanceCard";
import PortfolioPerformanceCard from "@/components/ui/portfolio/performanceCard";
import PortfolioDistributionCard from "@/components/ui/portfolio/distributionCard";
import QuickActions from "@/components/ui/generic/quickActions";
import TransactionHistory from "@/components/ui/generic/transactionHistory";


const Page = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <PortfolioBalanceCard />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 6 }}>
          <PortfolioPerformanceCard />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <PortfolioDistributionCard />
        </Grid>
      </Grid>
      <QuickActions />
      <Stack gap={2}>
        <Typography variant="h4" color="primary">
          Transaction history
        </Typography>
        <TransactionHistory />
      </Stack>
    </>
  )
}

export default Page
