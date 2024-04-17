import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { useState } from "react";

import { RiHomeLine } from "react-icons/ri";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { BiUser, BiCog } from "react-icons/bi";
import router from "next/router";



const PWABottomNav = () => {

    const [value, setValue] = useState<number>(0)

    return (
        <BottomNavigation
                showLabels={false}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction onClick={()=>{router.push('/pwa_index')}} icon={<RiHomeLine size={28} color={lightTheme.palette.text.primary} />} />
                <BottomNavigationAction onClick={()=>{router.push('/pwa_trade')}} icon={<CgArrowsExchangeAlt size={30} color={lightTheme.palette.text.primary} />} />
                <BottomNavigationAction onClick={()=>{router.push('/pwa_profile')}} icon={<BiUser size={28} color={lightTheme.palette.text.primary} />} />
                <BottomNavigationAction onClick={()=>{router.push('/pwa_settings')}}  icon={<BiCog size={28} color={lightTheme.palette.text.primary} />} />
            </BottomNavigation>

    )
}

export default PWABottomNav