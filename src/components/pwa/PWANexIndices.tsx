import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { PWAGradientStack } from "@/theme/overrides";
import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useLandingPageStore } from "@/store/store";


import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { useRouter } from "next/router";
 
const PWANexIndices = () => {

    const [listType, setListType] = useState<string>("All Nex Indices")
    const {changeSelectedIndex} = useLandingPageStore()
    const Indices = [
        {
            name: "Anti Inflation Index",
            symbol: "ANFI",
            logo: anfiLogo,
            price: "2453.4",
            change: "N/A"
        },
        {
            name: "CRYPTO5",
            symbol: "CR5",
            logo: cr5Logo,
            price: "784.8",
            change: "N/A"
        } 
    ];
    const router = useRouter();

    return (
        <Stack id="PWANexIndices" width={"100%"} height={"fit-content"} marginTop={3} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Menu transition menuButton={
                    <MenuButton className={"w-fit"}>
                        <Stack width={"100%"} height={"fit-content"} paddingY={0.5} paddingX={1} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                            <Typography variant="h6" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 700
                            }}>
                                {listType}
                            </Typography>
                            <IoIosArrowDown size={22} color={lightTheme.palette.text.primary}></IoIosArrowDown>
                        </Stack>
                        
                    </MenuButton>
                }>
                    <MenuItem onClick={()=>{setListType("Favorites")}}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Favorites
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={()=>{setListType("My Watchlist")}}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Watchlist
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={()=>{setListType("All Nex Indices")}}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            All Nex Indices
                        </Typography>
                    </MenuItem>
                </Menu>
                <Link href={"/pwa_trade"} className="w-fit h-fit flex flex-row items-center justify-center">
                    <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1} borderRadius={"4rem"} paddingY={"0.5rem"} paddingX={".8rem"} sx={PWAGradientStack}>
                        <GoPlus size={25} strokeWidth={1.2} color={lightTheme.palette.text.primary} className=" bg-white p-[0.2rem] rounded-full aspect-square" style={{
                            border: "solid 1px rgba(37, 37, 37, 0.5)",
                            boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                        }} />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600,
                            fontSize: "1rem",
                        }}>
                            More
                        </Typography>
                    </Stack>
                </Link>

            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={0.5} marginBottom={2}>
                {
                    Indices.map((index, key) => {
                        return (
                            <Stack key={key} width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack} onClick={()=>{
                                changeSelectedIndex(index.symbol);
                                router.push('/pwa_tradeIndex')
                            }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                                    <Image alt="index logo" src={index.logo} width={40} height={40} className="rounded-full mb-2"></Image>
                                    <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                        <Typography variant="caption" sx={{
                                            color: lightTheme.palette.text.primary,
                                            fontWeight: 600,
                                        }}>
                                            {
                                                index.name
                                            }
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: lightTheme.palette.text.primary,
                                            fontWeight: 500,
                                        }}>
                                            {
                                                index.symbol
                                            }
                                        </Typography>
                                    </Stack>

                                </Stack>
                                <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                    }}>
                                        ${
                                            index.price
                                        }
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.nexGreen.main,
                                        fontWeight: 600,
                                        fontSize: ".8rem",
                                        backgroundColor: lightTheme.palette.pageBackground.main,
                                        paddingX: "0.8rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "1rem",
                                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                    }}>
                                        {
                                            index.change
                                        }
                                    </Typography>
                                </Stack>
                            </Stack>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}

export default PWANexIndices