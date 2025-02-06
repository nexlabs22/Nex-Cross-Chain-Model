"use client"

import {
  Stack,
  Typography,
  Button,
  IconButton,
  Input,
  Divider,
} from "@mui/material"
import theme from "@/theme/theme"
import { useState } from "react"

// assets :
import { LuSettings2 } from "react-icons/lu"

// types:
import { IndexCryptoAsset } from "@/types/indexTypes"

interface SwapProps {
  side?: "stake" | "unstake"
  defaultToken?: IndexCryptoAsset
}

export default function Stake({ side = "stake", defaultToken }: SwapProps) {
  const [autoValue, setAutoValue] = useState<"min" | "half" | "max" | "auto">(
    "auto"
  )
  const [amount, setAmount] = useState(0)
  const [selectedSide, setSelectedSide] = useState<"stake" | "unstake">(side)
  return (
    <Stack
      width="100%"
      gap={2}
      sx={{
        backgroundColor: theme.palette.elevations.elevation950.main,
        border: `1px solid ${theme.palette.elevations.elevation800.main}`,
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="primary">
          {selectedSide === "stake" ? "Stake" : "Unstake"}{" "}
          {defaultToken?.symbol}
        </Typography>
        <IconButton
          size="small"
          color="primary"
          sx={{
            borderRadius: "50%",
            border: `1px solid ${theme.palette.elevations.elevation700.main}`,
            padding: 1,
          }}
        >
          <LuSettings2 />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="space-between"
        gap={2}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                autoValue === "min"
                  ? theme.palette.brand.nex1.main
                  : theme.palette.elevations.elevation700.main,
              padding: 0.5,
            }}
            onClick={() => setAutoValue("min")}
          >
            MIN
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                autoValue === "half"
                  ? theme.palette.brand.nex1.main
                  : theme.palette.elevations.elevation700.main,
              padding: 0.5,
            }}
            onClick={() => setAutoValue("half")}
          >
            HALF
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                autoValue === "max"
                  ? theme.palette.brand.nex1.main
                  : theme.palette.elevations.elevation700.main,
              padding: 0.5,
            }}
            onClick={() => setAutoValue("max")}
          >
            MAX
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                selectedSide === "stake"
                  ? theme.palette.brand.nex1.main
                  : theme.palette.elevations.elevation700.main,
              padding: 0.5,
            }}
            onClick={() => setSelectedSide("stake")}
          >
            Stake
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                selectedSide === "unstake"
                  ? theme.palette.brand.nexRed.main
                  : theme.palette.elevations.elevation700.main,
              padding: 0.5,
            }}
            onClick={() => setSelectedSide("unstake")}
          >
            Unstake
          </Button>
        </Stack>
      </Stack>
      <Stack gap={1}>
        <Stack
          justifyContent="space-between"
          sx={{
            border: `1px solid ${theme.palette.elevations.elevation700.main}`,
            borderRadius: 2,
            padding: 1.5,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Locked amount
          </Typography>
          <Input
            disableUnderline
            size="small"
            placeholder="0.00"
            sx={{
              width: "100%",
              border: "none",
              outline: "none",
              "& .MuiInputBase-input": {
                paddingY: 1,
                paddingX: 0.5,
                fontSize: 20,
              },
            }}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </Stack>
      </Stack>
      <Stack gap={0.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="text.secondary">
            Available
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.brand.nex1.main}>
            $0.00
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="text.secondary">
            vToken Balance
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.brand.nex1.main}>
            $0.00
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="text.secondary">
            Est. APY
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.brand.nex1.main}>
            $0.00
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="text.secondary">
            Platform Fees
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.brand.nex1.main}>
            $0.00
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="text.secondary">
            Total Fees
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.brand.nex1.main}>
            $0.00
          </Typography>
        </Stack>
      </Stack>
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor:
            amount > 0
              ? theme.palette.brand.nex1.main
              : theme.palette.elevations.elevation800.main,
          color:
            amount > 0
              ? theme.palette.info.main
              : theme.palette.elevations.elevation400.main,
          textTransform: "capitalize",
        }}
      >
        <Typography variant="h6">
          {amount > 0 ? `Confirm` : "Enter amount"}
        </Typography>
      </Button>
    </Stack>
  )
}
