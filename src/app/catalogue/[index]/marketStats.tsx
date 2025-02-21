import Grid from "@mui/material/Grid2"
import { Stack, Typography } from "@mui/material"
import GenericCard from "@/components/ui/generic/genericCard"
import theme from "@/theme/theme"
import { IndexCryptoAsset } from "@/types/indexTypes"
import { reduceAddress } from "@/utils/general"
import { formatToViewNumber } from "@/utils/conversionFunctions"

function calculateTwentyFourHourChange(index: IndexCryptoAsset) {
  const lastPrice =
    index?.historicalPrice?.[index?.historicalPrice?.length - 1]?.price
  const firstPrice = index?.historicalPrice?.[0]?.price
  if (!lastPrice || !firstPrice) return null
  const TwentyFourHourChange = ((lastPrice - firstPrice) / firstPrice) * 100
  return TwentyFourHourChange
}

const MarketStats = ({ index }: { index: IndexCryptoAsset }) => {
  const TwentyFourHourChange = calculateTwentyFourHourChange(index)

  const address = reduceAddress(
    index?.tokenAddresses?.Ethereum?.Mainnet?.token?.address
  )
  const managementFee = index?.smartContractInfo?.managementFee
    ? `${index?.smartContractInfo?.managementFee}%`
    : "N/A"
  const price = index?.smartContractInfo?.poolPrice
    ? `$${formatToViewNumber({
        value: index?.smartContractInfo.poolPrice,
        returnType: "currency",
      })}`
    : "N/A"
  const marketCap = index?.marketInfo?.marketCap
    ? `$${formatToViewNumber({
        value: index?.marketInfo?.marketCap,
        returnType: "currency",
      })}`
    : "N/A"
  const change24h = TwentyFourHourChange ? `${TwentyFourHourChange}%` : "N/A"

  const latestRebalanceUpdate =
    index?.smartContractInfo?.latestRebalanceUpdate || "N/A"

  return (
    <GenericCard>
      <Typography variant="h4" color="primary" marginBottom={2}>
        Market Stats
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Price
            </Typography>
            <Typography variant="h6">{price}</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Market Cap
            </Typography>
            <Typography variant="h6">{marketCap}</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              24h Change [%]
            </Typography>
            <Typography variant="h6">{change24h}</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Management Fee
            </Typography>
            <Typography variant="h6">{managementFee}</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Latest rebalance
            </Typography>
            <Typography variant="h6">{latestRebalanceUpdate}</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack alignItems={"start"} justifyContent={"start"} gap={1}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Token Address
            </Typography>
            <Typography variant="h6">{address}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </GenericCard>
  )
}

export default MarketStats
