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
import { FormatToViewNumber } from "@/hooks/math";
import { useMediaQuery } from '@mui/material';

export default function PWAPortfolioMyAssets() {
    const { nexTokenAssetData } = usePortfolio()
    const router = useRouter()
    const { changeSelectedIndex } = useLandingPageStore()
    const isLandscape = useMediaQuery('(orientation: landscape)'); 

    return (
        <Stack width={"100%"} height={"fit-content"} marginTop={isLandscape ? "100vh" : 12}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="body1" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 600,
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
                                <Stack key={asset.symbol} width={"50vw"} minWidth={{md: "46vw"}} marginX={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
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
                                                asset.shortName
                                            }
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: asset.percentage && Number(asset.percentage) < 0 ? "#F23645" : "#089981",
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
                                                FormatToViewNumber({ value: Number(asset.percentage), returnType: 'string' })
                                            }%
                                        </Typography>
                                    </Stack>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                        width: "90%"
                                    }}>
                                        {
                                            Number(asset.totalToken?.toFixed(2)).toLocaleString()
                                        }

                                    </Typography>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                        width: "90%"
                                    }}>
                                        (${
                                            FormatToViewNumber({ value: Number(asset.totalTokenUsd?.toFixed(2)), returnType: 'string' })
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


