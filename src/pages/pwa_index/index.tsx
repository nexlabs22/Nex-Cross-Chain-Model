import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWABanner from "@/components/pwa/PWABanner";
import PWAIndexSLider from "@/components/pwa/PWAIndexSlider";
import PWANexIndices from "@/components/pwa/PWANexIndices";
import PWATopStories from "@/components/pwa/PWATopStories";

import logo from "@assets/images/xlogo2.png"

export default function PWAIndex(){
    return(
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <PWABanner smallText="Welcome NEX User" bigText="Unlock passive investing with our index products" link="/pwa_trade" linkText="Trade Now" image={logo.src} imgWidth="30vw" imgHeight="30vw"></PWABanner>
            <PWAIndexSLider></PWAIndexSLider>
            <PWANexIndices></PWANexIndices>
            <PWATopStories></PWATopStories>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}