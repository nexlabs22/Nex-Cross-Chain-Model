"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { IndexCryptoAsset } from "@/types/indexTypes"
import IndexDetailsTabbedTablesView from "@/components/ui/index-details/indexDetailsTabbedViewTables"
import CircularProgress from "@mui/material/CircularProgress"
import MarketStats from "@/app/catalogue/index-details/marketStats"
import Composition from "@/app/catalogue/index-details/composition"
import TradingViewChart from "@/components/ui/chart/TradingViewChart"
import { PiHouseBold } from 'react-icons/pi';
import { GoStack } from "react-icons/go";
import { BreadcrumbItem } from '@/utils/breadcrumbsItems';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
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
    
  const breadcrumbsItems: BreadcrumbItem[] = [
    { icon: PiHouseBold, label: "Home", link: "/", available: true },
    { icon: GoStack, label: "Catalogue", link: `/catalogue`, available: true },
    { label: (selectedIndex?.symbol || 'ANFI').toLocaleUpperCase(), link: `/catalogue/index-details?&index=${selectedIndex?.symbol}`, available: true }
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
  )
}

export default Page