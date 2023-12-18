import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory } from '@/constants/contractAddresses'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import { Positions } from '@/types/tradeTableTypes'
import React, { useEffect, useState } from 'react'

function HistoryTable() {


	const { isFromCurrencyModalOpen, isToCurrencyModalOpen, setFromCurrencyModalOpen, setToCurrencyModalOpen, changeSwapFromCur, changeSwapToCur, swapFromCur, swapToCur, nftImage, setNftImage, setTradeTableReload, tradeTableReload } =
		useTradePageStore()
	const positionHistory = GetPositionsHistory2()

	const [positionHistoryData, setPositionHistoryData] = useState<Positions[]>([]);
	// const path = window.location.pathname
	const path = typeof window !== 'undefined' ? window.location.pathname : '/';
	useEffect(() => {
		const allowedSymbols = ['ANFI', 'CRYPTO5'];
		const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter(symbol => allowedSymbols.includes(symbol));
		if (path === '/trade') {
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
			setTradeTableReload(false);
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

	return (
		<div className='w-full h-full '>
			<div className='h-full'>
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full table-fixed border-collapse overflow-hidden rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
					<thead className='sticky top-0'>
						<tr className="text-md interBold bg-colorSeven-500 text-whiteText-500">
							<th
								onClick={() => {
									// console.log('HGJF', positionHistory.data)
								}}
								className="px-4 py-2 text-left"
							>
								Time
							</th>
							<th className="px-4 py-2 text-left">Pair</th>
							<th className="px-4 py-2 text-left">Side</th>
							<th className="px-4 py-2 text-left">Input Amount</th>
							<th className="px-4 py-2 text-left">Output Amount</th>
							{/* <th className="px-4 text-left">Fee</th> */}
							{/* <th className="px-4 text-left">Total</th> */}
							{/* <th className="px-4 text-left">Hash</th> */}
						</tr>
					</thead>
					{/* </table>
			</div>
			<div className="max-h-64 overflow-y-auto">
				<table className="w-full"> */}
					<tbody className='overflow-y-scroll overflow-x-hidden bg-gray-200'>
						{positionHistoryData.map((position: { timestamp: number; indexName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; side: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined; inputAmount: any; outputAmount: any }, i: React.Key | null | undefined) => {
							return (
								<>
									<tr
										key={i}
										// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
										className="text-gray-700 interMedium text-base border-b border-blackText-500"
									>
										<td className='px-4 text-left py-3'>{convertTime(position?.timestamp)}</td>

										{/* <td>{swapToCur.Symbol}</td> */}
										<td className='px-4 text-left py-3'>
											{
												position?.indexName
											}
										</td>
										<td className='px-4 text-left py-3'>
											<div
												className={`h-fit w-fit rounded-lg  px-3 py-1 capitalize interBold titleShadow ${position.side === 'Mint Request' ? ' bg-nexLightGreen-500 text-whiteText-500' : 'bg-nexLightRed-500 text-whiteText-500'
													} flex flex-row items-center justify-center`}
											>
												{position.side}
											</div>
										</td>
										<td className='px-4 text-left py-3'>{FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} USD</td>
										<td className='px-4 text-left py-3'>{FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} USD</td>
										{/* <td>{Number(position.amount * 1.001)} USD</td> */}
										{/* <td className="text-left">{position.requestHash}</td> */}
									</tr>

								</>

							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default HistoryTable