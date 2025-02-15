"use client"

import GenericCard from "@/components/ui/generic/genericCard"
import GenericAreaLineChart from "./genericAreaChart"
import { Box, Typography, Stack, Skeleton, Button, Link } from "@mui/material"
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup"

import {
  MdOutlineArrowUpward,
  MdOutlineArrowDownward
} from "react-icons/md"
import theme from "@/theme/theme"

import { IndexCryptoAsset } from "@/types/indexTypes"
import { formatToViewNumber } from "@/utils/conversionFunctions"
import { mongoDataToChartData } from "@/utils/convertToMongo/parse"

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
  const change24hString = index.marketInfo?.change24hFmt
    ? `${index.marketInfo?.change24hFmt}%`
    : "N/A"
  const change24hValue = index.marketInfo?.change24h as number
  const monthPrices = index.historicalPrice?.slice(0, 30).sort((a, b) => a.timestamp - b.timestamp) || []

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
      </Stack>
      <Stack gap={1} marginTop={3}>
        <Typography variant={"h3"}>{price}</Typography>
        <Stack gap={0} marginBottom={{ xs: 16, lg: 12 }}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Box
              borderRadius={"50%"}
              sx={{
                backgroundColor: change24hValue && change24hValue > 0 ? theme.palette.success.main : theme.palette.error.main,
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
              {formatToViewNumber({ value: change24hValue, returnType: 'currency' })} <span style={{ color: theme.palette.info.main, fontSize: 12, fontWeight: 400 }}>({change24hString})</span>
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='end' gap={0.5} marginTop={2}>
            <Link
              href={`/trade?side=buy&index=${index.symbol}`}
              style={{
                textDecoration: "none",
                width: "fit-content",
                cursor: "pointer",
              }}
            >
              <Button
                variant="contained"
                size='large'
                sx={{
                  backgroundColor: theme.palette.info.main,
                  borderRadius: 30,
                  color: theme.palette.background.default,
                  textTransform: "none",
                }}
              >
                <Typography variant={"h6"} fontWeight={700}>Trade</Typography>
              </Button>
            </Link>
            <Link
              href={`catalogue/index-details?index=${index.symbol}`}
              style={{
                textDecoration: "none",
                width: "fit-content",
                cursor: "pointer",
              }}
            >
              <Button
                variant="contained"
                size='large'
                sx={{
                  backgroundColor: theme.palette.info.main,
                  borderRadius: 30,
                  color: theme.palette.background.default,
                  textTransform: "none",
                }}
              >
                <Typography variant={"h6"} fontWeight={700}>Details</Typography>
              </Button>
            </Link>
          </Stack>
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
          {
            monthPrices.length > 0 ? (
              <GenericAreaLineChart label={index.symbol} chartData={mongoDataToChartData(monthPrices)} />
            ) : (
              <Stack width={'100%'} height={'100%'} padding={2} alignItems={'center'} justifyContent={'center'}>
                <Skeleton variant="rectangular" width={'100%'} height={'100%'} sx={{ borderRadius: 2 }} />
              </Stack>
            )
          }
        </Stack>
      </Stack>
    </GenericCard>
  )
}

export default IndexCard
