import { useEffect, useState, useCallback } from "react";
import { GetTradeHistoryCrossChain } from "./getTradeHistoryCrossChain";
import { Transaction, RequestType, AllowedTickers, Address } from "@/types/indexTypes";
import { useDashboard } from "@/providers/DashboardProvider";
import { num } from "@/utils/conversionFunctions";

export function GetPositionsHistoryCrossChain(dataFromGraph: { [key: string]: RequestType[] }) {
  const { nexTokens } = useDashboard();
  const crossChainpositionHistory = GetTradeHistoryCrossChain(dataFromGraph);
  const [positions, setPositions] = useState<Transaction[]>([]);

  const getHistory = useCallback(() => {
    try {
      const crossChainTokensSet = new Set(
        nexTokens
          .filter(token => token.smartContractType === "crosschain")
          .map(token => token.symbol.toLowerCase())
      );

      const positions0: Transaction[] = Object.entries(dataFromGraph)
        .filter(([key]) => Array.from(crossChainTokensSet).some(token => key.includes(token)))
        .flatMap(([key, logs]) => {
          const isMint = key.includes("RequestIssuances");
          const tokenName = key.split(isMint ? "RequestIssuances" : "RequestRedemptions")[0].toUpperCase() as AllowedTickers;

          return logs.map(log => ({
            side: isMint ? "Mint Request" : "Burn Request",
            userAddress: log.user as Address,
            inputAmount: num(log.inputAmount),
            outputAmount: num(log.outputAmount),
            tokenAddress: (isMint ? log.inputToken : log.outputToken) as Address,
            timestamp: Number(log.time),
            txHash: log.transactionHash,
            tokenName,
            messageId: log.messageId,
            nonce: Number(log.nonce),
            sendStatus: "SUCCESS",
            receiveStatus: "SUCCESS",
          }));
        });

      setPositions(positions0.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    } catch (err) {
      console.error(err);
    }
  }, [nexTokens, dataFromGraph]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const handleReload = () => {
    crossChainpositionHistory.reload();
    getHistory();
  };

  return {
    history: crossChainpositionHistory.data,
    requests: positions,
    reload: handleReload,
  };
}
