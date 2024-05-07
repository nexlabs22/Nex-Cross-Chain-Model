import { Stack, Container, Box, Typography, Button, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import logo from '@assets/images/xlogo_s.png'
import { IoSearchOutline } from "react-icons/io5";
import { lightTheme } from "@/theme/theme";
import { getDatabase, ref, onValue, set, update, push, child } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useAddress } from "@thirdweb-dev/react";
import router from "next/router";
import { useState, useEffect } from "react";
import { reduceAddress } from "@/utils/general";
import GenericAvatar from "../GenericAvatar";
import PWAGenericAvatar from "./PWAGenericAvatar";
import PWATopBarGenericAvatar from "./PWAGenericTopBarAvatar";
import { useLandingPageStore } from "@/store/store";
import usePortfolioPageStore from "@/store/portfolioStore";
import PWAConnectButton from "./PWAConnectWallet";
import { IoWalletOutline } from "react-icons/io5";


interface User {
	email: string
	isRetailer: boolean
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


const PWATopBar = () => {

	const address = useAddress()
	const { setSearchModal, isSearchModalOpen } = useLandingPageStore()
	const { globalConnectedUser, setGlobalConnectedUser } = usePortfolioPageStore()

	const [connectedUser, setConnectedUser] = useState<User>({
		name: 'null',
		email: 'null',
		isRetailer: true,
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

	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = () => {
		if (address) {
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000) // Reset "copied" state after 2 seconds

		}
	}

	const [name, setName] = useState('')
	const [instName, setInstName] = useState('')
	const [email, setEmail] = useState('')
	const [uploadedPPLink, setUploadedPPLink] = useState('none')
	const [chosenPPType, setChosenPPType] = useState('none')

	useEffect(() => {
		function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				for (const key in users) {
					const potentialUser: User = users[key]
					if (address && potentialUser.main_wallet == address) {
						setConnectedUser(potentialUser)
						setConnectedUserId(key)
					}
				}
			})
		}
		getUser()
	}, [address])

	return (
		<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
			<Link href={"pwa_index"} className="w-fit h-fit fle flex-row items-center justify-center">
				<Image src={logo} alt="pwa" className="w-[2.5rem] h-auto"></Image>
			</Link>

			<Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={2}>
				<IoSearchOutline size={32} color={lightTheme.palette.text.primary} onClick={()=>{setSearchModal(!isSearchModalOpen)}} />
				<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} position={"relative"}>
				<IoWalletOutline size={32} color={lightTheme.palette.text.primary} />
					<Stack width={32} height={32} direction={"row"} alignItems={"start"} justifyContent={"start"} padding={0} zIndex={9999} position={"absolute"} top={0} left={0} overflow={"hidden"} sx={{
						opacity: 0,
					}}>
						<PWAConnectButton />
					</Stack>
				</Stack>
				<Link href="pwa_profile" className="w-fit h-fit fle flex-row items-center justify-center">
					{
						(connectedUser?.ppType == 'identicon' || (connectedUser?.ppType == 'identicon' && connectedUser?.ppLink == 'none')) && address ? <PWATopBarGenericAvatar walletAddress={address}></PWATopBarGenericAvatar> : ""
					}
					{
						connectedUser?.ppType != "identicon" && connectedUser?.ppLink != "" && connectedUser?.ppLink != " " && connectedUser?.ppLink != "none" ? (
							<Avatar alt="user profile image" src={connectedUser?.ppLink} sx={{
								height: "2.6rem",
								width: "2.6rem"
							}}></Avatar>
						) : ("")
					}
				</Link>
			</Stack>
		</Stack>
	)
}

export default PWATopBar;