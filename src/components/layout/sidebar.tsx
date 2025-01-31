"use client"

import { Stack, Paper, Typography, Link } from "@mui/material"
import Image from "next/image"
import { useColorScheme } from "@mui/material/styles"
// project imports
import { navItems, settingItems } from "@/utils/sideBarItems";
import ModeSwitchButton from "./ModeSwitchButton";

// assets
import logo from '@/assets/images/logo.webp'

// types: 
import { type NavItem } from "@/utils/sideBarItems";

const Sidebar = () => {
    const { mode } = useColorScheme()
    return (
        <Paper
            component={'div'}
            elevation={2}
            sx={{
                display: { xs: "none", lg: "block" },
                minWidth: {xs: "4vw", xl: "3vw"},
                width: "fit-content",
                height: "100vh",
                maxHeight: "100vh",
                paddingY: 4,
                paddingX: 2,
                justifyContent: "space-between",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 999,
                ":hover": {
                    minWidth: "12vw",
                    transition: "min-width 0.1s ease",
                },
                ":hover .sidebar-link-typography": {
                    width: "auto",
                    transition: "width 0.1s ease",
                },
            }}
        >
            <Stack justifyContent={"space-between"} gap={6}>
                <Stack direction="row" alignItems={"baseline"} gap={1}>
                    <Image src={logo} alt="nexlabs nex logo" height={22} width={22} style={{
                        filter: mode === 'light' ? "brightness(0) invert(0)" : "brightness(0) invert(1)"
                    }}></Image>
                    <Typography variant="h3" className="sidebar-link-typography" sx={{
                        width: 0,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        transition: "width 0.3s ease",
                    }}>Nexlabs</Typography>
                </Stack>

                <Stack justifyContent={"space-between"} gap={3} height={'45%'}>
                    {
                        navItems.map((item: NavItem, key: number) => {
                            return (
                                <Link key={key} href={item.link} width={'fit-content'} display={'flex'} underline="none">
                                    <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                        <item.icon size={20} />
                                        <Typography variant="h6" className="sidebar-link-typography" sx={{
                                            width: 0,
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            transition: "width 0.3s ease",
                                        }}>{item.label}</Typography>
                                    </Stack>
                                </Link>
                            )
                        })
                    }
                </Stack>
            </Stack>
            <Stack justifyContent={"end"} gap={3} height={'45%'} sx={{
                opacity: 0
            }}>
                {
                    settingItems.map((item: NavItem, key: number) => {
                        return (
                            <Link key={key} href={item.link} width={'fit-content'} display={'flex'} underline="none">
                                <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                    <item.icon size={20} />
                                    <Typography variant="h6" className="sidebar-link-typography" sx={{
                                        width: 0,
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        transition: "width 0.3s ease",
                                    }}>{item.label}</Typography>
                                </Stack>
                            </Link>
                        )
                    })
                }
                <ModeSwitchButton />
            </Stack>
        </Paper>
    )
}

export default Sidebar