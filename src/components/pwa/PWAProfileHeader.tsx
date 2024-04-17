import { PWAGradientStack } from "@/theme/overrides";
import { Stack, Container, Box, Paper, Typography, Button, Avatar, BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import img from "@assets/images/nft_bg.png"
import { lightTheme } from "@/theme/theme";

const PWAProfileHeader = () => {
    return (
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"center"} marginY={3} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
            <Avatar alt="user profile image" src={img.src} sx={{
                height: "15vw",
                width: "15vw"
            }}></Avatar>
            <Typography variant="h6" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 700,
                marginTop: "1.2rem",
                marginBottom: "0.8rem"
            }}>
                Nex User
            </Typography>
            <Typography variant="caption" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,
                marginBottom: "0.2rem"
            }}>
                nexuser1@gmail.com
            </Typography>
            <Typography variant="caption" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,
            }}>
                ID: 45581
            </Typography>
        </Stack>
    )
}

export default PWAProfileHeader