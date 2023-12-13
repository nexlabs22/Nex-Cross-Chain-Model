import { goerliAnfiFactory, goerliAnfiV2Factory } from '@/constants/contractAddresses'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import React, { useEffect } from 'react'

function HistoryTable() {


	const { isFromCurrencyModalOpen, isToCurrencyModalOpen, setFromCurrencyModalOpen, setToCurrencyModalOpen, changeSwapFromCur, changeSwapToCur, swapFromCur, swapToCur, nftImage, setNftImage, setTradeTableReload, tradeTableReload } =
		useTradePageStore()


	// const positionHistory = GetPositionsHistory(swapToCur.factoryAddress as `0x${string}`, swapToCur.Symbol)
	// const positionHistory = GetPositionsHistory2(swapToCur.factoryAddress as `0x${string}`, swapToCur.Symbol)
	// useEffect(() => {
	const positionHistory = GetPositionsHistory2(goerliAnfiV2Factory as `0x${string}`, 'ANFI')
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
		<div className='w-full '>
			<div className='max-h-72'>
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full table-fixed border-collapse overflow-hidden rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
					<thead className='sticky top-0'>
						<tr className="text-[10px] bg-slate-300 text-slate-700">
							<th
								onClick={() => {
									// console.log('HGJF', positionHistory.data)
								}}
								className="px-4 text-left"
							>
								Time
							</th>
							<th className="px-4 text-left">Pair</th>
							<th className="px-4 text-left">Side</th>
							<th className="px-4 text-left">Input Amount</th>
							<th className="px-4 text-left">Output Amount</th>
							{/* <th className="px-4 text-left">Fee</th> */}
							{/* <th className="px-4 text-left">Total</th> */}
							{/* <th className="px-4 text-left">Hash</th> */}
						</tr>
					</thead>
					{/* </table>
			</div>
			<div className="max-h-64 overflow-y-auto">
				<table className="w-full"> */}
					<tbody className='max-h-64 overflow-y-auto overflow-x-auto'>
						{positionHistory.data.map((position, i) => {
							return (
								<tr
									key={i}
									// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
									className="text-gray-700 child:px-4 child:text-[10px] "
								>
									<td>{convertTime(position?.timestamp)}</td>
									{/* <td>{swapToCur.Symbol}</td> */}
									<td>ANFI</td>
									<td>
										<div
											className={`h-5 rounded px-3 py-1 capitalize ${position.side === 'Mint Request' ? ' text-green-500' : 'text-red-500'
												} inline-flex items-center `}
										>
											{position.side}
										</div>
									</td>
									<td>{FormatToViewNumber({value: position.inputAmount, returnType: 'string'})} USD</td>
									<td>{FormatToViewNumber({value: position.outputAmount, returnType: 'string'})} USD</td>
									{/* <td>{Number(position.amount * 1.001)} USD</td> */}
									{/* <td className="text-left">{position.requestHash}</td> */}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default HistoryTable