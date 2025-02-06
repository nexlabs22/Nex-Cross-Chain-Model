import { Box, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"

import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/sidebar"
import Footer from "@/components/layout/Footer"
import FeaturedIndices from "@/components/ui/dashboard/featuredIndices"
import PortfolioCard from "@/components/ui/dashboard/portfolioCard"
import QuickActions from "@/components/ui/generic/quickActions"
import IndicesTable from "@/components/ui/dashboard/IndicesTable"
import News from "@/components/ui/dashboard/news"

const Page = () => {
  console.log("running app page")
  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"row"}
    >
      <Sidebar />
      <Box marginLeft={{ xs: 0, lg: "5vw" }} flexGrow={1} overflow="auto">
        <Stack spacing={2} paddingBottom={2} paddingX={2}>
          <Header />
          {/* <ModeSwitcher /> */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <FeaturedIndices />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }} paddingX={{ xs: "2px", lg: 0 }}>
              <PortfolioCard />
            </Grid>
          </Grid>
          <QuickActions />
          <IndicesTable />
          <News />
          <Footer />
        </Stack>
      </Box>
    </Box>
  )
}

export default Page
