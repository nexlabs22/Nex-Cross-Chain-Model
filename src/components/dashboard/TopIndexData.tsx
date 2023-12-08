'use client'

import Image from 'next/image'
import Link from 'next/link'

//Components
import DashboardChartBox from './ChartBox'
import { Accordion, AccordionItem } from '@szhsin/react-accordion'
import GenericAddressTooltip from '../GenericAddressTooltip'

// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Logos and icons :
import { GrBitcoin, GrFormClose } from 'react-icons/gr'
import { BsInfoCircle } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { SiTether, SiBinance, SiRipple } from 'react-icons/si'
import { AiOutlinePlus } from 'react-icons/ai'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { IoCopyOutline, IoClose } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { CgArrowsExchange } from 'react-icons/cg'
import { TbCurrencySolana } from 'react-icons/tb'
import { useEffect } from 'react'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import etherscanLogo from '@assets/images/etherscan.png'
import GenericTooltip from '../GenericTooltip'

const TopIndexData = () => {
	const { defaultIndex, changeDefaultIndex } = useLandingPageStore()
	const { setANFIWeightage, fetchIndexData, setDayChangePer } = useChartDataStore()

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	useEffect(() => {
		setDayChangePer()
		setANFIWeightage()
	}, [setANFIWeightage, setDayChangePer])

	const IndicesWithDetails = [
		{
			name: 'ANFI',
			logo: anfiLogo,
			symbol: 'ANFI',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				"The Anti-inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures.\nGold has traditionally been a reliable investment. Nevertheless, it's worth considering that Bitcoin, often referred to as 'digital gold,' has the potential to assume a prominent role in everyday life in the future.",
			mktCap: '0',
			mktPrice: 0,
			chg24h: '0',
			tokenAddress: '0xF17A...9caE8D',
			managementFee: '1.00',
			underlyingAssets: [
				{
					symbol: 'XAUT',
					name: 'Tokenized Gold',
					percentage: 70,
					bgColor: '#A9C3B6',
					hoverColor: '#D4B460',
					logo: <SiTether size={20} color="#F2F2F2" />,
				},
				{
					symbol: 'BTC',
					name: 'Bitcoin',
					percentage: 30,
					bgColor: '#BBC8C2',
					hoverColor: '#F7931A',
					logo: <GrBitcoin color="#F2F2F2" size={20} />,
				},
			],
		},
		{
			name: 'CRYPTO 5',
			logo: cr5Logo,
			symbol: 'CRYPTO5',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				'The "Crypto 5 Index" represents a meticulously curated basket of assets designed to provide investors with a secure and diversified entry into the digital assets industry. It not only offers stability through its carefully selected assets but also presents substantial growth potential. This makes it an ideal choice for crypto investors seeking a balanced and reliable investment option in the ever-evolving cryptocurrency landscape.',
			mktCap: '3.29M',
			mktPrice: 824.18,
			chg24h: '12891',
			tokenAddress: '0xA29B...9caE8D',
			managementFee: '1.00',
			underlyingAssets: [
				{
					symbol: 'BTC',
					name: 'Bitcoin',
					percentage: 50,
					bgColor: '#A9C3B6',
					hoverColor: '#F7931A',
					logo: <GrBitcoin color="#F2F2F2" size={20} />,
				},
				{
					symbol: 'ETH',
					name: 'Ethereum',
					percentage: 25,
					bgColor: '#BBC8C2',
					hoverColor: '#627EEA',
					logo: <FaEthereum color="#F2F2F2" size={19} />,
				},
				{
					symbol: 'BNB',
					name: 'Binance coin',
					percentage: 8,
					bgColor: '#C7CECA',
					hoverColor: '#FCD535',
					logo: <SiBinance color="#F2F2F2" size={19} />,
				},
				{
					symbol: 'XRP',
					name: 'Riplle XRP',
					percentage: 12,
					bgColor: '#C7CECA',
					hoverColor: '#009393',
					logo: <SiRipple color="#F2F2F2" size={19} />,
				},

				{
					symbol: 'SOL',
					name: 'SOLANA',
					percentage: 5,
					bgColor: '#C7CECA',
					hoverColor: '#2775CA',
					logo: <TbCurrencySolana color="#F2F2F2" size={19} />,
				},
			],
		},
	]

	const defaultIndexObject = IndicesWithDetails.find((o) => o.symbol === defaultIndex)
	const othertIndexObject = IndicesWithDetails.find((o) => o.symbol != defaultIndex)

	return (
		<section className="px-2 h-fit lg:px-10 py-6 xl:py-16">
			<div className="flex h-fit xl:h-[45vh] flex-row items-stretch justify-between gap-1 xl:gap-4 mb-6">
				<div className="h-full w-full lg:w-1/2 rounded-2xl py-3 xl:py-6 bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-md shadow-blackText-500/50">
					<div className="flex flex-row items-center justify-between px-2 xl:px-6 w-full">
						<div className="flex flex-row items-center justify-start">
							<Image src={defaultIndexObject?.logo ? defaultIndexObject?.logo : ''} alt="" height={35} width={35} className="mr-2"></Image>
							<h5 className="interBlack mr-3 text-xl xl:text-2xl lg:text-4xl text-white titleShadow">{defaultIndexObject?.name}</h5>
						</div>
					</div>
					<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
						<div className="flex flex-row items-center justify-start">
							{defaultIndexObject?.underlyingAssets.map((asset, i) => {
								const zindex = i * 10
								return (
									<div key={i} className="aspect-square w-fit rounded-lg bg-colorSeven-500 p-[4px] shadow-sm shadow-slate-500" style={{ zIndex: `'${zindex}'`, marginLeft: '-2%' }}>
										{asset.logo}
									</div>
								)
							})}
						</div>
						<h5 className="interMedium flex items-center justify-center text-sm text-white">+{defaultIndexObject?.underlyingAssets.length} Assets</h5>
					</div>
					<div className="hidden xl:block w-full h-[1px] bg-gray-300 my-4"></div>
					<h5 className="interMedium hidden xl:block px-6 w-full text-lg text-white titleShadow">{defaultIndexObject?.description}</h5>
				</div>
				<div
					className="h-full w-full lg:w-1/2 rounded-2xl py-3 xl:py-6 border-[2px] border-gray-300 cursor-pointer hover:shadow-md hover:shadow-gray-200 shadow-md"
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
							<h5 className="interBlack mr-3 text-xl xl:text-2xl lg:text-4xl text-blackText-500">{othertIndexObject?.name} </h5>
						</div>
						<div className="hidden xl:flex flex-row items-center justify-center gap-1 bg-colorSeven-500 shadow-sm shadow-blackText-500 py-2 px-4 rounded-full">
							<h5 className="text-sm interMedium text-whiteText-500">See {othertIndexObject?.name}</h5>
						</div>
					</div>
					<div className="mt-5 hidden xl:flex flex-row items-center justify-start px-6">
						<div className="flex flex-row items-center justify-start">
							{othertIndexObject?.underlyingAssets.map((asset, i) => {
								const zindex = i * 10
								return (
									<div key={i} className="aspect-square w-fit rounded-lg bg-colorSeven-500 p-[4px] shadow-sm shadow-slate-500" style={{ zIndex: `'${zindex}'`, marginLeft: '-2%' }}>
										{asset.logo}
									</div>
								)
							})}
						</div>
						<h5 className="interMedium flex items-center justify-center text-xs text-blackText-500">+{othertIndexObject?.underlyingAssets.length} Assets</h5>
					</div>
					<div className="w-full hidden xl:block h-[1px] bg-gray-300 my-4"></div>
					<h5 className="interMedium hidden xl:block px-6 w-full text-lg text-blackText-500">{othertIndexObject?.description}</h5>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>
			<div className="hidden my-8 lg:flex flex-row items-center justify-between gap-24">
				<div className="flex w-2/6 flex-row items-center justify-between">
					<div>
						<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className="interExtraBold text-base text-gray-400">Market Cap</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className=" text-whiteText-500 text-sm interBold mb-1">Market Cap:</p>
											<p className=" text-gray-200 text-sm interMedium">
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

						<h5 className="interMedium text-base text-colorSeven-500">${defaultIndexObject?.mktCap}</h5>
					</div>
					<div>
						<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className="interExtraBold text-base text-gray-400">Market Price</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className=" text-whiteText-500 text-sm interBold mb-1">Market Price:</p>
											<p className=" text-whiteText-500 text-sm interMedium">The current value of a single unit of cryptocurrency in the market, indicating its buying or selling cost.</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
							</span>
						</div>
						<h5 className="interMedium text-base text-colorSeven-500">${defaultIndexObject?.mktPrice}</h5>
					</div>
					<div>
					<div className="w-fit h-fit flex flex-row items-center justify-center gap-1 mb-5">
							<h5 className="interExtraBold text-base text-gray-400">24h Change</h5>
							<span>
								<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className=" text-whiteText-500 text-sm interBold mb-1">24h Change:</p>
											<p className=" text-whiteText-500 text-sm interMedium">the percentage difference in a cryptocurrency{"'"}s price over the past day, reflecting recent price performance.</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
							</span>
						</div>
						<h5 className="interMedium text-base text-colorSeven-500">+${defaultIndexObject?.chg24h}</h5>
					</div>
				</div>
				<div className="w-4/6">
					<div className="mb-5 flex w-full flex-row items-center justify-start gap-1">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiGlobe color="#9CAAC6" size={20} />
							<h5 className="interExtraBold ml-2 text-base text-gray-400">Token address</h5>
						</div>
						<div className="flex flex-row items-center justify-between">
							<h5 className="interMedium mr-2 text-base text-colorSeven-500">null</h5>
							<GenericAddressTooltip color="#5E869B" address="0x18C41549ee05F893B5eA6ede6f8dccC1a9C16f44">
								<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer" />
							</GenericAddressTooltip>
						</div>
					</div>
					<div className="flex w-full flex-row items-center justify-start">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiStreamOn color="#9CAAC6" size={20} />
							<h5 className="interExtraBold ml-2 text-base text-gray-400">Managment fee</h5>
						</div>
						<div className="flex flex-row items-center justify-between gap-1">
						<h5 className="interMedium text-base text-blackText-500">{defaultIndexObject?.managementFee}%</h5>
						<GenericTooltip
									color="#5E869B"
									content={
										<div>
											<p className=" text-whiteText-500 text-sm interBold mb-1">Management Fees:</p>
											<p className=" text-whiteText-500 text-sm interMedium">the percentage difference in a cryptocurrency{"'"}s price over the past day, reflecting recent price performance.</p>
										</div>
									}
								>
									<BsInfoCircle color="#5E869B" size={12} className="cursor-pointer mt-1" />
								</GenericTooltip>
						</div>
						
					</div>
				</div>
			</div>

			<div className="block xl:hidden w-full h-fit text-blackText-500 py-6">
				<Accordion className="w-full">
					<AccordionItem
						header={
							<div className="w-full h-fit flex flex-row items-center justify-between px-2">
								<h5 className=" text-blackText-500 text-xl interBlack">{'More About ' + defaultIndexObject?.name.toString()}</h5>
								<AiOutlinePlus color="#000000" size={25}></AiOutlinePlus>
							</div>
						}
					>
						<div className="w-full h-fit flex flex-col items-start justify-start gap-2 px-2 py-3">
							<h5 className="interMedium text-blackText-500 text-xl">{defaultIndexObject?.description}</h5>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 grid-col gap-y-5 lg:hidden px-2 py-5">
							<div className="flex flex-col items-center justify-center">
								<h5 className="interExtraBold mb-5 text-xl text-gray-400">Market Cap</h5>
								<h5 className="interMedium text-lg text-blackText-500">${defaultIndexObject?.mktCap}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className="interExtraBold mb-5 text-xl text-gray-400">Market Price</h5>
								<h5 className="interMedium text-lg text-blackText-500">${defaultIndexObject?.mktCap}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className="interExtraBold mb-5 text-xl text-gray-400">24h Change</h5>
								<h5 className="interMedium text-lg text-blackText-500">${defaultIndexObject?.mktCap}</h5>
							</div>
							<div className="flex flex-col items-center justify-center">
								<h5 className="interExtraBold mb-5 text-xl text-gray-400">Managment Fees</h5>
								<h5 className="interMedium text-lg text-blackText-500">${defaultIndexObject?.mktCap}</h5>
							</div>
						</div>
						<div className="flex flex-row items-center justify-center gap-1 lg:hidden px-2">
							<CiGlobe color="#9CAAC6" size={20} />
							<h5 className="interExtraBold text-xl text-gray-400">Token address</h5>
						</div>
						<div className="flex flex-row items-center justify-center gap-2 lg:hidden px-2 py-2">
							<h5 className="interMedium text-lg text-blackText-500">null</h5>

							<BsInfoCircle color="#5E869B" size={25} />
						</div>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>

			<div>
				<div className="w-full h-fit flex flex-row items-center justify-between">
					<div className="mt-6 xl:mt-10 mb-5 flex flex-row items-center justify-center lg:justify-start">
						<h5 className="interBlack  text-xl lg:text-2xl text-blackText-500">{defaultIndexObject?.symbol}</h5>
						<CgArrowsExchange color="#5E869B" size={35} className="mx-2" />
						<h5 className="interBlack text-xl lg:text-2xl text-blackText-500">World{"'"}s best assets</h5>
						<div className="w-fit h-fit p-3 ml-2 hidden lg:flex flex-row items-center justify-center gap-2 rounded-3xl bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500">
							<h5 className="text-sm interExtraBold text-whiteText-500">{defaultIndexObject?.name}</h5>
							
						</div>
					</div>
				</div>

				<div className="h-fit w-full">
					<DashboardChartBox />
				</div>
			</div>
		</section>
	)
}

export default TopIndexData
