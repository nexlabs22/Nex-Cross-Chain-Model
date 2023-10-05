import Link from 'next/link'

import { BiMenuAltRight } from 'react-icons/bi'
import { CiMenuFries } from 'react-icons/ci'

const DappNavbar = () => {
	return (
		<section className="flex h-fit w-screen flex-row items-center justify-between px-4 py-4 md:px-10 md:py-6">
			<Link href={'/'}>
				<div className="flex flex-row items-center justify-between">
					<div className=" mr-2 h-12 w-12 rounded-full bg-colorOne-500"></div>
					<h5 className="ARPDisplay-80 text-base text-blackText-500">Nex Labs</h5>
				</div>
			</Link>
			<div className="h-fit w-fit md:hidden">
				<CiMenuFries color="#2A2A2A" size="30" />
			</div>
			<div className="hidden flex-row items-center justify-start md:visible md:flex">
				<div className="flex flex-row items-center justify-evenly">
					<Link href={'/'}>
						<h5 className="ARPDisplay-80 font-base mr-8 text-blackText-500">Home</h5>
					</Link>
					<h5 className="ARPDisplay-80 font-base mr-8 text-blackText-500">Dashboard</h5>
					<h5 className="ARPDisplay-80 font-base mr-8 text-blackText-500">Swap</h5>
					<h5 className="ARPDisplay-80 font-base mr-8 text-blackText-500">Contact</h5>
				</div>
				<div className=" ARPDisplay-150 rounded-xl bg-colorOne-500 px-4 py-3 text-lg text-whiteText-500">Connect wallet</div>
			</div>
		</section>
	)
}

export default DappNavbar
