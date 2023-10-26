import Link from 'next/link'
import Image from 'next/image'

import { BiMenuAltRight } from 'react-icons/bi'
import { CiMenuFries } from 'react-icons/ci'
import ConnectButton from './ConnectButton'

import logo1 from '@assets/images/logo1.png'
import logo2 from '@assets/images/logo2.png'

const DappNavbar = () => {
	return (
		<section className="flex h-fit w-screen flex-row items-center justify-between px-4 py-4 md:px-10 md:py-6 relative z-50">
			<Link href={'https://landing-page-spot-index.vercel.app/'}>
				<div className="flex flex-row items-center justify-between">
					<div className=" mr-2 h-fit w-fit">
						<Image src={logo1} alt="nex labs logo" className="w-28"></Image>
					</div>
				</div>
			</Link>
			<div className="h-fit w-fit md:hidden">
				<CiMenuFries color="#2A2A2A" size="30" />
			</div>
			<div className="hidden flex-row items-center justify-start md:visible md:flex">
				<div className="flex flex-row items-center justify-evenly">
					<Link href={'/'}>
						<h5 className="pangramMedium font-base mr-8 text-blackText-500">Dashboard</h5>
					</Link>
					<Link href={'/trade'}>
						<h5 className="pangramMedium font-base mr-8 text-blackText-500">Trade</h5>
					</Link>
					<Link href={'/convert'}>
						<h5 className="pangramMedium font-base mr-8 text-blackText-500">Convert</h5>
					</Link>
					<Link href={'/portfolio'}>
						<h5 className="pangramMedium font-base mr-8 text-blackText-500">Portfolio</h5>
					</Link>
				</div>
				{/* <div className=" montrealBold rounded-xl bg-colorOne-500 px-4 pb-3 pt-4 text-lg text-whiteText-500">Connect wallet</div> */}
				<ConnectButton />
			</div>
		</section>
	)
}

export default DappNavbar
