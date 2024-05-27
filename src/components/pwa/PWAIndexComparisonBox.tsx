import { Stack, Container, Box, Chip, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PWAComparisonChip } from "@/theme/overrides";

// Data :
import { comparisonIndices } from '@/constants/comparisionIndices'

// Icons and logos :
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

import { useState, useEffect } from "react";
import { useChartDataStore, useLandingPageStore } from "@/store/store";

const PWAIndexComparisonBox = () => {

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
    }, [selectedIndex, clearChartData])



    return (
        <Stack width={"100%"} height={"fit-content"} direction={"row"} marginTop={0.5} alignItems={"center"} justifyContent={"start"} id="PWAIndexComparisonSlider">
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
                                        if (!selectedComparisonIndices.includes(assetClass.colName)) {
                                            // fetchIndexData({ tableName: 'histcomp', index: assetClass.colName })
                                            setSelectedIndices((prevState) => [...prevState, assetClass.colName])
                                            changeSelectedComparisonIndices(selectedIndices)
                                        } else {
                                            // removeIndex(assetClass.colName)
                                            setSelectedIndices((prevState) =>
                                                prevState.filter((i) => {
                                                    return i != assetClass.colName
                                                })
                                            )
                                            changeSelectedComparisonIndices(selectedIndices)
                                        }
                                    }}>
                                        <Stack width={"3rem"} sx={{
                                            aspectRatio: "1",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "cover",
                                            backgroundImage: `url('${assetClass.logo}')`
                                        }}></Stack>
                                        <Typography variant="caption" sx={{
                                            color: selectedIndices.includes(assetClass.colName) ? '#FFFFFF' : '#000000',
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
    )
}

export default PWAIndexComparisonBox