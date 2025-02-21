"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { useDashboard } from "@/providers/DashboardProvider"
import { IndexCryptoAsset } from "@/types/indexTypes"
import IndexDetailsTabbedTablesView from "@/components/ui/index-details/indexDetailsTabbedViewTables"
import CircularProgress from "@mui/material/CircularProgress"
import MarketStats from "@/app/catalogue/index-details/marketStats"
import Composition from "@/app/catalogue/index-details/composition"
import { parseQueryFromPath } from "@/utils/general"
import TradingViewChart from "@/components/ui/chart/TradingViewChart"
import { PiHouseBold } from 'react-icons/pi';
import { GoStack } from "react-icons/go";
import { BreadcrumbItem } from '@/utils/breadcrumbsItems';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const Page = () => {
  const { nexTokens } = useDashboard()
  const [index, setIndex] = useState<IndexCryptoAsset | null>(null)
  const [loading, setLoading] = useState(true)

  const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
  const params = parseQueryFromPath(searchQuery)
  console.log(params)


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

  const breadcrumbsItems: BreadcrumbItem[] = [
    { icon: PiHouseBold, label: "Home", link: "/", available: true },
    { icon: GoStack, label: "Catalogue", link: `/catalogue`, available: true },
    { label: index.symbol.toLocaleUpperCase(), link: `/catalogue/index-details?&index=${index.symbol}`, available: true }
  ]

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
      <Breadcrumbs items={breadcrumbsItems} />
      </Grid>
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
        <TradingViewChart index={index.symbol} />
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
  )
}

export default Page