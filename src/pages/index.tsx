import { type NextPage } from 'next'
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import { GoArrowRight } from 'react-icons/go'
import bg2 from '@assets/images/dca3.png'

const Dashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="NexLabs decentralized trading platform allows seamless crypto swapping, trading, and index tracking. Learn how this innovative platform is making decentralized finance more accessible and transparent." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="m-0 h-screen w-screen bg-whiteBackground-500 p-0 overflow-x-hidden">
				<DappNavbar />
				<TopIndexData />
				<div className="w-full h-10 bg-transparent"></div>
				<section className="w-screen h-fit flex flex-col items-center justify-center px-4 xl:px-9 pb-10">
						<div className=" relative w-full overflow-hidden h-fit bg-gradient-to-bl from-colorFive-500 to-colorSeven-500 rounded-xl px-6 py-6">
							<div className="absolute overflow-hidden w-full h-full -right-10 xl:top-0 xl:right-0 z-10 flex flex-row items-center justify-normal">
								<div className="hidden xl:block w-1/2 h-full"></div>
								<div
									className="w-full xl:w-1/2 h-full bg-no-repeat xl:cefiCsDefiAnimated"
									style={{
										backgroundImage: `url('${bg2.src}')`,
										backgroundSize: "50%",
										backgroundPositionX: '80%',
										backgroundPositionY: '30%'
									}}
								></div>
							</div>
							<div className="relative top-0 left-0 z-40 xl:bg-transparent ">
								<h5 className="interBold text-whiteText-500 titleShadow text-4xl mb-6">DCA Calculator</h5>
								<p className="interMedium text-whiteText-500 text-base w-full xl:w-1/2 mb-3">
								Explore our Dollar Cost Averaging (DCA) Calculator, a strategic tool designed for investors aiming to mitigate market volatility and enhance portfolio growth. This calculator enables a disciplined investment approach by automating the DCA strategy, which involves regular, fixed-amount investments.

								</p>
								<Link href={'/dcaCalculator'}>
									<button className="h-fit w-fit flex flex-row items-center justify-center gap-1 bg-white shadow rounded-md px-4 py-1 interBold text-blackText-500 text-base">
										<span>Learn More </span>
										<GoArrowRight color="#5E869B" size={30} />
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
