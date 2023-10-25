'use client'

import DappNavbar from '@/components/DappNavbar'
import { LifiWidget } from '@components/LifiWidget'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

import bg from '@assets/images/3d hologram.png'



export default function Portfolio() {
	return (
		<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
			<section className="h-full w-fit overflow-x-hidde">
				<DappNavbar />
				<section className="w-screen h-fit overflow-x-hidden flex flex-row items-center justify-center pt-10">
					
					
					
				</section>
			</section>

			<div className='w-fit h-fit pt-16'>
			<Footer />
			</div>
		</main>
	)
}
