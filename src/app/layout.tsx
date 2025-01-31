import type { Metadata } from "next"
import ClientThemeProvider from "@/providers/ThemeProvider"
import { ThirdwebProvider } from "thirdweb/react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import "@/fonts/satoshi/satoshi.css"
import { DashboardProvider } from "@/providers/DashboardProvider";
import { GlobalProvider } from "@/providers/GlobalProvider";

export const metadata: Metadata = {
  title: "NexLabs - Index your trades, your investment, your future",
  description: "NexLabs: One-stop-shop for asset management.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ overflowX: 'hidden', fontFamily: 'Satoshi-Variable' }}>
        <ThirdwebProvider>
          <GlobalProvider>            
              <DashboardProvider>
                <InitColorSchemeScript attribute="class" />
                <ClientThemeProvider>{children}</ClientThemeProvider>
              </DashboardProvider>            
          </GlobalProvider>
        </ThirdwebProvider>
      </body>
    </html>
  )
}
