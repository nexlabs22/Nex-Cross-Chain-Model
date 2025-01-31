import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Index Details",
  description: "View the details of our products",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
