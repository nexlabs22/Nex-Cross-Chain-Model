"use client"

import { Stack, Typography, Link } from "@mui/material"
import Image from "next/image"
import { useColorScheme } from "@mui/material/styles"
import theme from "@/theme/theme"
// project imports
import { navItems, settingItems } from "@/utils/sideBarItems";


// assets
import logo from '@/assets/images/logo.webp'

// types: 
import { type NavItem } from "@/utils/sideBarItems";

const Sidebar = () => {
    const { mode } = useColorScheme()
    return (
        <Stack
            display={{ xs: "none", lg: "block" }}
            width={"fit-content"}
            height="100vh"
            maxHeight="100vh"
            paddingY={4}
            paddingX={2}
            justifyContent={"space-between"}
            sx={{
                backgroundColor: theme.palette.elevations.elevation950.main,
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 999,
                ":hover": {

                    minWidth: { lg: "12vw", xl: "5vw" },
                    transition: "min-width 0.1s ease",
                },
                ":hover .sidebar-link-typography": {
                    width: "auto",
                    transition: "width 0.1s ease",
                },
                ":hover .navItemsBox": {
                    alignItems: "start",
                    transition: "alignItems 0.1s ease"
                }
            }}
        >
            <Stack alignItems={'center'} justifyContent={"space-between"} gap={6} className="navItemsBox">
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

                <Stack alignItems={'center'} justifyContent={"space-between"} gap={3} height={'45%'} className="navItemsBox">
                    {
                        navItems.map((item: NavItem, key: number) => {
                            return (
                                item.available ? (
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
                                ) : (
                                    <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                        <item.icon size={20} color={theme.palette.text.secondary} />
                                        <Typography variant="h6" className="sidebar-link-typography" sx={{
                                            width: 0,
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            transition: "width 0.3s ease",
                                            color: theme.palette.text.secondary
                                        }}>{item.label}</Typography>
                                    </Stack>
                                )
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
                            <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                <item.icon size={20} />
                                <Typography variant="h6" className="sidebar-link-typography" sx={{
                                    width: 0,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    transition: "width 0.3s ease",
                                }}>{item.label}</Typography>
                            </Stack>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}


export default Sidebar