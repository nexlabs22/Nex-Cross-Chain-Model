'use client'

import GenericCard from "@/components/ui/generic/genericCard"
import { Typography, Stack, Button } from "@mui/material"
import { useState } from "react"
import { LuChartPie, LuChartColumnIncreasing } from "react-icons/lu"
import theme from "@/theme/theme"
import GenericPieChart from "../generic/genericPieChart";
import GenericBarChart from "../generic/genericBarChart"


const PortfolioDistributionCard = () => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')
    return (
        <GenericCard>
            <Stack gap={2}>
                <Typography variant={'h6'}>
                    Portfolio distribution
                </Typography>
                {
                    chartType == 'pie' && <Stack width={'100%'} height={{ xs: '30vh', lg: 230 }} marginX={'auto'} paddingTop={{ xs: 0, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <GenericPieChart />
                    </Stack>
                }
                {
                    chartType == 'bar' && <Stack width={'100%'} height={{ xs: '30vh', lg: 230 }} marginX={'auto'} paddingTop={{ xs: 3, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <GenericBarChart />
                    </Stack>
                }
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <Button variant={'contained'} onClick={() => setChartType('pie')} sx={{
                        backgroundColor: chartType === 'pie' ? theme.palette.elevations.elevation700.main : theme.palette.elevations.elevation900.main,
                        color: chartType === 'pie' ? theme.palette.text.primary : theme.palette.text.secondary,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}>
                        <LuChartPie size={20} color={theme.palette.info.main} />
                    </Button>
                    <Button variant={'contained'} onClick={() => setChartType('bar')} sx={{
                        backgroundColor: chartType === 'bar' ? theme.palette.elevations.elevation700.main : theme.palette.elevations.elevation900.main,
                        color: chartType === 'bar' ? theme.palette.text.primary : theme.palette.text.secondary,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}>
                        <LuChartColumnIncreasing size={20} color={theme.palette.info.main} />
                    </Button>
                </Stack>
            </Stack>
        </GenericCard>
    )
}

export default PortfolioDistributionCard