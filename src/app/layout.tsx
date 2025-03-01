import type { Metadata } from "next"
import ClientThemeProvider from "@/providers/ThemeProvider"
import { ThirdwebProvider } from "thirdweb/react"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import "@/fonts/satoshi/satoshi.css"
import { DashboardProvider } from "@/providers/DashboardProvider"
import { GlobalProvider } from "@/providers/GlobalProvider"
import { TradeProvider } from "@/providers/TradeProvider"
import { HistoryProvider } from "@/providers/HistoryProvider"
import { Suspense } from "react"

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
    <html lang="en" suppressHydrationWarning>
      <body style={{ overflowX: "hidden", fontFamily: "Satoshi-Variable" }}>
        <Suspense fallback={null}>
          <ThirdwebProvider>
            <GlobalProvider>
              <DashboardProvider>
                <TradeProvider>
                  <HistoryProvider>
                    <InitColorSchemeScript attribute="class" />
                    <ClientThemeProvider>{children}</ClientThemeProvider>
                  </HistoryProvider>
                </TradeProvider>
              </DashboardProvider>
            </GlobalProvider>
          </ThirdwebProvider>
        </Suspense>
      </body>
    </html>
  )
}