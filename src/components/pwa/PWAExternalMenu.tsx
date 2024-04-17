import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import { PWAGradientStack } from "@/theme/overrides";
import { IoMdArrowForward } from "react-icons/io";

const PWAExternalMenu = () => {
    return (
        <>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"center"} marginTop={5} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    marginBottom: "1.4rem"
                }}>
                    Nex Labs
                </Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Home
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Public Repository
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        White Paper
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Licences
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"center"} marginTop={1} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    marginBottom: "1.4rem"
                }}>
                    Whitepaper Pieces
                </Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Spot - Indices
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Protocol Structure
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Token & Smart contract Details
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        Roadmap
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={0.5}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        FAQ
                    </Typography>
                    <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                </Stack>
            </Stack>
        </>


    )
}

export default PWAExternalMenu