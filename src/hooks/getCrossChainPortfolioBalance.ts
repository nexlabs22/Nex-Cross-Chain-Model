import { useEffect, useState, useCallback } from "react";
import {
  indexFactoryV2Abi,
  tokenAbi,
} from "@/constants/abi";
import { getClient } from "@/utils/getRPCClient";
import { PublicClient } from "viem";
import {
  chainSelectorAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses";
import { Address, AllowedTickers, CryptoAsset } from "@/types/indexTypes";
import { useGlobal } from "@/providers/GlobalProvider";
import { readContract } from "thirdweb";
import { useDashboard } from "@/providers/DashboardProvider";
import GetContract from "./getContract";

export function GetCrossChainPortfolioBalance(
  swapFromToken: CryptoAsset,
  swapToToken: CryptoAsset
) {
  const {
    activeChainSetting: { network },
  } = useGlobal();
  const { nexTokens } = useDashboard();
  const [portfolioValue, setPortfolioValue] = useState<number>();

  const allowedSymbols = nexTokens
    .filter((token) => token.smartContractType === "crosschain")
    .map((token) => token.symbol);

  const activeTicker = [swapFromToken.symbol, swapToToken.symbol].find((symbol) =>
    allowedSymbols.includes(symbol)
  );

  const factoryContract = activeTicker
    ? GetContract(activeTicker as AllowedTickers, "factory")
    : null;
  const storageContract = activeTicker
    ? GetContract(activeTicker as AllowedTickers, "storage")
    : null;

  const arbitrumSepoliaPublicClient = getClient("Arbitrum", "Sepolia");

  const getPortfolioValue = useCallback(async () => {

    if (!activeTicker || !factoryContract || !storageContract) {
      setPortfolioValue(0);
      return;
    }

    let totalPortfolioBalance = 0;

    try {
      const portfolioBalance = await readContract({
        contract: factoryContract,
        method: "function getPortfolioBalance() returns(uint256)",
      });

      totalPortfolioBalance += Number(portfolioBalance);

      const totalCurrentList = await readContract({
        contract: storageContract,
        method: "function totalCurrentList() returns (uint256)",
      });

      for (let i = 0; i < Number(totalCurrentList); i++) {
        const tokenAddress = await readContract({
          contract: storageContract,
          method: "function currentList(uint256) returns (address)",
          params: [BigInt(i)],
        });

        const tokenChainSelector = await readContract({
          contract: storageContract,
          method: "function tokenChainSelector(address) returns(uint64)",
          params: [tokenAddress],
        });

        if (
          Number(tokenChainSelector) ===
          Number(chainSelectorAddresses.Arbitrum?.[network])
        ) {
          const tokenBalance = await (arbitrumSepoliaPublicClient as PublicClient).readContract({
            address: tokenAddress as Address,
            abi: tokenAbi,
            functionName: "balanceOf",
            args: [tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.vault?.address],
          });

          const tokenValue = await (arbitrumSepoliaPublicClient as PublicClient).readContract({
            address: tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.factory?.address as Address,
            abi: indexFactoryV2Abi,
            functionName: "getAmountOut",
            args: [
              tokenAddress,
              tokenAddresses.WETH?.Arbitrum?.Sepolia?.token?.address,
              tokenBalance,
              3,
            ],
          });

          totalPortfolioBalance += Number(tokenValue);
        }
      }

      setPortfolioValue(totalPortfolioBalance);
    } catch (error) {
      console.error("Error fetching portfolio balance:", error);
    }
  }, [factoryContract, activeTicker,storageContract, network, arbitrumSepoliaPublicClient]);

  useEffect(() => {
    getPortfolioValue();
  }, [getPortfolioValue]);

  return {
    data: portfolioValue,
    reload: getPortfolioValue,
  };
}
