import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'
import NFTReceiptBox from '@/components/NFTReceiptBox'
import TipsBox from '@/components/TipsBox'
import HistoryTable from '@/components/TradeTable'
import useTradePageStore from '@/store/tradeStore'
import { useAddress } from '@thirdweb-dev/react'
import { useRouter } from 'next/router';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'

import captureHtmlAsImage from '@/components/capture'
import GenericModal from '@/components/GenericModal'
import Head from 'next/head'
import SwapV2Cefi from '@/components/SwapV2Cefi'
import SwapV2Defi from '@/components/SwapV2Defi'
import NewTradeComponent from '@/components/newTradeComponent'
import usePortfolioPageStore from '@/store/portfolioStore'
// Firebase :
import { getDatabase, ref, onValue, set, update, push, child } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useLandingPageStore } from '@/store/store'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'

interface User {
	email: string
	inst_name: string
	main_wallet: string
	name: string
	vatin: string
	address: string
	ppLink: string
	p1: boolean
	p2: boolean
	p3: boolean
	p4: boolean
	p5: boolean
	ppType: string
	creationDate: string
	showTradePopUp: boolean
}

export default function Trade() {
	const { selectedTradingCategory } = useTradePageStore()
	const { mode } = useLandingPageStore()

	const address = useAddress()
	const [connectedUser, setConnectedUser] = useState<User>({
		name: 'null',
		email: 'null',
		address: 'null',
		inst_name: 'null',
		main_wallet: 'null',
		vatin: 'null',
		ppLink: 'null',
		ppType: '',
		p1: false,
		p2: false,
		p3: false,
		p4: false,
		p5: false,
		creationDate: 'null',
		showTradePopUp: true,
	})
	const [connectedUserId, setConnectedUserId] = useState<String>('')
	const [userFound, setUserFound] = useState<boolean>(false)
	const { globalConnectedUser, setGlobalConnectedUser } = usePortfolioPageStore()

	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

	const operationTypeExample = 'MINT TOKEN REQUEST'
	const amountExample = '182K'
	const timeExample = 939723

	const reference = useRef<HTMLDivElement>(null)

	const captureImage = useCallback(() => {
		if (reference.current === null) {
			return
		}

		toSvg(reference.current, { cacheBust: true })
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
	}, [reference])

	const [isTradePopUpOpen, setIsTradePopUpOpen] = useState<boolean>(false)

	function closeTradePopUp() {
		setIsTradePopUpOpen(!isTradePopUpOpen)
	}

	const [showAgain, setShowAgain] = useState<boolean>(false)

	const router = useRouter();

	async function dontShowAgain() {
		console.log(connectedUser)
		if (address) {
			update(ref(database, 'users/' + connectedUserId), {
				showTradePopUp: false
			})
		}
	}

	useEffect(() => {

		async function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				if (address) {
					for (const key in users) {
						console.log(users[key])
						const potentialUser: User = users[key]
						if (potentialUser.main_wallet == address) {
							setConnectedUser(potentialUser)
							setGlobalConnectedUser(potentialUser)
							setConnectedUserId(key)
							localStorage.setItem('connectedUserKey', key)
							setIsTradePopUpOpen(potentialUser.showTradePopUp)
						}
					}
				}
			})
		}


		if (address) {
			getUser()
		} else {
			setIsTradePopUpOpen(true)
		}
	}, [address, setGlobalConnectedUser])

	return (
		<>
			<Head>
				<title>Nex Labs - Trade</title>
				<meta
					name="description"
					content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`flex min-h-screen h-fit w-screen  ${mode == "dark" ? "bg-gradient-to-tl from-[#050505] to-[#050505]" : "bg-whiteBackground-500"} flex-col items-center justify-start`}>
				<DappNavbar tradeNavbar={true} />
				<section className="w-full h-fit  flex flex-col lg:flex-row items-center lg:items-stretch justify-start gap-2 p-5">
					<div className="w-full lg:w-9/12  flex-grow">
						<TradeChartBox />
					</div>
					<div className="w-full lg:w-3/12 flex-grow flex flex-col items-stretch justify-start gap-2">
						<div className="w-full h-fit ">
							{/* <Swap /> */}
							{
								selectedTradingCategory == "cefi" ? <SwapV2Cefi /> : <SwapV2Defi />
							}
							<div className='flex-grow-1'>
							{/* <NewTradeComponent /> */}
							</div>
							
						</div>
					</div>
				</section>
				<section className="w-full h-fit flex flex-col lg:flex-row items-stretch justify-start gap-2 px-5 pb-5">
					<div className="w-full lg:w-9/12 flex-grow ">
						<HistoryTable />
					</div>
					<div className="w-full flex-grow lg:w-3/12 flex flex-col items-center justify-start gap-2">
						{selectedTradingCategory == 'cefi' ? <TipsBox /> : <TipsBox />}
					</div>
				</section>
			</main>
			<GenericModal isOpen={isTradePopUpOpen} onRequestClose={closeTradePopUp}>
				<div className="w-full h-fit px-3">
					<h5 className={`text-xl ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interBold mb-4`}>Terms & Conditions</h5>
					<p className={`text-sm ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium mb-4`}>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
						beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
						nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
						aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
						iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
					</p>
					<div className="flex flex-row items-center justify-start gap-1 w-fit h-fit mb-8">
						<input
							type="checkbox"
							name="showAgain"
							id=""
							checked={showAgain}
							onChange={(e) => {
								setShowAgain(!showAgain)
							}}
						/>
						<p className={`text-xs${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium`}>Don{"'"}t show again</p>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-end gap-2 mb-2 mt-4">
						<button
							onClick={() => {
								router.push('/')
							}}
							className="text-base text-blackText-500/50 interBold bg-gray-300 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-fit px-4 py-2 rounded-lg"
						>
							Decline
						</button>
						<button
							onClick={() => {
								closeTradePopUp()
								if (showAgain) dontShowAgain()
							}}
							className={`text-base cursor-pointer text-white titleShadow interBold ${mode == "dark" ? "bg-cover border-transparent bg-center bg-no-repeat" : "bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500 hover:from-colorFour-500 hover:to-colorSeven-500/90"} active:translate-y-[1px] active:shadow-black w-fit px-4 py-2 rounded-lg `}
							style={{
								boxShadow:
									mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
								backgroundImage: mode == "dark" ? `url('${mesh1.src}')` : "",
							}}
						>
							Accept
						</button>
					</div>

				</div>
			</GenericModal>
		</>
	)
}
