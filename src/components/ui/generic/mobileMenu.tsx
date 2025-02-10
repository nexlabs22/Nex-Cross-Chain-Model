'use client'

import { IconButton, Link, Stack, Typography } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useState } from "react";
import Image from "next/image";
import theme from "@/theme/theme";
import { usePathname } from "next/navigation";
// assets
import { LuMenu } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import logo from '@/assets/images/logo.webp'
import { navItems } from "@/utils/sideBarItems";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaMedium } from "react-icons/fa6";

// types: 
import { type NavItem } from "@/utils/sideBarItems";

const MobileMenu = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    const path = usePathname();
    const isActive = (link: string) => path.split('/')[1] === link.split('/')[1];
    return (
        <>
            <Drawer anchor="right" open={open} onClose={handleClose} sx={{

                width: '75%',
                height: '100%',
                paddingX: 2,
                paddingY: 2,
                backgroundColor: `${theme.palette.background.default} !important`,
                backgroundImage: 'none !important',
                '& .MuiDrawer-paper': {
                    backgroundColor: `${theme.palette.background.default} !important`,
                    backgroundImage: 'none !important',
                    width: '100%',
                    height: '100%',
                },
                '& .MuiDrawer-root': {
                    backgroundColor: `${theme.palette.background.default} !important`,
                    backgroundImage: 'none !important',
                },
                '& .MuiDrawer-paperAnchorRight': {
                    backgroundColor: `${theme.palette.background.default} !important`,
                    backgroundImage: 'none !important',
                }

            }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} marginBottom={6}>
                    <Link href="/" underline="none" width={'fit-content'} height={'fit-content'} paddingLeft={1.5} paddingTop={1.5} display={'flex'} flexDirection={'row'} alignItems={"center"} gap={1}>
                        <Image src={logo} alt="logo" width={28} height={28} style={{
                            filter: "brightness(0) invert(1)"
                        }} />
                        <Typography variant="h3">NexLabs</Typography>
                    </Link>
                    <IconButton onClick={handleClose} sx={{
                        width: 'fit-content',
                    }}>
                        <IoMdClose size={36} color={theme.palette.info.main} />
                    </IconButton>
                </Stack>
                <Stack alignItems={"start"} justifyContent={"start"} width={'100%'} gap={3} paddingX={2}>
                    {
                        navItems.map((item: NavItem, key: number) => {
                            return (
                                <Link key={key} href={item.link} width={'fit-content'} display={'flex'} underline="none">
                                    <Stack key={key} direction="row" alignItems={"center"} gap={1}>
                                        <Typography variant="h5" color={isActive(item.link) ? theme.palette.brand.nex1.main : theme.palette.text.primary}>{item.label}</Typography>
                                    </Stack>
                                </Link>
                            )
                        })
                    }
                </Stack>
                <Stack direction={'row'} gap={2} marginY={{xs: 4, lg: 0}} paddingX={2}>
                        <Link href="https://www.linkedin.com/company/nex-labs/" target="_blank" underline="none">
                            <LinkedInIcon color="primary" />
                        </Link>
                        <Link href="https://twitter.com/NEX_Protocol" target="_blank" underline="none">
                            <XIcon color="primary" />
                        </Link>
                        <Link href="https://nexlabs.medium.com/" target="_blank" underline="none">
                            <FaMedium color="primary" size={24} />
                        </Link>
                        <Link href="https://github.com/nexlabs22" target="_blank" underline="none">
                            <GitHubIcon color="primary" />
                        </Link>
                    </Stack>
            </Drawer>
            <IconButton onClick={() => setOpen(true)}>
                <LuMenu size={36} color={theme.palette.info.main} />
            </IconButton>
        </>
    )
}

export default MobileMenu;