import { type NextPage } from 'next'
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import { GoArrowRight } from 'react-icons/go'
import bg2 from '@assets/images/dca3.png'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
import { useEffect } from 'react'
import axios from 'axios'

const Dashboard: NextPage = () => {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - Dashboard</title>
				<meta
					name="description"
					content="NexLabs decentralized trading platform allows seamless crypto swapping, trading, and index tracking. Learn how this innovative platform is making decentralized finance more accessible and transparent."
				/>
				<link rel="icon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<main className={`m-0 h-screen w-screen ${mode == 'dark' ? 'bg-gradient-to-tl from-[#050505] to-[#050505]' : 'bg-whiteBackground-500'} p-0 overflow-x-hidden`}>
				<DappNavbar />
				<TopIndexData />
				<section className="w-screen h-fit flex flex-col items-center justify-center px-4 xl:px-9 pb-10 md:pb-2 xl:pb-10">
					<div
						className={`relative w-full overflow-hidden h-fit ${mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-bl from-colorFive-500 to-colorSeven-500'
							} rounded-xl px-6 py-6`}
						style={{
							boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
							backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
							backgroundSize: mode == "dark" ? "100% 100%" : ""
						}}
					>
						<div className="absolute overflow-hidden w-full h-full -right-10 xl:top-0 xl:right-0 z-10 flex flex-row items-center justify-normal">
							<div className="hidden xl:block w-1/2 h-full"></div>
							<div
								className="w-full hidden md:block xl:w-1/2 h-full bg-no-repeat xl:cefiCsDefiAnimated"
								style={{
									backgroundImage: `url('${bg2.src}')`,
									backgroundSize: '45%',
									backgroundPositionX: '80%',
									backgroundPositionY: '35%',
								}}
							></div>
							<div
								className="w-full block md:hidden xl:w-1/2 h-full bg-no-repeat xl:cefiCsDefiAnimated"
								style={{
									backgroundImage: `url('${bg2.src}')`,
									backgroundSize: '55%',
									backgroundPositionX: '90%',
									backgroundPositionY: '98%',
								}}
							></div>
						</div>
						<div className="relative top-0 left-0 z-40 xl:bg-transparent ">
							<h5 className={`interBold titleShadow mb-12 text-4xl ${mode != "dark" ? " text-blackText-500" : " text-whiteBackground-500"} `}>
								CeFi vs DeFi
							</h5>
							<p className={`interMedium mb-4 w-1/2 text-xl ${mode != "dark" ? " text-blackText-500" : " text-whiteBackground-500"}`}>

								Let{"'"}s explore <span className="interBold">CeFi</span>, where traditional banks and institutions manage your money against <span className="interBold">DeFi</span>, where technology lets people handle their finances without middlemen.
							</p>
							<Link href={'/dcaCalculator'}>
								<button
									className={`interBold mt-8 mb-4 flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-2xl bg-gradient-to-tl ${mode == "dark"
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
					</div>
				</section>
				<Footer />
			</main>
		</>
	)
}

export default Dashboard
