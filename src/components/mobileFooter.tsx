import Image from 'next/image'
import Link from 'next/link'

import xLogo from '@assets/images/xlogo_s.png'
import arrow2 from '@assets/images/arrow2.svg'

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css'

const MobileFooterSection = () => {
	return (
		<section className="px-2 pb-4 pt-10 ">
			<div className="h-fit w-full rounded-[30px] bg-colorSeven-500 px-6 py-8 md:p-10">
				<Link href={'https://www.nexlabs.io/'}>
					<Image src={xLogo} alt="nex logo" width={22} height={22} className="w-12 md:scale-[2] md:ml-6 md:mt-6 md:mb-14 brightness-0 drop-shadow-sm invert"></Image>
				</Link>
				<h5 className="interBold my-4 md:mb-12 text-2xl md:text-4xl md:w-1/2 text-white">Index your trades, your investment, your future</h5>
				<Accordion allowZeroExpanded>
					<AccordionItem className="w-full border-none bg-transparent px-0 shadow-none">
						<AccordionItemHeading className="w-full border-none bg-transparent px-0 shadow-none">
							<AccordionItemButton className="w-full border-none bg-transparent px-0 shadow-none">
								<div className="my-6 flex h-fit w-full flex-row items-end justify-between border-b-[1.5px] border-b-white pb-5">
									<h5 className="interBold text-2xl md:text-4xl text-white">Nex Labs</h5>
									<svg width="35" height="21" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-45 md:scale-[1.1] ">
										<path
											d="M16.5563 0.556335C16.5563 1.29834 17.2893 2.40634 18.0313 3.33634C18.9853 4.53634 20.1253 5.58334 21.4323 6.38234C22.4123 6.98134 23.6003 7.55634 24.5563 7.55634M24.5563 7.55634C23.6003 7.55634 22.4113 8.13134 21.4323 8.73034C20.1253 9.53034 18.9853 10.5773 18.0313 11.7753C17.2893 12.7063 16.5563 13.8163 16.5563 14.5563M24.5563 7.55634L0.556335 7.55634"
											stroke="white"
											strokeWidth={1.5}
										/>
									</svg>
								</div>
							</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel className="w-full px-2 py-2">
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'/'}>
									<h5 className="interBold text-xl md:text-3xl text-white">Home</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://app.nexlabs.io/'}>
									<h5 className="interBold text-xl md:text-3xl text-white">Dapp</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://github.com/nexlabs22/…ices-Model-Contracts'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Public reposiroty</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Whitepaper</h5>
								</Link>
							</div>
						</AccordionItemPanel>
					</AccordionItem>
					<AccordionItem className="w-full border-none bg-transparent px-0 shadow-none">
						<AccordionItemHeading className="w-full border-none bg-transparent px-0 shadow-none">
							<AccordionItemButton className="w-full border-none bg-transparent px-0 shadow-none">
								<div className="my-6 flex h-fit w-full flex-row items-end justify-between border-b-[1.5px] border-b-white pb-5">
									<h5 className="interBold text-2xl md:text-4xl text-white">Whitepaper Pieces</h5>
									<svg width="35" height="21" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-45 md:scale-[1.1] ">
										<path
											d="M16.5563 0.556335C16.5563 1.29834 17.2893 2.40634 18.0313 3.33634C18.9853 4.53634 20.1253 5.58334 21.4323 6.38234C22.4123 6.98134 23.6003 7.55634 24.5563 7.55634M24.5563 7.55634C23.6003 7.55634 22.4113 8.13134 21.4323 8.73034C20.1253 9.53034 18.9853 10.5773 18.0313 11.7753C17.2893 12.7063 16.5563 13.8163 16.5563 14.5563M24.5563 7.55634L0.556335 7.55634"
											stroke="white"
											strokeWidth={1.5}
										/>
									</svg>
								</div>
							</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel className="w-full px-2 py-2">
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Spot - Indices</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Protocol structure</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Token & smart contract details</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">Roadmap</h5>
								</Link>
							</div>
							<div className="mb-4 md:mb-6 flex h-fit w-full flex-row items-center justify-start gap-2">
								<div className=" h-2 w-2 md:h-4 md:w-4 rounded-full bg-white"></div>
								<Link href={'https://nex-labs.gitbook.io/nex-dex/additional-information/faq'} target="_blank">
									<h5 className="interBold text-xl md:text-3xl text-white">FAQ</h5>
								</Link>
							</div>
						</AccordionItemPanel>
					</AccordionItem>
				</Accordion>

				<h5 className="interLight mb-4 mt-20 text-xl md:text-2xl md:text-center text-white">© Copyright Nex Labs B.V. 2023. All rights reserved</h5>
			</div>
		</section>
	)
}

export default MobileFooterSection
