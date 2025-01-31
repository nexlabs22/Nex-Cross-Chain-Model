import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Personal settings",
  description: "Personal settings and preferences",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
