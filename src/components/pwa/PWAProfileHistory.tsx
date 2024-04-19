import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { PWAGradientStack } from "@/theme/overrides";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown, IoMdLink } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";
import Divider from '@mui/material/Divider';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

const PWAProfileHistoryList = () => {

    const Indices = [
        {
            name: "Anti Inflation Index",
            symbol: "ANFI",
            logo: anfiLogo,
            price: "2453.4",
            change: "N/A"
        },
        {
            name: "CRYPTO5",
            symbol: "CR5",
            logo: cr5Logo,
            price: "784.8",
            change: "N/A"
        },
        {
            name: "AIIndex",
            symbol: "AII",
            logo: cr5Logo,
            price: "826.6",
            change: "N/A"
        },
    ];

    return (
        <Stack id="PWAProfileHistory" width={"100%"} height={"fit-content"} minHeight={"100vh"} marginTop={1} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Transactions History
                </Typography>
                <Menu transition direction="bottom" align="end" position="anchor" menuButton={
                    <MenuButton className={"w-fit"}>
                        <Stack width={"100%"} height={"fit-content"} paddingY={0.5} paddingX={1} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                            
                            <RiDownloadLine size={22} color={lightTheme.palette.text.primary}></RiDownloadLine>
                        </Stack>
                        
                    </MenuButton>
                }>
                    <MenuItem>
                        <Typography variant="subtitle1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Export to PDF
                        </Typography>
                    </MenuItem>
                    <MenuItem >
                        <Typography variant="subtitle1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Export to CSV 
                        </Typography>
                    </MenuItem>
                    
                </Menu>
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={1} marginY={2} sx={{
                overflowY: "scroll"
            }}>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                }}>
                                    ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Amount: 5.42 ANFI
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 500,
                                }}>
                                    Fees: $24.5
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Total: $133.6
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 500,
                            }}>
                                27/05/24
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.nexGreen.main,
                                fontWeight: 500,
                            }}>
                                Successful
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{backgroundColor: lightTheme.palette.text.primary}} flexItem />} gap={2}>
                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                            <Typography variant="caption" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 600,
                            }}>
                                Etherscan
                            </Typography>
                        </Stack>
                        
                        
                    </Stack>
                </Stack>

            </Stack>
        </Stack>
    )
}

export default PWAProfileHistoryList