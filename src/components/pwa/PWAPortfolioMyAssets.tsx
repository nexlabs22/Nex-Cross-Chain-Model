'use client'
import { usePortfolio } from "@/providers/PortfolioProvider";
import { Stack, Typography } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PWAGradientStack } from "@/theme/overrides";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLandingPageStore } from "@/store/store";

export default function PWAPortfolioMyAssets() {
    const {nexTokenAssetData} = usePortfolio()
    const router = useRouter()
    const { changeSelectedIndex } = useLandingPageStore()

    return (
        <Stack width={"100%"} height={"fit-content"} marginTop={6}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    My Assets
                </Typography>
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
                        nexTokenAssetData.map((asset) => {
                            return (
                                <Stack key={asset.symbol} width={"50vw"} marginX={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
                                    changeSelectedIndex(asset.shortName);
                                    router.push('/pwa_tradeIndex')
                                }}>
                                    <Image alt="index logo" src={asset.logo} width={40} height={40} className="rounded-full mb-2"></Image>
                                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
                                        <Typography variant="subtitle1" sx={{
                                            color: lightTheme.palette.text.primary,
                                            fontWeight: 600,
                                        }}>
                                            {
                                                asset.symbol
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
                                                asset.percentage
                                            }%
                                        </Typography>
                                    </Stack>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        width: "90%"
                                    }}>
                                        {Number(asset.totalToken?.toFixed(2)).toLocaleString()} (≈${
                                            Number(asset.totalTokenUsd?.toFixed(2)).toLocaleString()
                                        })

                                    </Typography>


                                </Stack>
                            )
                        })
                    }
                </Slider>
            </Stack>
        </Stack>
    )
}


