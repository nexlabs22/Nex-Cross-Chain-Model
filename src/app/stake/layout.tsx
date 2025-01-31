import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Stake",
  description: "Stake your assets and earn rewards",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
