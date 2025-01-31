import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Portfolio",
  description: "View your portfolio and manage your assets",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
