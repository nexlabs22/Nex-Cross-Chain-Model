"use client"

import { GrBitcoin } from 'react-icons/gr'
import { FaEthereum } from 'react-icons/fa'
import { SiTether, SiBinance } from 'react-icons/si'
import { BiDollarCircle, BiPlus } from 'react-icons/bi'
import { CiGlobe, CiStreamOn } from 'react-icons/ci'
import { IoCopyOutline } from 'react-icons/io5'
import { CgArrowsExchange } from 'react-icons/cg'
import DashboardChartBox from './ChartBox'
import { useLandingPageStore } from '@store/store'

const TopIndexData = () => {
	const { defaultIndex, changeDefaultIndex } = useLandingPageStore()

	const IndicesWithDetails = [
		{
			name: 'Anti Inflation index',
			symbol: 'ANFI',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			mktCap: '2.51M',
			mktPrice: 162.3,
			chg24h: '14000',
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
			name: 'Safe Crypto Exposure Index',
			symbol: 'CRYPTO5',
			shortDescription:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. culpa qui officia deserunt mollit anim id est laborum.',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
					symbol: 'USDT',
					name: 'Tether USD',
					percentage: 12,
					bgColor: '#C7CECA',
					hoverColor: '#009393',
					logo: <SiTether color="#F2F2F2" size={19} />,
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
					symbol: 'USDC',
					name: 'USD coin',
					percentage: 5,
					bgColor: '#C7CECA',
					hoverColor: '#2775CA',
					logo: <BiDollarCircle color="#F2F2F2" size={19} />,
				},
			],
		},
	]

	const defaultIndexObject = IndicesWithDetails.find((o) => o.symbol === defaultIndex)
	const othertIndexObject = IndicesWithDetails.find((o) => o.symbol != defaultIndex)

	return (
		<section className="px-10 py-16">
			<div className="flex flex-row items-center justify-between gap-10">
				<div className="h-full w-8/12">
					<div className="flex flex-row items-center justify-start">
						<h5 className="montrealBold mr-3 text-4xl text-blackText-500">{defaultIndexObject?.name}</h5>
						<h5 className="montral rounded-lg bg-colorOne-500 px-3 py-1 text-base text-whiteText-500">{defaultIndexObject?.symbol}</h5>
					</div>
					<div className="mt-5 flex flex-row items-center justify-start">
						<div className="flex flex-row items-center justify-start">
							{defaultIndexObject?.underlyingAssets.map((asset, i) => {
								const zindex = i * 10
								return (
									<div key={i} className="aspect-square w-fit rounded-lg bg-colorOne-500 p-[4px] shadow-sm shadow-slate-500" style={{ zIndex: `'${zindex}'`, marginLeft: '-2%' }}>
										{asset.logo}
									</div>
								)
							})}
						</div>
						<h5 className="montreal flex items-center justify-center text-xs text-blackText-500">+{defaultIndexObject?.underlyingAssets.length} Assets</h5>
					</div>
					<h5 className="pangramCompact mb-10 mt-6 w-full text-lg text-blackText-500">{defaultIndexObject?.description}</h5>
				</div>
				<div className="h-52 w-[1px] bg-blackText-500/20"></div>
				<div className="flex h-full w-4/12 flex-col items-start justify-between">
					<h5 className="montrealBold text-sm text-blackText-500">Other Nex Labs products</h5>
					<div className="h-fit w-full pb-8 pt-5">
						<div className="flex h-full w-full flex-row items-start justify-between">
							<div className="h-full w-full">
								<div
									className="flex cursor-pointer flex-row items-center justify-start"
									onClick={() => {
										if (defaultIndexObject && defaultIndexObject.symbol == 'CRYPTO5') {
											changeDefaultIndex('ANFI')
										} else {
											changeDefaultIndex('CRYPTO5')
										}
									}}
								>
									<h5 className="montrealBold mr-3 text-xl text-blackText-500">{othertIndexObject?.name}</h5>
									<h5 className="montralBold rounded-lg bg-colorOne-500 px-3 py-1 text-base text-whiteText-500">{othertIndexObject?.symbol}</h5>
								</div>

								<p className="pangramCompact my-3 w-full text-base text-blackText-500">{othertIndexObject?.shortDescription}</p>
								<div className="flex h-fit w-fit flex-row items-center justify-between rounded-lg bg-colorOne-500 py-1 pl-2 pr-3">
									<BiPlus color="#F2F2F2" size={18} />
									<h5
										className="montrealBold ml-2 cursor-pointer text-base text-whiteText-500"
										onClick={() => {
											if (defaultIndexObject && defaultIndexObject.symbol == 'CRYPTO5') {
												changeDefaultIndex('ANFI')
											} else {
												changeDefaultIndex('CRYPTO5')
											}
										}}
									>
										More
									</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>
			<div className="my-8 flex flex-row items-center justify-between gap-24">
				<div className="flex w-2/6 flex-row items-center justify-between">
					<div>
						<h5 className="montrealBold mb-5 text-base text-gray-400">Market Cap</h5>
						<h5 className="pangramMedium text-base text-blackText-500">${defaultIndexObject?.mktCap}</h5>
					</div>
					<div>
						<h5 className="montrealBold mb-5 text-base text-gray-400">Market Price</h5>
						<h5 className="pangramMedium text-base text-blackText-500">${defaultIndexObject?.mktPrice}</h5>
					</div>
					<div>
						<h5 className="montrealBold mb-5 text-base text-gray-400">24h Change</h5>
						<h5 className="pangramMedium text-base text-blackText-500">+${defaultIndexObject?.chg24h}</h5>
					</div>
				</div>
				<div className="w-4/6">
					<div className="mb-5 flex w-full flex-row items-center justify-start">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiGlobe color="#9CAAC6" size={20} />
							<h5 className="montrealBold ml-2 text-base text-gray-400">Token address</h5>
						</div>
						<div className="flex flex-row items-center justify-between">
							<h5 className="pangramMedium mr-2 text-base text-blackText-500">{defaultIndexObject?.tokenAddress}</h5>
							<IoCopyOutline color="#A9C3B6" size={20} />
						</div>
					</div>
					<div className="flex w-full flex-row items-center justify-start">
						<div className="mr-5 flex flex-row items-center justify-between">
							<CiStreamOn color="#9CAAC6" size={20} />
							<h5 className="montrealBold ml-2 text-base text-gray-400">Managment fee</h5>
						</div>
						<div className="flex flex-row items-center justify-between">
							<h5 className="pangramMedium text-base text-blackText-500">{defaultIndexObject?.managementFee}%</h5>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-center">
				<div className="h-[1px] w-full bg-blackText-500/20"></div>
			</div>

			<div>
				<div className="my-10 flex flex-row items-center justify-start">
					<h5 className="montrealBold text-2xl text-blackText-500">{defaultIndexObject?.symbol}</h5>
					<CgArrowsExchange color="#91AC9A" size={35} className="mx-2" />
					<h5 className="montrealBold text-2xl text-blackText-500">World{"'"}s best indices</h5>
				</div>

				<div className="h-[90vh] w-full rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300">
					<DashboardChartBox />
				</div>
			</div>
		</section>
	)
}

export default TopIndexData
