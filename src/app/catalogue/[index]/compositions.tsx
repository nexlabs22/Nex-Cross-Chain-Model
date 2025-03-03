import { IndexCryptoAsset } from "@/types/indexTypes";
import { Stack, Typography, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getWeights } from "@/utils/getWeights";

interface Allocation {
  symbol: string;
  weight: number;
}

const Composition = ({ index }: { index: IndexCryptoAsset }) => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  useEffect(() => {
    async function fetchAllocations() {
      const weightsData = await getWeights(index);
      if (weightsData && weightsData.allocations) {
        console.log(weightsData.allocations)
        setAllocations(weightsData.allocations);
      }
    }
    fetchAllocations();
  }, [index]);

  return (
    <>
      <Typography variant="h4" color="primary" marginBottom={2}>
        Composition
      </Typography>
      <Grid container spacing={2}>
        {index.assets
          ?.sort((a, b) => {
            const allocA =
              allocations.find(
                (alloc) =>
                  alloc.symbol.toUpperCase() === a.symbol.toUpperCase()
              )?.weight ?? a.weight;
            const allocB =
              allocations.find(
                (alloc) =>
                  alloc.symbol.toUpperCase() === b.symbol.toUpperCase()
              )?.weight ?? b.weight;
            return (allocB ?? 0) - (allocA ?? 0);
          })
          .map((asset, key) => {
            const allocation = allocations.find(
              (alloc) =>
                alloc.symbol.toUpperCase() === asset.symbol.toUpperCase()
            );
            const displayedWeight = allocation
              ? (allocation.weight * 100).toFixed(2)
              : asset.weight;

            return (
              <Grid size={{ xs: 6, md: 4, lg: 2 }} key={key}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
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
                      style={{
                        borderRadius: '50%'
                      }}
                    />
                  </Box>
                  <Stack direction="column">
                    <Typography variant="h6">{asset.symbol}</Typography>
                    {
                      allocation ? <Typography variant="h6">{displayedWeight}%</Typography> : <Skeleton variant="text" width={50} height={20} />
                    }
                  </Stack>
                </Stack>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default Composition;