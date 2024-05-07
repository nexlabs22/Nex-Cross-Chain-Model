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
import { GenericToast } from "../GenericToast";
import { HiOutlineQrCode } from "react-icons/hi2";
import Sheet from 'react-modal-sheet';
import QRCode from 'react-qr-code'

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
	const [isQRSheetOpen, setIsQRSheetOpen] = useState(false)
	

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
		<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginTop={3} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"80%"} height={"fit-content"} gap={2}>
				{
					(connectedUser?.ppType == 'identicon' || (connectedUser?.ppType == 'identicon' && connectedUser?.ppLink == 'none')) && address ? <PWAGenericAvatar walletAddress={address}></PWAGenericAvatar> : ""
				}
				{
					connectedUser?.ppType != "identicon" && connectedUser?.ppLink != "" && connectedUser?.ppLink != " " && connectedUser?.ppLink != "none" ? (
						<Avatar alt="user profile image" src={connectedUser?.ppLink} sx={{
							height: "20vw",
							width: "20vw"
						}}></Avatar>
					) : ("")
				}
				<Stack width={"fit-content"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"}>
					<Typography variant="body1" sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 700,
					}}>
						{connectedUser?.inst_name && connectedUser?.inst_name != "" && connectedUser?.inst_name != " " && connectedUser?.inst_name != "Nex User" ? connectedUser?.inst_name : connectedUser?.name}
					</Typography>
					<Typography variant="caption" sx={{
						color: lightTheme.palette.text.primary,
						fontSize: "0.9rem",
						fontWeight: 500,
					}}>
						{connectedUser?.email && connectedUser?.email != "" && connectedUser?.email != " " ? connectedUser?.email : "No Connected Email"}
					</Typography>
					<Typography variant="caption" sx={{
						color: lightTheme.palette.text.primary,
						fontSize: "0.9rem",
						fontWeight: 500,
					}}>
						{address ? reduceAddress(address.toString()) : ""}

					</Typography>
				</Stack>
			</Stack>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} width={"20%"} height={"fit-content"}>
				<HiOutlineQrCode size={50} color={lightTheme.palette.text.primary} onClick={()=>{setIsQRSheetOpen(true)}} />

			</Stack>
			<Sheet
                isOpen={isQRSheetOpen}
                onClose={() => setIsQRSheetOpen(false)}
                snapPoints={[500, 500, 0, 0]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Stack direction={"column"} height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"start"} paddingX={2} paddingY={2}>
                            <Typography variant="h6" align="center" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 700,
								marginBottom: "2rem"
                            }}>
                                Share Your Address
                            </Typography>

                            {
								address ? (
									<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} width={"fit-content"} height={"fit-content"} bgcolor={"red"}>
										<QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={address} viewBox={`0 0 256 256`} />
									</Stack>
								) : ""
							}
                        </Stack>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={()=>{setIsQRSheetOpen(false)}} />
            </Sheet>

		</Stack>
	)
}

export default PWAProfileHeader