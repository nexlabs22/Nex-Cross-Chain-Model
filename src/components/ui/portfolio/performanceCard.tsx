import GenericCard from "@/components/ui/generic/genericCard"
import { Typography, Stack } from "@mui/material"

// assets
import GenericLineChart from "../generic/genericLineChart";


const PortfolioPerformanceCard = () => {
    return (
        <GenericCard>
            <Stack gap={2}>
                <Typography variant={'h6'}>
                    Portfolio performance
                </Typography>
                <Stack width={'100%'} height={{ xs: '20vh', lg: 250 }} marginX={'auto'} paddingTop={{ xs: 3, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <GenericLineChart label1={'ANFI'} label2={'ARBEI'} />
                </Stack>
            </Stack>
        </GenericCard>
    )
}

export default PortfolioPerformanceCard