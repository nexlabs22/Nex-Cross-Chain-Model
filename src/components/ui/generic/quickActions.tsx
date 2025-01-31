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
            link: '/trade?side=buy&index=ANFI'
        },
        {
            title: 'Sell',
            icon: <MdOutlineArrowDownward size={24} color={theme.palette.text.primary} />,
            link: '/trade?side=sell&index=ANFI'
        },
        {
            title: 'Stake',
            icon: <LuSquarePercent size={24} color={theme.palette.text.primary} />,
            link: '/stake'
        },
        {
            title: 'Convert',
            icon: <RiExchange2Line size={24} color={theme.palette.text.primary} />,
            link: '/'
        },
        {
            title: 'Build',
            icon: <LuBlocks size={24} color={theme.palette.text.primary} />,
            link: '/build'
        },
        {
            title: 'DCA',
            icon: <LuDollarSign size={24} color={theme.palette.text.primary} />,
            link: '/'
        }
    ]
    return (
        <Stack gap={2} paddingX={{xs: '2px', lg: 0}}>
            <Typography variant="h4" color="primary">
                Quick Actions
            </Typography>
            <Stack display={{ xs: 'none', md: 'flex' }} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2}>
                {
                    quickActions.map((action, key) => (
                        <GenericCard key={key}>
                            <Link href={action.link} sx={{ textDecoration: 'none' }} width={{ xs: '30vw', lg: 'fit-content' }}>
                                <Stack gap={5}>
                                    <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                        backgroundColor: action.title === 'DCA' ? theme.palette.text.secondary : theme.palette.background.default,
                                        aspectRatio: '1/1',
                                    }}>
                                        {action.icon}
                                    </Box>
                                    <Stack width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                                        <Typography variant={'h6'} color={action.title === 'DCA' ? theme.palette.text.secondary : theme.palette.info.main}>
                                            {action.title}
                                        </Typography>
                                        <MdOutlineArrowForward size={24} color={action.title === 'DCA' ? theme.palette.text.secondary : theme.palette.info.main} style={{ transform: 'rotate(-45deg)' }} />
                                    </Stack>
                                </Stack>
                            </Link>
                        </GenericCard>
                    ))
                }
            </Stack>
            <Stack display={{ xs: 'flex', md: 'none' }} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2} flexWrap={'wrap'}>
                {
                    quickActions.map((action, key) => (
                        <Link key={key} href={action.link} sx={{ textDecoration: 'none' }} width={'30%'} my={1}>
                            <Stack gap={1} alignItems={'center'} justifyContent={'center'}>
                                <Box width="fit-content" display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={'50%'} padding={1} sx={{
                                    backgroundColor: action.title === 'DCA' ? theme.palette.text.secondary : theme.palette.background.default,
                                        aspectRatio: '1/1',
                                    }}>
                                        {action.icon}
                                    </Box>
                                    <Typography variant={'h6'} color={action.title === 'DCA' ? theme.palette.text.secondary : theme.palette.info.main}>
                                        {action.title}
                                    </Typography>
                                </Stack>
                            </Link>
                    ))
                }
            </Stack>

        </Stack>
    )
}

export default QuickActions