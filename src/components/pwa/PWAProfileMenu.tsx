import { PWAGradientStack } from "@/theme/overrides";
import { Stack, Container, Box, Paper, Typography, Button, Avatar, BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import img from "@assets/images/nft_bg.png"
import { lightTheme } from "@/theme/theme";

import { LuLayoutDashboard } from "react-icons/lu";
import { BsClockHistory } from "react-icons/bs";
import { BiCog } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";


const PWAProfileMenu = () => {
    return (
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} marginY={3} paddingX={2} paddingY={2} gap={4}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={3} borderBottom={"solid 2px #2A2A2A"}>
                <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1.5}>
                    <LuLayoutDashboard size={30} color={lightTheme.palette.text.primary}></LuLayoutDashboard>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600,
                    }}>
                        Overview
                    </Typography>
                </Stack>
                <IoIosArrowForward size={30} color={lightTheme.palette.text.primary}></IoIosArrowForward>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={3} borderBottom={"solid 2px #2A2A2A"}>
                <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1.5}>
                    <BsClockHistory size={30} color={lightTheme.palette.text.primary}></BsClockHistory>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600,
                    }}>
                        History
                    </Typography>
                </Stack>
                <IoIosArrowForward size={30} color={lightTheme.palette.text.primary}></IoIosArrowForward>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={2}>
                <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1.5}>
                    <BiCog size={30} color={lightTheme.palette.text.primary}></BiCog>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600,
                    }}>
                        Settings
                    </Typography>
                </Stack>
                <IoIosArrowForward size={30} color={lightTheme.palette.text.primary}></IoIosArrowForward>
            </Stack>
        </Stack>
    )
}

export default PWAProfileMenu