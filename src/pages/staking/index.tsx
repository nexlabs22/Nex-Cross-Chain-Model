'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import convert from '@assets/images/convert.png'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
import { Stack, Box, Typography, Button, Grid } from "@mui/material";
import Head from 'next/head'

import GenericStakingCard1 from '@/components/staking/GenericStakingCard1'
import GenericStakingCard2 from '@/components/staking/GenericStakingCard2'
import StakingConsole from '@/components/staking/StakingConsole'
import StakingLeaderBoard from '@/components/staking/leaderBoard'

import { useDashboard } from '@/providers/DashboardProvider'

export default function Staking() {
    const { mode, theme } = useLandingPageStore()
    const {
        anfiIndexObject,
        cr5IndexObject,
        mag7IndexObject,
        arbIndexObject,
    } = useDashboard();

    const [selectedStakingIndex, setSelectedStakingIndex] = useState(anfiIndexObject)
    return (
        <>
            <Head>
                <title>Nex Labs - Staking</title>
                <meta name="description" content="Nex Labs' convert page features a lifi widget enabling one-stop bridging, swapping, and native gas delivery making complex trades simple." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main
                className="min-h-screen overflow-x-hidden h-fit w-screen bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundColor: theme.palette.background.default
                }}
            >
                <section className="h-full w-fit overflow-x-hidden">
                    <DappNavbar />
                    <Typography variant='h3' sx={{
                        paddingX: 8,
                        marginBottom: 2,
                        marginTop: 6,
                        fontWeight: 600
                    }}>Staking</Typography>

                    <Typography variant="subtitle2" sx={{
                        paddingX: 8,
                        marginBottom: 4,
                        width: "95%"
                    }}>
                        Unlock promising rewards by staking Nex Labs Index tokens. By locking your tokens into Nex staking pool for a set period, you could earn interest on your holdings, similar to earning interest on a traditional savings account but potentially with higher returns. However, it{"'"}s important to remember that staking involves temporarily giving up control of your tokens and may come with associated risks, such as potential price volatility of the underlying assets or even smart contract bugs.
                    </Typography>
                    <Stack width={"100%"} height={"fit-content"} paddingX={8} marginY={"1rem"}>
                        <Typography variant="h6" component="h6" sx={{
                            fontWeight: 600
                        }}>
                            Nex Index Products
                        </Typography>
                        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={6} marginTop={"1.2rem"}>
                            <Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); setSelectedStakingIndex(anfiIndexObject) }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                                    <Image src={anfiIndexObject && anfiIndexObject.logo ? anfiIndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#E8BB31] rounded-full " />
                                    <Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
                                        <Typography variant="subtitle1" component="h6" sx={{
                                            fontWeight: 600
                                        }}>
                                            {anfiIndexObject?.name}
                                        </Typography>
                                        <Typography variant="caption" component="h6" sx={{
                                            fontWeight: 500
                                        }}>
                                            24h Change: <span style={{ color: Number(anfiIndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
                                        </Typography>
                                    </Stack>

                                </Stack>
                            </Link>
                            <Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); setSelectedStakingIndex(cr5IndexObject) }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                                    <Image src={cr5IndexObject && cr5IndexObject.logo ? cr5IndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#DA3E49] rounded-full " />
                                    <Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
                                        <Typography variant="subtitle1" component="h6" sx={{
                                            fontWeight: 600
                                        }}>
                                            {cr5IndexObject?.name}
                                        </Typography>
                                        <Typography variant="caption" component="h6" sx={{
                                            fontWeight: 500
                                        }}>
                                            24h Change: <span style={{ color: Number(cr5IndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
                                        </Typography>
                                    </Stack>

                                </Stack>
                            </Link>
                            <Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); setSelectedStakingIndex(mag7IndexObject) }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                                    <Image src={mag7IndexObject && mag7IndexObject.logo ? mag7IndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#D67DEC] rounded-full " />
                                    <Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
                                        <Typography variant="subtitle1" component="h6" sx={{
                                            fontWeight: 600
                                        }}>
                                            {mag7IndexObject?.name}
                                        </Typography>
                                        <Typography variant="caption" component="h6" sx={{
                                            fontWeight: 500
                                        }}>
                                            24h Change: <span style={{ color: Number(mag7IndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
                                        </Typography>
                                    </Stack>

                                </Stack>
                            </Link>
                            <Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); setSelectedStakingIndex(arbIndexObject) }}>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                                    <Image src={arbIndexObject && arbIndexObject.logo ? arbIndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#1E457A] rounded-full " />
                                    <Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
                                        <Typography variant="subtitle1" component="h6" sx={{
                                            fontWeight: 600
                                        }}>
                                            {arbIndexObject?.name}
                                        </Typography>
                                        <Typography variant="caption" component="h6" sx={{
                                            fontWeight: 500
                                        }}>
                                            24h Change: <span style={{ color: Number(arbIndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{arbIndexObject?.chg24h}%</span>
                                        </Typography>
                                    </Stack>

                                </Stack>
                            </Link>

                        </Stack>
                    </Stack>
                    <Stack width="100vw" height="fit-content" direction="row" alignItems="start" justifyContent="stretch" paddingX={8} gap={2} paddingTop={5}>
                        <Stack width="60%" height={"116vh"} borderRadius={"1rem"} flexGrow={1} sx={{ backgroundColor: "lightgray" }}>

                        </Stack>
                        <Stack width="35%" flexGrow={1}>
                            <StakingConsole generic={false} index={selectedStakingIndex?.symbol ? selectedStakingIndex?.symbol : "ANFI"} />
                        </Stack>
                    </Stack>
                    <Stack width="100vw" height="fit-content" direction="row" alignItems="start" justifyContent="center" paddingX={8} gap={2} paddingTop={5}>
                        <Stack width="50%" height={"fit-content"}>
                            <GenericStakingCard1 index={selectedStakingIndex?.symbol ? selectedStakingIndex?.symbol : "ANFI"} />
                        </Stack>
                        <Stack width="50%" height={"fit-content"}>
                            <GenericStakingCard2 index={selectedStakingIndex?.symbol ? selectedStakingIndex?.symbol : "ANFI"} />
                        </Stack>
                    </Stack>
                    <Typography variant="h6" component="h6" sx={{
                            fontWeight: 600,
                            paddingX: 8,
                            marginBottom: 2,
                            marginTop: 4
                        }}>
                            {selectedStakingIndex?.symbol} Staking Leaderboard
                        </Typography>
                    <Stack width="100vw" height="fit-content" direction="row" alignItems="start" justifyContent="center" paddingX={3} gap={2}>
                        <Stack width="95%" height={"fit-content"}>
                            <StakingLeaderBoard index={selectedStakingIndex?.symbol ? selectedStakingIndex?.symbol : "ANFI"} />
                        </Stack>
                    </Stack>


                </section>

                <div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
                    <Footer />
                </div>
                <div className='block xl:hidden'>
                    <MobileFooterSection />
                </div>
            </main>
        </>
    )
}
