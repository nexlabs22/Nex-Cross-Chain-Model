import { Stack, Container, Box, Paper, Switch, TextField, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAProfileHistoryList from "@/components/pwa/PWAProfileHistory";
import { IOSSwitch, PWAProfileTextField } from "@/theme/overrides";
import { BsQrCodeScan } from "react-icons/bs";



export default function PWAProfileSettings() {

    const [accountType, setAccountType] = useState<string>("retailer")


    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Account Info
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500,
                    marginTop: "1rem"
                }}>
                    Account Type
                </Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500,
                    }}>
                        Retailer
                    </Typography>
                    <IOSSwitch sx={{ m: 1 }} defaultChecked={false} />
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500,
                    }}>
                        Institutional Investor
                    </Typography>

                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.5}>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            First Name
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" fullWidth />
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Last Name
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" fullWidth />
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Email
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" fullWidth />
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Main Wallet
                        </Typography>
                        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"stretch"} justifyContent={"start"} gap={1}>
                            <Stack width={"80%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"}>
                                <TextField id="outlined-basic" color="info" variant="outlined" fullWidth />
                            </Stack>
                            <Stack width={"20%"} flexGrow={1} direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                                borderRadius: "0.5rem"
                            }}>
                                <BsQrCodeScan size={40} color={lightTheme.palette.text.primary}></BsQrCodeScan>
                            </Stack>
                        </Stack>

                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                    <Typography variant="h6" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Notifications & Insights
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive emails from Nex Labs
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive push notifications from Nex Labs
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive weekly News Recaps
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive news about Nex Labs events
                        </Typography>

                    </Stack>
                </Stack>
            </Stack>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}