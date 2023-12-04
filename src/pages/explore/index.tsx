import { useState } from 'react'
import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/Footer'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MenuButton } from '@szhsin/react-menu'
import arrowDown from 'react-useanimations/lib/arrowDown'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import useTradePageStore from '@/store/tradeStore'
import { useRouter } from 'next/navigation'

// assets :
import cr5Logo from '@assets/images/cr5.png'
import anfiLogo from '@assets/images/anfi.png'
import cefi from '@assets/images/cefi.jpg'
import defi from '@assets/images/defi.jpg'
import hybrid from '@assets/images/hybrid.png'
import crypto from '@assets/images/crypto.png'
import circle from '@assets/images/circle.png'
import { GoChevronDown } from 'react-icons/go'
import bg2 from '@assets/images/bg-2.png'


import Head from 'next/head'
import UseAnimations from 'react-useanimations'


interface Subcategory {
	name: string
	symbol: string
	logo: string
}

interface Product {
	name: string
	symbol: string
	logo: string // Assuming logo is a file path or URL (string)
	address: string
	totalSupply: number // Corrected typo in property name
	category: string
	subcategory: string
}

export default function Explore() {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<String>('defi')
	const { selectedTradingCategory, setSelectedTradingCategory, selectedTradingProduct, setSelectedTradingProduct} = useTradePageStore()
	const [searchResult, setSearchResult] = useState<Product>()
	const [selectedSubCategory, setSelectedsubCategory] = useState<Subcategory>({
		name: 'Hybrid Indices',
		symbol: 'sub1',
		logo: hybrid.src,
	})

	function toggleCategory() {
		setSelectedTradingCategory(selectedTradingCategory === 'defi' ? 'cefi' : 'defi')
		setSelectedCategory(selectedCategory === 'defi' ? 'cefi' : 'defi')
	}

	const subCategories = [
		{
			name: 'Hybrid Indices',
			symbol: 'sub1',
			logo: hybrid.src,
		},
		{
			name: 'Cryptocurrencies',
			symbol: 'sub2',
			logo: crypto.src,
		},
	]

	const products = [
		{
			name: 'CRYPTO 5',
			symbol: 'CRYPTO5',
			logo: cr5Logo.src,
			address: '0xIE9303...0392K0',
			totalSupply: 20938,
			category: 'defi',
			subcategory: 'sub2',
		},
		{
			name: 'CRYPTO 5',
			symbol: 'CRYPTO5',
			logo: cr5Logo.src,
			address: '0xIE9303...0392K0',
			totalSupply: 20938,
			category: 'cefi',
			subcategory: 'sub2',
		},
		{
			name: 'Anti Inlaftion Index',
			symbol: 'ANFI',
			logo: anfiLogo.src,
			address: '0xIE9303...0392K0',
			totalSupply: 109338,
			category: 'defi',
			subcategory: 'sub1',
		},
		{
			name: 'Anti Inlaftion Index',
			symbol: 'ANFI',
			logo: anfiLogo.src,
			address: '0xIE9303...0392K0',
			totalSupply: 109338,
			category: 'cefi',
			subcategory: 'sub1',
		},
		
	]

	const defiIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" width="50" height="63">
			<path d="m50,47.835l20.625-11.908-18.75-10.825c-1.16-.67-2.59-.67-3.75,0l-18.75,10.825,20.625,11.908Z" />
			<path d="m48.125,51.083l-20.625-11.908v21.65c0,1.34.715,2.578,1.875,3.248l18.75,10.825v-23.815Z" />
			<path d="m51.875,51.083v23.815l18.75-10.825c1.16-.67,1.875-1.908,1.875-3.248v-21.65l-20.625,11.908Z" />
			<path d="m16.719,60.781c-1.035,0-1.875-.84-1.875-1.875v-17.812c0-1.035.84-1.875,1.875-1.875s1.875.84,1.875,1.875v17.812c0,1.035-.84,1.875-1.875,1.875Z" />
			<path d="m58.908,85.156c-.649,0-1.28-.337-1.627-.939-.516-.897-.208-2.043.689-2.561l15.469-8.906c.899-.516,2.043-.207,2.561.689.516.897.208,2.043-.689,2.561l-15.469,8.906c-.295.169-.617.25-.934.25Z" />
			<path d="m74.373,27.5c-.318,0-.639-.081-.934-.25l-15.469-8.906c-.897-.517-1.206-1.664-.689-2.561.517-.897,1.666-1.205,2.561-.689l15.469,8.906c.897.517,1.206,1.664.689,2.561-.347.602-.978.939-1.627.939Z" />
			<path d="m83.281,60.781c-1.035,0-1.875-.84-1.875-1.875v-17.812c0-1.035.84-1.875,1.875-1.875s1.875.84,1.875,1.875v17.812c0,1.035-.84,1.875-1.875,1.875Z" />
			<path d="m41.092,85.156c-.318,0-.639-.081-.934-.25l-15.469-8.906c-.897-.517-1.206-1.664-.689-2.561.517-.896,1.664-1.204,2.561-.689l15.469,8.906c.897.517,1.206,1.664.689,2.561-.347.602-.978.939-1.627.939Z" />
			<path d="m25.627,27.5c-.649,0-1.28-.337-1.627-.939-.516-.897-.208-2.043.689-2.561l15.469-8.906c.899-.517,2.044-.207,2.561.689.516.897.208,2.043-.689,2.561l-15.469,8.906c-.295.169-.617.25-.934.25Z" />
			<circle cx="50" cy="11.562" r="4.688" />
			<circle cx="50" cy="88.437" r="4.687" />
			<circle cx="16.712" cy="30.781" r="4.688" />
			<circle cx="83.288" cy="69.219" r="4.687" />
			<circle cx="83.288" cy="30.781" r="4.688" />
			<circle cx="16.712" cy="69.219" r="4.688" />
		</svg>
	)

	const cefiIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50" height="63" viewBox="0 0 100 63">
			<path d="M85.096,17.066c3.332,0,6.032-2.701,6.032-6.033S88.428,5,85.096,5c-3.333,0-6.033,2.701-6.033,6.033  c0,1.322,0.438,2.535,1.158,3.528L51.105,43.541c-1.35-1.069-3.053-1.712-4.91-1.712c-1.086,0-2.122,0.22-3.064,0.615l-12.507-22.07  c0.821-0.757,1.344-1.833,1.344-3.037c0-2.288-1.854-4.142-4.142-4.142s-4.143,1.854-4.143,4.142s1.855,4.142,4.143,4.142  c0.407,0,0.792-0.077,1.164-0.187l12.515,22.084c-0.908,0.669-1.67,1.523-2.224,2.512l-13.899-5.729  c0.002-0.044,0.014-0.086,0.014-0.131c0-1.542-1.25-2.792-2.792-2.792c-1.542,0-2.791,1.25-2.791,2.792  c0,1.542,1.25,2.79,2.791,2.79c0.822,0,1.553-0.361,2.064-0.926l13.902,5.73c-0.189,0.678-0.298,1.391-0.298,2.13  c0,0.971,0.184,1.898,0.503,2.757L17.273,63.56c-0.867-1.08-2.181-1.786-3.674-1.786c-2.61,0-4.727,2.117-4.727,4.729  c0,2.609,2.117,4.727,4.727,4.727c2.611,0,4.727-2.117,4.727-4.727c0-0.446-0.081-0.867-0.196-1.276l21.494-11.044  c1.424,2.108,3.835,3.494,6.571,3.494c0.63,0,1.24-0.08,1.829-0.22l9.671,26.353c-1.83,1.024-3.081,2.958-3.081,5.204  c0,3.307,2.681,5.987,5.989,5.987c3.307,0,5.987-2.681,5.987-5.987c0-3.308-2.681-5.987-5.987-5.987  c-0.396,0-0.781,0.042-1.156,0.115l-9.663-26.329c1.516-0.772,2.746-2.017,3.505-3.541l23.184,8.245  c-0.031,0.219-0.066,0.437-0.066,0.663c0,2.611,2.117,4.728,4.727,4.728c2.611,0,4.728-2.116,4.728-4.728  c0-2.61-2.116-4.728-4.728-4.728c-1.719,0-3.208,0.927-4.035,2.297l-23.18-8.243c0.127-0.565,0.202-1.148,0.202-1.751  c0-0.695-0.099-1.364-0.267-2.005l17.525-6.895c0.461,0.487,1.107,0.795,1.83,0.795c1.393,0,2.521-1.128,2.521-2.521  c0-1.392-1.129-2.521-2.521-2.521c-1.387,0-2.511,1.119-2.52,2.505L53.175,46c-0.216-0.399-0.468-0.775-0.745-1.129L81.545,15.89  C82.543,16.621,83.762,17.066,85.096,17.066z M46.196,55.035c-2.917,0-5.283-2.364-5.283-5.282c0-2.918,2.365-5.283,5.283-5.283  s5.283,2.365,5.283,5.283C51.479,52.671,49.113,55.035,46.196,55.035z M46.196,47.112c-1.459,0-2.642,1.182-2.642,2.642  c0,1.458,1.183,2.64,2.642,2.64c1.458,0,2.641-1.183,2.641-2.64C48.837,48.294,47.654,47.112,46.196,47.112z" />
		</svg>
	)

	const handleOnSelect = (item: Product) => {
		setSelectedTradingCategory(item.category)
		setSelectedTradingProduct(item.symbol)
		router.push('/trade')
	}

	const formatSearchResult = (item: Product) => {
		return (
			<div className="w-full h-fit px-4 py-2 flex flfex-row items-center justify-start gap-2 cursor-pointer">
				<Image src={item.logo} width={40} height={40} alt={item.name}></Image>
				<div className="flex flex-col items-start justify-start gap-1">
					<h5 className="interBold text-colorSeven-500 text-base">{item.name} <span className='interBold uppercase text-blackText-500/50 text-sm italic'>({item.category} Product)</span> </h5>
					<h5 className="interMedium uppercase text-colorSeven-500 text-sm">{item.symbol}</h5>
				</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta
					name="description"
					content="Traders love the Nex Labs platform for its wide selection of CeFi and DeFi products. Explore margin trading, derivatives, staking, and more - this blog covers all the offerings so you can optimize your crypto portfolio."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit overflow-x-hidden flex flex-col items-center justify-center px-10 pt-10 pb-4">
						<h5 className="text-xl text-slate-700 interMedium text-center">Explore products and assets on Nex Labs</h5>
						<div className=" mt-10 mb-2 w-full h-fit mx-auto flex flex-row items-center justify-center gap-2">
							<div
								className={`w-1/2 h-fit flex flex-row items-center justify-between border border-slate-400 rounded-xl shadow ${
									selectedTradingCategory == 'cefi' ? ' shadow-colorSeven-500 bg-colorSeven-500/80' : ' bg-zinc-200/30'
								} p-5 cursor-pointer gap-2`}
								onClick={() => {
									setSelectedTradingCategory('cefi')
									setSelectedsubCategory(subCategories[0])
								}}
							>
								<div
									className={`h-24 w-28 overflow-hidden border bg-white border-slate-300 rounded-lg flex flex-row items-center justify-center ${
										selectedTradingCategory == "cefi ? 'opacity-100' : ' opacity-40' "
									}`}
								>
									<div
										className="w-11/12 aspect-square bg-center bg-contain bg-no-repeat"
										style={{
											backgroundImage: `url('${cefi.src}')`,
										}}
									></div>
								</div>
								<div className="w-fit h-fit flex flex-col items-start justify-between">
									<h5 className={`interBold text-2xl ${selectedTradingCategory == 'cefi' ? ' text-whiteText-500 titleShadow' : 'text-colorSeven-500/30'}`}>CeFi</h5>
									<h5 className={`interBold text-base ${selectedTradingCategory == 'cefi' ? ' text-whiteText-500' : 'text-colorSeven-500/30'}`}>
										CeFi involves traditional centralized financial systems, like banks and institutions.
									</h5>
								</div>
							</div>
							<div
								className={`w-1/2 h-fit flex flex-row items-center justify-between border border-slate-400 rounded-xl shadow ${
									selectedTradingCategory == 'defi' ? 'shadow-colorSeven-500 bg-colorSeven-500/80' : 'bg-zinc-200/30'
								} p-5 cursor-pointer gap-2`}
								onClick={() => {
									setSelectedTradingCategory('defi')
									setSelectedsubCategory(subCategories[0])
								}}
							>
								<div
									className={`h-24 w-24 overflow-hidden border bg-white border-slate-300 rounded-lg flex flex-row items-center justify-center  ${
										selectedTradingCategory == "defi ? 'opacity-100' : ' opacity-40' "
									}`}
								>
									<div
										className="w-11/12 aspect-square bg-center bg-contain bg-no-repeat"
										style={{
											backgroundImage: `url('${defi.src}')`,
										}}
									></div>
								</div>
								<div className="w-fit h-fit flex flex-col items-start justify-between">
									<h5 className={`interBold text-2xl ${selectedTradingCategory == 'defi' ? ' text-whiteText-500 titleShadow' : ' text-colorSeven-500/30'}`}>DeFi</h5>
									<h5 className={`interBold text-base ${selectedTradingCategory == 'defi' ? ' text-whiteText-500' : 'text-colorSeven-500/30'}`}>
										DeFi uses decentralized tech, sidestepping traditional financial middlemen.
									</h5>
								</div>
							</div>
						</div>
						<div className="w-full h-fit border border-slate-400 rounded-xl shadow bg-zinc-200/20 p-12">
							<div className="w-full h-fit flex flex-row items-center justify-between mb-6">
								<ReactSearchAutocomplete className="w-1/3" items={products} onSelect={handleOnSelect} autoFocus formatResult={formatSearchResult} />
								<Menu
									menuButton={
										<MenuButton>
											<div className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md bg-colorSeven-500 shadow-sm shadow-blackText-500 gap-8 cursor-pointer">
												<div className="flex flex-row items-center justify-start gap-2">
													<Image src={selectedSubCategory.logo} width={25} height={25} alt={selectedSubCategory.name}></Image>
													<h5 className="text-sm text-whiteBackground-500 titleShadow interBold uppercase">{selectedSubCategory.name}</h5>
												</div>
												<GoChevronDown color="#F2F2F2" size={20} />
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="end"
									className="subCatgoriesMenu"
								>
									{subCategories.map((sub, id) => {
										return (
											<div
												key={id}
												className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer hover:bg-[#7fa5b8]/50"
												onClick={() => {
													setSelectedsubCategory(sub)
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<Image src={sub.logo} width={25} height={25} alt={sub.name}></Image>
													<h5 className="text-sm text-whiteBackground-500 interMedium uppercase whitespace-nowrap">{sub.name}</h5>
												</div>
												<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
											</div>
										)
									})}
								</Menu>
							</div>
							<div className="w-full h-fit border border-gray-300 rounded-xl px-3 py-6 shadow">
								<div className="w-full h-fit pb-6 flex -flex-row items-center justify-center">
									<div className="w-1/4 h-fit px-1">
										<h5 className="interMedium text-gray-500 text-base">Product / Asset</h5>
									</div>
									<div className="w-1/4 h-fit px-1">
										<h5 className="interMedium text-gray-500 text-base">Symbol</h5>
									</div>
									<div className="w-1/4 h-fit px-1">
										<h5 className="interMedium text-gray-500 text-base">Total Supply</h5>
									</div>
									<div className="w-1/4 h-fit px-1">
										<h5 className="interMedium text-gray-500 text-base">Address</h5>
									</div>
								</div>
								{products.map((product, index) => {
									if (product.category == selectedCategory && product.subcategory == selectedSubCategory.symbol) {
										return (
											<div key={index}>
												<div className="w-full h-[1px] bg-blackText-500/50"></div>
												<div className="w-full h-fit py-4 flex -flex-row items-center justify-center cursor-pointer hover:bg-gray-200/50">
													<div className="w-1/4 h-fit px-1 flex flex-row items-center justify-start gap-2">
														<Link href={'/trade'}>
															<Image src={product.logo} alt={product.name} width={30} height={30}></Image>
														</Link>
														<Link href={'/trade'}>
															<h5 className="interBold text-colorSeven-500 text-base">{product.name}</h5>
														</Link>
													</div>
													<div className="w-1/4 h-fit px-1">
														<h5 className="interMedium text-blackText-500 text-base italic">{product.symbol}</h5>
													</div>
													<div className="w-1/4 h-fit px-1">
														<h5 className="interMedium text-blackText-500 text-base">${product.totalSupply}</h5>
													</div>
													<div className="w-1/4 h-fit px-1">
														<h5 className="interMedium text-blackText-500 text-base">{product.address}</h5>
													</div>
												</div>
											</div>
										)
									}
								})}
							</div>
						</div>
					</section>
					<section className="w-screen h-fit flex flex-col items-center justify-center px-9 pb-10">
						<div className=" relative w-full h-fit bg-gradient-to-bl from-colorFive-500 to-colorSeven-500 rounded-xl px-6 py-6">
							<div className='absolute overflow-hidden w-full h-full top-0 right-0 z-10 flex flex-row items-center justify-normal'>
								<div className='w-1/2 h-full'></div>
								<div className='w-1/2 h-full bg-no-repeat cefiCsDefiAnimated' style={{
									backgroundImage: `url('${bg2.src}')`
								}}>

								</div>
							</div>
							<div className='relative top-0 left-0 z-40 bg-transparent'>
								<h5 className="interBold text-whiteText-500 titleShadow text-4xl mb-6">Cefi vs Defi</h5>
								<p className="interMedium text-whiteText-500 text-base w-1/2 mb-3">
									Embark on a journey through CeFi and DeFi landscapes, understanding the centralized powerhouses and the decentralized disruptors. Start exploring the two faces of finance!
								</p>
								<button className="h-fit w-fit flex flex-row items-center justify-center gap-1 bg-white shadow rounded-md px-4 py-1 interBold text-blackText-500 text-base">
									<span>Learn More</span>
									<UseAnimations
										animation={arrowDown}
										wrapperStyle={{
											width: 'fit-content',
										}}
										strokeColor="#5E869B"
										size={40}
										className=" -rotate-90"
									/>
								</button>
							</div>
						</div>
					</section>
				</section>

				<div className="w-fit h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
			</main>
		</>
	)
}
