import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | My transactions",
  description: "View your transaction history",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
