import { MdOutlineArrowForward, MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md";
import theme from "@/theme/theme";
import GenericCard from "./genericCard";
import { Stack, Typography, Box, Link } from "@mui/material";

// assets 
import { RiExchange2Line } from "react-icons/ri";
import { LuSquarePercent, LuBlocks, LuDollarSign } from "react-icons/lu";

const QuickActions = () => {
    const quickActions = [
        {
            title: 'Buy',
            icon: <MdOutlineArrowUpward size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <MdOutlineArrowUpward size={24} color={theme.palette.text.secondary} />,
            link: '/trade?side=buy&index=ANFI',
            comingSoon: false
        },
        {
            title: 'Sell',
            icon: <MdOutlineArrowDownward size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <MdOutlineArrowDownward size={24} color={theme.palette.text.secondary} />,
            link: '/trade?side=sell&index=ANFI',
            comingSoon: false
        },
        {
            title: 'Stake',
            icon: <LuSquarePercent size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <LuSquarePercent size={24} color={theme.palette.text.secondary} />,
            link: '/stake',
            comingSoon: true
        },
        {
            title: 'Swap',
            icon: <RiExchange2Line size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <RiExchange2Line size={24} color={theme.palette.text.secondary} />,
            link: '/swap',
            comingSoon: true
        },

        {
            title: 'Build',
            icon: <LuBlocks size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <LuBlocks size={24} color={theme.palette.text.secondary} />,
            link: '/build',
            comingSoon: true
        },
        {
            title: 'DCA',
            icon: <LuDollarSign size={24} color={theme.palette.text.primary} />,
            cominSoonIcon: <LuDollarSign size={24} color={theme.palette.text.secondary} />,
            link: '/dca',
            comingSoon: true
        }
    ]
    return (
        <Stack gap={2} paddingX={{ xs: '2px', lg: 0 }}>
            <Typography variant="h4" color="primary">
                Quick Actions
            </Typography>
            <Stack display={{ xs: 'none', md: 'flex' }} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2}>
                {
                    quickActions.map((action, key) => (
                        <GenericCard key={key}>
                            {
                                action.comingSoon ? (
                                    <Stack gap={5} width={'100%'}>
                                        <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                            backgroundColor: theme.palette.elevations.elevation800.main,
                                            aspectRatio: '1/1',
                                        }}>
                                            {action.cominSoonIcon}
                                        </Box>
                                        <Stack width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                                            <Typography variant={'h6'} color={theme.palette.text.secondary}>
                                                {action.title} <span style={{ fontSize: '12px' }}>(Coming Soon)</span>
                                            </Typography>
                                            <MdOutlineArrowForward size={24} color={theme.palette.text.secondary} style={{ transform: 'rotate(-45deg)' }} />
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <Link href={action.link} sx={{ textDecoration: 'none' }} width={{ xs: '30vw', lg: '100%' }}>
                                        <Stack gap={5} width={'100%'}>
                                            <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                                backgroundColor: theme.palette.background.default,
                                                aspectRatio: '1/1',
                                            }}>
                                                {action.icon}
                                            </Box>
                                            <Stack width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                                                <Typography variant={'h6'} color={theme.palette.info.main}>
                                                    {action.title}
                                                </Typography>
                                                <MdOutlineArrowForward size={24} color={theme.palette.info.main} style={{ transform: 'rotate(-45deg)' }} />
                                            </Stack>
                                        </Stack>
                                    </Link>
                                )
                            }
                        </GenericCard>
                    ))
                }
            </Stack>
            <Stack display={{ xs: 'flex', md: 'none' }} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2} flexWrap={'wrap'}>
                {
                    quickActions.map((action, key) => (
                        action.comingSoon ? (
                            <Stack key={key} gap={1} alignItems={'center'} justifyContent={'center'} width={'30%'} my={1}>
                                <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                    backgroundColor: theme.palette.elevations.elevation800.main,
                                    aspectRatio: '1/1',
                                }}>
                                    {action.cominSoonIcon}
                                </Box>
                                <Stack alignItems={'center'} justifyContent={'start'}>
                                    <Typography variant={'h6'} color={theme.palette.text.secondary}>
                                        {action.title}
                                    </Typography>
                                    <Typography variant={'caption'} color={theme.palette.text.secondary}>
                                        (Coming Soon)
                                    </Typography>
                                </Stack>
                            </Stack>
                        ) : (
                            <Link key={key} href={action.link} sx={{ textDecoration: 'none' }} width={'30%'} my={1}>
                                <Stack gap={1} alignItems={'center'} justifyContent={'center'}>
                                    <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                        backgroundColor: theme.palette.elevations.elevation900.main,
                                        aspectRatio: '1/1',
                                    }}>
                                        {action.icon}
                                    </Box>
                                    <Typography variant={'h6'} color={theme.palette.info.main}>
                                        {action.title}
                                    </Typography>
                                </Stack>
                            </Link>
                        )

                    ))
                }
            </Stack>

        </Stack>
    )
}

export default QuickActions