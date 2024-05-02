import { PWAGradientStack } from "@/theme/overrides";
import { Stack, Container, Box, Paper, Typography, Button, Avatar, BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import img from "@assets/images/nft_bg.png"
import { lightTheme } from "@/theme/theme";
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useAddress } from "@thirdweb-dev/react";
import router from "next/router";
import { useState, useEffect } from "react";
import { reduceAddress } from "@/utils/general";
import GenericAvatar from "../GenericAvatar";
import PWAGenericAvatar from "./PWAGenericAvatar";

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

const PWAProfileHeader = () => {

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
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"center"} marginY={3} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
            {
                (connectedUser?.ppType == 'identicon' || (connectedUser?.ppType == 'identicon' && connectedUser?.ppLink == 'none') ) && address ? <PWAGenericAvatar walletAddress={address}></PWAGenericAvatar> : ""
            }
            {
                connectedUser?.ppType != "identicon" && connectedUser?.ppLink != "" && connectedUser?.ppLink != " " && connectedUser?.ppLink != "none" ? (
                    <Avatar alt="user profile image" src={connectedUser?.ppLink} sx={{
                        height: "20vw",
                        width: "20vw"
                    }}></Avatar>
                ) : ("")
            }
            
            <Typography variant="h6" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 700,
                marginY: "0.8rem"
            }}>
                {connectedUser?.inst_name && connectedUser?.inst_name != "" && connectedUser?.inst_name != " " && connectedUser?.inst_name != "Nex User" ? connectedUser?.inst_name : connectedUser?.name}
            </Typography>
            <Typography variant="caption" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,
            }}>
                {connectedUser?.email && connectedUser?.email != "" && connectedUser?.email != " " ? connectedUser?.email : "No Connected Email"}
            </Typography>
            <Typography variant="caption" sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,
            }}>
                { address ? reduceAddress(address.toString()) : ""}
                
            </Typography>
        </Stack>
    )
}

export default PWAProfileHeader