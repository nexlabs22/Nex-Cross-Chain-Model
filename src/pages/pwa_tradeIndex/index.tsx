import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAIndexChartBox from "@/components/pwa/PWAIndexChartBox";
import PWAIndexComparisonBox from "@/components/pwa/PWAIndexComparisonBox";

import { CgArrowsExchangeAlt } from "react-icons/cg";

import logo from "@assets/images/xlogo2.png"


export default function PWATradeIndex() {
    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    ANFI
                </Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500
                    }}>
                        ANFI
                    </Typography>
                    <CgArrowsExchangeAlt size={30} color={lightTheme.palette.mobileTitleDot.main}></CgArrowsExchangeAlt>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500
                    }}>
                        Wold{"'"}s Best Assets
                    </Typography>
                </Stack>

            </Stack>
            <PWAIndexComparisonBox></PWAIndexComparisonBox>
            <PWAIndexChartBox></PWAIndexChartBox>
            <Stack width={"100%"} height={"fit-content"} marginY={1} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                <Button sx={{
                    width: "50%",
                    paddingY: "1rem",
                    background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                }}>
                    <Typography variant="h3" component="h3" className="w-full" sx={{
                        color: lightTheme.palette.text.primary,
                        fontSize: "1.6rem",
                        textShadow: "none"
                    }} >
                        Buy
                    </Typography>
                </Button>
                <Button sx={{
                    width: "50%",
                    paddingY: "1rem",
                    background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                }}>
                    <Typography variant="h3" component="h3" className="w-full" sx={{
                        color: lightTheme.palette.text.primary,
                        fontSize: "1.6rem",
                        textShadow: "none"
                    }} >
                        Sell
                    </Typography>
                </Button>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    More About ANFI
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500
                }}>
                    The Anti-inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures. Gold has traditionally been a reliable investment. Nevertheless, it{"'"}s worth considering that Bitcoin, often referred to as  {"'"}digital gold,{"'"} has the potential to assume a prominent role in everyday life in the future.
                </Typography>

            </Stack>
            <Stack width={"100%"} height={"fit-content"} marginY={2} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={1}>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Market Cap
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        N/A
                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Market Price
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        N/A
                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        24h Change
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        N/A
                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Token Address
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        N/A
                    </Typography>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Managment Fees
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        1%
                    </Typography>
                </Stack>
            </Stack>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}