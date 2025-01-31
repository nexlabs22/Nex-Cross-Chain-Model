import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactElement,
} from "react"

interface PWAContextProps {
  isStandalone: boolean
  browser: string
  os: string
}

const PWAContext = createContext<PWAContextProps>({
  isStandalone: false,
  browser: "",
  os: "",
})

const usePWA = (): PWAContextProps => useContext(PWAContext)

const PWAProvider = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  const [isStandalone, setIsStandalone] = useState(false)
  const [os, setOs] = useState<string>("")
  const [browser, setBrowser] = useState<string>("")

  const detectMobileBrowserOS = () => {
    const userAgent = navigator.userAgent

    // Check for popular mobile browsers
    if (/CriOS/i.test(userAgent)) {
      setBrowser("Chrome")
    } else if (/FxiOS/i.test(userAgent)) {
      setBrowser("Firefox")
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      setBrowser("Safari")
    }

    // Check for common mobile operating systems
    if (/iP(ad|hone|od)/i.test(userAgent)) {
      setOs("iOS")
    } else if (/Android/i.test(userAgent)) {
      setOs("Android")
    }
  }

  useEffect(() => {
    detectMobileBrowserOS()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(display-mode: standalone)")
      const handleChange = (event: MediaQueryListEvent) =>
        setIsStandalone(event.matches)

      mediaQuery.addEventListener("change", handleChange)
      setIsStandalone(mediaQuery.matches) // Set initial state
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const contextValue = {
    isStandalone,
    browser,
    os,
  }

  return (
    <PWAContext.Provider value={contextValue}>{children}</PWAContext.Provider>
  )
}

export { PWAProvider, usePWA }
