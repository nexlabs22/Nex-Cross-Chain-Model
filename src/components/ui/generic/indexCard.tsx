'use client'

import GenericCard from "@/components/ui/generic/genericCard"
import GenericAreaLineChart from "./genericAreaChart";
import { Box, Typography, Stack } from "@mui/material"
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup";

// assets
import { MdOutlineArrowOutward, MdOutlineArrowUpward } from "react-icons/md";
import theme from "@/theme/theme"

//types
import { TokenObject } from "@/types/indexTypes";
import { formatToViewNumber } from "@/utils/conversionFunctions";

//interface
interface IndexCardProps {
    index: TokenObject
}

const IndexCard = ({ index }: IndexCardProps) => {

    return (
        <GenericCard>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack direction={'row'} alignItems={'center'} gap={1}>
                    <Box width={64} height={64} borderRadius={1} sx={{
                        backgroundImage: `url(${index.logo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                    </Box>
                    <Stack direction={'column'} alignItems={'start'} justifyContent={'center'} gap={0.5}>
                        <Typography variant={'subtitle1'}>{index.name}</Typography>
                        <CompositionAvatarGroup index={index} size={28} borderColor={theme.palette.elevations.elevation800.main} />
                    </Stack>
                </Stack>
                <MdOutlineArrowOutward size={24} color={theme.palette.info.main} />
            </Stack>
            <Stack gap={1} marginTop={3}>
                <Typography variant={'h3'}>
                    { index.smartContractInfo?.price ? `$${formatToViewNumber({value: index.smartContractInfo?.price, returnType: 'currency'})}` : '0.00'} <span style={{ color: theme.palette.text.secondary, fontSize: 12 }}>USD</span>
                </Typography>
                <Stack gap={0} marginBottom={{xs: 16, lg: 12}}>
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                        <Box borderRadius={'50%'} sx={{
                            backgroundColor: theme.palette.success.main,
                            width: 24,
                            height: 24,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: index.marketInfo?.change24h && index.marketInfo?.change24h > 0 ? 'rotate(125deg)' : 'rotate(45deg)',
                        }}>
                            <MdOutlineArrowUpward size={16} color={theme.palette.info.main} />
                        </Box>
                        <Typography variant={'h6'} color={'success.main'}>
                            {index.marketInfo?.change24h ? `${index.marketInfo?.change24h}%` : '0.00%'} 
                            {/* <span style={{ color: theme.palette.info.main, fontSize: 12, fontWeight: 400 }}>(0.0%)</span> */}
                        </Typography>
                    </Stack>
                    <Typography variant={'subtitle2'} color={'text.secondary'}>
                        {index.marketInfo?.change24h && index.marketInfo?.change24h > 0 ? 'More than' : 'Less than'} last 24 hours
                    </Typography>
                </Stack>
                <Stack width={'100%'} height={{ xs: '16vh', lg: 100 }} marginX={'auto'} paddingTop={{ xs: 3, lg: 0 }} direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
                    <GenericAreaLineChart label={index.symbol} />
                </Stack>

            </Stack>
        </GenericCard>
    )
}

export default IndexCard