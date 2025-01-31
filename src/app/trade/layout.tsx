import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Trade",
  description: "Trade, compare and place orders for index tokens",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
