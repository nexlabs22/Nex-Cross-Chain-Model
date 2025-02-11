"use client"

import GenericCard from "@/components/ui/generic/genericCard"
import GenericAreaLineChart from "./genericAreaChart"
import { Box, Typography, Stack } from "@mui/material"
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup"

import {
  MdOutlineArrowOutward,
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
} from "react-icons/md"
import theme from "@/theme/theme"

import { IndexCryptoAsset } from "@/types/indexTypes"
import { formatToViewNumber } from "@/utils/conversionFunctions"

//interface
interface IndexCardProps {
  index: IndexCryptoAsset
}

const IndexCard = ({ index }: IndexCardProps) => {

  const logo = index.logoString
  const price = index.smartContractInfo?.poolPrice
    ? `$${formatToViewNumber({
      value: index.smartContractInfo?.poolPrice,
      returnType: "currency",
    })}`
    : index.marketInfo?.offChainPrice
      ? `$${formatToViewNumber({
        value: index.marketInfo?.offChainPrice,
        returnType: "currency",
      })}`
      : "N/A"
  const change24hString = index.marketInfo?.change24h
    ? `${index.marketInfo?.change24h}%`
    : "N/A"
  const change24hValue = index.marketInfo?.change24h

  return (
    <GenericCard>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <Box
            width={64}
            height={64}
            borderRadius={1}
            sx={{
              backgroundImage: `url(${logo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>
          <Stack
            direction={"column"}
            alignItems={"start"}
            justifyContent={"center"}
            gap={0.5}
          >
            <Typography variant={"subtitle1"}>{index.name}</Typography>
            <CompositionAvatarGroup
              index={index}
              size={28}
              borderColor={theme.palette.elevations.elevation800.main}
            />
          </Stack>
        </Stack>
        <MdOutlineArrowOutward size={24} color={theme.palette.info.main} />
      </Stack>
      <Stack gap={1} marginTop={3}>
        <Typography variant={"h3"}>{price}</Typography>
        <Stack gap={0} marginBottom={{ xs: 16, lg: 12 }}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Box
              borderRadius={"50%"}
              sx={{
                backgroundColor: theme.palette.success.main,
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!!change24hValue && change24hValue > 0 ? (
                <MdOutlineArrowUpward
                  size={16}
                  color={theme.palette.info.main}
                />
              ) : (
                <MdOutlineArrowDownward
                  size={16}
                  color={theme.palette.info.main}
                />
              )}
            </Box>
            <Typography
              variant={"h6"}
              color={
                change24hValue && change24hValue > 0
                  ? "success.main"
                  : "error.main"
              }
            >
              {change24hString}
            </Typography>
          </Stack>
          <Typography variant={"subtitle2"} color={"text.secondary"}>
            {index.marketInfo?.change24h && index.marketInfo?.change24h > 0
              ? "More than"
              : "Less than"}{" "}
            last 24 hours
          </Typography>
        </Stack>
        <Stack
          width={"100%"}
          height={{ xs: "16vh", lg: 100 }}
          marginX={"auto"}
          paddingTop={{ xs: 3, lg: 0 }}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <GenericAreaLineChart label={index.symbol} />
        </Stack>
      </Stack>
    </GenericCard>
  )
}

export default IndexCard
