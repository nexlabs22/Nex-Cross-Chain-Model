'use client'

import Image from 'next/image'
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

export default function Staking() {
    const { mode, theme } = useLandingPageStore()
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
                    <Stack width="100vw" minHeight={"100vh"} height="fit-content" direction="row" alignItems="start" justifyContent="center" paddingX={3} gap={2} paddingTop={5}>
                        <Stack width="50%" height={"fit-content"}>
                            <GenericStakingCard1 index='ANFI' />
                        </Stack>
                        <Stack width="50%" height={"fit-content"}>
                            <GenericStakingCard2 index='ANFI' />
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
