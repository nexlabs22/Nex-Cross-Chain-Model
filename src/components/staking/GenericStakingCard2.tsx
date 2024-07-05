import Image from "next/image";
import Link from "next/link";

import { Stack, Box, Typography, Button, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useLandingPageStore } from '@/store/store'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { BsArrowRight } from "react-icons/bs";


import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from "react-icons/ci";


interface GenericStakingCardProps {
    index: string
}



const GenericStakingCard2: React.FC<GenericStakingCardProps> = ({ index }) => {

    const { theme } = useLandingPageStore()



    return (
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} borderRadius={"1.2rem"} sx={{
            border: index == "ANFI" ? "solid 1px rgba(95,81,38,0.6)" : "",
            backgroundImage: index == "ANFI" ? "linear-gradient(#000000, #5F5126);" : ""
        }}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={2} paddingX={4} paddingY={3}>
                <Stack width={"fit-content"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"}>
                    <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 700 }}>Staking {index.toUpperCase()}</Typography>
                    <Typography variant="caption" component="p" sx={{ color: "#D3D3D3" }}>Rewards are in ANFI or other NEX index products</Typography>
                </Stack>
                <Stack width={"fit-content"} height="fit-content" borderRadius={"0.8rem"} paddingX={4} paddingY={1} sx={{
                    background: "rgb(95,81,38)",
                    backgroundImage: index == "ANFI" ? "linear-gradient(180deg, rgba(95,81,38,1) 0%, rgba(54,46,22,1) 61%, rgba(54,46,22,1) 73%, rgba(34,29,14,1) 100%);" : "",

                }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }} component="label">
                        Stake Now
                    </Typography>
                </Stack>
            </Stack>
            <Stack width={"100%"} height={"1px"} sx={{ backgroundColor: "white" }}></Stack>
            <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} height={"fit-content"} paddingY={4}>
                <Stack width={"35%"} direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{ aspectRatio: "1" }}>
                    <CircularProgressbarWithChildren value={78} strokeWidth={2} styles={buildStyles({
                        rotation: 0.25,
                        pathColor: index == "ANFI" ? "#E8BB31" : "",
                        trailColor: "rgba(211,211,211,0.42)"
                    })}>
                        <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <Image src={index == "ANFI" ? anfiLogo : index == "CRYPTO5" ? cr5Logo : index == "MAG7" ? mag7Logo : index == "ARBEI" ? arbLogo : ""} alt={index + " logo"} height={100} width={100} className=" rounded-full"></Image>
                            <Typography variant="caption" component="label" sx={{ fontWeight: 700 }}>Staked {index.toUpperCase()}</Typography>
                        </Stack>
                    </CircularProgressbarWithChildren >
                </Stack>
                <Typography variant="h6" sx={{ marginTop: "1.2rem" }}>514.425,53</Typography>
                <Typography variant="caption" sx={{
                    color: index == "ANFI" ? "#E8BB31" : "#E8BB31"
                }}>$21.856,53</Typography>
                <Stack width={"100%"} height="fit-content" direction={"row"} alignItems={"center"} justifyContent={"center"} marginTop={"1.8rem"}>
                    <Typography variant="caption">Check on Etherscan</Typography>
                    <BsArrowRight size={20} color={theme.palette.text.primary} />
                </Stack>
            </Stack>
        </Stack>
    )
}

export default GenericStakingCard2