import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import { Positions } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'

function HistoryTable() {
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
	const positionHistory = GetPositionsHistoryDefi()
	useEffect(() => {
		console.log('positionHistory', positionHistory)
		console.log('positionHistory')
	}, [positionHistory])
	const [positionHistoryData, setPositionHistoryData] = useState<Positions[]>([])
	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	useEffect(() => {
		setEthPriceInUsd()
	}, [])

	useEffect(() => {
		const allowedSymbols = ['ANFI', 'CRYPTO5']
		const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))
		console.log('activeTicker', activeTicker)
		if (path === '/tradeIndex') {
			const data = positionHistory.data.filter((data) => {
				return activeTicker.includes(data.indexName)
			})
			setPositionHistoryData(data)
		} else if (path === '/portfolio') {
			setPositionHistoryData(positionHistory.data)
		}
	}, [path, positionHistory.data, swapFromCur.Symbol, swapToCur.Symbol])

	useEffect(() => {
		if (tradeTableReload) {
			positionHistory.reload()
			setTradeTableReload(false)
		}
	}, [positionHistory, setTradeTableReload, tradeTableReload])

	const roundNumber = (number: number) => {
		return FormatToViewNumber({ value: number, returnType: 'number' })
	}

	const convertTime = (timestamp: number) => {
		const date = new Date(timestamp * 1000)
		const localDate = date.toLocaleDateString('en-US')
		const localTime = date.toLocaleTimeString('en-US')
		return localDate + ' ' + localTime
	}
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({tokenAddress:token.address, tokenDecimals:token.decimals}, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd])

	const dataToShow: { timestamp: number; tokenAddress: string; indexName: string; side: string; inputAmount: number; outputAmount: number }[] = Array.from(
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

	return (
		<div className="w-full h-full ">
			<div className="h-full">
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full table-fixed border-collapse overflow-hidden rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
					<thead className="sticky top-0">
						<tr
							className={`text-md interBold ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500' : 'bg-colorSeven-500 text-whiteText-500'}`}
							style={{
								backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
							}}
						>
							<th className="px-4 py-2 text-left">Time</th>
							<th className="px-4 py-2 text-left">Pair</th>
							<th
								className="px-4 py-2 text-left"
								onClick={() => {
									positionHistory.reload()
								}}
							>
								Request Side
							</th>
							<th className="px-4 py-2 text-left">Input Amount</th>
							<th className="px-4 py-2 text-left">Output Amount</th>
						</tr>
					</thead>
					{/* </table>
			</div>
			<div className="max-h-64 overflow-y-auto">
				<table className="w-full"> */}
					<tbody className={`"overflow-y-scroll overflow-x-hidden ${mode == 'dark' ? ' bg-[#101010]  ' : 'bg-gray-200'} `}>
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
								},
								i: React.Key | null | undefined
							) => {
								return (
									<>
										<tr
											key={i}
											// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
											className={`${mode == 'dark' ? ' text-gray-200  ' : 'text-gray-700'} interMedium text-base border-b border-blackText-500`}
										>
											<td className={`px-4 text-left py-3 ${position.timestamp ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
												{position.timestamp ? convertTime(position.timestamp) : '-'}
											</td>

											{/* <td>{swapToCur.Symbol}</td> */}
											<td className={`px-4 text-left py-3 ${position.indexName ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
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
											<td className={`px-4 text-left py-3 ${position.inputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
												{position.inputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })}{' '}
														{position.side === 'Mint Request'
															? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
															: position?.indexName}{' '}
														<em>
															($
															{usdPrices
																? position.side === 'Mint Request'
																	? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																	: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																: 0}
															){' '}
														</em>{' '}
													</>
												) : (
													'-'
												)}
											</td>
											<td className={`px-4 text-left py-3 ${position.outputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
												{position.outputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })}{' '}
														{position.side === 'Burn Request'
															? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
															: position?.indexName}{' '}
														<em>
															($
															{usdPrices
																? position.side === 'Burn Request'
																	? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																	: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																: 0}{' '}
															){' '}
														</em>
													</>
												) : (
													'-'
												)}
											</td>
											{/* <td>{Number(position.amount * 1.001)} USD</td> */}
											{/* <td className="text-left">{position.requestHash}</td> */}
										</tr>
									</>
								)
							}
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default HistoryTable
