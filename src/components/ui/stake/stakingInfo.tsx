import GenericCard from "@/components/ui/generic/genericCard"
import { Typography, Stack, Divider } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { IndexCryptoAsset } from "@/types/indexTypes"

import { LuStickyNote } from "react-icons/lu"

interface StakingInforProps {
  index: IndexCryptoAsset
}

const StakingInfo = ({ index }: StakingInforProps) => {
  return (
    <GenericCard>
      <Stack spacing={3} width={"100%"}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Staked Amount</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Reawrds Amount</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Pool Size</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Pool Holders</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Availble Balance</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Profit Percentage</Typography>
              <Typography variant="body1">
                {`12453.23 ${index.symbol}`}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack
          direction={{ xs: "column", lg: "row" }}
          alignItems={"start"}
          spacing={2}
        >
          <LuStickyNote size={36} strokeWidth={1.5} />
          <Typography variant="body2">
            By investing in Nex products, you can get your rewards upon
            unstaking, either in Nex token, Nex indices tokens or in FIAT. If
            not extracted by withdrawing from the pool, rewards compound
            automatically to the user.
          </Typography>
        </Stack>
      </Stack>
    </GenericCard>
  )
}

export default StakingInfo
