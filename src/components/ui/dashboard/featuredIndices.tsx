"use client"

import { Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import IndexCard from "@/components/ui/generic/indexCard"
import { IndexCryptoAsset } from "@/types/indexTypes"
import { useDashboard } from "@/providers/DashboardProvider"
import MobileFeaturedIndices from "./mobileFeaturedIndices"

const FeaturedIndices = () => {
  const { nexTokens } = useDashboard()

  return (
    <>
      <Stack width="100%" display={{ xs: "none", lg: "block" }}>
        <Grid container spacing={2}>
          {nexTokens.slice(0, 3).map((index: IndexCryptoAsset, key: number) => (
            <Grid size={{ xs: 12, lg: 4 }} key={key}>
              <IndexCard index={index} />
            </Grid>
          ))}
        </Grid>
      </Stack>
      <MobileFeaturedIndices />
    </>
  )
}

export default FeaturedIndices
