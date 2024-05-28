import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Link from "next/link";
import Image from "next/image";
import { PWAGradientStack } from "@/theme/overrides";
import { IoMdArrowForward } from "react-icons/io";

const PWAExternalMenu = () => {
    return (
        <> 
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"center"} marginTop={5} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    marginBottom: "1.4rem"
                }}>
                    Nex Labs
                </Typography>
                <Link href={"https://www.nexlabs.io/"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Home
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://github.com/nexlabs22/%E2%80%A6ices-Model-Contracts"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Public Repository
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            White Paper
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://app.nexlabs.io/terms_and_conditions"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Terms & Conditions
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://app.nexlabs.io/privacy_policy"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Privacy Policy
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://app.nexlabs.io/us_disclaimer"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center mb-[0.6rem] ">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            US Disclaimer
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
            </Stack>
            
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"center"} marginTop={1} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
                    marginBottom: "1.4rem"
                }}>
                    Whitepaper Pieces
                </Typography>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} >
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Spot - Indices
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Protocol Structure
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Token & Smart contract Details
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Roadmap
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
                <Stack width={"100%"} height={"1.5px"} bgcolor={"#484848"} marginX={"auto"} marginY={2} sx={{opacity: 0.8}}></Stack>
                <Link href={"https://nex-labs.gitbook.io/nex-dex/additional-information/faq"} target="_blank" className="w-full h-fit fle flex-row items-center justify-center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={"0.6rem"}>
                        <Typography variant="caption" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            FAQ
                        </Typography>
                        <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
                    </Stack>
                </Link>
            </Stack>
        </>


    )
}

export default PWAExternalMenu