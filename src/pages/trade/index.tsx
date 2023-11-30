import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'

import captureHtmlAsImage from '@/components/capture'
import Head from 'next/head'
import SwapV2 from '@/components/SwapV2'

export default function Trade() {
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

	const operationTypeExample = 'MINT TOKEN REQUEST'
	const amountExample = '182K'
	const timeExample = 939723

	const ref = useRef<HTMLDivElement>(null)

	const captureImage = useCallback(() => {
		if (ref.current === null) {
			return
		}

		toSvg(ref.current, { cacheBust: true })
			.then((dataUrl) => {
				const link = document.createElement('a')
				link.download = 'my-image-name.png'
				link.href = dataUrl
				link.click()
				// Here, instead of using the click function to download  the image, u can use the dataUrl to create an Image obbect and upload to IPFS and then mint
			})
			.catch((err) => {
				console.log(err)
			})
	}, [ref])

	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="NexLabs: decentralized trading platform" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen h-fit w-screen bg-whiteBackground-500 flex-col items-center justify-start">
				<DappNavbar />
				<section className="w-full h-full flex flex-col lg:flex-row items-center justify-start gap-2 p-5">
					<div className="w-full lg:w-9/12 h-full ">
						<TradeChartBox />
					</div>
					<div className="w-full lg:w-3/12 h-full flex flex-col items-center justify-start gap-2">
						<div className="w-full h-full ">
							{/* <Swap /> */}
							<SwapV2 />
						</div>
					</div>
				</section>
				<section className="w-full h-full flex flex-col lg:flex-row items-center justify-start gap-2 p-5">
					<div className="w-full lg:w-9/12 h-full "></div>
					<div className="w-full lg:w-3/12 h-full flex flex-col items-center justify-start gap-2">
						<div className="w-full h-full rounded-xl shadow shadow-blackText-500 flex flex-col items-start justify-start px-4 py-3">
							<h5 className="interBlack text-blackText-500 text-base mb-5">Reciepts</h5>
							<div className="rounded-2xl overflow-hidden h-full w-full">
								<div
									ref={ref}
									className=" w-full h-full bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center py-10 px-3 gap-14"
									style={{
										backgroundImage: `url('https://media.discordapp.net/attachments/981580623342862336/1166428923245121566/NEX_background_1.png?ex=654a7496&is=6537ff96&hm=8e8831a7fa9a16b5b3c6b33b045ca24b9aec4e5609411631df3281ce52ea3a9b&=&width=567&height=567')`,
									}}
								>
									<h5 className="montrealBold text-whiteText-500 text-xl">{operationTypeExample}</h5>
									<h5 className="montrealBold text-whiteText-500 text-xl">AMOUNT : {amountExample}</h5>
									<h5 className="montrealBold text-whiteText-500 text-xl">TIME : {timeExample}</h5>
								</div>
							</div>
							<div
								className="w-full h-fit cursor-pointer bg-colorSeven-500 shadow shadow-blackText-500 flex flex-row items-center justify-center my-5 rounded-xl py-3"
								onClick={() => {
									captureImage()
								}}
							>
								<h5 className="montrealBold text-white titleShadow interBold text-base">
									Get Image <small>(button to test the )</small>{' '}
								</h5>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
