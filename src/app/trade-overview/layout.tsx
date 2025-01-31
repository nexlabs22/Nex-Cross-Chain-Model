import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Trade overview",
  description: "Overview of Nex indices available for trading",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
