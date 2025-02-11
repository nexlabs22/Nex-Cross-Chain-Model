import GenericCard from "@/components/ui/generic/genericCard"
import {
  Typography,
  Stack,
  CircularProgress,
  Box,
  circularProgressClasses,
} from "@mui/material"

// assets
import { MdOutlineArrowOutward } from "react-icons/md"
import theme from "@/theme/theme"

import { IndexCryptoAsset } from "@/types/indexTypes"

interface StakedAmountCardProps {
  index: IndexCryptoAsset
  percentage: number
  amount: number
}

const StakedAmountCard = ({
  index,
  percentage,
  amount,
}: StakedAmountCardProps) => {
  return (
    <GenericCard>
      <Stack spacing={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant={"h6"}>Staked {index.symbol}</Typography>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography variant={"body1"}>Etherscan</Typography>
            <MdOutlineArrowOutward size={24} color={theme.palette.info.main} />
          </Stack>
        </Stack>
        <Stack
          width={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
        >
          <CircularProgress
            variant="determinate"
            disableShrink
            value={percentage}
            size={150}
            thickness={4}
            sx={{
              // Active part (progress circle) color
              "& .MuiCircularProgress-colorPrimary": {
                color: theme.palette.brand.nex1.main, // Active part color
              },
              // Inactive part (remaining circle) color
              "& .MuiCircularProgress-colorSecondary": {
                color: theme.palette.grey[300], // Gray color for inactive part
              },
              [`&.${circularProgressClasses.colorPrimary}`]: {
                color: theme.palette.brand.nex1.main,
                strokeWidth: 4,
                strokeLinecap: "round",
              },
              [`&.${circularProgressClasses.colorSecondary}`]: {
                color: theme.palette.brand.nex1.main,
                strokeWidth: 4,
                strokeLinecap: "round",
              },
              "& .MuiCircularProgress-circleDeterminate": {
                color: theme.palette.brand.nex1.main,
                strokeWidth: 4,
                strokeLinecap: "round", // Rounded edges for active part
              },
              borderRadius: "50%", // Ensure circular shape
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              borderRadius: "50%",
              position: "absolute",
              zIndex: 1,
              border: `14px solid ${theme.palette.grey[500]}`,
              opacity: 0.5,
              width: 150,
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></Box>
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" component="div">
              {`${Math.round(percentage)}%`}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body1" textAlign={"center"}>
          {`${amount} ${index.symbol}`}
        </Typography>
      </Stack>
    </GenericCard>
  )
}

export default StakedAmountCard
