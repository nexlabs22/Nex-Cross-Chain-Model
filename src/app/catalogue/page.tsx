import { Box, Stack } from "@mui/material"

// project imports : 
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/sidebar'
import Footer from "@/components/layout/Footer"
import CatalogueView from "@/components/ui/catalogue/catalogueView"
import QuickActions from "@/components/ui/generic/quickActions"

const Page = () => {
  return (
    <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'row'}>
      <Sidebar />
      <Box
        marginLeft={{xs:0, lg:"5vw"}}
        flexGrow={1}
        overflow="auto"
      >
        <Stack spacing={2} paddingBottom={2} paddingX={2}>
          <Header />
          <QuickActions />
          <CatalogueView />
          <Box width={'100%'} height={'20vh'}></Box>
          <Footer />
        </Stack>
      </Box>
    </Box>
  )
}

export default Page
