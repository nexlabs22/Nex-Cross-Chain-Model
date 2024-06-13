import { Stack, Container, Box, Chip, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PWAComparisonChip } from "@/theme/overrides";
import Sheet from 'react-modal-sheet';

// Data :
import { comparisonIndices } from '@/constants/comparisionIndices'

// Icons and logos :
import { IoChevronDown } from "react-icons/io5";
import btc from '@assets/images/btc.png'
import gold from '@assets/images/gold.jpg'
import oil from '@assets/images/oil.jpg'
import sandp from '@assets/images/s&p.jpeg'
import dow from '@assets/images/dow.png'
import nasdaq from '@assets/images/nasdaq.jpg'
import nyse from '@assets/images/nyse.png'
import stock5 from '@assets/images/STOCK5.png'
import microsoft from '@assets/images/microsoft.png'
import paypal from '@assets/images/paypal.png'
import asml from '@assets/images/asml.png'
import copper from '@assets/images/copper.png'
import lithium from '@assets/images/lithium.png'
import apple from '@assets/images/apple.png'
import alphabet from '@assets/images/alphabet.png'
import amazon from '@assets/images/amazon.png'
import berkshirehathway from '@assets/images/berkshirehathway.png'
import chevron from '@assets/images/chevron.png'
import exxon_mobile from '@assets/images/exxon_mobile.png'
import jnj from '@assets/images/jnj.png'
import jpmorgan from '@assets/images/jpmorgan.png'
import lvmh from '@assets/images/lvmh.png'
import mastercard from '@assets/images/mastercard.png'
import meta from '@assets/images/meta.png'
import nvidia from '@assets/images/nvidia.png'
import silver from '@assets/images/silver.png'
import spy from '@assets/images/spy.png'
import tencent from '@assets/images/tencent.png'
import tesla from '@assets/images/tesla.png'
import tsmc from '@assets/images/tsmc.png'
import unitedhealth from '@assets/images/unitedhealth.png'
import visa from '@assets/images/visa.png'
import walmart from '@assets/images/walmart.png'
import { IoMdCheckmark } from "react-icons/io";
import { useState, useEffect } from "react";
import { useChartDataStore, useLandingPageStore } from "@/store/store";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import Link from "next/link";
import { Asset } from "next/font/google";

const PWAIndexComparisonBox = () => {

    const [isAssetsSheetOpen, setIsAssetsSheetOpen] = useState<boolean>(false)

    const { defaultIndex, mode, selectedIndex, selectedComparisonIndices, changeSelectedComparisonIndices } = useLandingPageStore()
    const priorityAssetClasses = [
        {
            index: 'ANFI',
            assetClasses: [
                {
                    name: 'btc',
                    colName: 'bitcoin',
                    logo: btc.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'bitcoin')?.selectionColor,
                },
                {
                    name: 'gold',
                    colName: 'gold',
                    logo: gold.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'gold')?.selectionColor,
                },
                {
                    name: 'oil',
                    colName: 'oil',
                    logo: oil.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'oil')?.selectionColor,
                },
                {
                    name: 'STK5',
                    colName: 'stock5',
                    logo: stock5.src,
                },
            ],
        },
        {
            index: 'CRYPTO 5',
            assetClasses: [

                {
                    name: 'GSPC',
                    colName: 'sandp',
                    logo: sandp.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'sandp')?.selectionColor,
                },
                {
                    name: 'DJI',
                    colName: 'dow',
                    logo: dow.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'dow')?.selectionColor,
                },
                {
                    name: 'IXIC',
                    colName: 'nasdaq',
                    logo: nasdaq.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'nasdaq')?.selectionColor,
                },
                {
                    name: 'NYA ',
                    colName: 'nyse',
                    logo: nyse.src,
                    selectionColor: comparisonIndices.find((index) => index.columnName === 'nyse')?.selectionColor,
                },
                {
                    name: 'STK5',
                    colName: 'stock5',
                    logo: stock5.src,
                },
            ],
        },
    ]

    const [selectedIndices, setSelectedIndices] = useState<string[]>([])
    const { fetchIndexData, removeIndex, clearChartData, selectedDuration, selectDuration, loading, dayChange, STOCK5Data, CR5Data, chartData, comparisionIndices, setComparisonIndices } =
        useChartDataStore()

    useEffect(() => {
        clearChartData()
        setSelectedIndices([])
        changeSelectedComparisonIndices([])
    }, [selectedIndex, clearChartData, changeSelectedComparisonIndices])



    return (
        <>
            <Stack direction={"column"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginTop={2} marginBottom={1}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"100%"} height={"fit-content"} marginBottom={"1rem"}>
                    <Typography variant="subtitle1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                    }}>
                        {selectedIndex}
                    </Typography>
                    <CgArrowsExchangeAlt size={28} color={lightTheme.palette.gradientHeroBg}></CgArrowsExchangeAlt>
                    <Typography variant="subtitle1" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                    }}>
                        Wold{"'"}s Best Assets
                    </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"}>

                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: "1rem",
                        whiteSpace: "nowrap"
                    }}>
                        Compared to:
                    </Typography>
                    {
                        selectedComparisonIndices.length == 0 ? (
                            <Link href="" onClick={(e) => { e.preventDefault(); setIsAssetsSheetOpen(true) }} className="w-full h-fit flex flex-col">
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"end"} width={"100%"} height={"fit-content"} gap={0.5}>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Add assets
                                    </Typography>
                                    <IoChevronDown color={lightTheme.palette.text.primary} size={20} />
                                </Stack>
                            </Link>
                        ) :
                            (
                                selectedComparisonIndices.length == 1 ? (
                                    <Link href="" onClick={(e) => { e.preventDefault(); setIsAssetsSheetOpen(true) }} className="w-full h-fit flex flex-col">
                                        <Stack direction={"row"} alignItems={"center"} justifyContent={"end"} width={"100%"} height={"fit-content"} gap={0.5}>
                                            <Stack
                                                width={25}
                                                height={25}
                                                sx={{
                                                    backgroundColor: "#C7C7C7",
                                                    backgroundImage: `url('${priorityAssetClasses.flatMap(category => category.assetClasses).find(assetClass => assetClass.colName === selectedComparisonIndices[0])?.logo || "Not found"}')`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    borderRadius:"9999px",
                                                    border:"solid 0.5px rgba(37, 37, 37, 0.4)",
                                                    boxShadow:"0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                                }}
                                            ></Stack>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                            }}>
                                                {priorityAssetClasses.flatMap(category => category.assetClasses)
                                                    .find(assetClass => assetClass.colName === selectedComparisonIndices[0])?.name || "Not found"}
                                            </Typography>
                                            <IoChevronDown color={lightTheme.palette.text.primary} size={20} />
                                        </Stack>
                                    </Link>
                                ) : (
                                    <Link href="" onClick={(e) => { e.preventDefault(); setIsAssetsSheetOpen(true) }} className="w-full h-fit flex flex-row items-center justify-end">
                                        <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"end"} gap={1}>
                                            <Stack width="fit-content" height={"fit-content"} direction={"row"} alignItems="center" justifyContent="end">
                                                {
                                                    [...new Set(selectedComparisonIndices)].map((asset, key) => {
                                                        const logo = priorityAssetClasses.flatMap(category => category.assetClasses).find(assetClass => assetClass.colName === asset)?.logo || "Not found"
                                                        return (
                                                            <Stack
                                                                key={key}
                                                                marginLeft={`${(key * -1 * 8) / key}px`}
                                                                zIndex={key * 10}
                                                                width={25}
                                                                height={25}
                                                                borderRadius={"9999px"}
                                                                border={"solid 0.5px rgba(37, 37, 37, 0.4)"}
                                                                boxShadow={"0px 1px 1px 1px rgba(37, 37, 37, 0.3)"}
                                                                sx={{
                                                                    backgroundColor: "#FFFFFF",
                                                                    backgroundImage: `url('${logo}')`,
                                                                    backgroundPosition: "center",
                                                                    backgroundSize: "cover",
                                                                    backgroundRepeat: "no-repeat"
                                                                }}
                                                            >

                                                            </Stack>
                                                        )
                                                    })
                                                }
                                            </Stack>
                                            <IoChevronDown color={lightTheme.palette.text.primary} size={20} />
                                        </Stack>
                                    </Link>
                                )
                            )
                    }
                </Stack>


            </Stack>
            <Stack display={"none"} width={"100%"} height={"fit-content"} direction={"row"} marginTop={0.5} alignItems={"center"} justifyContent={"start"} id="PWAIndexComparisonSlider">
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
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            },
                        },
                    ]}
                >
                    {
                        priorityAssetClasses.map((item, id) => {

                            if (item.index == selectedIndex) {
                                return item.assetClasses.map((assetClass, key) => {
                                    return (
                                        <Stack key={key} width={"30vw"} height={"100%"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={{
                                            backgroundColor: selectedComparisonIndices.includes(assetClass.colName) ? '#2962FF99' : '#F8F9FA',
                                            boxShadow: selectedComparisonIndices.includes(assetClass.colName) ? `0px 0px 6px 1px #2962FF` : '0px 2px 8px rgba(0, 0, 0, 0.4)',
                                        }} onClick={() => {
                                            function change() {
                                                if (!selectedComparisonIndices.includes(assetClass.colName)) {
                                                    // fetchIndexData({ tableName: 'histcomp', index: assetClass.colName })
                                                    setSelectedIndices((prevState) => [...prevState, assetClass.colName])
                                                    changeSelectedComparisonIndices(selectedIndices)
                                                    changeSelectedComparisonIndices(selectedIndices)
                                                } else {
                                                    // removeIndex(assetClass.colName)
                                                    setSelectedIndices((prevState) =>
                                                        prevState.filter((i) => {
                                                            return i != assetClass.colName
                                                        })
                                                    )
                                                    changeSelectedComparisonIndices(selectedIndices)
                                                    changeSelectedComparisonIndices(selectedIndices)
                                                }
                                            }

                                            change();
                                        }}>
                                            <Stack width={"3rem"} sx={{
                                                aspectRatio: "1",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "cover",
                                                backgroundImage: `url('${assetClass.logo}')`
                                            }}></Stack>
                                            <Typography variant="caption" sx={{
                                                color: selectedComparisonIndices.includes(assetClass.colName) ? '#FFFFFF' : '#000000',
                                                fontWeight: 700,
                                                marginRight: "0.3rem"
                                            }}>
                                                {assetClass.name.toString().toUpperCase()}
                                            </Typography>
                                        </Stack>
                                    )
                                })
                            }
                        })
                    }
                </Slider>
            </Stack>
            <Sheet
                isOpen={isAssetsSheetOpen}
                onClose={() => setIsAssetsSheetOpen(false)}
                snapPoints={[300, 300, 0, 0]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Stack width={"100%"} height={"100%"} maxHeight={"100%"} paddingBottom={"1.6rem"} sx={{ overflowY: "scroll" }}>
                            <Typography variant="subtitle1" align="center" sx={{ color: lightTheme.palette.text.primary }}>
                                Top assets
                            </Typography>
                            <Typography variant="caption" align="center" marginBottom={"1rem"} sx={{ color: lightTheme.palette.text.primary }}>
                                Double-click to add/remove
                            </Typography>
                            <Stack direction={"column"} height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"start"} paddingX={2} paddingY={1} gap={2.5}>
                                {
                                    priorityAssetClasses.map((item, id) => {

                                        if (item.index == selectedIndex) {
                                            return item.assetClasses.map((assetClass, key) => {
                                                return (
                                                    <Link key={key} href={""} className="w-full h-fit flex flex-row" onClick={(e) => {
                                                        e.preventDefault();

                                                        function change() {
                                                            if (!selectedComparisonIndices.includes(assetClass.colName)) {
                                                                // fetchIndexData({ tableName: 'histcomp', index: assetClass.colName })
                                                                setSelectedIndices((prevState) => [...prevState, assetClass.colName])
                                                                changeSelectedComparisonIndices(selectedIndices)
                                                                //changeSelectedComparisonIndices(selectedIndices)
                                                            } else {
                                                                // removeIndex(assetClass.colName)
                                                                setSelectedIndices((prevState) =>
                                                                    prevState.filter((i) => {
                                                                        return i != assetClass.colName
                                                                    })
                                                                )
                                                                changeSelectedComparisonIndices(selectedIndices)
                                                                //changeSelectedComparisonIndices(selectedIndices)
                                                            }

                                                        }

                                                        change()
                                                    }}>
                                                        <Stack key={key} width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                                            <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                                                                <Stack width={35} height={35} sx={{
                                                                    borderRadius: "99999px",
                                                                    backgroundColor: "none",
                                                                    backgroundSize: "cover",
                                                                    backgroundRepeat: "no-repeat",
                                                                    backgroundImage: `url('${assetClass.logo}')`,
                                                                    border: "solid 0.5px #C7C7C7",
                                                                    boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
                                                                }}></Stack>
                                                                <Typography variant="subtitle1" sx={{
                                                                    color: lightTheme.palette.text.primary,
                                                                    fontWeight: 700,
                                                                    marginRight: "0.3rem"
                                                                }}>
                                                                    {assetClass.name.toString().toUpperCase()}
                                                                </Typography>
                                                            </Stack>
                                                            {
                                                                selectedComparisonIndices.includes(assetClass.colName) ? (
                                                                    <Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} borderRadius={"9999px"} sx={{ backgroundColor: "#1C96E8" }} padding={0.5}>
                                                                        <IoMdCheckmark size={16} color="#FFFFFF" />
                                                                    </Stack>
                                                                ) : ("")
                                                            }


                                                        </Stack>
                                                    </Link>
                                                )
                                            })
                                        }
                                    })
                                }
                            </Stack>
                        </Stack>

                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => { setIsAssetsSheetOpen(false) }} />
            </Sheet>
        </>
    )
}

export default PWAIndexComparisonBox