import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import logo from '@assets/images/xlogo_s.png'
import { IoSearchOutline } from "react-icons/io5";
import { lightTheme } from "@/theme/theme";


const PWATopBar = () => {
    return (
        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Link href={"pwa_index"} className="w-fit h-fit fle flex-row items-center justify-center">
                <Image src={logo} alt="pwa" className="w-[2.5rem] h-auto"></Image>
            </Link>

            <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={2}>
                <IoSearchOutline size={32} color={lightTheme.palette.text.primary} />
                <Link href="pwa_profile" className="w-fit h-fit fle flex-row items-center justify-center">
                    <Stack width={"2.6rem"} height={"2.6rem"} borderRadius={"99999px"} bgcolor={lightTheme.palette.sliderBoxBg}></Stack>
                </Link>
            </Stack>
        </Stack>
    )
}

export default PWATopBar;