import type { Metadata } from "next"
import { Box, Stack } from "@mui/material"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Sidebar from "@/components/layout/sidebar"
import { Suspense } from "react"
export const metadata: Metadata = {
  title: "Nexlabs | Index Details",
  description: "View the details of our products",
}


const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<></>}>
    {children}
  </Suspense>
}

export default Layout
