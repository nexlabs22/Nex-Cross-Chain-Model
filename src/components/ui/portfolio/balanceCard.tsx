import GenericCard from "@/components/ui/generic/genericCard"
import { Box, Typography, Stack } from "@mui/material"

// assets
import { MdOutlineArrowUpward } from "react-icons/md";
import theme from "@/theme/theme"
import GenericAreaLineChart from "../generic/genericAreaChart";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];


const PortfolioBalanceCard = () => {
    return (
        <GenericCard>
            <Stack alignItems={'center'} gap={2}>
            <Typography variant={'h6'} textAlign={'center'}>
                Portfolio balance
            </Typography>
            <Stack gap={1} alignItems={'center'}>
                <Typography variant={'h3'}>
                    0.00 <span style={{ color: theme.palette.text.secondary, fontSize: 12 }}>USD</span>
                </Typography>
                <Stack gap={0} marginBottom={{ xs: 10, lg: 8 }} alignItems={'center'}>
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                        <Box borderRadius={'50%'} sx={{
                            backgroundColor: theme.palette.success.main,
                            width: 24,
                            height: 24,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: 'rotate(45deg)',
                        }}>
                            <MdOutlineArrowUpward size={16} color={theme.palette.info.main} />
                        </Box>
                        <Typography variant={'h6'} color={'success.main'}>
                            0.00 <span style={{ color: theme.palette.info.main, fontSize: 12, fontWeight: 400 }}>(0.0%)</span>
                        </Typography>
                    </Stack>
                    <Typography variant={'subtitle2'} color={'text.secondary'} textAlign={'center'}>
                        More than last 24 hours
                    </Typography>
                </Stack>
                <Stack width={'100%'} height={{ xs: '20vh', lg: 250 }} marginX={'auto'} paddingTop={{ xs: 3, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <GenericAreaLineChart label={'Portfolio'} chartData={{xValue: uData, yValue: xLabels}}/>
                </Stack>
            </Stack>
            </Stack>
        </GenericCard>
    )
}

export default PortfolioBalanceCard