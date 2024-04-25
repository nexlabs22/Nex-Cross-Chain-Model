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
import { PWAGradientStack } from "@/theme/overrides";
import { useChartDataStore, useLandingPageStore } from "@/store/store";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect } from "react";


const GenericGradientAreaChart = dynamic(
    () => import("@components/pwa/PWAGenericAreaChart"),
    {
        ssr: false,
    }
);


const PWAIndexSLider = () => {


    const { fetchIndexData, ANFIData, CR5Data } = useChartDataStore();
    useEffect(() => {
        fetchIndexData({ tableName: "histcomp", index: "OurIndex" });
      }, [fetchIndexData]); 

    const dataForChart:{[key:string]: { time: string | number | Date; value: number }[]} = {
        ANFI: ANFIData.reverse().slice(30),
        CR5: CR5Data.reverse().slice(30)
    }
    
    const { changeSelectedIndex } = useLandingPageStore()
    const Indices = [
        {
            name: "Anti Inflation Index",
            symbol: "ANFI",
            logo: anfiLogo,
            price: "2453.4",
            change: "N/A",
        },
        {
            name: "CRYPTO5",
            symbol: "CR5",
            logo: cr5Logo,
            price: "784.8",
            change: "N/A",
        }
    ];
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
                    className="relative m-0 h-full w-full p-0"
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
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                                initialSlide: 2,
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
                        Indices.map((index, key) => {
                            return (
                                <Stack key={key} width={"50vw"} marginX={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                    changeSelectedIndex(index.name);
                                    router.push('/pwa_tradeIndex')
                                }}>
                                    <Image alt="index logo" src={index.logo} width={40} height={40} className="rounded-full mb-2"></Image>
                                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                        <Typography variant="subtitle1" sx={{
                                            color: lightTheme.palette.text.primary,
                                            fontWeight: 600,
                                        }}>
                                            {
                                                index.symbol
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
                                                index.change
                                            }
                                        </Typography>
                                    </Stack>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        width: "90%"
                                    }}>
                                        ${
                                            index.price
                                        }
                                    </Typography>
                                    <Stack width={"100%"} height={100} borderRadius={'.8rem'} marginTop={1}>
                                        <GenericGradientAreaChart data={dataForChart[index.symbol]}/>
                                    </Stack>

                                </Stack>
                            )
                        })
                    }
                </Slider>
            </Stack>

        </Stack>
    )
}

export default PWAIndexSLider