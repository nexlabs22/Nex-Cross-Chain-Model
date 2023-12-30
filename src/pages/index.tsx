import { type NextPage } from 'next'
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@components/Footer'
import Head from 'next/head'

const Dashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
				<meta
					name="description"
					content="NexLabs decentralized trading platform allows seamless crypto swapping, trading, and index tracking. Learn how this innovative platform is making decentralized finance more accessible and transparent."
				/>
				<link rel="icon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<main className="m-0 h-screen w-screen bg-whiteBackground-500 p-0 overflow-x-hidden">
				<DappNavbar />
				<TopIndexData />
				<div className="w-full h-10 bg-transparent"></div>
				<Footer />
			</main>
		</>
	)
}

export default Dashboard
