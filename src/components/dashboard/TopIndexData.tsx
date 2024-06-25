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
import { Stack, Box } from "@mui/material";

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
		defaultIndexObject,
		othertIndexObject,
		CR5UnderLyingAssets,
		ANFIUnderLyingAssets,
	} = useDashboard();
	const { isStandalone } = usePWA()
	const { mode } = useLandingPageStore()
	const { defaultIndex, changeDefaultIndex } = useLandingPageStore()
	const sliderRef = React.useRef<Slider | null>(null);

	return (
		<>
			{
				isStandalone ? (
					<>

					</>
				) : (
					<>
						<section className="px-2 h-fit lg:px-10 py-6 xl:pt-16">
							<div className="w-full overflow-x-hidden flex h-fit xl:h-fit flex-row items-stretch justify-between gap-1 xl:gap-4 mb-2" id="TopDataSectionCarousel">
								<Slider
									prevArrow={
										<CustomPrevArrow
											className="glassy"
											onClick={() => sliderRef.current?.slickPrev()}
										/>
									}
									nextArrow={
										<CustomNextArrow
											className="glassy"
											onClick={() => sliderRef.current?.slickNext()}
										/>
									}
									dots={false}
									infinite={false}
									speed={500}
									slidesToShow={1}
									autoplay={false}
									arrows
									className="relative m-0 h-full w-full p-0"
									ref={sliderRef}
									
								>
									<div
										className={`w-full lg:w-full xl:h-full xl:min-h-full rounded-2xl py-3 xl:py-6 ${mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-md shadow-blackText-500/50'
											} `}
										style={{
											boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : `url('${mesh1.src}')`,
											backgroundColor: mode == 'dark' ? `green` : '',
										}}
									>
										<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
											<div className="flex flex-row items-center justify-start">
												<Image src={defaultIndexObject?.logo ? defaultIndexObject?.logo : ''} alt="" height={35} width={35} className="mr-2"></Image>
												<h5 className={`interBlack whitespace-nowrap mr-3 text-lg xl:text-2xl lg:text-4xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} titleShadow`}>{defaultIndexObject?.name}</h5>
											</div>
										</div>
										<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
											{defaultIndexObject?.symbol == 'ANFI' ? (
												<div className="flex flex-row items-center justify-start">
													{[...ANFIUnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											) : (
												<div className="flex flex-row items-center justify-start">
													{[...CR5UnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											)}
										</div>
										<div className={`hidden xl:block w-full h-[1px] ${mode == 'dark' ? 'bg-gray-300' : 'bg-blackText-500'}  my-4`}></div>
										<h5 className={`interMedium hidden xl:block px-6 w-full text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} titleShadow`}>{defaultIndexObject?.description}</h5>
									</div>
									<div
										className={`w-full lg:w-full xl:h-full xl:min-h-full rounded-2xl py-3 xl:py-6 border-[2px] ${mode == 'dark' ? ' border-gray-400/50 hover:shadow-gray-400/50' : 'border-gray-300 hover:shadow-gray-200'
											} cursor-pointer hover:shadow-md  shadow-md shadow-blackText-500/50`}
										onClick={() => {
											if (defaultIndexObject && defaultIndexObject.symbol == 'CRYPTO5') {
												changeDefaultIndex('ANFI')
											} else {
												changeDefaultIndex('CRYPTO5')
											}
										}}
									>
										<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
											<div className="flex flex-row items-center justify-start">
												<Image src={othertIndexObject?.logo ? othertIndexObject?.logo : ''} alt="" height={35} width={35} className="mr-2"></Image>
												<h5 className={`interBlack whitespace-nowrap mr-3 text-lg xl:text-2xl lg:text-4xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{othertIndexObject?.name} </h5>
											</div>
											
										</div>
										<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
											{othertIndexObject?.symbol == 'ANFI' ? (
												<div className="flex flex-row items-center justify-start">
													{[...ANFIUnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											) : (
												<div className="flex flex-row items-center justify-start">
													{[...CR5UnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											)}
										</div>
										<div className="w-full hidden xl:block h-[1px] bg-gray-300 my-4"></div>
										<h5 className={`interMedium hidden xl:block px-6 w-full text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{othertIndexObject?.description}</h5>
									</div>
									<div
										className={`w-full lg:w-full xl:h-full xl:min-h-full rounded-2xl py-3 xl:py-6 border-[2px] ${mode == 'dark' ? ' border-gray-400/50 hover:shadow-gray-400/50' : 'border-gray-300 hover:shadow-gray-200'
											} cursor-pointer hover:shadow-md  shadow-md shadow-blackText-500/50`}
										onClick={() => {
											
										}}
									>
										<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
											<div className="flex flex-row items-center justify-start">
												<Image src={mag7} alt="" height={35} width={35} className="mr-2"></Image>
												<h5 className={`interBlack whitespace-nowrap mr-3 text-lg xl:text-2xl lg:text-4xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>MAG7</h5>
											</div>
											
										</div>
										<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
											{othertIndexObject?.symbol == 'ANFI' ? (
												<div className="flex flex-row items-center justify-start">
													{[...ANFIUnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											) : (
												<div className="flex flex-row items-center justify-start">
													{[...CR5UnderLyingAssets]
														.sort((a, b) => b.percentage - a.percentage)
														.map((asset, i) => {
															const zindex = i * 10
															return (
																<div
																	key={i}
																	className={`aspect-square w-fit rounded-lg ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-slate-500'
																		}  p-[4px] `}
																	style={{
																		zIndex: `'${zindex}'`,
																		marginLeft: '-2%',
																		boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																		backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
																	}}
																>
																	<span className={`text-whiteText-500 ${mode == 'dark' ? '' : 'invert'}`}>{asset.logo}</span>
																</div>
															)
														})}
												</div>
											)}
										</div>
										<div className="w-full hidden xl:block h-[1px] bg-gray-300 my-4"></div>
										<h5 className={`interMedium hidden xl:block px-6 w-full text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>
										 The Magnificent 7 (MG7) refers to the top seven tech-driven companies dominating the stock market: Meta Platforms, Amazon, Apple, Netflix, Alphabet, Microsoft, and Nvidia. These companies hold significant market power, robust pricing, and strong earnings potential. The term, coined in 2023 by Michael Hartnett of Bank of America, reflects their innovative capabilities and dominant positions. MG7 is the first tokenized stocks index of this type, offering new digital investment opportunities on blockchain platforms.
										</h5>
									</div>
								</Slider>


							</div>
							<div className="flex w-full flex-row items-center justify-center">
								<div className={`h-[1px] w-full ${mode == 'dark' ? ' bg-whiteBackground-500/80' : 'bg-blackText-500/20'} `}></div>
							</div>
							<div className="hidden my-2 lg:flex flex-row items-stretch justify-between gap-24">
								<div className="flex w-2/6 py-12 flex-grow flex-row items-center justify-between">
									<div>
										<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
											<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Market Cap</h5>
											<span>
												<GenericTooltip
													color="#5E869B"
													content={
														<div>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Market Cap:</p>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
																The total value of a cryptocurrency, calculated by multiplying its price by the circulating supply. It indicates the cryptocurrency{"'"}s significance in the
																market.
															</p>
														</div>
													}
												>
													<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
												</GenericTooltip>
											</span>
										</div>

										<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>
											{FormatToViewNumber({ value: Number(defaultIndexObject?.mktCap), returnType: 'string' }) + ' ' + defaultIndexObject?.shortSymbol}
										</h5>
									</div>
									<div>
										<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
											<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Market Price</h5>
											<span>
												<GenericTooltip
													color="#5E869B"
													content={
														<div>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Market Price:</p>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
																The current value of a single unit of cryptocurrency in the market, indicating its buying or selling cost.
															</p>
														</div>
													}
												>
													<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
												</GenericTooltip>
											</span>
										</div>
										<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>
											${FormatToViewNumber({ value: Number(defaultIndexObject?.mktPrice), returnType: 'string' })}
										</h5>
									</div>
									<div>
										<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
											<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>24h Change</h5>
											<span>
												<GenericTooltip
													color="#5E869B"
													content={
														<div>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>24h Change:</p>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
																the percentage difference in a cryptocurrency{"'"}s price over the past day, reflecting recent price performance.
															</p>
														</div>
													}
												>
													<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
												</GenericTooltip>
											</span>
										</div>
										<h5 className={`interMedium text-base  ${defaultIndexObject?.chg24h && Number(defaultIndexObject?.chg24h) > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500'}`}>
											{defaultIndexObject?.chg24h}%
										</h5>
									</div>
								</div>
								<div className="w-4/6 flex-grow flex flex-row items-stretch justify-between">
									<div className="flex-grow w-1/3 flex flex-col items-start justify-center">
										<div className="mb-5 flex w-full flex-row items-center justify-start gap-1">
											<div className="mr-5 flex min-w-max flex-row items-center justify-between">
												<CiGlobe color="#9CAAC6" size={20} />
												<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : ' text-blackText-500'} `}>Token address</h5>
											</div>
											<div className="flex flex-row items-center justify-between gap-1">
												<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} `}>{reduceAddress(defaultIndexObject?.tokenAddress as string)}</h5>
												<GenericAddressTooltip
													color="#5E869B"
													address={defaultIndexObject?.tokenAddress as string}
													totalSupply={defaultIndexObject?.totalSupply as string}
													name={defaultIndexObject?.name as string}
												>
													<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
												</GenericAddressTooltip>
											</div>
										</div>
										<div className="flex w-full flex-row items-center justify-start">
											<div className="mr-5 flex flex-row items-center justify-between">
												<CiStreamOn color="#9CAAC6" size={20} />
												<h5 className={`interExtraBold text-base ${mode == 'dark' ? ' text-gray-100' : 'text-blackText-500'} `}>Management Fees</h5>
											</div>
											<div className="flex flex-row items-center justify-between gap-1">
												<h5 className={`interMedium text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{defaultIndexObject?.managementFee} %</h5>
												<GenericTooltip
													color="#5E869B"
													content={
														<div>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-1`}>Management Fees:</p>
															<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
																We charge a competitive 1.5% annual management fee on assets under management, similar to traditional ETF providers.
															</p>
														</div>
													}
												>
													<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
												</GenericTooltip>
											</div>
										</div>
									</div>
									<div className="flex-grow min-h-full p-2 w-2/3 flex flex-row items-center justify-end">
										<div
											className={`w-2/3 relative overflow-hidden h-full ${mode == 'dark' ? 'bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'
												} rounded-2xl`}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
											<Image src={managment} alt="managment section" className="absolute z-10 -right-32 -bottom-40 scale-50"></Image>
											<div className="absolute h-full top-0 left-0 w-4/5 z-50 flex flex-col items-start justify-start p-4">
												<h5 className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} titleShadow text-2xl mb-3`}>Nexlabs Fees</h5>

												<Link href={'https://nex-labs.gitbook.io/nex-dex/protocol-structure/fees'}>
													<button
														className={`interBold flex h-fit mt-3 w-fit flex-row items-center justify-center gap-1 rounded-2xl bg-gradient-to-tl ${mode == 'dark' ? 'titleShadow bg-cover bg-center bg-no-repeat text-whiteText-500' : 'from-colorFour-500 to-colorSeven-500 text-blackText-500'
															}  px-5 py-3 text-2xl shadow-sm shadow-blackText-500 active:translate-y-[1px] active:shadow-black `}
														style={{
															backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
															boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
														}}
													>
														<span>Learn More</span>
														{mode == 'dark' ? <GoArrowRight color="#FFFFFF" size={30} /> : <GoArrowRight color="#252525" size={30} />}
													</button>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="block xl:hidden w-full h-fit text-blackText-500 py-6">
								<Accordion className="w-full">
									<AccordionItem
										header={
											<div className="w-full h-fit flex flex-row items-center justify-between px-2">
												<h5 className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-xl interBlack`}>{'More About ' + defaultIndexObject?.name.toString()}</h5>
												{mode == 'dark' ? <AiOutlinePlus color="#FFFFFF" size={25}></AiOutlinePlus> : <AiOutlinePlus color="#000000" size={25}></AiOutlinePlus>}
											</div>
										}
									>
										<div className="w-full h-fit flex flex-col items-start justify-start gap-2 px-2 py-3">
											<h5 className={`interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-xl`}>{defaultIndexObject?.description}</h5>
										</div>
										<div className="grid grid-cols-2 grid-rows-2 grid-col gap-y-5 lg:hidden px-2 py-5">
											<div className="flex flex-col items-center justify-center">
												<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Market Cap</h5>
												<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
											</div>
											<div className="flex flex-col items-center justify-center">
												<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Market Price</h5>
												<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
											</div>
											<div className="flex flex-col items-center justify-center">
												<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>24h Change</h5>
												<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
											</div>
											<div className="flex flex-col items-center justify-center">
												<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Managment Fees</h5>
												<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A{/*defaultIndexObject?.mktCap*/}</h5>
											</div>
										</div>
										<div className="flex flex-row items-center justify-center gap-1 lg:hidden px-2">
											<CiGlobe color="#9CAAC6" size={20} />
											<h5 className={`interExtraBold mb-5 text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-400'}`}>Token address</h5>
										</div>
										<div className="flex flex-row items-center justify-center gap-2 lg:hidden px-2 py-2">
											<h5 className={`interMedium text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>N/A</h5>

											<BsInfoCircle color="#5E869B" size={25} />
										</div>
									</AccordionItem>
								</Accordion>
							</div>

							<div className="flex w-full flex-row items-center justify-center">
								<div className={`h-[1px] w-full ${mode == 'dark' ? ' bg-whiteBackground-500/80' : 'bg-blackText-500/20'} `}></div>
							</div>

							<div>
								<div className="w-full h-fit flex flex-row items-center justify-between">
									<div className="mt-6 xl:mt-10 mb-5 flex flex-row items-center justify-center lg:justify-start">
										<h5 className={`interBlack  text-xl lg:text-2xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>{defaultIndexObject?.symbol}</h5>
										{mode == 'dark' ? <CgArrowsExchange color="#FFFFFF" size={35} className="mx-2" /> : <CgArrowsExchange color="#5E869B" size={35} className="mx-2" />}

										<h5 className={`interBlack  text-xl lg:text-2xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} `}>World{"'"}s best assets</h5>
										<div
											className={`w-fit h-fit p-3 ml-2 hidden lg:flex flex-row items-center justify-center gap-2 rounded-3xl ${mode == 'dark' ? 'bg-cover  border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
												} `}
											style={{
												boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
											}}
										>
											<h5 className={`text-sm interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>{defaultIndexObject?.name}</h5>
										</div>
									</div>
								</div>

								<div className="h-fit w-full">
									<DashboardChartBox />
									{/* <TradingViewChart index={defaultIndex}/> */}
								</div>
							</div>
						</section>
					</>
				)
			}
		</>
	)
}

export default TopIndexData
