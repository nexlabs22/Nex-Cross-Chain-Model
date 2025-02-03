import type { Metadata } from "next"
import { Box, Stack } from "@mui/material"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Sidebar from "@/components/layout/sidebar"

export const metadata: Metadata = {
  title: "Nexlabs | Index Details",
  description: "View the details of our products",
}


const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'row'}>
    <Sidebar />
    <Box
      marginLeft={{ xs: 0, lg: "5vw" }}
      flexGrow={1}
      overflow="auto"
    >
      <Stack spacing={2} paddingBottom={2} paddingX={2}>
        <Header />
        {children}
        <Footer />
      </Stack>
    </Box>
  </Box>
}


export default Layout
