import { useEffect, useState, useCallback } from "react";
import { GetTradeHistoryStock } from "./getTradeHistoryStock";
import { Transaction, RequestType, Address } from "@/types/indexTypes";
import { getDecimals } from "@/utils/general";
import { tokenAddresses } from "@/constants/contractAddresses";
import { num, weiToNum } from "@/utils/conversionFunctions";

export function GetPositionsHistoryStock(dataFromGraph: { [key: string]: RequestType[] }) {
  const stockTradeHistory = GetTradeHistoryStock(dataFromGraph);
  const [positions, setPositions] = useState<Transaction[]>([]);

  const getHistory = useCallback(() => {
    try {
      const allMintLogs = [...(dataFromGraph["mag7RequestIssuances"] ?? []), ...(dataFromGraph["mag7RequestCancelIssuances"] ?? [])];
      const allBurnLogs = [...(dataFromGraph["mag7RequestRedemptions"] ?? []), ...(dataFromGraph["mag7RequestCancelRedemptions"] ?? [])];

      const tradeHistoryData = new Set(stockTradeHistory.data.map(data => `${data.nonce}-${data.side}`));

      const mapToTransaction = (log: RequestType, side: "Mint Request" | "Burn Request", cancelSide: "Cancelled Mint" | "Cancelled Burn") => {
        const isCancelled = tradeHistoryData.has(`${log.nonce}-${cancelSide}`);
        const isExecuted = tradeHistoryData.has(`${log.nonce}-${side}`);

        const status = log.__typename.includes("Cancel")
          ? isCancelled ? "CANCELLED" : "CANCEL PENDING"
          : isExecuted ? "SUCCESS" : side === "Mint Request" ? "MINT PENDING" : "BURN PENDING";

        const tokenDecimals = getDecimals(
          Object.values(tokenAddresses)
            .flatMap(chains => Object.values(chains))
            .flatMap(networks => Object.values(networks))
            .flatMap(contractTypes => Object.values(contractTypes))
            .find(obj => obj.address.toLowerCase() === (side === "Mint Request" ? log.inputToken : log.outputToken)?.toLowerCase())
        );

        return {
          side,
          userAddress: log.user as Address,
          inputAmount: side === "Mint Request" ? weiToNum(log.inputAmount, tokenDecimals) : num(log.inputAmount),
          outputAmount: side === "Mint Request" ? num(log.outputAmount) : weiToNum(log.outputAmount, tokenDecimals),
          tokenAddress: (side === "Mint Request" ? log.inputToken : log.outputToken) as Address,
          timestamp: Number(log.time),
          txHash: log.transactionHash,
          tokenName: "MAG7",
          nonce: Number(log.nonce),
          sendStatus: status,
          receiveStatus: status,
        } as Transaction;
      };

      const mintData = allMintLogs.map(log => mapToTransaction(log, "Mint Request", "Cancelled Mint"));
      const burnData = allBurnLogs.map(log => mapToTransaction(log, "Burn Request", "Cancelled Burn"));

      // Prioritize transactions where `sendStatus` includes "CANCEL"
      const nonceMap = new Map<number, Transaction>();
      [...mintData, ...burnData].forEach(obj => {
        if (!nonceMap.has(obj.nonce!) || obj.sendStatus?.includes("CANCEL")) {
          nonceMap.set(obj.nonce!, obj);
        }
      });

      setPositions([...nonceMap.values()].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    } catch (err) {
      console.error(err);
    }
  }, [stockTradeHistory.data, dataFromGraph]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const handleReload = () => {
    stockTradeHistory.reload();
    getHistory();
  };

  return {
    history: stockTradeHistory.data,
    requests: positions,
    reload: handleReload,
  };
}
