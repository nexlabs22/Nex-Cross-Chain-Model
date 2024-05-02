import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAIndexChartBox from "@/components/pwa/PWAIndexChartBox";
import PWAIndexComparisonBox from "@/components/pwa/PWAIndexComparisonBox";
import { useLandingPageStore } from "@/store/store";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

import logo from "@assets/images/xlogo2.png"

interface pwaTradeConsole1Props {
    operation: string
}

export default function PWATradeConsole1() {

    const { PWATradeoperation } = useLandingPageStore()

    return (
        <Box width={"100vw"} height={"fit-content"} minHeight={"100vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingBottom={4} paddingX={2} bgcolor={lightTheme.palette.background.default}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} >
                <Stack width={"fit-content"} height={"fit-content"} paddingTop={4} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={8}>
                    <Link href={"/pwa_tradeIndex"} className="w-fit h-fit flex flex-row items-center justify-center">
                        <IoIosArrowBack size={30} color={lightTheme.palette.text.primary}></IoIosArrowBack>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600,
                            textTransform: "capitalize",
                            marginLeft: "0.8rem",
                            whiteSpace: "nowrap"
                        }}>
                            {PWATradeoperation} ANFI
                        </Typography>
                    </Link>
                </Stack>
                <Stack width={"100vw"} height={"fit-content"} paddingTop={4} direction={"row"} alignItems={"center"} justifyContent={"end"}>
                    <Typography variant="caption" sx={{
                        color: PWATradeoperation == "buy" ? lightTheme.palette.nexGreen.main : lightTheme.palette.nexRed.main,
                        fontWeight: 600,
                        backgroundColor: PWATradeoperation == "buy" ? lightTheme.palette.nexLightGreen.main : lightTheme.palette.nexLightRed.main,
                        paddingX: "0.8rem",
                        whiteSpace: "nowrap",
                        paddingY: "0.2rem",
                        borderRadius: "1.4rem",
                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                        boxShadow: `0px 1px 1px 1px ${PWATradeoperation == "buy" ? lightTheme.palette.nexLightGreen.main : lightTheme.palette.nexLightRed.main}`,
                        textTransform: "capitalize",
                        borderColor: PWATradeoperation == "buy" ? lightTheme.palette.nexLightGreen.main : lightTheme.palette.nexLightRed.main
                    }}>
                        {PWATradeoperation} ANFI
                    </Typography>
                </Stack>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} paddingTop={8} paddingBottom={6} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={2}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    backgroundColor: lightTheme.palette.pageBackground.main,
                    paddingX: "1.2rem",
                    paddingY: "0.4rem",
                    borderRadius: "1rem",
                    border: "solid 1px rgba(37, 37, 37, 0.5)",
                    boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                }}>
                    MIN
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    backgroundColor: lightTheme.palette.pageBackground.main,
                    paddingX: "1.2rem",
                    paddingY: "0.4rem",
                    borderRadius: "1rem",
                    border: "solid 1px rgba(37, 37, 37, 0.5)",
                    boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                }}>
                    HALF
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    backgroundColor: lightTheme.palette.pageBackground.main,
                    paddingX: "1.2rem",
                    paddingY: "0.4rem",
                    borderRadius: "1rem",
                    border: "solid 1px rgba(37, 37, 37, 0.5)",
                    boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                }}>
                    MAX
                </Typography>
            </Stack>
            <Stack width={"100vw"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"}>
                <Typography variant="caption" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: "0.8rem"
                }}>
                    Enter Amount
                </Typography>
                <input type="number" className=" bg-transparent border-none w-full h-fit pt-4 pb-8 interMedium outline-none text-black text-center text-6xl" placeholder="0.0" />
                <Typography variant="subtitle1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500,
                }}>
                    ≈$0.0
                </Typography>
                <Typography variant="subtitle1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    paddingTop: "1rem"
                }}>
                    Current Balance : N/A
                </Typography>
            </Stack>
        </Box>
    )
}