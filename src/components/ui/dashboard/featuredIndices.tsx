'use client'

import { Stack, Link } from "@mui/material"
import Grid from '@mui/material/Grid2';
import IndexCard from "@/components/ui/generic/indexCard"
import { TokenObject } from "@/types/indexTypes";
import { useDashboard } from "@/providers/DashboardProvider";
import MobileFeaturedIndices from "./mobileFeaturedIndices";

const FeaturedIndices = () => {
    
    const { nexTokens} = useDashboard()

    return (
        <>
        <Stack width="100%" display={{xs: 'none', lg: 'block'}}>
            <Grid container spacing={2}>
                {
                    nexTokens.slice(0, 3).map((index: TokenObject, key: number) => (
                        <Grid size={{ xs: 12, lg: 4 }} key={key}>
                            <Link href={`/trade?side=buy&index=${index.symbol}`} key={key} style={{ textDecoration: 'none', width: '100%', cursor: 'pointer' }}>
                                <IndexCard index={index} />
                            </Link>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
        <MobileFeaturedIndices />
        </>
    )
}

export default FeaturedIndices;
