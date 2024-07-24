import Image from "next/image";
import Link from "next/link";

import { Stack, Box, Typography, Button, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useLandingPageStore } from '@/store/store'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

import mesh2 from "@assets/images/mesh2.png"
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";
import { CgArrowsExchangeAlt } from "react-icons/cg";

import Switch from '@mui/material/Switch';



interface StakingConsoleProps {
    index: string,
    generic: boolean
}


const StakingConsole: React.FC<StakingConsoleProps> = ({ index, generic }) => {

    const { theme } = useLandingPageStore()

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} borderRadius={"1.2rem"} sx={{
            border: index == "ANFI" ? "solid 1px rgba(95,81,38,0.6)" : index == "CRYPTO5" ? "solid 1px rgba(91,28,33,0.6)" : index == "MAG7" ? "solid 1px rgba(104,44,119,0.6)" : index == "ARBEI" || index == "ARBIn" ? "solid 1px rgba(25,54,95,0.6)" : "",
            backgroundImage: generic ? `url('${mesh2.src}')` : index == "ANFI" ? "linear-gradient(#000000, #5F5126);" : index == "CRYPTO5" ? "linear-gradient(#000000, #562C2F);" : index == "MAG7" ? "linear-gradient(#000000, #682C77)" : index == "ARBEI" || index == "ARBIn" ? "linear-gradient(#000000, #112643)" : "",
            backgroundPosition: generic ? "center" : "",
            backgroundSize: generic ? "cover" : "",
            backgroundRepeat: generic ? "no-repeat" : ""
        }}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={2} padding={3}>
                <Stack width={"fit-content"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"}>
                    <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 700 }}>Stake {index.toUpperCase()}</Typography>

                </Stack>
            </Stack>
            <Stack width={"100%"} height={"0.5px"} sx={{ backgroundColor: "white" }}></Stack>
            <Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: "#D3D3D3", marginTop: "1.2rem", paddingX: 3 }}>Reward Type</Typography>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} paddingX={3} paddingY={"1rem"} marginBottom={1}>
                <Stack width="100%" height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                    <Image src={anfiLogo} alt={index + " logo"} height={40} width={40} className=" rounded-full"/>
                    <Typography variant="caption" component={"label"}>ANFI</Typography>
                </Stack>
                <Stack width="fit-content" height="fit-content" direction="row" alignItems={"center"} justifyContent={"end"} gap={0.5}>
                    <Typography variant="caption" component={"label"} sx={{ fontSize: "0.8rem", fontWeight: 400 }}>Change</Typography>
                    <CgArrowsExchangeAlt size={18} color={theme.palette.text.primary} />
                </Stack>

            </Stack>
            <Stack width={"100%"} height={"0.5px"} sx={{ backgroundColor: "white" }}></Stack>

            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={3} paddingY={"1.2rem"}>
                <Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: "#D3D3D3" }}>Locked Amount</Typography>
                <Stack width="fit-content" height="fit-content" direction="row" alignItems="center" justifyContent="end" gap={0.5}>
                    <Stack width="fit-content" height="fit-content" paddingX={1} paddingY={0.3} borderRadius={"0.4rem"} sx={{ backgroundColor: "#44A4A4" }}>
                        <Typography variant="caption" component="label" sx={{ fontSize: "0.8rem" }}>MIN</Typography>
                    </Stack>
                    <Stack width="fit-content" height="fit-content" paddingX={1} paddingY={0.3} borderRadius={"0.4rem"} sx={{ backgroundColor: "#44A4A4" }}>
                        <Typography variant="caption" component="label" sx={{ fontSize: "0.8rem" }}>MIN</Typography>
                    </Stack>
                    <Stack width="fit-content" height="fit-content" paddingX={1} paddingY={0.3} borderRadius={"0.4rem"} sx={{ backgroundColor: "#44A4A4" }}>
                        <Typography variant="caption" component="label" sx={{ fontSize: "0.8rem" }}>MIN</Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} paddingTop={"1.2rem"} paddingBottom={"0.4rem"} paddingX={3}>
                <Stack width="100%" height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"0.8rem"} border={"solid 0.5px white"} paddingY={1.3} paddingX={1.5}>
                    <Typography variant="caption" component="label" sx={{ fontWeight: 400 }}>Enter amount</Typography>
                    <Stack width="fit-content" height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={1}>
                        <Stack width={"1px"} height={"80%"} minHeight={"1.1rem"} sx={{ backgroundColor: "white" }}></Stack>
                        <Stack width="fit-content" height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
                            <Image src={anfiLogo} alt={index + " logo"} height={20} width={20} className=" rounded-full"/>
                            <Typography variant="caption" component={"label"} sx={{ fontSize: "0.8rem" }}>ANFI</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Typography variant="caption" component="label" sx={{ fontSize: "0.8rem", color: "#D3D3D3", textAlign: "right", width: "100%", paddingX: 3, paddingBottom: 3 }}>
                Available: <span style={{ color: "#34FFDA" }}>14.245,24 {index.toUpperCase()}</span>
            </Typography>
            <Stack width={"94%"} height={"1px"} marginX={"auto"} marginY={1} sx={{ backgroundColor: "white" }}></Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={3} paddingTop={"0.8rem"}>
                <Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: "#D3D3D3" }}>Auto Compound Rewards</Typography>
                <Stack width="fit-content" height="fit-content" direction="row" alignItems="center" justifyContent="end" gap={0.5}>
                    <Switch {...label} color="primary" />
                </Stack>
            </Stack>
            <Typography variant="caption" component="p" sx={{ paddingX: 3, fontSize: "0.9rem", marginTop: "0.6rem", marginBottom: "1.2rem" }}>
                By Investing in Nex Token, you will get rewards in NEX token or in NEX indices tokens.
            </Typography>
            <Stack width={"94%"} height={"1px"} marginX={"auto"} marginY={1} sx={{ backgroundColor: "white" }}></Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} paddingX={3} paddingTop={"0.8rem"}>
                <Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: "#D3D3D3" }}>Summary</Typography>

            </Stack>
            <Stack width={"100%"} height="fit-content" direction="column" alignItems={"start"} justifyContent={"start"} paddingX={3} paddingY={2} gap={0.5}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1} width={"100%"}>
                    <Typography variant="caption" sx={{ fontSize: "0.9rem", color: "lightgray" }}>
                        Start Date:
                    </Typography>
                    <Typography variant="caption">
                        {new Date().toDateString() + " - " + new Date().toTimeString().split("(")[0]}
                    </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1} width={"100%"}>
                    <Typography variant="subtitle2" sx={{ fontSize: "0.9rem", color: "lightgray" }}>
                        Est. APY:
                    </Typography>
                    <Typography variant="caption">
                        36%
                    </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1} width={"100%"}>
                    <Typography variant="subtitle2" sx={{ fontSize: "0.9rem", color: "lightgray" }}>
                        Est. APY:
                    </Typography>
                    <Typography variant="caption">
                        0.0 {index}
                    </Typography>
                </Stack>
            </Stack>
            <Stack width={"94%"} height={"1px"} marginX={"auto"} marginY={1} sx={{ backgroundColor: "white" }}></Stack>
            <Stack width="100%" height="fit-content" direction="row" alignItems={"center"} justifyContent={"center"} paddingX={3} paddingY={2}>
                <Stack width={"100%"} height="fit-content" borderRadius={"0.8rem"} paddingX={4} paddingY={1} sx={{
                    background: "rgb(95,81,38)",
                    backgroundImage: index == "ANFI" ? "linear-gradient(180deg, rgba(95,81,38,1) 0%, rgba(54,46,22,1) 61%, rgba(54,46,22,1) 73%, rgba(34,29,14,1) 100%);" : index == "CRYPTO5" ? "linear-gradient(180deg, #562C2F 0%, #391D1F 66.5%, #341B1D 79.5%, #390004 100%)" : index == "MAG7" ? "linear-gradient(180deg, #682C77 0%, #2A1030 100%)" : index == "ARBEI" || index == "ARBIn" ? "linear-gradient(180deg, #1D4275 0%, #071426 100%)" : "",
                    boxShadow: index == "ANFI" ? "0px 0px 1.5px 6px rgba(95,81,38,0.3)" : index == "CRYPTO5" ? "0px 0px 6px 1.5px #3E2022" : index == "MAG7" ? "0px 0px 6px 1.5px #682C77" : index == "ARBEI" || index == "ARBIn" ? "0px 0px 6px 1.5px #1E457A" : ""
                }}>
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700 }} component="label">
                        Confirm
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default StakingConsole