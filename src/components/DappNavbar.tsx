import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import useTradePageStore from '@/store/tradeStore'
import { Menu as NavMenu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import HoverMenuWithTransition from './popper'
import usePortfolioPageStore from '@/store/portfolioStore'
import { BiChevronRight, BiChevronDown } from 'react-icons/bi'
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
import { BsSearch } from 'react-icons/bs'

import { BiMenuAltRight } from 'react-icons/bi'
import { CiMenuFries } from 'react-icons/ci'
import { AiOutlineClose } from 'react-icons/ai'
import ConnectButton from './ConnectButton'

import logo1 from '@assets/images/logo1.png'
import logo2 from '@assets/images/logo2.png'
import xlogo from '@assets/images/xlogo_s.png'

import { Menu, SubMenu, Item } from 'burger-menu'
import 'burger-menu/lib/index.css'
import { useConnectionStatus, useAddress } from '@thirdweb-dev/react'

// Firebase :
import { getDatabase, ref, onValue, set, update, push, child } from 'firebase/database'
import Search from './Search'
import { database } from '@/utils/firebase'
import GenericModal from './GenericModal'
import { PoweredBy } from 'react-instantsearch'

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

interface DappNavbarProps {
	lightVersion?: boolean
	tradeNavbar?: boolean
}

const DappNavbar: React.FC<DappNavbarProps> = ({ lightVersion, tradeNavbar }) => {
	const { mode, changeMode, setSearchModal, isSearchModalOpen } = useLandingPageStore()

	function toggleMode() {
		if (mode == 'dark') changeMode('light')
		if (mode == 'light') changeMode('dark')
	}

	const { globalConnectedUser, setGlobalConnectedUser } = usePortfolioPageStore()
	const { openMobileMenu, setOpenMobileMenu, selectedTradingCategory } = useTradePageStore()
	const [subMenuOpen, setSubMenuOpen] = useState(false)

	const connectionStatus = useConnectionStatus()
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

	useEffect(() => {
		async function findUser(): Promise<boolean> {
			var found: boolean = false
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				if (address) {
					for (const key in users) {
						const potentialUser: User = users[key]
						if (potentialUser.main_wallet == address) {
							found = true
							setUserFound(true)
							setConnectedUser(potentialUser)
							setGlobalConnectedUser(potentialUser)
							setConnectedUserId(key)
							localStorage.setItem('connectedUserKey', key)
						}
					}
				}
			})
			return found
		}

		async function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				if (address) {
					for (const key in users) {
						const potentialUser: User = users[key]
						if (potentialUser.main_wallet == address) {
							setConnectedUser(potentialUser)
							setGlobalConnectedUser(potentialUser)
							setConnectedUserId(key)
							localStorage.setItem('connectedUserKey', key)
						}
					}
				}
			})
		}

		async function createNewUser() {
			const todayDate = new Date()
			let day = todayDate.getDate()
			let month = todayDate.getMonth() + 1
			let year = todayDate.getFullYear()
			let creationDate = `${day}-${month}-${year}`
			const newUserKey = push(child(ref(database), 'users')).key
			set(ref(database, 'users/' + newUserKey), {
				name: 'Nex User',
				isRetailer: false,
				email: '',
				address: '',
				inst_name: 'Nex User',
				main_wallet: address?.toString(),
				vatin: '',
				ppLink: '',
				ppType: 'identicon',
				p1: false,
				p2: false,
				p3: false,
				p4: false,
				p5: false,
				creationDate: creationDate,
				showTradePopUp: true,
			})
		}

		async function userLogic() {
			let isUserFound = await findUser().then(async () => {
				if (localStorage.getItem('connectedUserKey')) {
					getUser()
				} else {
					await createNewUser().then(() => {
						getUser()
					})
				}
			})
		}

		if (address) userLogic()
	}, [address, setGlobalConnectedUser])

	function handleClose() {
		setSearchModal(!isSearchModalOpen)
	}

	/*useEffect(() => {
		function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				if (connectionStatus == 'connected' && address) {
					for (const key in users) {
						console.log(users[key])
						const potentialUser: User = users[key]
						if (potentialUser.main_wallet == address) {
							setConnectedUser(potentialUser)
							setConnectedUserId(key)
						}
					}
				}
			})
		}
		if(address) {
			getUser()
			if (connectedUser.main_wallet == 'null') {
				const newUserKey = push(child(ref(database), 'users')).key
				set(ref(database, 'users/' + newUserKey), {
					name: 'Nex User',
					email: '',
					address: '',
					inst_name: 'Nex User',
					main_wallet: address?.toString(),
					vatin: '',
					ppLink: '',
					ppType: 'identicon',
					p1: false,
					p2: false,
					p3: false,
					p4: false,
					p5: false,
					creationDate: 'null',
				})
				setConnectedUser({
					name: 'Nex User',
					email: '',
					address: '',
					inst_name: 'Nex User',
					main_wallet: address?.toString(),
					vatin: '',
					ppLink: '',
					ppType: 'identicon',
					p1: false,
					p2: false,
					p3: false,
					p4: false,
					p5: false,
					creationDate: 'null',
				})
			}
		}
		
		
	}, [address])*/

	return (
		<section className="flex h-fit w-screen flex-row items-center justify-between px-4 py-4 lg:px-10 lg:py-6 relative z-50">
			<Link href={'https://www.nexlabs.io/'}>
				<div className="flex flex-row items-center justify-between">
					<div className=" mr-2 h-fit w-fit">
						<Image src={xlogo} alt="nex labs logo" className={`w-12 brightness-[0.65] ${mode == 'dark' || lightVersion ? 'brightness-[0] invert' : ''} drop-shadow-sm`}></Image>
					</div>
				</div>
			</Link>

			<div className="h-fit w-fit flex flex-row items-center justify-end gap-2 lg:hidden">
				<button
					className={`h-fit w-fit rounded-xl bg-gradient-to-tl ml-2 ${
						mode == 'dark'
							? tradeNavbar && selectedTradingCategory == 'cefi'
								? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
								: ' shadow-green-200 active:shadow-gray-500 bg-center bg-cover bg-no-repeat'
							: tradeNavbar && selectedTradingCategory == 'cefi'
							? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
							: 'from-colorFour-500 to-colorSeven-500 shadow-blackText-500 active:shadow-black'
					} p-2 shadow-sm  active:translate-y-[1px]`}
					onClick={toggleMode}
					style={{
						backgroundImage: mode == 'dark' && selectedTradingCategory != 'cefi' ? `url('${mesh1.src}')` : '',
						boxShadow: mode == 'dark' && !tradeNavbar && selectedTradingCategory != 'cefi' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
					}}
				>
					{mode == 'light' ? <IoSunnyOutline color="#F2F2F2" size={22} /> : <IoMoonOutline color="#F2F2F2" size={22} />}
				</button>
				{mode == 'dark' ? (
					<CiMenuFries
						color="#FFFFFF"
						size="30"
						onClick={() => {
							setOpenMobileMenu(true)
						}}
					/>
				) : (
					<CiMenuFries
						color="#2A2A2A"
						size="30"
						onClick={() => {
							setOpenMobileMenu(true)
						}}
					/>
				)}
			</div>
			<div className="hidden flex-row items-center justify-start lg:visible lg:flex">
				<div className="flex flex-row items-center justify-evenly">
					<Link href={'/'}>
						<h5 className={`interMedium font-base mr-8 ${mode == 'dark' || lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Dashboard</h5>
					</Link>
					<Link href={'/trade'}>
						<h5 className={`interMedium font-base mr-8 ${mode == 'dark' || lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Trade</h5>
					</Link>
					<Link href={'/convert'}>
						<h5 className={`interMedium font-base mr-8 ${mode == 'dark' || lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Convert</h5>
					</Link>
					<HoverMenuWithTransition key={0} menuItem="item" lightV={lightVersion} />
				</div>
				{/* <div
					onClick={() => {
						setSearchModal(!isSearchModalOpen)
					}}
					className='m-5'
				>
					<BsSearch />
				</div> */}
				{/* < Search /> */}
				{/* <div className=" montrealBold rounded-xl bg-colorOne-500 px-4 pb-3 pt-4 text-lg text-whiteText-500">Connect wallet</div> */}
				<ConnectButton tradeNavbarButton={tradeNavbar} />
				<button
					className={`h-fit w-fit rounded-xl bg-gradient-to-tl ml-2 ${
						mode == 'dark'
							? tradeNavbar && selectedTradingCategory == 'cefi'
								? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
								: ' shadow-green-200  active:shadow-gray-500 bg-center bg-cover bg-no-repeat'
							: tradeNavbar && selectedTradingCategory == 'cefi'
							? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
							: 'from-colorFour-500 to-colorSeven-500 shadow-blackText-500 active:shadow-black'
					} p-3 shadow-sm  active:translate-y-[1px]`}
					onClick={() => {
						setSearchModal(!isSearchModalOpen)
					}}
					style={{
						backgroundImage: mode == 'dark' ? (tradeNavbar && selectedTradingCategory == 'cefi' ? '' : `url('${mesh1.src}')`) : ``,
						boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
					}}
				>
					{mode == 'light' ? <BsSearch color="#F2F2F2" size={25} /> : <BsSearch color="#F2F2F2" size={25} />}
				</button>
				<button
					className={`h-fit w-fit rounded-xl bg-gradient-to-tl ml-2 ${
						mode == 'dark'
							? tradeNavbar && selectedTradingCategory == 'cefi'
								? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
								: ' shadow-green-200  active:shadow-gray-500 bg-center bg-cover bg-no-repeat'
							: tradeNavbar && selectedTradingCategory == 'cefi'
							? 'shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]'
							: 'from-colorFour-500 to-colorSeven-500 shadow-blackText-500 active:shadow-black'
					} p-3 shadow-sm  active:translate-y-[1px]`}
					onClick={toggleMode}
					style={{
						backgroundImage: mode == 'dark' ? (tradeNavbar && selectedTradingCategory == 'cefi' ? '' : `url('${mesh1.src}')`) : ``,
						boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
					}}
				>
					{mode == 'light' ? <IoSunnyOutline color="#F2F2F2" size={25} /> : <IoMoonOutline color="#F2F2F2" size={25} />}
				</button>
			</div>
			<GenericModal isOpen={isSearchModalOpen} onRequestClose={handleClose}>
				<Search />
			</GenericModal>
			<Menu isOpen={openMobileMenu} className={`${mode == 'dark' ? 'dark-menu-wrap' : ''}`}>
				<div className="w-full h-fit pt-4">
					<div className="flex flex-row items-center justify-end px-3 pt-3">
						<AiOutlineClose
							color="#2A2A2A"
							size={30}
							onClick={() => {
								setOpenMobileMenu(false)
							}}
						></AiOutlineClose>
					</div>
					<div className="w-full h-full flex flex-col items-center justify-around">
						<div className="w-9/12 mx-auto h-fit flex flex-col items-start justify-center py-16 gap-12">
							<Link
								href={'/'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className={`interBold text-3xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Dashboard</h5>
							</Link>
							<Link
								href={'/trade'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className={`interBold text-3xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Trade</h5>
							</Link>
							<Link
								href={'/convert'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className={`interBold text-3xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Convert</h5>
							</Link>
							<Link
								href={'/portfolio'}
								onClick={(e) => {
									e.preventDefault()
									setSubMenuOpen(!subMenuOpen)
								}}
							>
								<div className="w-fit h-fit flex flex-row items-center justify-start gap-1">
									<h5 className={`interBold text-3xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Portfolio</h5>
									{subMenuOpen ? <BiChevronDown size={25} color="#252525" /> : <BiChevronRight size={25} color="#252525" />}
								</div>
							</Link>
							{subMenuOpen ? (
								<div className=" w-full h-fit flex flex-col items-start justify-start gap-8 -mt-4">
									<Link
										href={'/portfolio'}
										onClick={() => {
											setOpenMobileMenu(false)
										}}
									>
										<h5 className={`interBold text-2xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Overview</h5>
									</Link>
									<Link
										href={'/history'}
										onClick={() => {
											setOpenMobileMenu(false)
										}}
									>
										<h5 className={`interBold text-2xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Transactions</h5>
									</Link>
									<Link
										href={'/settings'}
										onClick={() => {
											setOpenMobileMenu(false)
										}}
									>
										<h5 className={`interBold text-2xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}`}>Settings</h5>
									</Link>
								</div>
							) : (
								''
							)}
						</div>
						<div className="">
							<ConnectButton />
						</div>
					</div>
				</div>
			</Menu>
		</section>
	)
}

export default DappNavbar
