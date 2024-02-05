import React, { ReactNode, useState } from 'react'
import Link from 'next/link'

import { IoIosSearch } from 'react-icons/io'
import { IoCopyOutline } from 'react-icons/io5'
import { useLandingPageStore } from '@/store/store'

interface TooltipProps {
	children: ReactNode
	color: string
	address: string
}

const GenericAddressTooltip: React.FC<TooltipProps> = ({ children, color, address }) => {
	const [isHovered, setIsHovered] = useState(false)

	const { mode } = useLandingPageStore()

	return (
		<div className="relative inline-block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
			{children}

			{isHovered && (
				<div
					className="w-fit h-fit absolute pt-2 shadow-md rounded-xl bottom-full left-1/2 transform -translate-x-1/2"
					style={{
						backgroundColor: color,
					}}
				>
					<div className="w-[30rem] h-fit flex flex-col items-start justify-start gap-2 px-3">
						<h5 className={`interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-lg`}>Contract name 1</h5>
						<div className={`w-full h-fit py-2 border ${mode == "dark" ? "border-gray-300" : " border-blackText-500"}  rounded-md flex flex-col items-start justify-start gap-1`}>
							<h5 className={`interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-sm px-2`}>Address: {address}</h5>
							<div className={`my-2 ${mode == "dark" ? " bg-gray-100/50" : " bg-black"} w-full h-[1px]`}></div>
							<h5 className={`interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-sm px-2`}>Total supply: $78622.32</h5>
							<div className={`my-2 ${mode == "dark" ? " bg-gray-100/50" : " bg-black"} w-full h-[1px]`}></div>
							<h5 className={`interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-sm px-2`}>Total holders: 875</h5>
						</div>

					</div>
					<div className={`mt-3 border-t w-full h-fit ${mode == "dark" ? "border-t-whiteText-500" : "border-t-blackText-500"} flex flex-row items-center justify-center`}>
						<div className={`w-1/2 py-2 h-fit flex flex-row items-center justify-center border-r ${mode != "dark" ? " border-r-blackText-500" : "border-r-whiteBackground-500"} gap-5`}>
							<Link href={`https://etherscan.io/token/${address}`}>
								
								{
									mode == "dark" ? <IoIosSearch color="#F2F2F2" size={25} className="cursor-pointer" /> : <IoIosSearch color="#252525" size={25} className="cursor-pointer" />
								}
							</Link>
							<Link href={`https://etherscan.io/token/${address}`}>
								<h5 className={`interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-sm cursor-pointer`}>
									EXPLORE ON
									<br />
									ETHERSCAN
								</h5>
							</Link>
						</div>
						<div className="w-1/2 py-2 h-fit flex flex-row items-center justify-center gap-5">
							{
								mode == "dark" ? <IoCopyOutline color="#F2F2F2" size={25} className="cursor-pointer" /> : <IoCopyOutline color="#252525" size={25} className="cursor-pointer" />
							}
							
							<h5 className={`interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-sm cursor-pointer`}>COPY ADDRESS</h5>
						</div>
					</div>
					<div
						style={{
							content: '',
							display: 'block',
							width: 0,
							height: 0,
							position: 'absolute',
							borderTop: `8px solid ${color}`,
							borderLeft: '8px solid transparent',
							borderRight: '8px solid transparent',
							bottom: '-6px',
							left: '50%',
							transform: 'translateX(-50%)',
						}}
					></div>
				</div>
			)}
		</div>
	)
}

export default GenericAddressTooltip
