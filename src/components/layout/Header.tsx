"use client"

import { Stack, Box, Link } from "@mui/material"
import Image from "next/image"

// assets
import logo from "@/assets/images/logo.webp"
// import Search from "../ui/dashboard/Search";
import ConnectWallet from "@/components/ui/generic/connectWallet"

const Header = () => {
  return (
    <Stack
      width="100%"
      direction={"row"}
      justifyContent={{ xs: "space-between", lg: "end" }}
      alignItems={"center"}
      paddingY={{ xs: 1, lg: 2 }}
      gap={1}
    >
      <Box display={{ xs: "flex", lg: "none" }}>
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            width={26}
            height={26}
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </Link>
      </Box>
      {/* <Box display={{ xs: 'none', lg: 'none' }}>
                <Search />
            </Box> */}
      <ConnectWallet />
    </Stack>
  )
}

export default Header
