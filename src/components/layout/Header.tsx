"use client"

import { Stack, Box, Link } from "@mui/material";
import { useColorScheme } from "@mui/material";
import Image from "next/image";

// assets
import logo from '@/assets/images/logo.webp'
import Search from "../ui/dashboard/Search";
import ConnectWallet from "@/components/ui/generic/connectWallet";

const Header = () => {
    const { mode } = useColorScheme();
    return (
        <Stack width="100%" direction={'row'} justifyContent={{ xs: 'space-between', lg: 'end' }} alignItems={'center'} paddingY={{ xs: 1, lg: 2 }} gap={1}>
            <Box display={{ xs: 'flex', lg: 'none' }}>
                <Link href="/">
                    <Image src={logo} alt="logo" width={32} height={32} style={{
                        filter: mode === 'dark' ? "brightness(0) invert(1)" : "brightness(0) invert(0)"
                    }} />
                </Link>
            </Box>
            <Box display={{ xs: 'none', lg: 'none' }}>
                <Search />
            </Box>
            <ConnectWallet />
        </Stack>
    )
}

export default Header;