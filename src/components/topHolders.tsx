import { goerliAnfiFactory, goerliAnfiV2Factory } from '@/constants/contractAddresses'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import React, { useEffect } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { IoCopyOutline } from "react-icons/io5";

function TopHolders() {
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
	} = useTradePageStore()

	// const positionHistory = GetPositionsHistory(swapToCur.factoryAddress as `0x${string}`, swapToCur.Symbol)
	// const positionHistory = GetPositionsHistory2(swapToCur.factoryAddress as `0x${string}`, swapToCur.Symbol)
	// useEffect(() => {
	const positionHistory = GetPositionsHistory2(goerliAnfiV2Factory as `0x${string}`, 'ANFI')
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

	return (
		<div className="w-full h-full ">
			<div className="h-full">
				<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] w-full table-fixed border-collapse overflow-hidden rounded-xl border shadow-xl dark:border-[#161C10] md:min-w-[700px]">
					<thead className="sticky top-0">
						<tr className="text-md interBold bg-colorSeven-500 text-whiteText-500">
							<th
								onClick={() => {
									// console.log('HGJF', positionHistory.data)
								}}
								className="px-4 py-2 text-left"
							>
								Quantity
							</th>
							<th className="px-4 py-2 text-left">Percentage</th>
							<th className="px-4 py-2 text-left">24h Change</th>
							<th className="px-4 py-2 text-left">Address</th>
						</tr>
					</thead>
					{/* </table>
			</div>
			<div className="max-h-64 overflow-y-auto">
				<table className="w-full"> */}
					<tbody className="overflow-y-scroll overflow-x-hidden bg-gray-200">
						{positionHistory.data.map(
							(
								position: {
									timestamp: number
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
									inputAmount: any
									outputAmount: any
								},
								i: React.Key | null | undefined
							) => {
								return (
									<>
										<tr
											key={i}
											// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
											className="text-gray-700 interMedium text-base border-b border-blackText-500"
										>
											<td className="px-4 text-left py-3">
												<span>34,573,777</span>
												<br />
												<span className="text-sm text-colorSeven-500 italic">≈ $3.927.2</span>
											</td>

											<td className="px-4 text-left py-3 flex flex-col items-start justify-start gap-1">
												<span>28.76%</span>
												<ProgressBar completed={28.76} height="10px" isLabelVisible={false} className="w-8/12" bgColor="#5E869B" baseBgColor="#A9A9A9" />
											</td>
											<td className="px-4 text-left py-3">
												<span>337,825</span>
												<br />
												<span className="text-sm text-nexLightGreen-500">+ $127.5</span>
											</td>
											<td className="px-4 text-left py-3 flex flex-row items-center justify-start gap-1">
                                                <span>0x000000...7705fa</span>
                                                <IoCopyOutline color="#252525" size={18} className="cursor-pointer" />
                                            </td>
										</tr>
                                        <tr
											key={i}
											// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
											className="text-gray-700 interMedium text-base border-b border-blackText-500"
										>
											<td className="px-4 text-left py-3">
												<span>34,573,777</span>
												<br />
												<span className="text-sm text-colorSeven-500 italic">≈ $3.927.2</span>
											</td>

											<td className="px-4 text-left py-3 flex flex-col items-start justify-start gap-1">
												<span>28.76%</span>
												<ProgressBar completed={28.76} height="10px" isLabelVisible={false} className="w-8/12" bgColor="#5E869B" baseBgColor="#A9A9A9" />
											</td>
											<td className="px-4 text-left py-3">
												<span>337,825</span>
												<br />
												<span className="text-sm text-nexLightGreen-500">+ $127.5</span>
											</td>
											<td className="px-4 text-left py-3 flex flex-row items-center justify-start gap-1">
                                                <span>0x000000...7705fa</span>
                                                <IoCopyOutline color="#252525" size={18} className="cursor-pointer" />
                                            </td>
										</tr>
                                        <tr
											key={i}
											// className="child-[td]:text-[#D8DBD5]/60 child:px-4 child:text-[10px] bg-[#1C2018]/20"
											className="text-gray-700 interMedium text-base border-b border-blackText-500"
										>
											<td className="px-4 text-left py-3">
												<span>34,573,777</span>
												<br />
												<span className="text-sm text-colorSeven-500 italic">≈ $3.927.2</span>
											</td>

											<td className="px-4 text-left py-3 flex flex-col items-start justify-start gap-1">
												<span>28.76%</span>
												<ProgressBar completed={28.76} height="10px" isLabelVisible={false} className="w-8/12" bgColor="#5E869B" baseBgColor="#A9A9A9" />
											</td>
											<td className="px-4 text-left py-3">
												<span>337,825</span>
												<br />
												<span className="text-sm text-nexLightGreen-500">+ $127.5</span>
											</td>
											<td className="px-4 text-left py-3 flex flex-row items-center justify-start gap-1">
                                                <span>0x000000...7705fa</span>
                                                <IoCopyOutline color="#252525" size={18} className="cursor-pointer" />
                                            </td>
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

export default TopHolders
