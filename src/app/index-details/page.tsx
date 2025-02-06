"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/sidebar"
import Footer from "@/components/layout/Footer"
import { useDashboard } from "@/providers/DashboardProvider"
import GenericCard from "@/components/ui/generic/genericCard"
import { IndexCryptoAsset } from "@/types/indexTypes"
import IndexDetailsTabbedTablesView from "@/components/ui/index-details/indexDetailsTabbedViewTables"
import CircularProgress from "@mui/material/CircularProgress"
import MarketStats from "./marketStats"
import Composition from "./composition"
import { useSearchParams } from "next/navigation"

const Page = () => {
  const { nexTokens } = useDashboard()
  const [index, setIndex] = useState<IndexCryptoAsset | null>(null)
  const [loading, setLoading] = useState(true)

  const paramsRaw = useSearchParams()
  const params = Object.fromEntries(paramsRaw.entries())  

  useEffect(() => {
    setIndex(
      nexTokens.find((token) => token.symbol === params.index) ?? null
    )
    setLoading(false)
  }, [params, nexTokens])

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

  if (!index) return <div>Index not found: {params.index}</div>

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
                    backgroundImage: `url(${index?.logoString})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <Stack direction={"column"}>
                  <Typography variant={"h3"}>{index?.name}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography variant="h6" color="primary" marginBottom={2}>
                {index?.description}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <GenericCard>
                <Typography variant="h4" color="primary" marginBottom={2}>
                  Chart space
                </Typography>
              </GenericCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <MarketStats index={index} />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 }} marginTop={2}>
              <Composition index={index} />
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
