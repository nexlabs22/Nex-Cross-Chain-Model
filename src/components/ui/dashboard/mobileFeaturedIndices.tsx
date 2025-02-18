"use client"

import { Stack } from "@mui/material"
import Grid from "@mui/material/Grid2"
import IndexCard from "@/components/ui/generic/indexCard"
import { IndexCryptoAsset } from "@/types/indexTypes"
import Carousel from "@/components/ui/generic/genericCarousel"
import { useDashboard } from "@/providers/DashboardProvider"

const MobileFeaturedIndices = () => {
  const { nexTokens } = useDashboard()

  return (
    <Stack
      width="100%"
      height={"100%"}
      display={{ xs: "block", lg: "none" }}
      sx={{
        backgroundColor: "transparent",
        "& .carousel-container": {
          width: "100%",
          height: "100%",
          padding: { xs: 0, lg: "20px 0" },
        },
        "& .carousel-item": {
          padding: { xs: "0 2px", lg: "0 0px" },
          height: "100%",
        },
        "& .react-multi-carousel-track": {
          height: "100%",
        },
      }}
    >
      <Grid container spacing={0} height={"100%"}>
        <Carousel
          autoPlay={true}
          transitionDuration={500}
          dotColor={"primary"}
          arrowColor={"text.primary"}
          swipeable={true}
          slidesPerView={{
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
          }}
          spacing={10}
          interval={5000}
        >
          {nexTokens.map((index: IndexCryptoAsset, key: number) => (
            <IndexCard key={key} index={index} />
          ))}
        </Carousel>
      </Grid>
    </Stack>
  )
}

export default MobileFeaturedIndices
