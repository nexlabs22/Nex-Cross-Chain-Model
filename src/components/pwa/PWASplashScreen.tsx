import Image from "next/image";
import Link from "next/link";
import { Stack, Container, Box, Typography, Button } from "@mui/material";
import PWAIcon from '@assets/images/PWAIcon.png'
import logo from '@assets/images/xlogo_s.png'
import { lightTheme } from "@/theme/theme";
import { useLandingPageStore } from "@/store/store";

const PWASplashScreen = () => {
    const { setTheme } = useLandingPageStore()
    return (
        <Stack height={"100vh"} width={"100vw"} paddingBottom={6} direction={"column"} alignItems={"center"} justifyContent={"end"} bgcolor={"#FFFFFF"} paddingX={2}>
            <Image src={logo} alt="pwa" className="w-6/12 h-auto mb-56"></Image>
            <Stack height={"fit-content"} width={"100%"} direction={"column"} alignItems={"center"} justifyContent={"flex-end"} gap={2}>
                <Link href={"/pwa_index"} className="w-full flex flex-row items-center justify-center">
                    <Button sx={{
                        width: "80%",
                        paddingY: ".8rem" ,
                        background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                    }}>
                        <Typography variant="h3" component="h3" className="w-full" sx={{
                            color: lightTheme.palette.text.primary,
                            fontSize: "1.6rem",
                            textShadow: "none"
                        }} >
                            Connect Wallet
                        </Typography>
                    </Button>
                </Link>

                <Button sx={{
                    width: "80%",
                    paddingY: ".8rem",

                }}>
                    <Typography variant="h3" component="h3" className="w-full" sx={{
                        color: lightTheme.palette.text.primary,
                        fontSize: "1.6rem",
                        textShadow: "none"
                    }} >
                        Docs
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    )
}

export default PWASplashScreen;