import { Stack, Link } from "@mui/material"
import Grid from "@mui/material/Grid2"
import IndexCard from "@/components/ui/generic/indexCard"
import { IndexCryptoAsset } from "@/types/indexTypes"
import { useDashboard } from "@/providers/DashboardProvider"

const CatalogueGrid = () => {
  const { nexTokens } = useDashboard()
  return (
    <Stack width="100%">
      <Grid container spacing={2}>
        {nexTokens.map((index: IndexCryptoAsset, key: number) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={key}>
            <Link
              href={`/trade?side=buy&index=${index.symbol}`}
              style={{
                textDecoration: "none",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <IndexCard index={index} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default CatalogueGrid
