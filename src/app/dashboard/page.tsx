import { type NextPage } from 'next'
import Head from 'next/head'

// Components

// import Navbar from "@components/Navbar";
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@components/Footer'

const Dashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="NexLabs: decentralized trading platform" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="m-0 h-screen w-screen bg-whiteBackground-500 p-0 overflow-x-hidden">
				<DappNavbar />
				<TopIndexData />
				<Footer />
			</main>
		</>
	)
}

export default Dashboard
