import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import { IoMdArrowForward } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/cr5.png'
import arbeiLogo from '@assets/images/cr5.png'
import { PWAGradientStack } from "@/theme/overrides";
import { useChartDataStore, useLandingPageStore } from "@/store/store";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDashboard } from "@/providers/DashboardProvider";
import { FormatToViewNumber, num } from '@/hooks/math'

const GenericGradientAreaChart = dynamic(
    () => import("@components/pwa/PWAGenericAreaChart"),
    {
        ssr: false,
    }
);


const PWAIndexSLider = () => {

    const { anfiIndexObject, cr5IndexObject, mag7IndexObject, arbIndexObject} = useDashboard()
    const { fetchIndexData, ANFIData, CR5Data } = useChartDataStore();
    useEffect(() => {
        fetchIndexData({ tableName: "histcomp", index: "OurIndex" });
      }, [fetchIndexData]); 

    const dataForChart:{[key:string]: { time: string | number | Date; value: number }[]} = {
        ANFI: ANFIData.reverse().slice(30),
        CR5: CR5Data.reverse().slice(30)
    }
    
    const { changeSelectedIndex } = useLandingPageStore()
   
    const router = useRouter();

    return (
        <Stack width={"100%"} height={"fit-content"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Featured Indices
                </Typography>
                <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} id="PWAIndexSlider">
                <Slider
                    dots={false}
                    infinite={false}
                    speed={500}
                    slidesToShow={4}
                    slidesToScroll={4}
                    autoplay={false}
                    centerMode={false}
                    arrows={false}
                    className="relative m-0 h-full w-full p-0 flex flex-row"
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                infinite: true,
                                dots: true,
                            },
                        },
                        {
                            breakpoint: 800,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 2,
                            },
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            },
                        },
                    ]}
                >
                    {
                        anfiIndexObject ? (
                            <Stack width={"50vw"} minWidth={{md: "45vw"}} marginX={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                changeSelectedIndex(anfiIndexObject.symbol);
                                router.push('/pwa_tradeIndex')
                            }}>
                                <Image alt="index logo" src={anfiLogo.src} width={40} height={40} className="rounded-full mb-2"/>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                    }}>
                                        {
                                            anfiIndexObject.shortSymbol
                                        }
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: anfiIndexObject.chg24h && Number(anfiIndexObject.chg24h) < 0 ? "#F23645" : "#089981",
                                        fontWeight: 600,
                                        fontSize: ".8rem",
                                        backgroundColor: lightTheme.palette.pageBackground.main,
                                        paddingX: "0.8rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "1rem",
                                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                    }}>
                                        {
                                            anfiIndexObject.chg24h
                                        }%
                                    </Typography>
                                </Stack>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    width: "90%"
                                }}>
                                    ${
                                        FormatToViewNumber({ value: Number(anfiIndexObject?.mktPrice), returnType: 'string' })
                                    }
                                </Typography>
                                <Stack width={"100%"} height={100} borderRadius={'.8rem'} marginTop={1}>
                                    <GenericGradientAreaChart data={dataForChart["ANFI"]}/>
                                </Stack>

                            </Stack>
                        ) : ("")
                    }
                    {
                        cr5IndexObject ? (
                            <Stack width={"50vw"} minWidth={{md: "45vw"}} marginLeft={{sm: 1, md: "5vw"}} marginRight={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                changeSelectedIndex(cr5IndexObject.symbol);
                                router.push('/pwa_tradeIndex')
                            }}>
                                <Image alt="index logo" src={cr5Logo.src} width={40} height={40} className="rounded-full mb-2"/>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                    }}>
                                        {
                                            cr5IndexObject.shortSymbol
                                        }
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.nexGreen.main,
                                        fontWeight: 600,
                                        fontSize: ".8rem",
                                        backgroundColor: lightTheme.palette.pageBackground.main,
                                        paddingX: "0.8rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "1rem",
                                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                    }}>
                                        {
                                            cr5IndexObject.chg24h
                                        }%
                                    </Typography>
                                </Stack>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    width: "90%"
                                }}>
                                    ${
                                        FormatToViewNumber({ value: Number(cr5IndexObject?.mktPrice), returnType: 'string' })
                                    }
                                </Typography>
                                <Stack width={"100%"} height={100} borderRadius={'.8rem'} marginTop={1}>
                                    <GenericGradientAreaChart data={dataForChart["CR5"]}/>
                                </Stack>

                            </Stack>
                        ) : ("")
                    }
                    {
                        mag7IndexObject && (
                            <Stack width={"50vw"} minWidth={{md: "45vw"}} marginLeft={{sm: 1, md: "5vw"}} marginRight={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                changeSelectedIndex(mag7IndexObject.symbol);
                                router.push('/pwa_tradeIndex')
                            }}>
                                <Image alt="index logo" src={mag7Logo.src} width={40} height={40} className="rounded-full mb-2"/>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                    }}>
                                        {
                                            mag7IndexObject.shortSymbol
                                        }
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.nexGreen.main,
                                        fontWeight: 600,
                                        fontSize: ".8rem",
                                        backgroundColor: lightTheme.palette.pageBackground.main,
                                        paddingX: "0.8rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "1rem",
                                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                    }}>
                                        {
                                            mag7IndexObject.chg24h
                                        }%
                                    </Typography>
                                </Stack>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    width: "90%"
                                }}>
                                    ${
                                        FormatToViewNumber({ value: Number(mag7IndexObject?.mktPrice), returnType: 'string' })
                                    }
                                </Typography>
                                <Stack width={"100%"} height={100} borderRadius={'.8rem'} marginTop={1}>
                                    <GenericGradientAreaChart data={dataForChart["CR5"]}/>
                                </Stack>

                            </Stack>
                        )
                    }
                                        {
                        arbIndexObject && (
                            <Stack width={"50vw"} minWidth={{md: "45vw"}} marginLeft={{sm: 1, md: "5vw"}} marginRight={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                changeSelectedIndex(arbIndexObject.symbol);
                                router.push('/pwa_tradeIndex')
                            }}>
                                <Image alt="index logo" src={arbeiLogo.src} width={40} height={40} className="rounded-full mb-2"/>
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                    }}>
                                        {
                                            arbIndexObject.shortSymbol
                                        }
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.nexGreen.main,
                                        fontWeight: 600,
                                        fontSize: ".8rem",
                                        backgroundColor: lightTheme.palette.pageBackground.main,
                                        paddingX: "0.8rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "1rem",
                                        border: "solid 1px rgba(37, 37, 37, 0.5)",
                                        boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                    }}>
                                        {
                                            arbIndexObject.chg24h
                                        }%
                                    </Typography>
                                </Stack>
                                <Typography variant="subtitle1" sx={{
                                    color: lightTheme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    width: "90%"
                                }}>
                                    ${
                                        FormatToViewNumber({ value: Number(arbIndexObject?.mktPrice), returnType: 'string' })
                                    }
                                </Typography>
                                <Stack width={"100%"} height={100} borderRadius={'.8rem'} marginTop={1}>
                                    <GenericGradientAreaChart data={dataForChart["CR5"]}/>
                                </Stack>

                            </Stack>
                        )
                    }
                </Slider>
            </Stack>

        </Stack>
    )
}

export default PWAIndexSLider