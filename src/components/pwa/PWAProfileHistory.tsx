import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { PWAGradientStack } from "@/theme/overrides";
import { GoPlus } from "react-icons/go";


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
        <Stack width={"100%"} height={"fit-content"} marginTop={3} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Transactions History
                </Typography>

            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={1} marginY={2} sx={{
                overflowY: "scroll"
            }}>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
                <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
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
                            color: lightTheme.palette.text.primary,
                            fontWeight: 500,
                        }}>
                            Succesful
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default PWAProfileHistoryList