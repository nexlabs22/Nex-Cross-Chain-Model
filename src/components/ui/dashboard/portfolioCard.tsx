import GenericCard from "@/components/ui/generic/genericCard"
import { Box, Typography, Stack } from "@mui/material"

// assets
import { MdOutlineArrowOutward, MdOutlineArrowUpward } from "react-icons/md";
import theme from "@/theme/theme"
import GenericAreaLineChart from "../generic/genericAreaChart";


const IndexCard = () => {
    return (
        <GenericCard>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h6'}>
                    My Portfolio
                </Typography>
                <MdOutlineArrowOutward size={24} color={theme.palette.info.main} />
            </Stack>
            <Stack gap={1} marginTop={3}>
                <Typography variant={'h3'}>
                   0.00 <span style={{ color: theme.palette.text.secondary, fontSize: 12 }}>USD</span>
                </Typography>
                <Stack gap={0} marginBottom={{xs: 16, lg: 8}}>
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
                    <Typography variant={'subtitle2'} color={'text.secondary'}>
                       More than last 24 hours
                    </Typography>
                </Stack>
                <Stack width={'100%'} marginX={'auto'} paddingTop={{ xs: 3, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    aspectRatio: '3/0.7',
                }}>
                    <GenericAreaLineChart label={'Portfolio'} />
                </Stack>
            </Stack>
        </GenericCard>
    )
}

export default IndexCard