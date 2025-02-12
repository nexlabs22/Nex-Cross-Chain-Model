import { Stack, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';


// project imports : 
import Stake from "@/components/ui/stake/staking";
import StakedAmountCard from "@/components/ui/stake/stakedAmountCard";
import { nexTokensArray } from "@/constants/indices";
import StakingInfo from "@/components/ui/stake/stakingInfo";
import Leaderboard from "@/components/ui/stake/leaderboard";


const Page = () => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, lg: 8 }}>

                </Grid>
                <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
                    <Stake />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
                    <StakedAmountCard index={nexTokensArray[0]} percentage={35} amount={12453.23} />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, lg: 8 }}>
                    <StakingInfo index={nexTokensArray[0]} />
                </Grid>
            </Grid>
            <Stack spacing={2}>
                <Typography variant="h4" color="primary">Leaderboard</Typography>
                <Leaderboard />
            </Stack>
        </>
    )
}

export default Page
