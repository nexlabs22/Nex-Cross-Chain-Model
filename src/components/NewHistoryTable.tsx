import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import usePortfolioPageStore from '@/store/portfolioStore'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'
import etherscan from '@assets/images/etherscan2.png'
import ccip from '@assets/images/ccip.png'
import chainlink from '@assets/images/chainlink.png'
import { useLandingPageStore } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime, reduceAddress } from '@/utils/general'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetPositionsHistoryCrossChain } from '@/hooks/getPositiontHistoryCrosschain'
import { useAddress } from '@thirdweb-dev/react'

function NewHistoryTable() {
	const address = useAddress()
	const { mode } = useLandingPageStore()
	const { swapFromCur, swapToCur, setTradeTableReload, tradeTableReload, crosschainTableReload, setEthPriceInUsd, ethPriceInUsd, isMainnet } = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()

	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain()

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [combinedPositionTableData, setCombinedPositionTableData] = useState<PositionType[]>([])
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	const activeIndexType = swapFromCur?.indexType === 'defi' || swapToCur?.indexType === 'defi' ? 'defi' : 'crosschain'

	useEffect(() => {
		const crossChainRequests = positionHistoryCrosschain.requests
		const crossChainHistory = positionHistoryCrosschain.history

		const activeRequests = crossChainRequests.filter((data) => {
			const isExist = crossChainHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...crossChainHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableData)) {
			setCombinedPositionTableData(combinedData)
		}
	}, [positionHistoryCrosschain])

	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))

	useEffect(() => {
		const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.history)
		setPortfolioData(combinedData)
	}, [setEthPriceInUsd, setPortfolioData, positionHistoryDefi.data, positionHistoryCrosschain.history])

	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : combinedPositionTableData
			const dataToShow = data.filter((data: { indexName: string }) => {
				return data.indexName === activeTicker[0]
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (path === '/portfolio' || path === '/history') {
			const data = positionHistoryCrosschain.history.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			setPositionHistoryData(data)
		} else if (path === '/assetActivity') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistoryDefi.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, combinedPositionTableData])

	useEffect(() => {
		if (tradeTableReload) {
			activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
			setTradeTableReload(false)
		}
	}, [positionHistoryDefi, setTradeTableReload, tradeTableReload, activeIndexType, positionHistoryCrosschain])

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({ tokenAddress: token.address, tokenDecimals: token.decimals }, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: PositionType[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
				sendStatus: '',
				receiveStatus: '',
			}
	)

	useEffect(() => {
        console.log(dataToShow)
    }, [dataToShow])

	return (
		<div className={`w-full h-full overflow-x-auto ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
			<div className={`h-full border w-full border-gray-300 rounded-2xl overflow-scroll max-h-[400px] ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
				{address && path === '/tradeIndex' && activeIndexType === 'crosschain' && crosschainTableReload && (
					<Box sx={{ p: 2, width: '100%' }}>
						<LinearProgress />
					</Box>
				)}

				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] table-fixed border-collapse w-full rounded-xl dark:border-[#161C10] min-w-[700px]">
					<thead className="sticky top-0">
						<tr className={`text-md interExtraBold ${mode == 'dark' ? ' text-whiteText-500 bg-[#000000]' : ' text-blackText-500 bg-[#F2F2F2]'} border-b border-b-[#E4E4E4]`}>
							<th className="px-4 py-3 text-left whitespace-nowrap">Time</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Pair</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Request Side</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Input Amount</th>
							<th className="px-4 py-3 text-left whitespace-nowrap">Output Amount</th>
							{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
								<>
									<th className="px-4 py-3 text-left whitespace-nowrap">Send Status</th>
									<th className="px-4 py-3 text-left whitespace-nowrap">Receive Status</th>
								</>
							)}
							<th className="px-4 py-3 text-left whitespace-nowrap">
								Actions
								<div
									onClick={() => {
										activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
									}}
									className="float-end py-1 cursor-pointer"
								>
									{mode === 'dark' ? <BsArrowCounterclockwise size={20} color="#F2F2F2" /> : <BsArrowCounterclockwise size={20} color="#252525" />}
								</div>
							</th>
						</tr>
					</thead>
					<tbody className="overflow-y-scroll overflow-x-hidden">
						{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
							return (
								<tr key={i} className={`${mode == 'dark' ? ' text-gray-200  ' : 'text-gray-700'} interMedium text-base border-b border-blackText-500`}>
									<td className={`px-4 text-left py-3  ${position.timestamp ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
										{position.timestamp ? convertTime(position.timestamp) : '-'}
									</td>
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
												{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
												{position.side === 'Mint Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
												{isMainnet && (
													<>
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
												)}
											</>
										) : (
											'-'
										)}
									</td>
									<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
										{position.outputAmount && position.tokenAddress ? (
											<>
												{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
												{position.side === 'Burn Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
												{isMainnet && (
													<>
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
												)}
											</>
										) : (
											'-'
										)}
									</td>
									{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
										<>
											<td
												className={`px-4 text-left py-3 whitespace-nowrap ${
													position.sendStatus ? (position.sendStatus === 'SUCCESS' ? 'text-nexLightGreen-500' : 'text-[#FFFAA0]') : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'
												}`}
											>
												{position.sendStatus ? position.sendStatus : '-'}
											</td>
											<td
												className={`px-4 text-left py-3 whitespace-nowrap ${
													position.receiveStatus
														? position.receiveStatus === 'SUCCESS'
															? 'text-nexLightGreen-500'
															: 'text-[#FFFAA0]'
														: mode === 'dark'
														? 'text-[#101010]'
														: 'text-[#E5E7EB]'
												}`}
											>
												{position.receiveStatus ? position.receiveStatus : '-'}
											</td>
										</>
									)}
									<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress && mode != 'dark' ? 'text-blackText-500' : 'text-[#F2F2F2]'}`}>
										<div className="flex flex-row items-center justify-start gap-3 ">
											{(allowedSymbols.includes(position.indexName) ) && (
												<Link title={'View in Etherscan'} className="my-auto" target="_blank" href={`https://sepolia.etherscan.io/tx/${position.txHash}`}>
													<Image src={etherscan.src} alt="etherscan Logo" width={25} height={25} />
												</Link>
											)}
											{position.messageId && (
												<Link
													title={'View in CCIP'}
													target="_blank"
													href={`https://ccip.chain.link/msg/${position.recieveSideMessageId ? position.recieveSideMessageId : position.messageId}`}
												>
													<Image src={chainlink.src} alt="chainlink Logo" width={25} height={25} />
												</Link>
											)}
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default NewHistoryTable
