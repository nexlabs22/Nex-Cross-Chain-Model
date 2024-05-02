import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { useLandingPageStore } from "@/store/store";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { LiaWalletSolid } from "react-icons/lia";
import { AiOutlineSwap } from "react-icons/ai";
import { IOSSwitch, PWAProfileTextField } from "@/theme/overrides";
import { GoArrowUpRight } from "react-icons/go";
import SwapV2Defi from "@/components/SwapV2Defi";

interface pwaTradeConsole1Props {
    operation: string
}

export default function PWATradeConsole1() {

    const { PWATradeoperation } = useLandingPageStore()

    return (
        <SwapV2Defi />
    )
}