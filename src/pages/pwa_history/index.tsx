import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAProfileHistoryList from "@/components/pwa/PWAProfileHistory";
import {NewHistoryTable} from "@/components/NewHistoryTable";


export default function PWAProfileHistory() {

    

    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <Stack width={"100%"} height={"fit-content"} paddingTop={2} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <NewHistoryTable></NewHistoryTable>
                
            </Stack>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}