import { Transaction, RequestType, Address, AllowedTickers } from "@/types/indexTypes";
import { num, weiToNum } from "@/utils/conversionFunctions";
import { getDecimals } from "@/utils/general";
import { tokenAddresses } from "@/constants/contractAddresses";
import { nexTokensArray } from "@/constants/indices";

export function processStocksPositions(
  dataFromGraph: { [key: string]: RequestType[] },
) {
  const stockTokensSet = new Set(
    nexTokensArray
      .filter(token => token.smartContractType === "stocks")
      .map(token => token.symbol.toLowerCase())
  );

  // Cache decimals to avoid redundant calls
  const tokenDecimalsCache = new Map<string, number>();
  Object.values(tokenAddresses)
    .flatMap(chains => Object.values(chains))
    .flatMap(networks => Object.values(networks))
    .flatMap(contractTypes => Object.values(contractTypes))
    .forEach(obj => {
      tokenDecimalsCache.set(obj.address.toLowerCase(), getDecimals(obj));
    });

  const mapToTransaction = (
    log: RequestType,
    key: string,
    side: "Minted" | "Burned" | "Mint Request" | "Burn Request" | "Cancelled Mint" | "Cancelled Burn",
    status: "SUCCESS" | "CANCELLED" | "MINT PENDING" | "BURN PENDING" | "CANCEL PENDING"
  ): Transaction => {
    const isMint = side.includes("Mint");
    const tokenAddress = isMint ? log.inputToken : log.outputToken;
    const tokenDecimals = tokenDecimalsCache.get(tokenAddress?.toLowerCase() ?? "") || 18;

    return {
      side,
      userAddress: log.user as Address,
      inputAmount: isMint ? weiToNum(log.inputAmount, tokenDecimals) : num(log.inputAmount),
      outputAmount: isMint ? num(log.outputAmount) : weiToNum(log.outputAmount, tokenDecimals),
      tokenAddress: tokenAddress as Address,
      timestamp: Number(log.time),
      txHash: log.transactionHash,
      tokenName: key.split(/Issuanceds|IssuanceCancelleds|Redemptions|RedemptionCancelleds/)[0].toUpperCase() as AllowedTickers,
      nonce: Number(log.nonce),
      sendStatus: status,
      receiveStatus: status,
    };
  };

  const tradeHistory: Transaction[] = [];
  const positionRequests: Transaction[] = [];

  Object.entries(dataFromGraph)
    .filter(([key]) => Array.from(stockTokensSet).some(token => key.includes(token)))
    .forEach(([key, logs]) => {
      logs.forEach(log => {
        if (key.includes("Issuanceds")) {
          tradeHistory.push(mapToTransaction(log, key, "Minted", "SUCCESS"));
        } else if (key.includes("IssuanceCancelleds")) {
          tradeHistory.push(mapToTransaction(log, key, "Cancelled Mint", "CANCELLED"));
        } else if (key.includes("Redemptions")) {
          tradeHistory.push(mapToTransaction(log, key, "Burned", "SUCCESS"));
        } else if (key.includes("RedemptionCancelleds")) {
          tradeHistory.push(mapToTransaction(log, key, "Cancelled Burn", "CANCELLED"));
        } else if (key.includes("RequestIssuances")) {
          positionRequests.push(mapToTransaction(log, key, "Mint Request", "MINT PENDING"));
        } else if (key.includes("RequestRedemptions")) {
          positionRequests.push(mapToTransaction(log, key, "Burn Request", "BURN PENDING"));
        } else if (key.includes("RequestCancelIssuances")) {
          positionRequests.push(mapToTransaction(log, key, "Cancelled Mint", "CANCEL PENDING"));
        } else if (key.includes("RequestCancelRedemptions")) {
          positionRequests.push(mapToTransaction(log, key, "Cancelled Burn", "CANCEL PENDING"));
        }
      });
    });

  // Filter out completed requests
  const tradeHistorySet = new Set(tradeHistory.map(data => `${data.nonce}-${data.side}`));
  const activeRequests = positionRequests.filter(request => !tradeHistorySet.has(`${request.nonce}-${request.side}`));

  // Prioritize transactions where `sendStatus` includes "CANCEL"
  const nonceMap = new Map<number, Transaction>();
  [...tradeHistory, ...activeRequests].forEach(obj => {
    if (!nonceMap.has(obj.nonce!) || obj.sendStatus?.includes("CANCEL")) {
      nonceMap.set(obj.nonce!, obj);
    }
  });

  // Final sorted combined dataset
  const finalData = [...nonceMap.values()].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return {
    tradeHistory,
    activeRequests, // Only pending requests
    finalData, // Trade history + active requests sorted
  };
}
