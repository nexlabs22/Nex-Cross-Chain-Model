import { Stack, Box, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import { IOSSwitch } from "@/theme/overrides";
import { MdEdit } from "react-icons/md";

import { MdOutlineModeEdit } from "react-icons/md";
import { ref, onValue, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useAddress } from "@thirdweb-dev/react";
import { reduceAddress } from "@/utils/general";
import router from "next/router";
import { GenericToast } from "@/components/GenericToast";
import PWATopBarGenericAvatar from "@/components/pwa/PWAGenericTopBarAvatar";
import Sheet from 'react-modal-sheet';
import { UploadDropzone } from 'react-uploader'
import { Uploader } from 'uploader'

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

export default function PWAProfileSettings() {

    const address = useAddress()


    const uploader = Uploader({
        apiKey: 'free', // Get production API keys from Bytescale
    })
    const ImageUploaderOptions = { multi: false }

    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        if (address) {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000) // Reset "copied" state after 2 seconds

        }
    }

    const [isRetailerAccount, setIsRetailerAccount] = useState(true)

    const changeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) setIsRetailerAccount(false)
        else setIsRetailerAccount(true)
    };

    const [photoOptionSheetOpen, setPhotoOptionSheetOpen] = useState(false)
    const [photoUploadSheetOpen, setPhotoUploadSheetOpen] = useState(false)

    const [option1, setOption1] = useState(false)
    const [option2, setOption2] = useState(false)
    const [option3, setOption3] = useState(false)
    const [option4, setOption4] = useState(false)
    const [option5, setOption5] = useState(false)

    const [editable1, setEditable1] = useState(false)
    const [editable2, setEditable2] = useState(false)
    const [editable3, setEditable3] = useState(false)
    const [editable4, setEditable4] = useState(false)

    const [name, setName] = useState('')
    const [instName, setInstName] = useState('')
    const [email, setEmail] = useState('')
    const [adr, setAdr] = useState('')
    const [vatin, setVatin] = useState('')
    const [uploadedPPLink, setUploadedPPLink] = useState('none')
    const [chosenPPType, setChosenPPType] = useState('none')

    const [connectedUser, setConnectedUser] = useState<User>()
    const [connectedUserId, setConnectedUserId] = useState('')

    function switchToIdenticon() {
        update(ref(database, 'users/' + connectedUserId), {

            ppType: "identicon",
        })
    }

    function uploadPhoto() {

    }

    useEffect(() => {
        function getUser() {
            const usersRef = ref(database, 'users/')
            onValue(usersRef, (snapshot) => {
                const users = snapshot.val()
                for (const key in users) {
                    const potentialUser: User = users[key]
                    if (address && potentialUser.main_wallet == address) {
                        console.log(potentialUser.ppLink)
                        setConnectedUser(potentialUser)
                        setIsRetailerAccount(potentialUser.isRetailer)
                        setConnectedUserId(key)
                        setOption1(potentialUser.p1)
                        setOption2(potentialUser.p2)
                        setOption3(potentialUser.p3)
                        setOption4(potentialUser.p4)
                        setOption5(potentialUser.p5)
                    }
                }
            })
        }
        getUser()
    }, [address])



    function saveSettings() {
        update(ref(database, 'users/' + connectedUserId), {
            isRetailer: isRetailerAccount != connectedUser?.isRetailer ? isRetailerAccount : connectedUser.isRetailer,
            name: name != connectedUser?.name && name != '' ? name : connectedUser?.name,
            email: email != connectedUser?.email && email != '' ? email : connectedUser?.email,
            address: adr != connectedUser?.address && adr != '' ? adr : connectedUser?.address,
            vatin: vatin != connectedUser?.vatin && vatin != '' ? vatin : connectedUser?.vatin,
            inst_name: instName != connectedUser?.inst_name && instName != '' ? instName : connectedUser?.inst_name,
            p1: option1 != connectedUser?.p1 ? option1 : connectedUser.p1,
            p2: option2 != connectedUser?.p2 ? option2 : connectedUser.p2,
            p3: option3 != connectedUser?.p3 ? option3 : connectedUser.p3,
            p4: option4 != connectedUser?.p4 ? option4 : connectedUser.p4,
            p5: option5 != connectedUser?.p5 ? option5 : connectedUser.p5,
            ppLink: uploadedPPLink != 'none' ? uploadedPPLink : connectedUser?.ppLink,
            ppType: chosenPPType != 'none' && chosenPPType != connectedUser?.ppType ? chosenPPType : connectedUser?.ppType,
        })

        router.push('/pwa_profile')
    }


    return (
        <Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingY={4} paddingX={3} bgcolor={lightTheme.palette.background.default}>
            <PWATopBar></PWATopBar>
            {
                connectedUser?.ppType == 'identicon' && address ? (
                    <Link href="" onClick={(e) => { e.preventDefault(); setPhotoOptionSheetOpen(true) }} className="w-fit h-fit flex flex-row items-center justify-center">
                        <Stack width="fit-content" height="fit-content" position={"relative"} direction={"row"} alignItems={"center"} justifyContent={"center"} marginY={12} sx={{ scale: "4" }}>
                            <PWATopBarGenericAvatar walletAddress={address}></PWATopBarGenericAvatar>
                            <Stack width={"fit-content"} height={"fit-content"} bgcolor={"#FFFFFF"} position={"absolute"} zIndex={999} borderRadius={"999px"} bottom={"15%"} right={"3%"} border={"solid 0.2px #C0C0C0"} direction={"row"} alignItems={"center"} justifyContent={"center"} padding={"0.5px"}>
                                <MdEdit color={lightTheme.palette.text.primary} size={4} className=" rotate-[90deg] " />
                            </Stack>
                        </Stack>
                    </Link>
                ) : (
                    <Link href="" onClick={(e) => { e.preventDefault(); setPhotoOptionSheetOpen(true) }} className="w-fit h-fit flex flex-row items-center justify-center">
                        <Stack
                            width={"40vw"} height={"40vw"} marginTop={8} borderRadius={"9999px"} sx={{
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                border: "solid 1.5px #252525",
                                backgroundImage:
                                    uploadedPPLink != 'none' ? `url('${uploadedPPLink}')` : uploadedPPLink == 'none' && connectedUser?.ppType != 'identicon' ? `url('${connectedUser?.ppLink}')` : '',
                            }}
                        >
                        </Stack>
                    </Link>
                )
            }


            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Account Info
                </Typography>
                <Typography variant="caption" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700,
                    marginTop: "1rem"
                }}>
                    Account Type
                </Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500,
                    }}>
                        Retailer
                    </Typography>
                    <IOSSwitch sx={{ m: 1 }} checked={!isRetailerAccount} onChange={changeType} />
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500,
                    }}>
                        Institutional Investor
                    </Typography>

                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.5}>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Name
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.name} onChange={(event) => { setName(event.target.value) }} fullWidth sx={{ fontSize: "1rem" }} />
                    </Stack>

                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Email
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.email && connectedUser?.email != "" && connectedUser?.email != "" ? connectedUser?.email : "No Connected Email"} onChange={(event) => { setEmail(event.target.value) }} fullWidth />
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Main Wallet
                        </Typography>
                        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"stretch"} justifyContent={"start"} gap={1}>
                            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"}>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={address ? reduceAddress(address.toString()) : ""} fullWidth />
                            </Stack>

                        </Stack>

                    </Stack>
                </Stack>
                {
                    !isRetailerAccount ? (
                        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.5}>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    Legal Entity Name
                                </Typography>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.inst_name} onChange={(event) => { setInstName(event.target.value) }} fullWidth />
                            </Stack>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    Address
                                </Typography>
                                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"stretch"} justifyContent={"start"} gap={1}>
                                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"}>
                                        <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.address && connectedUser?.address != "" && connectedUser?.address != "" ? connectedUser?.address : "No Specified Address"} onChange={(event) => { setAdr(event.target.value) }} fullWidth />
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    VAT (VAT registration number)
                                </Typography>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.vatin && connectedUser?.vatin != "" && connectedUser?.vatin != "" ? connectedUser?.vatin : "No Specified VAT"} onChange={(event) => { setVatin(event.target.value) }} fullWidth />
                            </Stack>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    Number of Commerce Chamber
                                </Typography>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.vatin && connectedUser?.vatin != "" && connectedUser?.vatin != "" ? connectedUser?.vatin : "Number of Commerce Chamber"} onChange={(event) => { setVatin(event.target.value) }} fullWidth />
                            </Stack>

                        </Stack>
                    ) : ""
                }
                <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                    <Typography variant="body1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700
                    }}>
                        Notifications & Insights
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive emails from Nex Labs
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive push notifications from Nex Labs
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive weekly News Recaps
                        </Typography>

                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} gap={1}>

                        <IOSSwitch sx={{ m: 1 }} defaultChecked />
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Receive news about Nex Labs events
                        </Typography>

                    </Stack>
                    <Button className="pwaConnectWallet"
                        sx={{
                            width: "90%",
                            paddingY: "1rem",
                            borderRadius: "1.2rem",
                            marginX: "auto",
                            marginTop: "1.2rem",
                            marginBottom: "6rem",
                            background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
                            boxShadow: "none"
                        }}
                        onClick={() => { saveSettings() }}
                    >
                        <Typography variant="h3" component="h3" className="w-full rounded-3xl" sx={{
                            color: "#000000",
                            fontSize: "1.2rem",
                            textShadow: "none",

                        }} >
                            Save Settings
                        </Typography>
                    </Button>
                </Stack>
            </Stack>
            <Sheet
                isOpen={photoOptionSheetOpen}
                onClose={() => setPhotoOptionSheetOpen(false)}
                snapPoints={[200, 200, 0, 0]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content className=" flex flex-col items-center justify-center pt-0">
                        <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} height={"fit-content"}>

                            <Link href={""} className="flex flex-row items-center justify-center w-fit h-fit" onClick={(e) => { e.preventDefault(); setPhotoOptionSheetOpen(false); setPhotoUploadSheetOpen(true) }}>
                                <Typography variant="h6" align="center" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "-2rem"
                                }}>
                                    Upload A New Photo
                                </Typography>
                            </Link>
                            <Stack width={"40%"} height={"1.5px"} bgcolor={"#808080"} marginX={"auto"} marginY={1.5}></Stack>
                            <Link href={""} className="flex flex-row items-center justify-center w-fit h-fit" onClick={(e) => { e.preventDefault(); switchToIdenticon(); setPhotoOptionSheetOpen(false) }}>
                                <Typography variant="h6" align="center" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700
                                }}

                                >
                                    Use Identicon
                                </Typography>
                            </Link>
                        </Stack>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => { setPhotoOptionSheetOpen(false) }} />
            </Sheet>
            <Sheet
                isOpen={photoUploadSheetOpen}
                onClose={() => setPhotoUploadSheetOpen(false)}
                snapPoints={[310, 310, 0, 0]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content className=" flex flex-col items-center justify-center pt-0">
                        <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} height={"fit-content"}>
                            <UploadDropzone
                                uploader={uploader}
                                options={ImageUploaderOptions}
                                onUpdate={(files) => {
                                    update(ref(database, 'users/' + connectedUserId), {
                                        ppLink: files.map((x) => x.fileUrl).join('\n'),
                                        ppType: "image",
                                    })

                                    setPhotoUploadSheetOpen(false)
                                    GenericToast({
                                        type: 'success',
                                        message: "Image uploaded succesfully!",
                                    })
                                }}
                                width="600px"
                                height="250px"
                            />
                        </Stack>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => { setPhotoUploadSheetOpen(false) }} />
            </Sheet>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}