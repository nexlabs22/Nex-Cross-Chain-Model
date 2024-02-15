import { goerliAnfiFactory, goerliAnfiV2Factory } from '@/constants/contractAddresses'
import { GetPositionsHistory } from '@/hooks/getTradeHistory'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'
import { FormatToViewNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import React, { useEffect, useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { IoCopyOutline } from "react-icons/io5";
import { reduceAddress } from '@/utils/general'
import CopyToClipboard from 'react-copy-to-clipboard'
import { GenericToast } from './GenericToast'

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

	const [topHolders, setTopHolders] = useState([])

	const options = {
		method: 'GET',
		headers: { accept: 'application/json', 'x-api-key': process.env.CHAINBASE_KEY as string }
	};
	const tokenAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' // UNI token address for dummy
	useEffect(() => {
		fetch(`https://api.chainbase.online/v1/token/top-holders?chain_id=1&contract_address=${tokenAddress}&page=1&limit=10`, options)
			.then(response => response.json())
			.then(response => setTopHolders(response.data))
			.catch(err => console.error(err));
	}, [])

	const roundNumber = (number: number) => {
		return FormatToViewNumber({ value: number, returnType: 'number' })
	}

	const convertTime = (timestamp: number) => {
		const date = new Date(timestamp * 1000)
		const localDate = date.toLocaleDateString('en-US')
		const localTime = date.toLocaleTimeString('en-US')
		return localDate + ' ' + localTime
	}

	const handleCopy = () => {
			GenericToast({
				type: 'success',
				message: 'Copied !',
			})
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
						{topHolders.map(
							(
								holder: {
									amount: number,
									usd_value: number,
									wallet_address: string
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
												<span>{FormatToViewNumber({ value: Number(holder.amount), returnType: 'string' })}</span>
												<br />
												<span className="text-sm text-colorSeven-500 italic">≈ ${FormatToViewNumber({ value: Number(holder.usd_value), returnType: 'string' })}</span>
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
												<span>{reduceAddress(holder.wallet_address)}</span>
												<CopyToClipboard text={holder.wallet_address as string} onCopy={handleCopy}>
													<IoCopyOutline color="#252525" size={18} className="cursor-pointer" />
												</CopyToClipboard>
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
