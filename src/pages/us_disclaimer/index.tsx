'use client'

import { useEffect, useState, useRef } from 'react'
import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { Menu, MenuButton } from '@szhsin/react-menu'
import { useLandingPageStore } from '@/store/store'

import mesh1 from '@assets/images/mesh1.png'
import tw from '@assets/images/tradingview.png'
import { GoArrowRight } from 'react-icons/go'

export default function USDisclaimer() {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - License</title>
				<meta name="description" content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main
				className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'text-[#F2F2F2] bg-gradient-to-tl from-[#050505] to-[#050505]' : 'text-[#2A2A2A] bg-whiteBackground-500'
					} p-0 overflow-x-hidden`}
			>

				<DappNavbar />
				<section className="w-screen h-fit flex flex-col items-stretch justify-start px-2 lg:px-10 pt-10 pb-12">
					<h5 className={` text-4xl interBold mb-6 ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>US Disclaimer</h5>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						Dear users,
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Please be advised that, in accordance with international regulations and the laws in force in the United States of America, our European investment and trading platform is not authorized to accept clients resident in the USA. Regulatory provisions, including but not limited to MiFID II and PRIIPs, impose specific restrictions that prevent US users from opening new positions or executing trades via our services.
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Our platform is committed to fully complying with applicable laws and regulations to ensure maximum transparency and security for all investors. Therefore, we are required to disclaim any form of registration or trading activity by citizens or residents of the United States.
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    For further information or clarification, please contact the relevant financial regulatory authorities in your country of residence.
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We thank you for your consideration and understand the importance of adhering to these important compliance measures.
					</p>

					{/* <div className="w-full xl:w-9/12 flex-grow flex flex-col "></div> */}
				</section>



				{/* <div className="w-full mx-auto h-0 px-2 flex flex-col items-start overflow-hidden justify-between">
				</div> */}

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
