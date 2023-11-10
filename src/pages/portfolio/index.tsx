'use client'

import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import { LifiWidget } from '@components/LifiWidget'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { Chart } from 'react-google-charts'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import GenericAvatar from '@/components/GenericAvatar'

import bg from '@assets/images/3d hologram.png'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'

import { BiCopy } from 'react-icons/bi'
import { PiQrCodeDuotone } from 'react-icons/pi'
import { BsCalendar4 } from 'react-icons/bs'
import { goerliAnfiIndexToken, goerliCrypto5IndexToken } from '@/constants/contractAddresses'
import { indexTokenAbi } from '@/constants/abi'
import { FormatToViewNumber, num } from '@/hooks/math'


export default function Portfolio() {

	const address = useAddress();

	const anfiTokenContract = useContract(goerliAnfiIndexToken, indexTokenAbi)
	const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

	const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [address])
	const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [address])
	// const fiatBalance = 
	const anfiPercent = num(anfiTokenBalance.data)/(num(crypto5TokenBalance.data)+num(anfiTokenBalance.data))
	const crypto5Percent = num(crypto5TokenBalance.data)/(num(crypto5TokenBalance.data)+num(anfiTokenBalance.data))

	const data = [
		['Asset', 'Percentage'],
		['CRYPTO 5', crypto5Percent ? crypto5Percent : 45 ],
		['ANFI', anfiPercent ? anfiPercent : 50],
		['FIAT', anfiPercent ? 0 : 5],
	]

	const options = {
		is3D: true,
        fontName: 'montrealBold',
        slices: [{color: '#9c4f29'}, {color: '#d3bf24'}, {color: '#73cbf3'}],
        tooltip: {text: 'percentage'},
		backgroundColor: 'transparent',
		legend: {
			position: 'right', // Set the legend position to the right
			alignment: 'center', // Horizontally center the legend
		},
	}
	return (
		<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
			<section className="h-full w-fit overflow-x-hidde">
				<DappNavbar />
				<section className="w-screen h-fit pt-10">
					<div className="w-full h-fit px-20 py-5 flex flex-row items-center justify-between mb-10">
						<div className="w-full lg:w-2/5 h-fit flex flex-col lg:flex-row items-center justify-between gap-8">
							 {
								address && address != "" ? <GenericAvatar walletAddress={address}></GenericAvatar> : <div className="w-40 lg:w-2/5 aspect-square bg-colorOne-500 rounded-full">
								
							</div>
							 }
							<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
								<h5 className="text-xl text-blackText-500 montrealBold">ID: 88320</h5>
								<div className="flex flex-row items-center justify-start gap-2">
									<h5 className="text-base text-gray-500 pangramMedium">{
										address && address != "" ? address.toString().slice(0,7) + "..." + address.toString().substring(address.toString().length -  7): "Connect your wallet" 
									}</h5>
									<div className=" bg-colorTwo-500/50 w-fit h-fit p-2 rounded-full">
										<BiCopy color="#000000" size={15} />
									</div>
									<div className=" bg-colorTwo-500/50 w-fit h-fit p-2 rounded-full">
										<PiQrCodeDuotone color="#000000" size={15} />
									</div>
								</div>
								<div className=" bg-colorOne-500 w-fit h-fit py-1 px-3 rounded-2xl flex flex-row items-center justify-center gap-2">
									<BsCalendar4 color="#FFFFFF" size={15} />
									<h5 className="text-base text-whiteText-500 montrealBold">45 Days</h5>
								</div>
							</div>
						</div>
						<div className="hidden lg:flex w-3/5 h-fit" id="smallChartBox"></div>
					</div>
					<div className="w-full h-fit px-2 lg:px-20">
						<Tabs>
							<TabList>
								<Tab>
									<h5 className="montrealBold text-xl">Indices</h5>
								</Tab>
							</TabList>

							<TabPanel>
								<div className="w-full h-fit p-4">
									<div
										className="px-4 py-8 grid grid-cols-2 grid-rows-auto lg:rid-cols-7 lg:grid-rows-1 rounded-2xl bg-gradient-to-tr from-gray-300 to-whiteBackground-500 shadow- shadow-blackText-500"
										
									>
										<div className="w-full h-fit px-4 py-2 flex flex-col items-center justify-center">
											<Image src={anfiLogo} alt="anfi logo" width={80} height={80} className="mb-3"></Image>
											<h5 className="montrealBold text-xl text-blackText-500">ANFI</h5>
											<h5 className="montrealBold text-2xl text-blackText-500 mb-2">$ {anfiTokenBalance.data ? FormatToViewNumber({value: num(anfiTokenBalance.data), returnType:'string'}) : 0}</h5>
											<h5 className="montrealBoldItalic text-base text-nexLightGreen-500">3%</h5>
										</div>
										<div className="w-full h-fit px-4 py-2 flex flex-col items-center justify-center">
											<Image src={cr5Logo} alt="cr5 logo" width={80} height={80} className="mb-3"></Image>
											<h5 className="montrealBold text-xl text-blackText-500">CRYPTO 5</h5>
											<h5 className="montrealBold text-2xl text-blackText-500 mb-2">$ {crypto5TokenBalance.data ? FormatToViewNumber({value: num(crypto5TokenBalance.data), returnType:'string'}) : 0}</h5>
											<h5 className="montrealBoldItalic text-base text-nexLightGreen-500">1%</h5>
										</div>
									</div>
								</div>
							</TabPanel>
						</Tabs>
					</div>
					<div className="w-full h-fit px-5 lg:px-20 mt-10">
						<h5 className="montrealBold text-3xl text-blackText-500">Assets Distribution</h5>
						<div className="w-full h-fit flex flex-row items-center justify-start">
							<Chart
								chartType="PieChart"
								data={data}
								options={options}
								width={'100%'}
								height={'600px'}
								className='montrealBold chartBox'
							/>
						</div>
					</div>
				</section>
			</section>

			<div className="w-fit h-fit pt-16">
				<Footer />
			</div>
		</main>
	)
}
