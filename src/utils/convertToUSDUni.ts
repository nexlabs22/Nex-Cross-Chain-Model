import { isWETH, SwapNumbers } from "./general";
import getPoolAddress from "./getPoolAddress";
import { Address, getContract, readContract } from "thirdweb";
import { client } from "./thirdWebClient";
import { Networks } from "@/types/indexTypes";
import { networkToChain } from "./mappings";

export default async function convertToUSDUni(
  address: Address,
  decimals: number,
  ethPrice: number,
  network: Networks
) {
  try {
    if (isWETH(address)) return ethPrice;

    const poolAddress = await getPoolAddress(address, network);
    let isRevPool = false;

    const chain = networkToChain[network];
    const poolContract = getContract({
      address: poolAddress as string,
      chain,
      client,
    });

    const data = await readContract({
      contract: poolContract,
      method:
        "function slot0() returns (uint160,  int24, uint16, uint16,  uint16, uint8,bool)",
      // sqrtPriceX96 uint160, tick int24, observationIndex uint16, observationCardinality uint16, observationCardinalityNext uint16, feeProtocol uint8, unlocked bool
      params: [],
    });

    const token0 = await readContract({
      contract: poolContract,
      method: "function token0() returns (address)",
      params: [],
    });

    const fromSqrtPriceX96 = Number(data[0]);

    let decimal0 = Number(decimals);
    let decimal1 = 18;

    if (token0 !== address) {
      isRevPool = true;
      [decimal0, decimal1] = SwapNumbers(decimal0, decimal1);
    }

    const calculatedPrice =
      Math.pow(fromSqrtPriceX96 / 2 ** 96, 2) /
      (10 ** decimal1 / 10 ** decimal0);
    const calculatedPriceAsNumber = parseFloat(
      calculatedPrice.toFixed(decimal1)
    );

    const priceInUSD = isRevPool
      ? calculatedPriceAsNumber / ethPrice
      : 1 / calculatedPriceAsNumber / ethPrice;

    return priceInUSD as number;
  } catch (err) {
    console.dir(err, { depth: null });
    console.log("Error in getting USD Price", err);
    return null;
  }
}
