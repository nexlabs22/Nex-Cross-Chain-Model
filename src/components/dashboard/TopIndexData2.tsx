"use client"

import { GrBitcoin } from 'react-icons/gr'
import { FaEthereum } from 'react-icons/fa'
import { SiTether, SiBinance } from 'react-icons/si'
import { BiDollarCircle } from 'react-icons/bi'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { IoCopyOutline } from 'react-icons/io5'
import { CgArrowsExchange } from 'react-icons/cg'

import DashboardChartBox from './ChartBox'

const TopIndexData2 = () => {
	return (
		<section className="py-16 px-10">
			<div className="flex flex-row items-center justify-start">
				<h5 className="monumentBold mr-3 text-3xl text-blackText-500">Safe crypto index</h5>
				<h5 className="monumentBold rounded-lg bg-colorOne-500 py-1 px-3 text-base text-whiteText-500">CRYPTO5</h5>
			</div>
			<div className="mt-5 flex flex-row items-center justify-start">
				<div className="mr-3 flex flex-row items-center justify-start">
					<div className="z-50 aspect-square w-fit rounded-lg bg-whiteText-500 p-[4px] shadow-sm shadow-slate-500">
						<GrBitcoin color="#F7931A" size={20} />
					</div>
					<div className="z-40 ml-[-10px] aspect-square w-fit rounded-lg bg-whiteText-500 p-[4px] shadow-sm shadow-slate-500">
						<FaEthereum color="#627EEA" size={19} />
					</div>
					<div className="z-30 ml-[-5px] aspect-square w-fit rounded-lg bg-whiteText-500 p-[4px] shadow-sm shadow-slate-500">
						<SiTether color="#009393" size={19} />
					</div>
					<div className="z-20 ml-[-5px] aspect-square w-fit rounded-lg bg-whiteText-500 p-[4px] shadow-sm shadow-slate-500">
						<SiBinance color="#FCD535" size={19} />
					</div>
					<div className="z-10 ml-[-5px] aspect-square w-fit rounded-lg bg-whiteText-500 p-[4px] shadow-sm shadow-slate-500">
						<BiDollarCircle color="#2775CA" size={19} />
					</div>
				</div>
				<h5 className="monument flex items-center justify-center text-xs text-blackText-500">+5 Assets</h5>
			</div>
			<h5 className="monument mt-6 mb-10 text-xl text-blackText-500 w-4/6">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
				non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</h5>
			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>
			<div className="my-8 flex flex-row items-center justify-between gap-24">
				<div className="flex w-2/6 flex-row items-center justify-between">
					<div>
						<h5 className="ARPDisplay-80 mb-5 text-base text-gray-400">Market Cap</h5>
						<h5 className="ARPDisplay-80 text-base text-blackText-500">$2.51M</h5>
					</div>
					<div>
						<h5 className="ARPDisplay-80 mb-5 text-base text-gray-400">Market Price</h5>
						<h5 className="ARPDisplay-80 text-base text-blackText-500">$2.51M</h5>
					</div>
					<div>
						<h5 className="ARPDisplay-80 mb-5 text-base text-gray-400">24h Change</h5>
						<h5 className="ARPDisplay-80 text-base text-blackText-500">+ $14K</h5>
					</div>
				</div>
				<div className="w-4/6">
					<div className="mb-5 flex w-full flex-row items-center justify-start">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiGlobe color="#9CAAC6" size={20} />
							<h5 className="ARPDisplay-80 ml-2 text-base text-gray-400">Token address</h5>
						</div>
						<div className="flex flex-row items-center justify-between">
							<h5 className="ARPDisplay-80 mr-2 text-base text-blackText-500">0xF17A...9caE8D</h5>
							<IoCopyOutline color="#A9C3B6" size={20} />
						</div>
					</div>
					<div className="flex w-full flex-row items-center justify-start">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiStreamOn color="#9CAAC6" size={20} />
							<h5 className="ARPDisplay-80 ml-2 text-base text-gray-400">Managment fee</h5>
						</div>
						<div className="flex flex-row items-center justify-between">
							<h5 className="ARPDisplay-80 text-base text-blackText-500">1.00%</h5>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>
			<div className="mt-12 mb-16">
				<h5 className="ARPDisplay-150 mb-4 text-2xl text-blackText-500">Other products from Nex Labs</h5>
				<div className="my-8 flex w-full flex-row items-center justify-between gap-3">
					<div className=" aspect-square w-1/5 rounded-2xl border border-gray-300/50 bg-colorOne-500 shadow-md shadow-gray-300"></div>
					<div className=" aspect-square w-1/5 rounded-2xl border border-gray-300/50 bg-colorOne-500 shadow-md shadow-gray-300"></div>
					<div className=" aspect-square w-1/5 rounded-2xl border border-gray-300/50 bg-colorOne-500 shadow-md shadow-gray-300"></div>
					<div className=" aspect-square w-1/5 rounded-2xl border border-gray-300/50 bg-colorOne-500 shadow-md shadow-gray-300"></div>
					<div className=" aspect-square w-1/5 rounded-2xl border border-gray-300/50 bg-colorOne-500 shadow-md shadow-gray-300"></div>
				</div>
			</div>
			<div>
				<div className="flex flex-row items-center justify-start mb-10">
					<h5 className="ARPDisplay-150 text-2xl text-blackText-500">CRYPTO5</h5>
					<CgArrowsExchange color="#91AC9A" size={35} className="mx-2" />
					<h5 className="ARPDisplay-150 text-2xl text-blackText-500">World{"'"}s best indices</h5>
				</div>

				<div className="h-[90vh] w-full rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300">
					<DashboardChartBox />
				</div>
			</div>
		</section>
	)
}

export default TopIndexData2
