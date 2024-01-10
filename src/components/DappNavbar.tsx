import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import useTradePageStore from '@/store/tradeStore'
import { Menu as NavMenu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import HoverMenuWithTransition from './popper'

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
import { database } from '@/utils/firebase'

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
}

interface DappNavbarProps {
	lightVersion?: boolean
}

const DappNavbar: React.FC<DappNavbarProps> = ({ lightVersion }) => {
	const { openMobileMenu, setOpenMobileMenu } = useTradePageStore()

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
	})
	const [connectedUserId, setConnectedUserId] = useState<String>('')

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
		<section className="flex h-fit w-screen flex-row items-center justify-between px-4 py-4 md:px-10 md:py-6 relative z-50">
			<Link href={'https://www.nexlabs.io/'}>
				<div className="flex flex-row items-center justify-between">
					<div className=" mr-2 h-fit w-fit">
						<Image src={xlogo} alt="nex labs logo" className={`w-12 brightness-[0.65] ${lightVersion ? 'brightness-[0] invert' : ''} drop-shadow-sm`}></Image>
					</div>
				</div>
			</Link>
			<div className="h-fit w-fit md:hidden">
				<CiMenuFries
					color="#2A2A2A"
					size="30"
					onClick={() => {
						setOpenMobileMenu(true)
					}}
				/>
			</div>
			<div className="hidden flex-row items-center justify-start md:visible md:flex">
				<div className="flex flex-row items-center justify-evenly">
					<Link href={'/'}>
						<h5 className={`interMedium font-base mr-8 ${lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Dashboard</h5>
					</Link>
					<Link href={'/trade'}>
						<h5 className={`interMedium font-base mr-8 ${lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Trade</h5>
					</Link>
					<Link href={'/convert'}>
						<h5 className={`interMedium font-base mr-8 ${lightVersion ? ' text-whiteText-500' : 'text-blackText-500'}`}>Convert</h5>
					</Link>
					<HoverMenuWithTransition key={0} menuItem="item" lightV={lightVersion} />
				</div>
				{/* <div className=" montrealBold rounded-xl bg-colorOne-500 px-4 pb-3 pt-4 text-lg text-whiteText-500">Connect wallet</div> */}
				<ConnectButton />
			</div>
			<Menu isOpen={openMobileMenu} className="">
				<div className="w-full h-full">
					<div className="flex flex-row items-center justify-end p-3">
						<AiOutlineClose
							color="#2A2A2A"
							size={30}
							onClick={() => {
								setOpenMobileMenu(false)
							}}
						></AiOutlineClose>
					</div>
					<div className="w-full h-full flex flex-col items-center justify-around">
						<div className="w-fit h-fit flex flex-col items-center justify-center gap-12">
							<Link
								href={'/'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className="interBold text-3xl text-blackText-500">Dashboard</h5>
							</Link>
							<Link
								href={'/trade'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className="interBold text-3xl text-blackText-500">Trade</h5>
							</Link>
							<Link
								href={'/convert'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className="interBold text-3xl text-blackText-500">Convert</h5>
							</Link>
							<Link
								href={'/portfolio'}
								onClick={() => {
									setOpenMobileMenu(false)
								}}
							>
								<h5 className="interBold text-3xl text-blackText-500">Portfolio</h5>
							</Link>
						</div>
						<div className="pt-10">
							<ConnectButton />
						</div>
					</div>
				</div>
			</Menu>
		</section>
	)
}

export default DappNavbar
