import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Catalogue",
  description: "Explore the Nexlabs catalogue and find the best index tokens",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
