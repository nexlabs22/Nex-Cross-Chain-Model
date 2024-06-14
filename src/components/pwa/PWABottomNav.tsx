"use client"

import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { useState, useEffect, useRef } from "react";

import { RiHomeLine } from "react-icons/ri";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { BiUser, BiCog } from "react-icons/bi";
import router from "next/router";
import useIsScrolledDown from "@/hooks/scrollObserver";


const PWABottomNav = () => {

    const [value, setValue] = useState<number>(0)
    const isScrolledDown = useIsScrolledDown();

    return (
        <BottomNavigation
            showLabels={false}
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            className={`${isScrolledDown ? "hiddenBottomNav" : ""}`}
            sx={{
                zIndex: 99
            }}
        >
            <BottomNavigationAction onClick={() => { router.push('/pwa_index') }} icon={<RiHomeLine size={28} color={lightTheme.palette.text.primary} />} />
            <BottomNavigationAction onClick={() => { router.push('/pwa_trade') }} icon={<CgArrowsExchangeAlt size={30} color={lightTheme.palette.text.primary} />} />
            <BottomNavigationAction onClick={() => { router.push('/pwa_profile') }} icon={<BiUser size={28} color={lightTheme.palette.text.primary} />} />
            <BottomNavigationAction onClick={() => { router.push('/pwa_external') }} icon={<BiCog size={28} color={lightTheme.palette.text.primary} />} />
        </BottomNavigation>

    )
}

export default PWABottomNav