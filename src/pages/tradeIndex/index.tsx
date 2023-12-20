import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'
import NFTReceiptBox from '@/components/NFTReceiptBox'
import TipsBox from '@/components/TipsBox'
import HistoryTable from '@/components/TradeTable'
import useTradePageStore from '@/store/tradeStore'
import { useRouter } from 'next/router';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'

import captureHtmlAsImage from '@/components/capture'
import Head from 'next/head'
import SwapV2 from '@/components/SwapV2'

export default function Trade() {

	const { selectedTradingCategory } = useTradePageStore()


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
				<meta
					name="description"
					content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen h-fit w-screen bg-whiteBackground-500 flex-col items-center justify-start">
				<DappNavbar />
				<section className="w-full h-full flex flex-col lg:flex-row items-stretch justify-start gap-2 p-5">
					<div className="w-full lg:w-9/12 flex-grow">
						<TradeChartBox />
					</div>
					<div className="w-full lg:w-3/12 h-full flex flex-col items-center justify-start gap-2">
						<div className="w-full h-full ">
							{/* <Swap /> */}
							<SwapV2 />
						</div>
					</div>
				</section>
				<section className="w-full h-full flex flex-col lg:flex-row items-stretch justify-start gap-2 px-5 pb-5">
					<div className="w-full lg:w-9/12 flex-grow">
						<HistoryTable />
					</div>
					<div className="w-full lg:w-3/12 flex flex-col items-center justify-start gap-2">
						<div className="w-full">{selectedTradingCategory == 'cefi' ? <NFTReceiptBox /> : <TipsBox />}</div>
					</div>
				</section>
			</main>
		</>
	)
}
