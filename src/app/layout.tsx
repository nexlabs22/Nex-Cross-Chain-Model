import type { Metadata } from "next"
import ClientThemeProvider from "@/providers/ThemeProvider"
import { ThirdwebProvider } from "thirdweb/react"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import { DashboardProvider } from "@/providers/DashboardProvider"
import { GlobalProvider } from "@/providers/GlobalProvider"
import { TradeProvider } from "@/providers/TradeProvider"
import { HistoryProvider } from "@/providers/HistoryProvider"
import { ToastContainer } from "react-toastify"
import localFont from "next/font/local"

// Define local font optimization
const satoshi = localFont({
  src: [
    {
      path: "../fonts/satoshi/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../fonts/satoshi/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NexLabs - Index your trades, your investment, your future",
  description: "NexLabs: One-stop-shop for asset management.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log("running root layout")
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <body style={{ overflowX: "hidden" }}>
        <ThirdwebProvider>
          <GlobalProvider>
            <DashboardProvider>
              <TradeProvider>
                <HistoryProvider>
                  <InitColorSchemeScript attribute="class" />
                  <ClientThemeProvider>{children}</ClientThemeProvider>
                  <ToastContainer position="bottom-right" theme="dark" />
                </HistoryProvider>
              </TradeProvider>
            </DashboardProvider>
          </GlobalProvider>
        </ThirdwebProvider>
      </body>
    </html>
  )
}
