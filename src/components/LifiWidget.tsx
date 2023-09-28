'use client'
import { LiFiWidget, WidgetConfig } from '@lifi/widget'

const widgetConfig: WidgetConfig = {
	integrator: 'Nexlabs.io',
	containerStyle: {
		border: '1px solid rgb(234, 234, 234)',
		borderRadius: '16px',
	},
}

export const LifiWidget = () => {
	return <LiFiWidget integrator="Nexlabs.io" config={widgetConfig} />
}
