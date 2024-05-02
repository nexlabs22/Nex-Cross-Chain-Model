import { Stack, Container, Box, Paper, Switch, TextField, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAProfileHistoryList from "@/components/pwa/PWAProfileHistory";
import { IOSSwitch, PWAProfileTextField } from "@/theme/overrides";
import { BsQrCodeScan } from "react-icons/bs";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { useAddress } from "@thirdweb-dev/react";
import { reduceAddress } from "@/utils/general";
import router from "next/router";
import { GenericToast } from "@/components/GenericToast";

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

    useEffect(() => {
        function getUser() {
            const usersRef = ref(database, 'users/')
            onValue(usersRef, (snapshot) => {
                const users = snapshot.val()
                for (const key in users) {
                    const potentialUser: User = users[key]
                    if (address && potentialUser.main_wallet == address) {
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
            <Stack width={"100%"} height={"fit-content"} paddingTop={5} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={0.2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Account Info
                </Typography>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 500,
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
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Name
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.name} onChange={(event) => { setName(event.target.value) }} fullWidth />
                    </Stack>

                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 700,
                            marginTop: "1rem"
                        }}>
                            Email
                        </Typography>
                        <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.email && connectedUser?.email != "" && connectedUser?.email != "" ? connectedUser?.email : "No Connected Email"} onChange={(event) => { setEmail(event.target.value) }} fullWidth />
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                        <Typography variant="body1" sx={{
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
                                <Typography variant="body1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    Legal Entity Name
                                </Typography>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.inst_name} onChange={(event) => { setInstName(event.target.value) }} fullWidth />
                            </Stack>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="body1" sx={{
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
                                <Typography variant="body1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 700,
                                    marginTop: "1rem"
                                }}>
                                    VAT (VAT registration number)
                                </Typography>
                                <TextField id="outlined-basic" color="info" variant="outlined" placeholder={connectedUser?.vatin && connectedUser?.vatin != "" && connectedUser?.vatin != "" ? connectedUser?.vatin : "No Specified VAT"} onChange={(event) => { setVatin(event.target.value) }} fullWidth />
                            </Stack>
                            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} gap={1}>
                                <Typography variant="body1" sx={{
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
                    <Typography variant="h6" sx={{
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
                            width: "95%",
                            paddingY: "1.3rem",
                            borderRadius: "1.2rem",
                            marginX: "auto",
                            marginTop: "1.2rem",
                            marginBottom: "6rem"
                        }}
                        onClick={()=>{saveSettings()}}
                    >
                        <Typography variant="h3" component="h3" className="w-full rounded-3xl" sx={{
                            color: "#000000",
                            fontSize: "1.8rem",
                            textShadow: "none",

                        }} >
                            Save Settings
                        </Typography>
                    </Button>
                </Stack>
            </Stack>
            <PWABottomNav></PWABottomNav>
        </Box>
    )
}