import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import PWAProfileHeader from "@/components/pwa/PWAProfileHeader";
import PWAProfileMenu from "@/components/pwa/PWAProfileMenu";
import { useMediaQuery } from '@mui/material';
import { PWAGradientStack } from "@/theme/overrides";

export default function PWAProfile() {

    const isLandscape = useMediaQuery('(orientation: landscape)'); 
    return (
        <Box width={"100vw"} height={"fit-content"} minHeight={"100vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar/>
            <PWAProfileHeader/>
            <PWAProfileMenu/>
            <PWABottomNav/>
        </Box>
    )
}