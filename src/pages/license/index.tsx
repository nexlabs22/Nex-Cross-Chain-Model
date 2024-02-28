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

export default function Licenses() {
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
				<section className="w-screen h-fit flex flex-col items-stretch justify-start px-10 pt-10 pb-12">
					<h5 className={` text-4xl interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>Our Licences</h5>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						Licences indicate collaborations with different third-party and players in the economic ecosystem (institutions, hi-tech companies ...) to ensure compliance with regulations, protect users from potential harm, and contribute to a more trustworthy financial environment. Without proper licenses, users risk legal repercussions and potentially engaging in unauthorized financial activities.
					</p>
					<div className={`w-full py-6 px-8 mt-10 rounded-xl flex-grow gap-3 flex flex-row items-center justify-between ${mode == "dark" ? " border-transparent bg-center bg-no-repeat" : "bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500 hover:from-colorFour-500 hover:to-colorSeven-500/90"}`}
						style={{
							boxShadow:
								mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
							backgroundImage: mode == "dark" ? `url('${mesh1.src}')` : "",
							backgroundSize: mode == "dark" ? `100% 100%` : "",
						}}
					>
						<div className='w-full lg:w-2/3 py-4 flex flex-col items-start justify-between gap-2'>
							<h5 className={`text-2xl interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>TradingView</h5>
							<Image src={tw} alt='tradingview' className={`lg:hidden h-20 mt-8 mb-4 w-auto ${mode == "dark" ? " invert" : ""}`}></Image>
							<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
								Nexlabs has partnered with TradingView, a top-tier charting and trading platform, to elevate your experience. Access advanced charting and market analysis tools, amplifying
								success and gaining valuable insights into
								<Link href="https://www.tradingview.com/markets/stocks-usa/market-movers-pre-market-gainers/">
									<em> financial markets</em>
								</Link>
								.
							</p>
							<Link href={'https://www.tradingview.com/'}>
								<button
									className={`interBold mt-4 flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-2xl bg-gradient-to-tl ${mode == "dark"
										? "titleShadow bg-cover bg-center bg-no-repeat text-whiteText-500"
										: "from-colorFour-500 to-colorSeven-500 text-blackText-500"
										}  px-5 py-3 text-2xl shadow-sm shadow-blackText-500 active:translate-y-[1px] active:shadow-black `}
									style={{
										backgroundImage: mode == "dark" ? `url('${mesh1.src}')` : "",
										boxShadow:
											mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
									}}
								>
									<span>Learn More</span>
									{
										mode == "dark" ? <GoArrowRight color="#FFFFFF" size={30} /> : <GoArrowRight color="#252525" size={30} />
									}

								</button>
							</Link>
						</div>
						<div className='hidden h-fit w-1/3 lg:flex flex-col items-center py-10 justify-center'>
							<Image src={tw} alt='tradingview' className={`h-32 w-auto ${mode == "dark" ? " invert" : ""}`}></Image>
						</div>

					</div>

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
