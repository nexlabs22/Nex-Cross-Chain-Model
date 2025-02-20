"use client"

import { useEffect, useState } from "react"
import GenericCard from "@/components/ui/generic/genericCard"
import GenericAreaLineChart from "./genericAreaChart"
import { Box, Typography, Stack, Skeleton, Button, Link } from "@mui/material"
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup"
import { useDashboard } from "@/providers/DashboardProvider"
import { DailyAsset } from "@/types/mongoDb"
import { calculateHistoricalTwentyFourHourChange } from "@/utils/calculateTwentyFourHourChange"

import { MdOutlineArrowUpward, MdOutlineArrowDownward } from "react-icons/md"
import theme from "@/theme/theme"
import { IoIosHelpCircle } from "react-icons/io";

import IconButton from "@mui/material/IconButton"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { IndexCryptoAsset } from "@/types/indexTypes"
import { formatToViewNumber } from "@/utils/conversionFunctions"
import { mongoDataToChartData } from "@/utils/convertToMongo/parse"

interface IndexCardProps {
  index: IndexCryptoAsset
}

const InfoTooltip = () => {
  return (
    <Tooltip
      sx={{ 
        marginLeft: 0, 
        backgroundColor: theme.palette.elevations.elevation900.main, 
        color: theme.palette.text.primary,
        borderRadius: 1,
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: theme.palette.elevations.elevation900.main,
          color: theme.palette.text.primary,
        },
      }}
      placement="top"
      title={
        <Typography variant="body2">
          Date range from 365 days ago to present
        </Typography>
      }
    >
      <IconButton>
        <IoIosHelpCircle color={theme.palette.elevations.elevation500.main} size={20} />
      </IconButton>
    </Tooltip>
  )
}

const arrowComponent = ({
  change24hValue,
  loadingHistoricalPrices,
}: {
  change24hValue: number | null | undefined
  loadingHistoricalPrices: boolean
}) => {
  let item = null
  let bgColor = theme.palette.elevations.elevation50.main
  const change24hString = change24hValue
    ? change24hValue.toFixed(2) + "% 1Y"
    : "N/A"

  if (!change24hValue) {
    item = <Skeleton variant="circular" width={16} height={16} />
    bgColor = "grey"
  } else if (change24hValue > 0) {
    item = <MdOutlineArrowUpward size={16} color={theme.palette.brand.nex1.main} />
  } else {
    item = <MdOutlineArrowDownward size={16} color={theme.palette.brand.nexRed.main} />
  }

  return (
    <>
      <Box
        borderRadius={"50%"}
        sx={{
          backgroundColor: bgColor,
          width: 24,
          height: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item}
      </Box>
      {loadingHistoricalPrices ? (
        <Skeleton variant="text" width={100} height={40} />
      ) : (
        <>
          <Typography
            variant={"h6"}
            color={
              loadingHistoricalPrices
                ? "text.secondary"
                : change24hValue && change24hValue > 0
                ? "success.main"
                : "error.main"
            }
          >
            {change24hValue
              ? change24hString
              : loadingHistoricalPrices
              ? "..."
              : "N/A"}
          </Typography>
          <InfoTooltip />
        </>
      )}
    </>
  )
}

const IndexCard = ({ index }: IndexCardProps) => {
  const { historicalPrices, loadingHistoricalPrices } = useDashboard()
  const tokenPrices = historicalPrices?.filter(
    (asset: DailyAsset) => asset.ticker === index.symbol
  )
  const [change24hValue, setChange24hValue] = useState<number | null>(null)

  useEffect(() => {
    if (!historicalPrices) {
      return
    }
    const value = calculateHistoricalTwentyFourHourChange(tokenPrices)
    setChange24hValue(value)
  }, [tokenPrices, historicalPrices])

  const logo = index.logoString
  const price = tokenPrices?.[tokenPrices.length - 1]?.price
  const priceString = price
    ? `$${formatToViewNumber({
        // value: index.smartContractInfo?.poolPrice,
        value: price,
        returnType: "currency",
      })}`
    : index.marketInfo?.offChainPrice
    ? `$${formatToViewNumber({
        value: index.marketInfo?.offChainPrice,
        returnType: "currency",
      })}`
    : "N/A"

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
        {
          price && change24hValue && <Typography variant={"h3"}>
          {loadingHistoricalPrices ? (
            <Skeleton variant="text" width={50} height={32} />
          ) : (
            priceString
          )}
        </Typography>
        }
        {
          !price && !change24hValue && (
            <Skeleton variant="text" width={100} height={24} />
          )
        }
        <Stack gap={0} marginBottom={{ xs: 16, lg: 12 }}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            {arrowComponent({ change24hValue, loadingHistoricalPrices })}
          </Stack>
          <Stack direction="row" alignItems="end" gap={1} marginTop={2}>
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
                size="large"
                sx={{
                  backgroundColor: theme.palette.brand.nex1.main,
                  paddingY: 0.5,
                  paddingX: 1,
                  borderRadius: 2,
                  color: theme.palette.info.main,
                  textTransform: "none",
                }}
              >
                <Typography variant={"h6"}>Trade</Typography>
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
                size="large"
                sx={{
                  backgroundColor: theme.palette.brand.nex1.main,
                  paddingY: 0.5,
                  paddingX: 1,
                  borderRadius: 2,
                  color: theme.palette.info.main,
                  textTransform: "none",
                }}
              >
                <Typography variant={"h6"}>Details</Typography>
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Stack
          width={"100%"}
          height={{ xs: "20vh", lg: 130 }}
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
          {tokenPrices?.length > 0 ? (
            <GenericAreaLineChart
              label={index.symbol}
              chartData={mongoDataToChartData(tokenPrices)}
            />
          ) : (
            <Stack
              width={"100%"}
              height={"100%"}
              padding={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"100%"}
                sx={{ borderRadius: 2 }}
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </GenericCard>
  )
}

export default IndexCard
