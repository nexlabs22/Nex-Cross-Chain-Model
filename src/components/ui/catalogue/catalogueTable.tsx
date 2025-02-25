"use client"

import GenericTable from "@/components/ui/generic/genericTable"
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { reduceAddress } from "@/utils/general"
import { useDashboard } from "@/providers/DashboardProvider"
import { formatToViewNumber } from "@/utils/conversionFunctions"
import { Address } from "@/types/indexTypes"
import CompositionAvatarGroup from "@/components/ui/generic/compositionAvatarGroup"
import { LuCopy } from "react-icons/lu"
import copy from "copy-to-clipboard"
import { useGlobal } from "@/providers/GlobalProvider"

const CatalogueTable = () => {
  const { nexTokens } = useDashboard()
  const {
    activeChainSetting: { chainName, network },
  } = useGlobal()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const mobileColumns: GridColDef[] = [
    {
      field: "index",
      headerName: "Index",
      disableColumnMenu: true,
      // resizable: true,
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          href={`/trade?side=buy&index=${params.row.symbol}`}
          style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
          underline="none"
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Box
              width={40}
              height={40}
              borderRadius={1}
              sx={{
                backgroundImage: `url(${params.row.logoString})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></Box>
            <Stack direction={"column"}>
              <Typography variant={"h6"}>{params.row.symbol}</Typography>
            </Stack>
          </Stack>
        </Link>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      disableColumnMenu: true,
      // resizable: true,
      minWidth: 100,
    },
    {
      field: "change24h",
      headerName: "24h Change",
      flex: 1.5,
      disableColumnMenu: true,
      // resizable: true,
      minWidth: 100,
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      disableColumnMenu: true,
      // resizable: true,
      sortable: false,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction={"row"} justifyContent={"end"} gap={1}>
          <Link
            href={`/trade?side=buy&index=${params.row.symbol}`}
            style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
            underline="none"
          >
            <Button
              variant="contained"
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
            href={`catalogue/${params.row.symbol}`}
            style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
            underline="none"
          >
            <Button
              variant="contained"
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
      ),
    },
  ]

  const desktopColumns: GridColDef[] = [
    {
      field: "index",
      headerName: "Index",
      disableColumnMenu: true,
      // resizable: true,
      flex: 2,
      renderCell: (params) => (
        <Link
          href={`/trade?side=buy&index=${params.row.symbol}`}
          style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
          underline="none"
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Box
              width={40}
              height={40}
              borderRadius={1}
              sx={{
                backgroundImage: `url(${params.row.logoString})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></Box>
            <Stack
              direction={"column"}
              alignItems={"start"}
              justifyContent={"start"}
            >
              <Typography variant={"h6"} display={{ xs: "none", lg: "block" }}>
                {params.row.name}
              </Typography>
              <Typography variant={"h6"} display={{ xs: "block", lg: "none" }}>
                {params.row.symbol}
              </Typography>
              <CompositionAvatarGroup
                index={params.row}
                size={20}
                borderColor={theme.palette.background.default}
              />
            </Stack>
          </Stack>
        </Link>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      width: 50,
      disableColumnMenu: true,
      // resizable: true,
    },
    {
      field: "totalSupply",
      headerName: "Total Supply",
      flex: 1,
      width: 50,
      disableColumnMenu: true,
      // resizable: true,
    },
    {
      field: "change24h",
      headerName: "24h Change",
      width: 50,
      flex: 1.5,
      disableColumnMenu: true,
      // resizable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 100,
      flex: 1.5,
      disableColumnMenu: true,
      // resizable: false,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"start"}
          gap={1}
        >
          <Typography variant={"body1"}>
            {reduceAddress(
              params.row.tokenAddresses?.Ethereum?.Sepolia?.token
                ?.address as Address
            )}
          </Typography>
          <IconButton
            sx={{ cursor: "pointer" }}
            onClick={() => {
              copy(
                params.row.tokenAddresses?.Ethereum?.Sepolia?.token
                  ?.address as Address
              )
            }}
          >
            <LuCopy size={16} color={theme.palette.info.main} />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      disableColumnMenu: true,
      // resizable: true,
      sortable: false,
      renderCell: (params) => (
        <Stack direction={"row"} justifyContent={"end"} gap={1}>
          <Link
            href={`/trade?side=buy&index=${params.row.symbol}`}
            style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
          >
            <Button
              variant="contained"
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
            href={`catalogue/${params.row.symbol}`}
            style={{ textDecoration: "none", width: "100%", cursor: "pointer" }}
          >
            <Button
              variant="contained"
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
      ),
    },
  ]

  const columns = isMobile ? mobileColumns : desktopColumns

  const rows = nexTokens.map((token, index) => ({
    id: index,
    ...token,
    price:
      token.smartContractInfo?.poolPrice &&
      `$${formatToViewNumber({
        value: token.smartContractInfo.poolPrice,
        returnType: "currency",
      })}`,
    totalSupply:
      token.smartContractInfo?.totalSupply &&
      `${formatToViewNumber({
        value: token.smartContractInfo?.totalSupply,
        returnType: "string",
      })}`,
    change24h: token.marketInfo?.change24hFmt
      ? `${token.marketInfo?.change24hFmt}%` 
      : "N/A",
    address: reduceAddress(
      token.tokenAddresses?.[chainName]?.[network]?.token?.address as Address
    ),
  }))

  return (
    <Stack width="100%" gap={2} paddingX={{ xs: "2px", lg: 0 }}>
      <GenericTable
        rows={rows}
        columns={columns}
        rowHeight={60}
        autoSizeOptions={{
          includeOutliers: true,
          includeHeaders: true,
          outliersFactor: 30,
          expand: true,
          columns: isMobile
            ? ["index", "price", "change24h", "action"]
            : [
                "index",
                "price",
                "totalSupply",
                "change24h",
                "address",
                "action",
              ],
        }}
      />
    </Stack>
  )
}

export default CatalogueTable
