import { nexTokensArray } from "@/constants/indices";
import { Transaction, RequestType, AllowedTickers, Address, Chains, Networks } from "@/types/indexTypes";
import { weiToNum } from "@/utils/conversionFunctions";
import { getDecimals, getTokenInfoByAddress } from "../general";
import { tokenAddresses } from "@/constants/contractAddresses";

export function processCrosschainPositions(
    dataFromGraph: { [key: string]: RequestType[] },
    chainName: Chains,
    network: Networks
) {
    const crosschainTokensSet = new Set(
        nexTokensArray
            .filter(token => token.smartContractType === "crosschain")
            .map(token => token.symbol.toLowerCase())
    );

    const mapToTransaction = (log: RequestType, key: string, isMint: boolean, type: "trade" | "position"): Transaction => {
        const side = isMint ? (type === "trade" ? "Minted" : "Mint Request") : (type === "trade" ? "Burned" : "Burn Request")        
        const tokenName = key.split(isMint ? (type === "trade" ? "Issuanceds" : "RequestIssuances") : (type === "trade" ? "Redemptions" : "RequestRedemptions"))[0].toUpperCase() as AllowedTickers
        const tokenAddress = isMint ? log.inputToken : log.outputToken;
        const decimalsForInput = isMint
            ? Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal'))
            : Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token));
        const decimalsForOutput = isMint
            ? Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token))
            : Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal'));

        return {
            side,
            userAddress: log.user as Address,
            inputAmount: weiToNum(log.inputAmount, decimalsForInput),
            outputAmount: weiToNum(log.outputAmount, decimalsForOutput),
            tokenAddress: (isMint ? log.inputToken : log.outputToken) as Address,
            timestamp: Number(log.time),
            txHash: log.transactionHash,
            tokenName,
            messageId: log.messageId,
            nonce: Number(log.nonce),
            sendStatus: "SUCCESS",
            receiveStatus: "SUCCESS",
        }
    };

    const tradeHistory: Transaction[] = [];
    const positionRequests: Transaction[] = [];

    Object.entries(dataFromGraph)
        .filter(([key]) => Array.from(crosschainTokensSet).some(token => key.includes(token)))
        .forEach(([key, logs]) => {
            const isMint = key.includes("Issuanceds") || key.includes("RequestIssuances");

            logs.forEach(log => {
                if (key.includes("RequestIssuances") || key.includes("RequestRedemptions")) {
                    positionRequests.push(mapToTransaction(log, key, isMint, "position"));
                } else {
                    tradeHistory.push(mapToTransaction(log, key, isMint, "trade"));
                }
            });
        });
    
    const activeRequests = positionRequests.filter(request => {
        return !tradeHistory.some(history => history.nonce === request.nonce && history.side === request.side);
    });

    const finalData = [...tradeHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp);

    return {
        tradeHistory,
        activeRequests,
        finalData,
    };
}
