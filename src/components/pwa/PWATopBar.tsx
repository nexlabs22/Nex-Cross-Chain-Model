import { Stack, Container, Box, Typography, Button, Avatar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import logo from '@assets/images/xlogo_s.png'
import { IoSearchOutline } from "react-icons/io5";
import { lightTheme } from "@/theme/theme";
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useAddress } from "@thirdweb-dev/react";
import router from "next/router";
import { useState, useEffect } from "react";
import { reduceAddress } from "@/utils/general";
import GenericAvatar from "../GenericAvatar";
import PWAGenericAvatar from "./PWAGenericAvatar";
import PWATopBarGenericAvatar from "./PWAGenericTopBarAvatar";

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
    const [connectedUser, setConnectedUser] = useState<User>()
	const [connectedUserId, setConnectedUserId] = useState('')

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
                <IoSearchOutline size={32} color={lightTheme.palette.text.primary} />
                <Link href="pwa_profile" className="w-fit h-fit fle flex-row items-center justify-center">
                {
                (connectedUser?.ppType == 'identicon' || (connectedUser?.ppType == 'identicon' && connectedUser?.ppLink == 'none') ) && address ? <PWATopBarGenericAvatar walletAddress={address}></PWATopBarGenericAvatar> : ""
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