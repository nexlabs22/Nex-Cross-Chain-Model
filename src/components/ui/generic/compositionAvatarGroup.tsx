import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import Image from "next/image"

import { IndexCryptoAsset } from "@/types/indexTypes"
import theme from "@/theme/theme"

interface CompositionAvatarGroupProps {
  index: IndexCryptoAsset
  size?: number
  borderColor?: string
}

const CompositionAvatarGroup = ({
  index,
  size = 20,
  borderColor = theme.palette.elevations.elevation800.main,
}: CompositionAvatarGroupProps) => {
  const totalAvatars = index?.assets?.length ?? 0

  return (
    <AvatarGroup
      max={5}
      slotProps={{
        surplus: {
          sx: {
            border: `3px solid ${borderColor}`,
            backgroundColor: theme.palette.elevations.elevation500.main,
            color: theme.palette.info.main,
            fontSize: ".8rem",
            fontWeight: "500",
            width: size - 8,
            height: size - 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0.5,
            zIndex: totalAvatars * 10,
          },
        },
      }}
      sx={{
        "& .MuiAvatar-root": {
          border: `3px solid ${borderColor}`,
        },
      }}
    >
      {index?.assets
        ?.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
        .map((asset, key) => (
          <Avatar
            alt={asset.symbol}
            key={key}
            sx={{
              backgroundColor: asset?.bgColor,
              width: size,
              height: size,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: totalAvatars * key,
            }}
          >
            {asset?.logoString && (
              <Image
                src={asset?.logoString}
                alt={asset?.symbol}
                width={size}
                height={size}
              />
            )}
          </Avatar>
        ))}
    </AvatarGroup>
  )
}

export default CompositionAvatarGroup
