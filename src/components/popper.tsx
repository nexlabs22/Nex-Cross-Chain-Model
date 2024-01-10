import { useRef, useState } from 'react'
import Link from 'next/link'
import { ControlledMenu, MenuItem, useHover, useMenuState } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { BsCaretDownFill } from 'react-icons/bs'

interface MenuItem {
	id: string
	name: string
	links: string
	namesub: { id: string; sub: string; links: string }[]
}

interface HoverMenuWithTransitionProps {
	menuItem: string
	lightV?: boolean
}

const HoverMenuWithTransition: React.FC<HoverMenuWithTransitionProps> = ({ menuItem, lightV }) => {
	const ref = useRef(null)
	const [menuState, toggle] = useMenuState({ transition: true })
	const { anchorProps, hoverProps } = useHover(menuState.state, toggle)

	// console.log(menuItem);

	return (
		<>
			<div className="flex h-fit w-fit flex-row items-center justify-start gap-1" ref={ref} {...anchorProps}>
				<h5 className={`interMedium cursor-pointer font-base mr-3 ${lightV ? ' text-whiteText-500' : 'text-blackText-500'}`}>Portfolio</h5>
				{lightV ? <BsCaretDownFill size={9} color="#FFFFFF" className="mr-5" /> : <BsCaretDownFill size={9} color="#252525" className="mr-5" />}
			</div>

			<ControlledMenu {...hoverProps} {...menuState} anchorRef={ref} onClose={() => toggle(false)} direction="bottom" align="end" menuClassName="navSubMenu">
				<MenuItem key={1} className=" hover:bg-colorSeven-500/20">
					<Link href={'/portfolio'} key={10}>
						<h5 className="interMedium font-sm mr-2 text-blackText-500 py-2">Overview</h5>
					</Link>
				</MenuItem>
				<MenuItem key={2} className=" hover:bg-colorSeven-500/20">
					<Link href={'/history'} key={20}>
						<h5 className="interMedium font-sm mr-2 text-blackText-500 py-2">Transactions</h5>
					</Link>
				</MenuItem>
				<MenuItem key={3} className=" hover:bg-colorSeven-500/20">
					<Link href={'/settings'} key={30}>
						<h5 className="interMedium font-sm mr-2 text-blackText-500 py-2">Settings</h5>
					</Link>
				</MenuItem>
			</ControlledMenu>
		</>
	)
}

export default HoverMenuWithTransition
