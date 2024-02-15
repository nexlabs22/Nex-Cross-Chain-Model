'use client'

import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { use, useMemo } from 'react'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'

export const LifiWidget = () => {
	const {mode} = useLandingPageStore()
	// https://docs.li.fi/integrate-li.fi-widget/configure-widget
	const widgetConfig: WidgetConfig = useMemo(
		() => ({
			// tokens: {
			// Featured tokens will appear on top of the list
			// featured: [
			//   {
			// 	address: '0x2fd6c9b869dea106730269e13113361b684f843a',
			// 	symbol: 'NEX',
			// 	decimals: 9,
			// 	chainId: 5, //goerli
			// 	name: 'Nexlabs Token',
			// 	logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21334.png',
			//   },
			// ],
			// },
			containerStyle: {
				boxShadow: '0px 0px 3px 1px rgba(16,16,16,0.4)',
				borderRadius: '30px',
			},
			
			// I used colors from:
			// https://github.com/nexlabs22/landingPage/blob/main/tailwind.config.cjs
			theme: {
				palette: {
					primary: { main: '#2A2A2A' },
					secondary: { main: '#2A2A2A' },
					background: { 
					  paper: '#B7D1D3', // bg color for cards
					  default: '#5E869B', // bg color container
					  },
					grey: {
					  300: '#CEDFDF', // border light theme 
					  800: '#000000', // border dark theme
					  },
				  },
				typography: {
					fontFamily: 'Inter',
					color: "#2A2A2A"
				  },
				
			},
			appearance: "light",
			
			integrator: 'nexlabs.io',
			toToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			toChain: 'pol',
			fee: 0.01
		}),
		[]
	)
	return (
		<div className='w-fit h-fit overflow-hidden'>
			<LiFiWidget integrator="nexlabs.io" config={widgetConfig} />
		</div>
	)
}
