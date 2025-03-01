"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/sidebar"
import Footer from "@/components/layout/Footer"
import { IndexCryptoAsset } from "@/types/indexTypes"
import IndexDetailsTabbedTablesView from "@/components/ui/index-details/indexDetailsTabbedViewTables"
import CircularProgress from "@mui/material/CircularProgress"
import MarketStats from "./marketStats"
import Composition from "./composition"
import TradingViewChart from "@/components/ui/chart/TradingViewChart"
import { nexTokensArray } from "@/constants/indices"

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const [selectedIndex, setSelectedIndex] = useState<IndexCryptoAsset>(nexTokensArray[0])
  const [loading, setLoading] = useState(true)

  const { index } = searchParams;

  useEffect(() => {
    setSelectedIndex( nexTokensArray.find((token) => token.symbol === index) ?? nexTokensArray[0] )
    setLoading(false)
  }, [index])

  if (loading)
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
      >
        <CircularProgress />
      </Box>
    )

  if (!index) return <div>Index not found: {index}</div>

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="row">
      <Sidebar />
      <Box marginLeft={{ xs: 0, lg: "5vw" }} flexGrow={1} overflow="auto">
        <Stack spacing={2} paddingBottom={2} paddingX={2}>
          <Header />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Box
                  width={60}
                  height={60}
                  borderRadius={1}
                  sx={{
                    backgroundImage: `url(${selectedIndex?.logoString})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <Stack direction={"column"}>
                  <Typography variant={"h3"}>{selectedIndex?.name}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography variant="h6" color="primary" marginBottom={2}>
                {selectedIndex?.description}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TradingViewChart index={selectedIndex.symbol} />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <MarketStats index={selectedIndex} />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 }} marginTop={2}>
              <Composition index={selectedIndex} />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 }} marginTop={2}>
              <IndexDetailsTabbedTablesView />
            </Grid>
          </Grid>
          <Footer />
        </Stack>
      </Box>
    </Box>
  )
}

export default Page