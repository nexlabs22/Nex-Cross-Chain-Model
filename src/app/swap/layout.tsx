import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Swap",
  description: "Multichain asset swap, transfer and on/off ramp",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
