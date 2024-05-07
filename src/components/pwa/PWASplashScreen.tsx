import Image from "next/image";
import Link from "next/link";
import { Stack, Container, Box, Typography, Button } from "@mui/material";
import PWAIcon from '@assets/images/PWAIcon.png'
import logo from '@assets/images/xlogo_s.png'
import { lightTheme } from "@/theme/theme";
import { useLandingPageStore } from "@/store/store";
import PWAConnectButton from "./PWAConnectWallet";
import { useConnectionStatus, useSetIsWalletModalOpen, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PWASplashScreen = () => {

    const address = useAddress()
    const router = useRouter()
    const connectionStatus = useConnectionStatus();
    const setIsWalletModalOpen = useSetIsWalletModalOpen();

    useEffect(() => {
        if (connectionStatus == "connected") router.push("/pwa_index")
    }, [connectionStatus, router])
    return (
        <Stack height={"100vh"} width={"100vw"} paddingBottom={6} direction={"column"} alignItems={"center"} justifyContent={"end"} bgcolor={"#FFFFFF"} paddingX={2}>
            <Image src={logo} alt="pwa" className="w-6/12 h-auto mb-56"></Image>
            <Stack height={"fit-content"} width={"100%"} direction={"column"} alignItems={"center"} justifyContent={"flex-end"} gap={1}>
                {
                    address ? (
                        <Typography variant="h3" component="h3" className="w-full rounded-3xl" sx={{
                            color: "#000000",
                            fontSize: "1.8rem",
                            textShadow: "none",
                            textAlign: "center"
                        }} >
                            Redirecting...
                        </Typography>
                    ) : (
                        <>
                            <PWAConnectButton />
                            <Button className="pwaConnectWallet" sx={{
                                width: "78%",
                                paddingY: "1.3rem",
                                borderRadius: "1.2rem",
                                background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                                boxShadow: "none"
                            }}>
                                <Typography variant="h3" component="h3" className="w-full rounded-3xl" sx={{
                                    color: "#000000",
                                    fontSize: "1.8rem",
                                    textShadow: "none",

                                }} >
                                    Docs
                                </Typography>
                            </Button>
                        </>
                    )
                }

            </Stack>
        </Stack>
    )
}

export default PWASplashScreen;