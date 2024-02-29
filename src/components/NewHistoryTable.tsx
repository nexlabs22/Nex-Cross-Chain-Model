import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/goerliTokens'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import usePortfolioPageStore from '@/store/portfolioStore'
import useTradePageStore from '@/store/tradeStore'
import { Positions } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import etherscan from '@assets/images/etherscan2.png'
import ccip from '@assets/images/ccip.png'
import chainlink from '@assets/images/chainlink.png'
// import etherscan from '@assets/images/etherscan2.jpg'
// import ccip from '@assets/images/ccip.jpg'
import { useLandingPageStore } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime, reduceAddress } from '@/utils/general'

function NewHistoryTable() {
	const { mode } = useLandingPageStore()
	const {
		isFromCurrencyModalOpen,
		isToCurrencyModalOpen,
		setFromCurrencyModalOpen,
		setToCurrencyModalOpen,
		changeSwapFromCur,
		changeSwapToCur,
		swapFromCur,
		swapToCur,
		nftImage,
		setNftImage,
		setTradeTableReload,
		tradeTableReload,
		setEthPriceInUsd,
		ethPriceInUsd,
	} = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()
	const positionHistory = GetPositionsHistory2()

	// useEffect(() => {
	// 	console.log("positionHistory", positionHistory)
	// 	console.log("positionHistory")
	// },[positionHistory])

	const [positionHistoryData, setPositionHistoryData] = useState<Positions[]>([])
	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	useEffect(() => {
		// setEthPriceInUsd()
		setPortfolioData(positionHistory.data)
	}, [setEthPriceInUsd, setPortfolioData, positionHistory.data])

	const allowedSymbols = ['ANFI', 'CRYPTO5']
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))
	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = positionHistory.data.filter((data) => {
				return activeTicker.includes(data.indexName)
			})
			setPositionHistoryData(data)
		} else if (path === '/portfolio' || path === '/history') {
			setPositionHistoryData(positionHistory.data)
		} else if (path === '/assetActivity') {
			const data = positionHistory.data.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistory.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, activeTicker])

	useEffect(() => {
		if (tradeTableReload) {
			positionHistory.reload()
			setTradeTableReload(false)
		}
	}, [positionHistory, setTradeTableReload, tradeTableReload])

	const roundNumber = (number: number) => {
		return FormatToViewNumber({ value: number, returnType: 'number' })
	}

	// const convertTime = (timestamp: number) => {
	// 	const date = new Date(timestamp * 1000)
	// 	const localDate = date.toLocaleDateString('en-US')
	// 	const localTime = date.toLocaleTimeString('en-US')
	// 	return localDate + ' ' + localTime
	// }
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD(token.address, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: { timestamp: number; tokenAddress: string; indexName: string; side: string; inputAmount: number; outputAmount: number; txHash: string }[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
			}
	)

	const [localStorageHash, setLocalStorageHash] = useState<string[]>([])
	if (typeof window !== 'undefined' && localStorage.getItem('txHash')) {
		const txHash = JSON.parse(localStorage.getItem('txHash') || '{}')
		const txHashArray: string[] = Object.values(txHash)
		if (JSON.stringify(localStorageHash) !== JSON.stringify(txHashArray)) {
			setLocalStorageHash(txHashArray)
		}
	}

	useEffect(() => {
		if (localStorageHash && positionHistoryData) {
			localStorageHash.forEach((hash) => {
				const ifExist = positionHistoryData.filter((data) => {
					data.txHash === hash
				})

				if (ifExist.length > 0) {
					const txHash = JSON.parse(localStorage.getItem('txHash') || '{}')
					const newObj = Object.fromEntries(Object.entries(txHash).filter(([key, value]) => value !== hash))
					Object.keys(newObj).length === 0 ? localStorage.removeItem('txHash') : localStorage.setItem('txHash', JSON.stringify(newObj))
					const newArray: string[] = Object.values(newObj) as string[]
					setLocalStorageHash(newArray)
				}
			})
		}
	}, [localStorageHash, positionHistoryData])

	return (
		<div className={`w-full h-full overflow-x-auto ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
			{' '}
			{/* Added overflow-x-auto for X-axis scrolling */}
			{ path==='/tradeIndex' && activeTicker[0] === 'CRYPTO5' && localStorageHash.length > 0 && (
				<div role="alert" className="alert alert-info mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>
						You have sent a CCIP transaction.{' '}
						<div className="dropdown dropdown-hover">
							<div tabIndex={0} role="button" className="">
								<em> Click here </em>
							</div>
							<ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-fit">
								{localStorageHash.map((hash) => (
									<li key={hash}>
										<Link href={`https://ccip.chain.link/tx/${hash}`}>{reduceAddress(hash)}</Link>
									</li>
								))}
							</ul>
						</div>
						{/* <Link href={`https://ccip.chain.link/tx/${localStorageHash}`}>
							<em>Click Here </em>
						</Link> */}{' '}
						to view in ccip
					</span>
				</div>
			)}
			<div className={`h-full border w-full border-gray-300 rounded-2xl overflow-scroll max-h-[400px] ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] table-fixed border-collapse w-full rounded-xl dark:border-[#161C10] min-w-[700px]">
					<thead className="sticky top-0">
						<tr className={`text-lg interExtraBold ${mode == 'dark' ? ' text-whiteText-500 bg-[#000000]' : ' text-blackText-500 bg-[#F2F2F2]'} border-b border-b-[#E4E4E4]`}>
							<th className="px-4 py-3 text-left whitespace-nowrap">Time</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Pair</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Request Side</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Input Amount</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Output Amount</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">
								Actions
								<div
									onClick={() => {
										positionHistory.reload()
									}}
									className="float-end py-1 cursor-pointer"
								>
									{mode === 'dark' ? <BsArrowCounterclockwise size={20} color="#F2F2F2" /> : <BsArrowCounterclockwise size={20} color="#252525" />}
								</div>
							</th>
						</tr>
					</thead>
					<tbody className="overflow-y-scroll overflow-x-hidden">
						{/* {localStorageHash ? 
					():( */}

						{dataToShow.map(
							(
								position: {
									timestamp: number | null
									tokenAddress: string | null
									indexName:
										| string
										| number
										| boolean
										| React.ReactElement<any, string | React.JSXElementConstructor<any>>
										| Iterable<React.ReactNode>
										| React.ReactPortal
										| React.PromiseLikeOfReactNode
										| null
										| undefined
									side:
										| string
										| number
										| boolean
										| React.ReactElement<any, string | React.JSXElementConstructor<any>>
										| Iterable<React.ReactNode>
										| React.PromiseLikeOfReactNode
										| null
										| undefined
									inputAmount: number | null
									outputAmount: number | null
									txHash: string
								},
								i: React.Key | null | undefined
							) => {
								return (
									<tr
										key={i}
										// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
										className={`${mode == 'dark' ? ' text-gray-200  ' : 'text-gray-700'} interMedium text-base border-b border-blackText-500`}
									>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.timestamp ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.timestamp ? convertTime(position.timestamp) : '-'}
										</td>

										{/* <td>{swapToCur.Symbol}</td> */}
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.indexName ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.indexName ? position.indexName : '-'}
										</td>
										<td className="px-4 text-left py-3">
											<div
												className={`h-fit w-fit rounded-lg  px-3 py-1 capitalize ${position.side ? 'interBold titleShadow' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}  
										${
											position.side === 'Mint Request'
												? 'bg-nexLightGreen-500 text-whiteText-500'
												: position.side === 'Burn Request'
												? 'bg-nexLightRed-500 text-whiteText-500'
												: 'bg-transparent'
										} flex flex-row items-center justify-center`}
											>
												{position.side ? position.side.toString().split(' ')[0] : '-'}
											</div>
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.inputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.inputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })}{' '}
													{position.side === 'Mint Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													<div className="text-slate-500">
														<em>
															≈ $
															{usdPrices
																? position.side === 'Mint Request'
																	? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																	: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																: 0}{' '}
														</em>
													</div>{' '}
												</>
											) : (
												'-'
											)}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.outputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })}{' '}
													{position.side === 'Burn Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													<div className="text-slate-500">
														<em>
															≈ $
															{usdPrices
																? position.side === 'Burn Request'
																	? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																	: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																: 0}{' '}
														</em>
													</div>{' '}
												</>
											) : (
												'-'
											)}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress && mode != 'dark' ? 'text-blackText-500' : 'text-[#F2F2F2]'}`}>
											<div className="flex flex-row items-center justify-start gap-3 ">
												{(position.indexName === 'ANFI' || position.indexName === 'CRYPTO5') && (
													<Link title={'View in Etherscan'} className="my-auto" target="_blank" href={`https://sepolia.etherscan.io/tx/${position.txHash}`}>
														<Image src={etherscan.src} alt="etherscan Logo" width={25} height={25} />
													</Link>
												)}
												{position.indexName === 'CRYPTO5' && (
													<Link title={'View in CCIP'} target="_blank" href={`https://ccip.chain.link/tx/${position.txHash}`}>
														<Image src={chainlink.src} alt="chainlink Logo" width={25} height={25} />
													</Link>
												)}
											</div>
										</td>
									</tr>
								)
							}
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default NewHistoryTable
