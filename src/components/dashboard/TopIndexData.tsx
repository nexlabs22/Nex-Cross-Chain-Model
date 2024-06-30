'use client'
import { ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

//Components
import DashboardChartBox from './ChartBox'
import GenericAddressTooltip from '../GenericAddressTooltip'
import GenericTooltip from '../GenericTooltip'
import { Accordion, AccordionItem } from '@szhsin/react-accordion'
import { reduceAddress } from '@/utils/general'
import { FormatToViewNumber, num } from '@/hooks/math'
import { usePWA } from '@/providers/PWAProvider'
import { useDashboard } from '@/providers/DashboardProvider'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Store
import { useLandingPageStore } from '@/store/store'


// Logos and icons :

import { BsChevronCompactLeft, BsChevronCompactRight, BsInfoCircle } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { CgArrowsExchange } from 'react-icons/cg'
import managment from '@assets/images/managment.png'
import mesh1 from '@assets/images/mesh1.png'
import { GoArrowRight } from 'react-icons/go'
import mag7 from '@assets/images/mag7.png'
import React from 'react'
import { CustomArrowProps } from "react-slick";
import { Stack, Box, Typography, Button, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';
import { GradientStack } from '@/theme/overrides'


const CustomNextArrow: React.FC<CustomArrowProps> = ({
	onClick,
	className,
}) => {
	return (
		<Stack className="glassy" position={"absolute"} right={"1.25rem"} top={"45%"} zIndex={20} width={"fit-content"} borderRadius={"9999px"} border={"none"} padding={1} sx={{
			aspectRatio: "1",
			cursor: "pointer"
		}}
			onClick={onClick}
		>
			<BsChevronCompactRight color="#FFFFFF" size={25} />
		</Stack>
	);
};

const CustomPrevArrow: React.FC<CustomArrowProps> = ({
	onClick,
	className,
}) => {
	return (
		<Stack className="glassy" position={"absolute"} left={"1.25rem"} top={"45%"} zIndex={20} width={"fit-content"} borderRadius={"9999px"} border={"none"} padding={1} sx={{
			aspectRatio: "1",
			cursor: "pointer"
		}}
			onClick={onClick}
		>
			<BsChevronCompactLeft color="#FFFFFF" size={25} />
		</Stack>
	);
};

const TopIndexData = () => {


	const {
		anfiIndexObject,
		cr5IndexObject,
		mag7IndexObject,
		CR5UnderLyingAssets,
		ANFIUnderLyingAssets,
		MAG7UnderLyingAssets,
		IndicesWithDetails
	} = useDashboard();
	const { isStandalone } = usePWA()
	const { mode } = useLandingPageStore()
	const { defaultIndex, changeDefaultIndex, theme } = useLandingPageStore()
	const sliderRef = React.useRef<Slider | null>(null);

	const [selectedIndex, setSelectedIndex] = useState(defaultIndex == "ANFI" ? anfiIndexObject : defaultIndex == "CRYPTO5" ? cr5IndexObject : mag7IndexObject)
	const selectedIndexWeights = defaultIndex == "ANFI" ? ANFIUnderLyingAssets : defaultIndex == "CRYPTO5" ? CR5UnderLyingAssets : MAG7UnderLyingAssets

	useEffect(() => {
		setSelectedIndex(defaultIndex == "ANFI" ? anfiIndexObject : defaultIndex == "CRYPTO5" ? cr5IndexObject : mag7IndexObject)
	}, [anfiIndexObject, cr5IndexObject, defaultIndex, mag7IndexObject])


	return (
		<>
			{
				isStandalone ? (
					<>

					</>
				) : (
					<>
						<section className="px-2 h-fit lg:px-10 pb-6 pt-3 xl:pb-16 xl:pt-8">
							<Stack width={"100%"} height={400} marginBottom={4} borderRadius={4} direction={"row"} gap={0.5} alignItems={"start"} justifyContent={"start"} divider={<Divider orientation="vertical" variant='middle' flexItem />} sx={GradientStack}>
								<Stack width={"35%"} height={"fit-content"} direction={"column"} alignContent={"start"} justifyContent={"start"} padding={4}>
									<Stack direction={"row"} alignItems={"center"} justifyContent={"start"}>
										<Image src={selectedIndex && selectedIndex.logo ? selectedIndex?.logo : ""} alt="" height={35} width={35} className="mr-2"></Image>
										<Typography variant="h6" component="h6" sx={{
											fontWeight: 600
										}}>
											{selectedIndex?.name}
										</Typography>
									</Stack>
									<Typography variant="subtitle2" component="p" sx={{
										marginTop: "1.2rem"
									}}>
										{
											selectedIndex?.description
										}
									</Typography>

								</Stack>
								<Stack width={"30%"} height={"fit-content"} direction={"column"} alignContent={"start"} justifyContent={"start"} padding={4}>
									<Typography variant="h6" component="h6" sx={{
										fontWeight: 600,
									}}>
										Key Information
									</Typography>
									<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginTop={"1.2rem"} marginBottom={"0.8rem"}>
										<Stack direction={"column"} alignItems={"start"} justifyContent={"space-between"} gap={1}>
											<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
												<Typography variant="caption" component={"p"} sx={{
													fontSize: "1.1rem",
													fontWeight: "600"
												}}>
													Market Cap
												</Typography>
												<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
											</Stack>
											<Typography variant="caption" component={"p"} sx={{
												fontSize: "1rem",
												fontWeight: "400"
											}}>
												{selectedIndex?.mktCap + " " + selectedIndex?.shortSymbol}
											</Typography>
										</Stack>
										<Stack direction={"column"} alignItems={"start"} justifyContent={"space-between"} gap={1}>
											<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
												<Typography variant="caption" component={"p"} sx={{
													fontSize: "1.1rem",
													fontWeight: "600"
												}}>
													Market Price
												</Typography>
												<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
											</Stack>
											<Typography variant="caption" component={"p"} sx={{
												fontSize: "1rem",
												fontWeight: "400"
											}}>
												${selectedIndex?.mktPrice}
											</Typography>
										</Stack>
									</Stack>
									<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={"0.8rem"}>
										<Stack direction={"column"} alignItems={"start"} justifyContent={"space-between"} gap={1}>
											<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
												<Typography variant="caption" component={"p"} sx={{
													fontSize: "1.1rem",
													fontWeight: "600"
												}}>
													24h Change
												</Typography>
												<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
											</Stack>
											<Typography variant="caption" component={"p"} sx={{
												fontSize: "1rem",
												fontWeight: "400",
												color: Number(selectedIndex?.chg24h) > 0 ? "#089981" : "#F23645"
											}}>
												{selectedIndex?.chg24h}%
											</Typography>
										</Stack>
										<Stack direction={"column"} alignItems={"start"} justifyContent={"space-between"} gap={1}>
											<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
												<Typography variant="caption" component={"p"} sx={{
													fontSize: "1.1rem",
													fontWeight: "600"
												}}>
													Management Fees
												</Typography>
												<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
											</Stack>
											<Typography variant="caption" component={"p"} sx={{
												fontSize: "1rem",
												fontWeight: "400"
											}}>
												{selectedIndex?.managementFee}%
											</Typography>
										</Stack>
									</Stack>
									<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginY={"0.8rem"}>
										<Stack direction={"column"} alignItems={"start"} justifyContent={"space-between"} gap={1}>
											<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
												<Typography variant="caption" component={"p"} sx={{
													fontSize: "1.1rem",
													fontWeight: "600"
												}}>
													Token Address
												</Typography>
												<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
											</Stack>
											<Typography variant="caption" component={"p"} sx={{
												fontSize: "1rem",
												fontWeight: "400",
											}}>
												{selectedIndex?.tokenAddress ? reduceAddress(selectedIndex?.tokenAddress) : ""}
											</Typography>
										</Stack>

									</Stack>
								</Stack>
								<Stack width={"35%"} height={"fit-content"} direction={"column"} alignContent={"start"} justifyContent={"start"} padding={4}>
									<Typography variant="h6" component="h6" sx={{
										fontWeight: 600,
									}}>
										Composition
									</Typography>

									<Grid container columns={12} rowSpacing={2}>
										{
											selectedIndexWeights.map((item, key) => {
												return (
													<Grid item md={6} key={key}>
														<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
															<Stack width={'fit-content'} height={'fit-content'} padding={"0.9rem"} borderRadius={"0.8rem"} sx={GradientStack}>
																<Stack sx={{
																	scale: "1.5"
																}}>
																	{item.logo}
																</Stack>

															</Stack>
															<Stack width={'fit-content'} height={'fit-content'} direction={"column"} alignItems={"start"} justifyContent={"start"}>
																<Typography variant="caption" component={"p"} sx={{
																	fontSize: "1.1rem",
																	fontWeight: "600"
																}}>
																	{item.name}
																</Typography>
																<Typography variant="caption" component={"p"} sx={{
																	fontSize: "1rem",
																	fontWeight: "400"
																}}>
																	{item.percentage.toFixed(2)}%
																</Typography>
															</Stack>
														</Stack>

													</Grid>
												)
											})
										}

									</Grid>

								</Stack>
							</Stack>
							<Stack width={"100%"} height={"fit-content"} paddingX={"1.2rem"} marginY={"1rem"}>
								<Typography variant="h6" component="h6" sx={{
									fontWeight: 600
								}}>
									Other Products
								</Typography>
								<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={6} marginTop={"1.2rem"}>
									{
										selectedIndex?.symbol != "ANFI" ? (
											<Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); changeDefaultIndex('ANFI') }}>
												<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
													<Image src={anfiIndexObject && anfiIndexObject.logo ? anfiIndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#E8BB31] rounded-full "></Image>
													<Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
														<Typography variant="subtitle1" component="h6" sx={{
															fontWeight: 600
														}}>
															{anfiIndexObject?.name}
														</Typography>
														<Typography variant="caption" component="h6" sx={{
															fontWeight: 500
														}}>
															24h Change: <span style={{ color: Number(anfiIndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
														</Typography>
													</Stack>

												</Stack>
											</Link>
										) : ("")
									}
									{
										selectedIndex?.symbol != "CRYPTO5" ? (
											<Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); changeDefaultIndex('CRYPTO5') }}>
												<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
													<Image src={cr5IndexObject && cr5IndexObject.logo ? cr5IndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#DA3E49] rounded-full "></Image>
													<Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
														<Typography variant="subtitle1" component="h6" sx={{
															fontWeight: 600
														}}>
															{cr5IndexObject?.name}
														</Typography>
														<Typography variant="caption" component="h6" sx={{
															fontWeight: 500
														}}>
															24h Change: <span style={{ color: Number(cr5IndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
														</Typography>
													</Stack>

												</Stack>
											</Link>
										) : ("")
									}
									{
										selectedIndex?.symbol != "MAG7" ? (
											<Link href="" className="h-fit w-fit flex flex-row items-start justify-start" onClick={(e) => { e.preventDefault(); changeDefaultIndex('MAG7') }}>
												<Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
													<Image src={mag7IndexObject && mag7IndexObject.logo ? mag7IndexObject?.logo : ""} alt="" height={60} width={60} className="mr-2 border border-[#D67DEC] rounded-full "></Image>
													<Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
														<Typography variant="subtitle1" component="h6" sx={{
															fontWeight: 600
														}}>
															{mag7IndexObject?.name}
														</Typography>
														<Typography variant="caption" component="h6" sx={{
															fontWeight: 500
														}}>
															24h Change: <span style={{ color: Number(mag7IndexObject?.chg24h) > 0 ? "#089981" : "#F23645" }}>{anfiIndexObject?.chg24h}%</span>
														</Typography>
													</Stack>

												</Stack>
											</Link>
										) : ("")
									}
								</Stack>
							</Stack>








							<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
								<Stack marginTop={{ xs: 3, xl: 5 }} marginBottom={1} direction={"row"} alignItems={"center"} justifyContent={{ xs: "center", xl: "start" }}>
									<Typography variant="h6" component={"h6"} sx={{
										
										fontWeight: "600"
									}}>
										{selectedIndex?.symbol}
									</Typography>
									<CgArrowsExchange color={theme.palette.mode == "dark" ? "#FFFFFF" : "#5E869B"} size={35} className="mx-2" />
									<Typography variant="h6" component={"h6"} sx={{
										fontWeight: "600"
									}}>
										World{"'"}s best assets
									</Typography>
									<Stack width={"fit-content"} height={"fit-content"} paddingX={1.5} paddingY={1} marginLeft={1} direction={"row"} alignItems={"center"} justifyContent={"center"} borderRadius={"9999px"} sx={GradientStack}

									>
										<Typography variant="caption" component={"p"} sx={{
											fontSize: "1.1rem",
											fontWeight: "600"
										}}>
											{selectedIndex?.name}
										</Typography>
									</Stack>
								</Stack>
							</Stack>

							<Stack width={"100%"} height={"fit-content"}>
								<DashboardChartBox />
							</Stack>

						</section>
					</>
				)
			}
		</>
	)
}

export default TopIndexData
