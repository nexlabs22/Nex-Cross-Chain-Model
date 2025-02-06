import { IndexCryptoAsset } from "@/types/indexTypes"
import { Stack, Typography, Box } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Image from "next/image"

const Composition = ({ index }: { index: IndexCryptoAsset }) => {
  return (
    <>
      <Typography variant="h4" color="primary" marginBottom={2}>
        Composition
      </Typography>
      <Grid container spacing={2}>
        {/* {index. */}
        {index.assets
          ?.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
          .map((asset, key) => (
            <Grid size={{ xs: 6, md: 4, lg: 2 }} key={key}>
              <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={50}
                  height={50}
                  sx={{
                    backgroundColor: asset.bgColor,
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={asset.logoString || ""}
                    alt={asset.symbol}
                    width={50}
                    height={50}
                  />
                </Box>
                <Stack direction={"column"}>
                  <Typography variant="h6">{asset.symbol}</Typography>
                  <Typography variant="h6">{asset.weight}%</Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default Composition
