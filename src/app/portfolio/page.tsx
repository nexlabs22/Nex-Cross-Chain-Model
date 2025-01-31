import { Box, Stack, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
// project imports : 
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/sidebar'
import Footer from "@/components/layout/Footer"
import PortfolioBalanceCard from "@/components/ui/portfolio/balanceCard";
import PortfolioPerformanceCard from "@/components/ui/portfolio/performanceCard";
import PortfolioDistributionCard from "@/components/ui/portfolio/distributionCard";
import QuickActions from "@/components/ui/generic/quickActions";
import TransactionHistory from "@/components/ui/generic/transactionHistory";


const Page = () => {
  return (
    <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'row'}>
      <Sidebar />
      <Box
        marginLeft="5vw"
        flexGrow={1}
        overflow="auto"
      >
        <Stack spacing={2} paddingBottom={2} paddingX={2}>
          <Header />
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
          <Footer />
        </Stack>
      </Box>
    </Box>
  )
}

export default Page
