import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import PWAProfileOverviewHeader from "@/components/pwa/PWAProfileOverviewHeader";
import PWAPNLChartBox from "@/components/pwa/PWAPNLChartBox";
import PWAMyAssets from "@/components/pwa/PWAMyAssets";
import PWABanner from "@/components/pwa/PWABanner";
import dca from "@assets/images/dca.png"
import logo from "@assets/images/xlogo2.png"
import { PWAGradientStack, PWAGradientTradeButton } from "@/theme/overrides";

export default function PWAOverview() {

    

    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <PWAProfileOverviewHeader></PWAProfileOverviewHeader>
            <PWAPNLChartBox></PWAPNLChartBox>
            <PWAMyAssets></PWAMyAssets>
            <PWABanner image={dca.src} bigText="Nex DCA Calculator" smallText="Nex Dollar Cost Averaging (DCA) Calculator, a strategic tool designed for investors." link="" linkText="Learn More"></PWABanner>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}