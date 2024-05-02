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

export default function PrivacyPolicy() {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - Privacy Policy</title>
				<meta name="description" content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main
				className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'text-[#F2F2F2] bg-gradient-to-tl from-[#050505] to-[#050505]' : 'text-[#2A2A2A] bg-whiteBackground-500'
					} p-0 overflow-x-hidden`}
			>

				<DappNavbar />
				<section className="w-screen h-fit flex flex-col items-stretch justify-start px-4 lg:px-10 pt-10 pb-12">
					<h5 className={` text-4xl interBold mb-6 ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>Privacy Policy - NEX Labs</h5>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						This Privacy Policy describes NEXLABS{"'"} practices regarding the collection, use and protection of personal data as part of our decentralized cryptocurrency trading platform.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						The NEXLABS Protocol operates in a decentralized and permissionless manner, not collecting personal data directly from its users. Although we may collect and process information about users of nexlabs.io or the Interface in accordance with this Privacy Policy, we do not have information on all users of the protocol beyond what is already publicly available and recorded on the blockchain.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						This Privacy Policy (the “Privacy Policy”) explains how NEXLABS (“we,” “our,” or “us”) collects, uses and shares information in connection with our Services, and your rights and choices regarding that information. These terms apply to nexlabs.io and to the Interface and any other online locations that link to this Privacy Policy (collectively, the “Services”).
						By using the Services, you also agree to our collection, use and sharing of your information as described in this Privacy Policy. If you do not agree to the Terms of Use, you should not use or access the Interface or the Services.

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
