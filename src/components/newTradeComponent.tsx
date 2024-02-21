import Image from 'next/image'
import { useEffect, useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

// Assets : 
import xLogo from "@assets/images/bg-2.png"
import { useLandingPageStore } from '@/store/store'
import useTradePageStore from '@/store/tradeStore'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'


const NewTradeComponent = () => {
	const tips = [
		'Diversify your crypto holdings for a more stable investment journey.',
		'Stay ahead in crypto trading by staying well-informed about market trends.',
		'Manage risks smartly to maximize gains in the volatile crypto market.',
		'Capitalize on market trends to optimize your spot index trading strategy.',
		'Start small, learn quickly, and gradually build your trading expertise.',
		'Trade with confidence on trusted and secure platforms for peace of mind.',
	]

	const [selectedIndex, setSelectedIndex] = useState(0)

    const { selectedTradingCategory} = useTradePageStore()

	const { mode, changeMode } = useLandingPageStore()
	
	return (
		<div className={`w-full mt-4 relative h-full overflow-hidden ${mode == "dark" ? selectedTradingCategory == "cefi" ? "shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]" :  "bg-cover border-transparent bg-center bg-no-repeat" : selectedTradingCategory == "cefi" ? "shadow shadow-[#7335CA] bg-gradient-to-bl from-[#7335CA] to-[#B790E2]" : "bg-colorSeven-500 "} rounded-xl`} style={{
			boxShadow:
			  mode == "dark" && selectedTradingCategory != "cefi" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
			backgroundImage: mode == "dark" && selectedTradingCategory !="cefi" ? `url('${mesh1.src}')` : "",
		  }}>
            <div className='absolute h-full w-2/3 -right-10 -bottom-10 bg-center bg-contain bg-no-repeat rounded-xl opacity-20' style={{
                backgroundImage: `url('${xLogo.src}')`
            }}></div>
			<div className=" relative z-50 w-full h-full rounded-xl shadow shadow-blackText-500 flex flex-col items-start justify-start px-4 py-10">
				<h5 className={`interBlack  ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} text-xl mb-3 titleShadow`}>Nex News</h5>
				<Carousel
					className="m-0 h-full w-full p-0"
					infiniteLoop={true}
					showIndicators={false}
					autoPlay={true}
					interval={8000}
					showStatus={false}
					showArrows={false}
					showThumbs={false}
					stopOnHover={true}
					swipeable={true}
					selectedItem={selectedIndex}
					onChange={(item) => {
						setSelectedIndex(item)
					}}
				>
					<div key={1} className={`p-2 w-full h-fit flex flex-col ${mode == "dark" ? "" : "invert"} items-center justify-center gap-3 cursor-pointer z-50`}>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[0]}</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[1]}</h5>
						</div>
                        <div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[1]}</h5>
						</div>
					</div>
					<div key={2} className={`p-2 w-full h-fit flex flex-col items-center ${mode == "dark" ? "" : "invert"} justify-center gap-3`}>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[2]}</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[3]}</h5>
						</div>
                        <div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[3]}</h5>
						</div>
					</div>
					<div key={3} className={`p-2 w-full h-fit flex ${mode == "dark" ? "" : "invert"} flex-col items-center justify-center gap-3`}>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[4]}</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[5]}</h5>
						</div>
                        <div className="flex flex-row items-center justify-start gap-4">
							<div className="w-fit h-fit border border-whiteText-500 rounded-full p-[2px] shadow-sm shadow-white">
								<div className="w-2 aspect-square rounded-full bg-whiteBackground-500 m-0"></div>
							</div>
							<h5 className="interMedium text-left text-whiteText-500 text-base w-11/12">{tips[5]}</h5>
						</div>
					</div>
				</Carousel>

				<div className="w-full h-10 bg-red flex flex-row items-center justify-center gap-1">
					{selectedIndex == 0 ? (
						<div className="flex flex-row items-center justify-center gap-1">
							<div
								className="h-2 w-8 md:h-1 md:w-6 md:py-[3px] rounded-full bg-whiteText-500 cursor-pointer"
								onClick={() => {
									setSelectedIndex(0)
								}}
							></div>
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(1)
								}}
							></div>
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(2)
								}}
							></div>
						</div>
					) : selectedIndex == 1 ? (
						<div className="flex flex-row items-center justify-center gap-1">
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(0)
								}}
							></div>
							<div
								className="h-2 w-8 md:h-1 md:w-6 md:py-[3px] rounded-full bg-whiteText-500 cursor-pointer"
								onClick={() => {
									setSelectedIndex(1)
								}}
							></div>
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(2)
								}}
							></div>
						</div>
					) : (
						<div className="flex flex-row items-center justify-center gap-1">
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(0)
								}}
							></div>
							<div
								className="h-2 w-3 md:h-1 md:w-3 md:py-[3px] rounded-full bg-slate-400 cursor-pointer"
								onClick={() => {
									setSelectedIndex(1)
								}}
							></div>
							<div
								className="h-2 w-8 md:h-1 md:w-6 md:py-[3px] rounded-full bg-whiteText-500 cursor-pointer"
								onClick={() => {
									setSelectedIndex(2)
								}}
							></div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default NewTradeComponent
