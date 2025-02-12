import { Box } from "@mui/material"

// project imports : 
import CatalogueView from "@/components/ui/catalogue/catalogueView"
import QuickActions from "@/components/ui/generic/quickActions"

const Page = () => {
  return (
    <>
      <QuickActions />
      <CatalogueView />
      <Box width={'100%'} height={'20vh'}></Box>
    </>
  )
}

export default Page
