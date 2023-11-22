'use client'

import DappNavbar from '@/components/DappNavbar'
import { LifiWidget } from '@components/LifiWidget'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

import bg from '@assets/images/3d hologram.png'
import Head from 'next/head'

export const LiFiWidgetNext = dynamic(() => import('@/components/LifiWidget').then((module) => module.LifiWidget) as any, {
	ssr: false,
	loading: () => (
		<div className="h-screen xl:h-[80vh] w-full flex flex-row items-center justify-center">
			<h5 className="text-xl text-blackText-500 interBlack">Loading ...</h5>
		</div>
	),
})

export default function Convert() {
	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="NexLabs: decentralized trading platform" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit overflow-x-hidden flex flex-row items-center justify-center px-4 pt-10">
						<LiFiWidgetNext></LiFiWidgetNext>
					</section>
				</section>

				<div className="w-fit h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
			</main>
		</>
	)
}
