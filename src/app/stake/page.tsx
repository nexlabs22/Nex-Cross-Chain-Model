import { Box, Stack, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';


// project imports : 

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/sidebar'
import Footer from "@/components/layout/Footer"
import Stake from "@/components/ui/stake/staking";
import StakedAmountCard from "@/components/ui/stake/stakedAmountCard";
import { nexTokensArray } from "@/constants/indices";
import StakingInfo from "@/components/ui/stake/stakingInfo";
import Leaderboard from "@/components/ui/stake/leaderboard";


const Page = () => {
    return (
        <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'row'}>
            <Sidebar />
            <Box
                marginLeft={{xs:0, lg:"5vw"}}
                flexGrow={1}
                overflow="auto"
            >
                <Stack spacing={2} paddingBottom={2} paddingX={2}>
                    <Header />

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
                    <Footer />
                </Stack>
            </Box>
        </Box>
    )
}

export default Page
