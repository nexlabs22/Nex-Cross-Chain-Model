'use client'

import { IconButton, Link, Stack, Typography } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState } from "react";
import theme from "@/theme/theme";
// assets
import { LuMenu } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import { navItems } from "@/utils/sideBarItems";

// types: 
import { type NavItem } from "@/utils/sideBarItems";

const MobileMenu = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <>
            <Drawer anchor="right" open={open} onClose={handleClose} sx={{
                width: '75%',
                height: '100%',
                backgroundColor: theme.palette.elevations.elevation950.main,
                '& .MuiDrawer-paper': {
                    backgroundColor: theme.palette.elevations.elevation950.main,
                    width: '100%',
                    height: '100%',
                },
                '& .MuiDrawer-root': {
                    backgroundColor: theme.palette.elevations.elevation950.main,
                }
            }}>
                <Stack direction={'row'} justifyContent={"end"} width={'100%'}>
                    <IconButton onClick={handleClose} sx={{
                        width: 'fit-content',
                    }}>
                        <IoMdClose size={36} color={theme.palette.info.main} />
                    </IconButton>
                </Stack>
            <Stack alignItems={"center"} justifyContent={"start"} width={'100%'} gap={3} height={'45%'}>
                    {
                        navItems.map((item: NavItem, key: number) => {
                            return (
                                <Link key={key} href={item.link} width={'fit-content'} display={'flex'} underline="none">
                                    <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                        <Typography variant="h6">{item.label}</Typography>
                                    </Stack>
                                </Link>
                            )
                        })
                    }
                </Stack>
            </Drawer>
            <IconButton onClick={() => setOpen(true)}>
                <LuMenu size={36} color={theme.palette.info.main} />
            </IconButton>
        </>
    )
}

export default MobileMenu;