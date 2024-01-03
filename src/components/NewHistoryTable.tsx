import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, tokenAddresses } from '@/constants/contractAddresses'
import { tokens } from '@/constants/goerliTokens'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import { Positions } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'

function NewHistoryTable() {
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
	const positionHistory = GetPositionsHistory2()

	const [positionHistoryData, setPositionHistoryData] = useState<Positions[]>([])
	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	useEffect(() => {
		setEthPriceInUsd()
	}, [])

	useEffect(() => {
		const allowedSymbols = ['ANFI', 'CRYPTO5']
		const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))
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
			tokens.map(async (token) => {
				if (token.symbol !== 'CRYPTO5' && ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = await convertToUSD(token.address, ethPriceInUsd, false) // false as for testnet tokens
					if (Object.keys(usdPrices).length === tokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd])
	
	const dataToShow: { timestamp: number; tokenAddress: string; indexName: string; side: string; inputAmount: number; outputAmount: number }[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) => positionHistoryData[index] || {
			timestamp: 0,
			indexName: '',
			inputAmount: 0,
			outputAmount: 0,
			tokenAddress: '',
			side: ''
		}
		);

	return (
		<div className="w-full h-full">
			<div className="h-full border border-gray-300 rounded-2xl">
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full table-fixed border-collapse overflow-hidden rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
					<thead className="sticky top-0">
						<tr className="text-lg interExtraBold text-[#646464] border-b border-b-[#E4E4E4]">
							<th className="px-4 py-3 text-left" >
								Time
							</th>
							<th className="px-4 py-3 text-left">Pair</th>
							<th className="px-4 py-3 text-left">Request Side</th>
							<th className="px-4 py-3 text-left">Input Amount</th>
							<th className="px-4 py-3 text-left">Output Amount</th>
						</tr>
					</thead>
					{/* </table>
			</div>
			<div className="max-h-64 overflow-y-auto">
				<table className="w-full"> */}
					<tbody className="overflow-y-scroll overflow-x-hidden">
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
											className=" interMedium text-base border-b border-b-[#E4E4E4]"
										>
											<td className={`px-4 text-left interExtraBold text-blackText-500 text-md py-3 ${position.timestamp?'':'text-[#E5E7EB]'}`}>{position.timestamp ? convertTime(position.timestamp) : '-'}</td>

											{/* <td>{swapToCur.Symbol}</td> */}
											<td className={`px-4 text-left interExtraBold text-blackText-500 text-md py-3 ${position.indexName?'':'text-[#E5E7EB]'}`}>{position.indexName ? position.indexName : '-'}</td>
											<td className="px-4 text-left py-3">
												<div
													className={`h-fit w-fit rounded-lg  px-3 py-1 capitalize ${position.side? 'interBold titleShadow' : 'text-[#E5E7EB]'}  
													${ position.side === 'Mint Request' ? 'bg-nexLightGreen-500 text-whiteText-500' :position.side === 'Burn Request' ? 'bg-nexLightRed-500 text-whiteText-500':'bg-transparent'} flex flex-row items-center justify-center`}
												>
													{position.side ? position.side.toString().split(" ")[0] : '-'} 
												</div>
											</td>
											<td className={`px-4 text-left interExtraBold text-blackText-500 text-lg py-3 ${position.inputAmount && position.tokenAddress ? '':'text-[#E5E7EB]'}`}>
												{position.inputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })}{' '}
														{position.side === 'Mint Request' ? Object.keys(tokenAddresses).find((key) => tokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
														<br /><em className='interExtraBold text-[#646464] text-base'>(${usdPrices ? formatNumber(position.inputAmount * usdPrices[position.tokenAddress]) : 0}) </em>{' '}
													</>
												) : (
													'-'
												)}
											</td>
											<td className={`px-4 text-left interExtraBold text-blackText-500 text-lg py-3 ${position.outputAmount && position.tokenAddress ?'':'text-[#E5E7EB]' }`}>
												{position.outputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })}{' '}
														{position.side === 'Burn Request' ? Object.keys(tokenAddresses).find((key) => tokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
														<br /><em className='interExtraBold text-[#646464] text-base'>(${usdPrices ? formatNumber(position.outputAmount * usdPrices[position.tokenAddress]) : 0} ) </em>
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

export default NewHistoryTable
