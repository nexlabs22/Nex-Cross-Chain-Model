import Image from "next/image";
import { Stack, Container, Box, Typography } from "@mui/material";
import PWAIcon from '@assets/images/PWAIcon.png'

const PWASplashScreen = () => {
    return (
        <Stack height={"100vh"} width={"100vw"} direction={"column"} alignItems={"center"} justifyContent={"center"} bgcolor={"#FFFFFF"} paddingX={2}>
            <Image src={PWAIcon} alt="pwa" className="w-7/12 h-auto"></Image>
            <Typography variant="h3" align='center' sx={{
                color: "#000000",
                fontSize: "1.4rem"

            }}>
                Mobile Experince Is Coming Soon ...
            </Typography>
            <Typography variant="subtitle2" marginTop={2} width={"90%"} align='center' sx={{
                color: "#000000",

            }}>
                Nothing can be compared to a native mobile experience, that is why in Nex Labs, we are building a new mobile PWA experience for our users. 
            </Typography>
            <Typography variant="subtitle2" marginTop={1} width={"90%"} align='center' sx={{
                color: "#000000",

            }}>
                A relaxed user experience combined with stunning user interface, are the key to handy app that will let you enjoy trying and trading with our products.
            </Typography>
        </Stack>
    )
}

export default PWASplashScreen;