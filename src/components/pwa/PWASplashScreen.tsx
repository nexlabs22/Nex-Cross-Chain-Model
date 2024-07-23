import Image from "next/image";
import Link from "next/link";
import { Stack, Typography, Button } from "@mui/material";
import PWAIcon from '@assets/images/PWAIcon.png'
import logo from '@assets/images/xlogo_s.png'
import { lightTheme } from "@/theme/theme";
import { useLandingPageStore } from "@/store/store";
import PWAConnectButton from "./PWAConnectWallet";
import { useConnectionStatus, useSetIsWalletModalOpen, useAddress, useChainId } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Goerli, Sepolia } from "@thirdweb-dev/chains";

const PWASplashScreen = () => {

    const address = useAddress()
    const chainId = useChainId()
    const router = useRouter()
    const connectionStatus = useConnectionStatus();
    const setIsWalletModalOpen = useSetIsWalletModalOpen();

    useEffect(() => {
        if (connectionStatus == "connected") router.push("/pwa_index")
    }, [connectionStatus, router])

    // Function for auto switching to the right chain
	const switchChain = useSwitchChain()
	
	useEffect(() => {
		if (address && chainId !== Sepolia.chainId ) {
			try{
				switchChain(Sepolia.chainId)
			}catch(err){
				console.log(err)
			}
		}
	}, [address, chainId, switchChain])

	// !Function for auto switching to the right chain
    return (
        <Stack height={"100vh"} width={"100vw"} paddingBottom={6} direction={"column"} alignItems={"center"} justifyContent={"end"} bgcolor={"#FFFFFF"} paddingX={2}>
            <Image src={logo} alt="pwa" className="w-6/12 h-auto mb-56"/>
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
                            <Button id="pwaSplashDocs" className="" sx={{
                                width: "77%",
                                paddingY: "1.05rem",
                                borderRadius: "1.2rem",
                                backgroundColor: "none",
                                background: "linear-gradient(to top right, #5E869B 100%, #8FB8CA 100%)",
                                boxShadow: "0 1px 2px 1px rgb(0 0 0 / 0.4)"
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