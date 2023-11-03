import { type NextPage } from 'next'
import { Metadata } from 'next'

// Components

// import Navbar from "@components/Navbar";
import DappNavbar from '@components/DappNavbar'
import TopIndexData from '@components/dashboard/TopIndexData'
import Footer from '@components/Footer'

const Dashboard: NextPage = () => {
	return (
			<main className="m-0 h-screen w-screen bg-whiteBackground-500 p-0 overflow-x-hidden">
				<DappNavbar />
				<TopIndexData />
				<div className='w-full h-10 bg-transparent'></div>
				<Footer />
			</main>
	)
}

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Overview of spot index trading products',
}

export default Dashboard
