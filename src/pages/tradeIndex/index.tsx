import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import Swap from '@/components/Swap'
import RecieptsBox from '@/components/RecieptsBox'
import TradeChartBox from '@/components/TradeChart'
import NFTReceiptBox from '@/components/NFTReceiptBox'
import TipsBox from '@/components/TipsBox'
// import HistoryTable from '@/components/TradeTable'
import HistoryTable from '@/components/NewHistoryTable'
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
	const [connectedUserId, setConnectedUserId] = useState('')
	const [userFound, setUserFound] = useState(false)
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

	const [isTradePopUpOpen, setIsTradePopUpOpen] = useState(false)

	function closeTradePopUp() {
		setIsTradePopUpOpen(!isTradePopUpOpen)
	}

	const [showAgain, setShowAgain] = useState(false)
	const [acceptTerms, setAcceptTerms] = useState(false)

	const router = useRouter();

	async function dontShowAgain() {
		console.log(connectedUser)
		if (address && showAgain == true && acceptTerms == true) {
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
							{/*<NewTradeComponent />*/}
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
					<h5 className={`text-xl ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interBold mb-4`}>Dear trader, you should now:</h5>
					<p className={`text-sm ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium mb-4`}>
					Before interacting with the Nex Labs application, reading and understanding the official Nex Labs whitepaper and the applicable general terms and conditions is required.
					</p>
					<p className={`text-sm ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium mb-4`}>
					Our application is a frontend provided solely as an interface for user convenience in accessing certain decentralized smart contracts and does not represent or imply any responsibility for the underlying code and technology accessed. The application is not responsible for the accessed smart contracts’ accuracy, completeness, or reliability. We cannot guarantee the application’s performance or functionality.
					</p>
					<p className={`text-sm ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium mb-4`}>
					Our application is fully decentralized which means that Nex Labs does not own the funds of the user and is not responsible for the functioning of the smart contracts accessed via the application. Nex Labs is also not responsible for any loss or damages to the funds of the users or the functioning of the smart contracts of the application and the possible consequences of the (non) functioning of these smart contracts.
					</p>
					<p className={`text-sm ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium mb-4`}>
					The user is aware that crypto assets is a volatile asset and that trading in crypto assets or interacting with crypto assets or smart contracts may bring (financial) risks. Any interaction with the smart contracts, whether through the application or directly, is at the user’s own risk.
					</p>
					<div className="flex flex-row items-center justify-start gap-1 w-fit h-fit mb-2">
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
					<div className="flex flex-row items-center justify-start gap-1 w-fit h-fit mb-8">
						<input
							type="checkbox"
							name="showAgain"
							id=""
							checked={acceptTerms}
							onChange={(e) => {
								setAcceptTerms(!acceptTerms)
							}}
						/>
						<p className={`text-xs${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interMedium`}>I Accept Terms & Conditions, US Disclaimer and Privacy Policy</p>
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
