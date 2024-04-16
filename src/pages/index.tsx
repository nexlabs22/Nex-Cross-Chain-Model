import { GetServerSideProps, GetServerSidePropsContext, type NextPage } from 'next'
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@/components/newFooter'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GoArrowRight } from 'react-icons/go'
import bg2 from '@assets/images/dca3.png'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
import { useEffect, useState } from 'react'
import axios from 'axios'
import DCASection from '@/components/DCASection'
import PWAIcon from '@assets/images/PWAIcon.png'
import MobileFooterSection from '@/components/mobileFooter'
import { Stack, Box, Typography, Button } from "@mui/material";
import { MainStack } from '@/theme/overrides'
import PWASplashScreen from '@/components/pwa/PWASplashScreen'

function isStandaloneFromUserAgent(userAgent: string): boolean {
	// You can check for specific keywords or patterns in the user agent string
	// This is a basic example, consider improving the logic for better accuracy
	return userAgent.includes('(standalone)') || userAgent.includes('(iPhone; standalone)');
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { req } = context; // Access request object
	const isStandalone = context.req?.headers['user-agent']; // Get user agent from request headers

	// Implement logic to check for standalone mode based on user agent (might not be foolproof)
	//const isStandalone = isStandaloneFromUserAgent(userAgent);

	return {
		props: {
			isStandalone,
		},
	};
}

const Dashboard: NextPage = ({ initialStandalone = false }: { initialStandalone?: boolean }) => {
	const { mode } = useLandingPageStore()
	const [isStandalone, setIsStandalone] = useState(initialStandalone);
	const [os, setOs] = useState<String>("")
	const [browser, setBrowser] = useState<String>("")

	function detectMobileBrowserOS() {
		const userAgent = navigator.userAgent;

		let browser: string | undefined;
		let os: string | undefined;

		browser = ""
		os = ""
		// Check for popular mobile browsers
		if (/CriOS/i.test(userAgent)) {
			browser = 'Chrome';
		} else if (/FxiOS/i.test(userAgent)) {
			browser = 'Firefox';
		} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
			browser = 'Safari';
		}

		// Check for common mobile operating systems
		if (/iP(ad|hone|od)/i.test(userAgent)) {
			os = 'iOS';
		} else if (/Android/i.test(userAgent)) {
			os = 'Android';
		}

		setOs(os.toString());
		setBrowser(browser.toString())
	}

	useEffect(() => {
		detectMobileBrowserOS()
	}, [])

	useEffect(() => {
		// Client-side detection using window.matchMedia (optional)
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(display-mode: standalone)');
			const handleChange = (event: MediaQueryListEvent) => setIsStandalone(event.matches);
			mediaQuery.addEventListener('change', handleChange);
			setIsStandalone(mediaQuery.matches); // Set initial client-side state
			//alert(mediaQuery.matches)
			return () => mediaQuery.removeEventListener('change', handleChange);
		}
	}, []);

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
			{
				isStandalone ? (
					<PWASplashScreen></PWASplashScreen>
				) : (
					<>
						
						<Box margin={0} height={"100vh"} width={"100vw"} padding={0} sx={MainStack} display={{ xs: "none", lg: "block" }}>
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
												backgroundSize: '40%',
												backgroundPositionX: '90%',
												backgroundPositionY: '100%',
											}}
										></div>

									</div>
									<div className="relative top-0 left-0 z-40 xl:bg-transparent ">
										<h5 className={`interBold titleShadow mb-12 text-4xl ${mode != "dark" ? " text-blackText-500" : " text-whiteBackground-500"} `}>
											DCA Calculator
										</h5>
										<p className={`interMedium mb-4 w-11/12 md:w-7/12 text-xl ${mode != "dark" ? " text-blackText-500" : " text-whiteBackground-500"}`}>

											Explore our Dollar Cost Averaging (DCA) Calculator, a strategic tool designed for investors aiming to mitigate market volatility and enhance portfolio growth. This calculator
											enables a disciplined investment approach by automating the DCA strategy, which involves regular, fixed-amount investments.
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
							<div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
								<Footer />
							</div>
							<div className='block xl:hidden'>
								<MobileFooterSection />
							</div>
						</Box>
						<Box display={{ xs: "flex", lg: "none" }} height={"100vh"} width={"100vw"} bgcolor={"#FFFFFF"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
							<Stack height={"100%"} width={"100%"} bgcolor={"rgba(50,50,50,0.4)"} direction={"row"} alignItems={"center"} justifyContent={"center"}>
								<Stack paddingX={2} paddingY={3} direction={"column"} alignItems={"center"} justifyContent={"center"} width={"90%"} height={"fit-content"} bgcolor={"#FFFFFF"} borderRadius={"1.75rem"} boxShadow={"boxShadow: rgba(0, 0, 0, 0.68) 0px 0px 6px 1px"}>

									<Image src={PWAIcon} alt="pwa" className="w-7/12 h-auto"></Image>
									<Typography variant="h3" align='center' sx={{
										color: "#000000",
										fontSize: "1.4rem"

									}}>
										Add To Home Screen
									</Typography>
									<Typography variant="subtitle2" width={"90%"} align='center' sx={{
										color: "#000000",

									}}>
										Install the Nex Labs app to enjoy a better mobile experience.
									</Typography>
									<Typography marginTop={1} variant="subtitle2" width={"90%"} align='center' sx={{
										color: "#000000",

									}}>
										{
											os == "iOS" && browser == "Safari" ?
												(
													<span>
														In Your Safari Browser, tap the share icon an choose <strong>Add To Homescreen</strong> then open the Nex Labs app from your homescreen.
													</span>
												)
												:
												(
													<span>
														In the settings menu of your browser, choose <strong>Install App</strong> or <strong>Add To Homescreen</strong> then open the Nex Labs app from your homescreen.
													</span>
												)
										}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					</>
				)

			}
		</>
	)
}

export default Dashboard
