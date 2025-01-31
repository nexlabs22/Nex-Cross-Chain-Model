import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nexlabs | Account",
  description:
    "View your account details, balances, transactions and performance",
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default Layout
