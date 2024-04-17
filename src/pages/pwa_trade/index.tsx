import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
const PWADynamicRibbon = dynamic(() => import("@components/pwa/PWADynamicRibbon").then(module => module.default), { ssr: false });


import logo from "@assets/images/xlogo2.png"
import { PWAGradientStack, PWAGradientTradeButton } from "@/theme/overrides";
import dynamic from "next/dynamic";

export default function PWATrade() {

    const Indices = [
        {
            name: "Anti Inflation Index",
            symbol: "ANFI",
            logo: anfiLogo,
            price: "2453.4",
            change: "N/A"
        },
        {
            name: "CRYPTO5",
            symbol: "CR5",
            logo: cr5Logo,
            price: "784.8",
            change: "N/A"
        },
        {
            name: "AIIndex",
            symbol: "AII",
            logo: cr5Logo,
            price: "826.6",
            change: "N/A"
        },

    ];

    return (
        <Box width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>

            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Our Indices
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500
                }}>
                    Explore Our Index Products
                </Typography>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} marginTop={4} marginBottom={2} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                <PWADynamicRibbon>
                    <Button sx={{
                        width: "100%",
                        paddingY: "0.8rem",
                        background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                        boxShadow: "none",
                        filter: "grayscale(1)"
                    }}>
                        <Typography variant="h3" component="h3" className="w-full" sx={{
                            color: lightTheme.palette.text.primary,
                            fontSize: "1.6rem",
                            textShadow: "none"
                        }} >
                            CeFi
                        </Typography>
                    </Button>
                </PWADynamicRibbon>

                <Button sx={{
                    width: "50%",
                    paddingY: "0.8rem",
                    background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                    boxShadow: "none"
                }}>
                    <Typography variant="h3" component="h3" className="w-full" sx={{
                        color: lightTheme.palette.text.primary,
                        fontSize: "1.6rem",
                        textShadow: "none"
                    }} >
                        DeFi
                    </Typography>
                </Button>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} marginTop={'-2.4rem'} direction={"column"} alignItems={"cnter"} justifyContent={"start"} gap={1} sx={{
                overflowY: "scroll"
            }}>
                {
                    Indices.map((index, key) => {
                        return (
                            <Link href={"/pwa_tradeIndex"} key={key} className="w-full h-fit flex flex-row items-center justify-center">
                                <Stack key={key} width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                                        <Image alt="index logo" src={index.logo} width={40} height={40} className="rounded-full mb-2"></Image>
                                        <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                                fontWeight: 600,
                                            }}>
                                                {
                                                    index.name
                                                }
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                                fontWeight: 500,
                                            }}>
                                                {
                                                    index.symbol
                                                }
                                            </Typography>
                                        </Stack>

                                    </Stack>
                                    <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                                        <Typography variant="caption" sx={{
                                            color: lightTheme.palette.text.primary,
                                            fontWeight: 600,
                                        }}>
                                            ${
                                                index.price
                                            }
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: lightTheme.palette.nexGreen.main,
                                            fontWeight: 600,
                                            fontSize: ".8rem",
                                            backgroundColor: lightTheme.palette.pageBackground.main,
                                            paddingX: "0.8rem",
                                            paddingY: "0.2rem",
                                            borderRadius: "1rem",
                                            border: "solid 1px rgba(37, 37, 37, 0.5)",
                                            boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                        }}>
                                            {
                                                index.change
                                            }
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Link>
                        )
                    })
                }
            </Stack>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}