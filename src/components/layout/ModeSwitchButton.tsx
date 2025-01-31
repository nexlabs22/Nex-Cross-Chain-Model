"use client"

import { Stack, Typography, Link, Box } from "@mui/material"
import { useColorScheme } from "@mui/material/styles"
import { LuSun } from "react-icons/lu";
import { useEffect } from "react";

const ModeSwitchButton = () => {
    const { mode, setMode } = useColorScheme()

    useEffect(() => {
        if (mode === undefined) {
            setMode('dark')
        }
    }, [mode, setMode])

    if (!mode) {
        return null
    }
    return (
        <Link href={'/'} width={'fit-content'} display={'flex'} underline="none" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>)=>{
            e.preventDefault()
            setMode(mode === 'light' ? 'dark' : 'light')
        }}>
            <Stack direction="row" alignItems={"center"} gap={1}>
                <Box display={{ xs: 'none', lg: 'flex' }}>
                    <LuSun size={20} />
                </Box>
                <Box display={{ xs: 'flex', lg: 'none' }}>
                    <LuSun size={32} />
                </Box>
                <Typography variant="h6" className="sidebar-link-typography" sx={{
                    width: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition: "width 0.3s ease",
                    textTransform: "capitalize", 
                    display: { xs: 'none', lg: 'block' }
                }}>{mode} Mode</Typography>
            </Stack>
        </Link>
    )
}

export default ModeSwitchButton
