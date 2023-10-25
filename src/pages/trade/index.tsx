import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { toPng } from 'html-to-image'

import captureHtmlAsImage from '@/components/capture'

export default function Trade() {
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

	const ref = useRef<HTMLDivElement>(null)

	const captureImage = useCallback(() => {
		if (ref.current === null) {
			return
		}

		toPng(ref.current, { cacheBust: true })
			.then((dataUrl) => {
				const link = document.createElement('a')
				link.download = 'my-image-name.png'
				link.href = dataUrl
				link.click()
			})
			.catch((err) => {
				console.log(err)
			})
	}, [ref])

	

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
			<section className="w-full h-full flex flex-row items-center justify-start gap-2 p-5">
				<div className="w-9/12 h-full "></div>
				<div className="w-3/12 h-full flex flex-col items-center justify-start gap-2">
					<div className="w-full h-full rounded-xl border border-colorTwo-500/40 shadow shadow-colorTwo-500 flex flex-col items-start justify-start px-4 py-3">
						<h5 className="montrealBold text-blackText-500 text-base mb-5">Reciepts</h5>
						<div className='rounded-2xl overflow-hidden h-full w-full'>
						<div
							ref={ref}
							className=" w-full h-full bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center py-10 px-3 gap-14"
							style={{
								backgroundImage: `url('https://media.discordapp.net/attachments/981580623342862336/1166428923245121566/NEX_background_1.png?ex=654a7496&is=6537ff96&hm=8e8831a7fa9a16b5b3c6b33b045ca24b9aec4e5609411631df3281ce52ea3a9b&=&width=567&height=567')`,
							}}
						>
							<h5 className="montrealBold text-whiteText-500 text-xl">MINT TOKEN REQUEST</h5>
							<h5 className="montrealBold text-whiteText-500 text-xl">AMOUNT : 182K</h5>
							<h5 className="montrealBold text-whiteText-500 text-xl">TIME : 939723</h5>
						</div>
						</div>
						<div className="w-full h-fit cursor-pointer bg-colorOne-500 flex flex-row items-center justify-center my-5 rounded-xl py-3" onClick={()=>{captureImage()}}>
							<h5 className="montrealBold text-blackText-500 text-base">Get Image <small>(button for testing)</small> </h5>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
