'use client' // This is a client component 👈🏽
import Image from 'next/image'
import { useState } from 'react'

// Icons:
import { BiSolidChevronRight } from 'react-icons/bi'
import { AiOutlineSetting } from 'react-icons/ai'
import { MdOutlineShowChart, MdOutlineCandlestickChart } from 'react-icons/md'

// Components :
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import GenericModal from './GenericModal'
import Switch from 'react-switch'
import { SketchPicker, TwitterPicker, GithubPicker, BlockPicker, CirclePicker, SwatchesPicker, CompactPicker, ColorResult } from 'react-color'

// Store
import useTradePageStore from '@/app/zustand/tradeStore'

const TradeChartBox = () => {
	const { isChartSettingsModalOpen, setChartSettingsModalOpen } = useTradePageStore()

	const openChartSettingsModal = () => {
		setChartSettingsModalOpen(true)
	}

	const closeChartSettingsModal = () => {
		setChartSettingsModalOpen(false)
	}

	const [showAverageLine, setShowAverageLine] = useState(false)

	const [lineColor, setLineColor] = useState<string>('#089981')

	const ChangeLineColor = (hexColor: ColorResult) => {
		setLineColor(hexColor.hex)
	}

	return (
		<>
			<div className="h-full w-full rounded-xl border border-colorTwo-500/40 shadow shadow-colorTwo-500 flex flex-col items-center justify-start px-4 py-3">
				<div className="w-full h-fit flex flex-row items-center justify-between">
					<div className="w-fit h-fit p-2">
						<div className="w-fit h-fit flex flex-row items-center justify-start mb-1">
							<h5 className="pangram text-xl text-blackText-500 mr-2">CRYPTO5</h5>
							<BiSolidChevronRight color="#2F2F2F" size={20} className="mt-1" />
						</div>
						<div className="w-fit h-fit flex flex-row items-center justify-between gap-3">
							<p className="montrealBold text-xs text-gray-400">$203.89</p>
							<p className="montrealBold text-xs text-nexLightGreen-500">+1.023%</p>
						</div>
					</div>
					<div className="w-fit h-fit flex flex-row items-center justify-between gap-5">
						<div className="flex flex-row items-center justify-normal border-2 border-blackText-500/50 rounded-lg">
							<h5 className="montrealBold text-sm text-blackText-500 px-3 py-1 border-r-2 border-r-blackText-500/50 cursor-pointer hover:bg-colorOne-500/30">1m</h5>
							<h5 className="montrealBold text-sm text-blackText-500 px-3 py-1 border-r-2 border-r-blackText-500/50 cursor-pointer hover:bg-colorOne-500/30">1h</h5>
							<h5 className="montrealBold text-sm text-blackText-500 px-3 py-1 border-r-2 border-r-blackText-500/50 cursor-pointer hover:bg-colorOne-500/30">1d</h5>
							<h5 className="montrealBold text-sm text-blackText-500 px-3 py-1 cursor-pointer hover:bg-colorOne-500/30">1w</h5>
						</div>
						<div className="flex flex-row items-start justify-start gap-3">
							<Menu
								menuButton={
									<MenuButton>
										<MdOutlineCandlestickChart color="#2F2F2F" size={20} />
									</MenuButton>
								}
								transition
								direction="bottom"
								align="end"
								arrow
							>
								<div className="w-full h-fit py-1 px-2 flex flex-col items-start justify-start gap-1">
									<p className="montrealBold text-sm text-blackText-500 mb-2">Chart type :</p>
									<div className="w-full h-fit flex flex-row items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-lg">
										<MdOutlineCandlestickChart color="#2F2F2F" size={20} />
										<p className="montrealBold text-xs text-blackText-500">Candle Sticks</p>
									</div>
									<div className="w-full h-fit flex flex-row items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-lg">
										<MdOutlineShowChart color="#2F2F2F" size={20} />
										<p className="montrealBold text-xs text-blackText-500">Line</p>
									</div>
								</div>
							</Menu>
							<AiOutlineSetting
								color="#2F2F2F"
								className="cursor-pointer"
								size={20}
								onClick={() => {
									openChartSettingsModal()
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<GenericModal isOpen={isChartSettingsModalOpen} onRequestClose={closeChartSettingsModal}>
				<div className="w-full h-fit px-2">
					<h5 className="montrealBold text-blackText-500 text-xl mb-5">Chart Settings</h5>
					<div className="h-fit -w-full">
						<div className="h-fit w-full flex flex-row items-center justify-between mb-1">
							<h5 className="pangram text-blackText-500 text-sm mb-3">Show Average Line</h5>
							<Switch
								onChange={() => {
									setShowAverageLine(!showAverageLine)
								}}
								checked={showAverageLine}
								height={15}
								width={30}
								onColor="#089981"
							/>
						</div>
						<div className="h-fit w-full flex flex-row items-center justify-between mb-1">
							<h5 className="pangram text-blackText-500 text-sm mb-3">Show Average Line</h5>
							<Switch
								onChange={() => {
									setShowAverageLine(!showAverageLine)
								}}
								checked={showAverageLine}
								height={15}
								width={30}
								onColor="#089981"
							/>
						</div>
						<div className="w-full h-fit flex flex-row items-center justify-end"></div>
						<h5 className="pangram text-blackText-500 text-sm mb-3">Line Color:</h5>
						<div className="w-full h-fit mb-2">
							<BlockPicker
								triangle={'hide'}
								onChange={ChangeLineColor}
								className=" h-full w-full"
								color={lineColor}
								width="100%"
								colors={[
									'#089981',
									'#F23645',
									'#2B70C1',
									'#F01A79',
									'#47A83E',
									'#E6B90D',
									'#9F36F3',
									'#D5317D',
									'#A0CA21',
									'#C32E4B',
									'#7D8B0A',
									'#349892',
									'#F07235',
									'#6D02B8',
									'#BB8029',
									'#2DAAE8',
									'#FA85C3',
									'#4A5D28',
									'#D3A3E7',
									'#2B70C1',
									'#F01A79',
									'#47A83E',
									'#E6B90D',
									'#F56104',
									'#57CDA4',
									'#8E4D10',
								]}
							/>
						</div>
					</div>
				</div>
			</GenericModal>
		</>
	)
}

export default TradeChartBox
