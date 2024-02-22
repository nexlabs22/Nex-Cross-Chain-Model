'use client'

import { useEffect, useState, useRef } from 'react'
import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Head from 'next/head'
import { Menu, MenuButton } from '@szhsin/react-menu'
import { useLandingPageStore } from '@/store/store'

export default function Licenses() {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - Licenses</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'text-[#F2F2F2] bg-gradient-to-tl from-[#050505] to-[#050505]' : 'text-[#2A2A2A] bg-whiteBackground-500'} p-0 overflow-x-hidden`}>
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit flex flex-col items-stretch justify-start px-4 pt-10 pb-12">
						<div className="w-full p-10 flex-grow flex flex-col  justify-between">
							<strong className='text-2xl'>Trading View</strong>
							<p>
								Nexlabs has partnered with TradingView, a top-tier charting and trading platform, to elevate your experience. Access advanced charting and market analysis tools, amplifying
								success and gaining valuable insights into financial markets.
							</p>
						</div>
						{/* <div className="w-full xl:w-9/12 flex-grow flex flex-col "></div> */}
					</section>
					<section className="w-full h-fit px-4 overflow-hidden lg:px-10 flex flex-col items-center justify-start gap-3">
						<div className="flex flex-row ml-auto z-10 w-full"></div>

						<div className="w-full h-full overflow-hidden"></div>
					</section>
				</section>

				{/* <div className="w-full mx-auto h-0 px-2 flex flex-col items-start overflow-hidden justify-between">
				</div> */}

				<div className="w-fit h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
			</main>
		</>
	)
}
