import Image from 'next/image'

import Navbar from '@/components/Navbar'
import Swap from '@/components/Swap'
import TradeChartBox from '@/components/TradeChart'

export default function Trade() {
	return (
		<main className="flex h-screen w-screen bg-whiteBackground-500 flex-col items-center justify-start">
			<Navbar />
			<section className="w-full h-full flex flex-row items-center justify-start gap-2 p-5">
				<div className="w-9/12 h-full">
					<TradeChartBox />
				</div>
				<div className="w-3/12 h-full">
					<Swap />
				</div>
			</section>
		</main>
	)
}
