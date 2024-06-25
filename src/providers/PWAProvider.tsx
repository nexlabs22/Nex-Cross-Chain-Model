import React, { createContext, useState, useEffect, useContext, ReactElement } from 'react';

interface PWAContextProps {
    isStandalone: boolean
    browser: String
    os: String
}

const PWAContext = createContext<PWAContextProps>({
    isStandalone: false,
    browser: "",
    os: ""
})

const usePWA = () => {
    return(useContext(PWAContext))
}

const PWAProvider = ({ children }: { children: React.ReactNode }) => {

    const [isStandalone, setIsStandalone] = useState(false)
	const [os, setOs] = useState<String>('')
	const [browser, setBrowser] = useState<String>('')

	function detectMobileBrowserOS() {
		const userAgent = navigator.userAgent

		let browser: string | undefined
		let os: string | undefined

		browser = ''
		os = ''
		// Check for popular mobile browsers
		if (/CriOS/i.test(userAgent)) {
			browser = 'Chrome'
		} else if (/FxiOS/i.test(userAgent)) {
			browser = 'Firefox'
		} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
			browser = 'Safari'
		}

		// Check for common mobile operating systems
		if (/iP(ad|hone|od)/i.test(userAgent)) {
			os = 'iOS'
		} else if (/Android/i.test(userAgent)) {
			os = 'Android'
		}

		setOs(os.toString())
		setBrowser(browser.toString())
	}

	useEffect(() => {
		detectMobileBrowserOS()
	}, [])

	useEffect(() => {
		// Client-side detection using window.matchMedia (optional)
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(display-mode: standalone)')
			const handleChange = (event: MediaQueryListEvent) => setIsStandalone(event.matches)
			mediaQuery.addEventListener('change', handleChange)
			setIsStandalone(mediaQuery.matches) // Set initial client-side state
			//alert(mediaQuery.matches)
			return () => mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

    const contextValue = {
        isStandalone: isStandalone,
        browser: browser,
        os: os
    }

    return(
        <PWAContext.Provider value={contextValue}>
            {children}
        </PWAContext.Provider>
    )

}

export { PWAProvider, PWAContext, usePWA}