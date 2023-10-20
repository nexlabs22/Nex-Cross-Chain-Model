import Image from 'next/image'

import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'


export default function Trade() {
	return (
		<main className="flex min-h-screen h-fit w-screen bg-whiteBackground-500 flex-col items-center justify-start">
			<DappNavbar />
			<section className="w-full h-full flex flex-row items-center justify-start gap-2 p-5">
				<div className="w-9/12 h-full ">
					<TradeChartBox />
				</div>
				<div className="w-3/12 h-full flex flex-col items-center justify-start gap-2">
					<div className="w-full h-full ">
						<Swap />
					</div>
				</div>
			</section>
		</main>
	)
}
