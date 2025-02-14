import { tokenAddresses } from '@/constants/contractAddresses';
import { useDashboard } from '@/providers/DashboardProvider';
import { Address, Transaction, RequestType, AllowedTickers } from '@/types/indexTypes';
import { num, weiToNum } from '@/utils/conversionFunctions';
import { getDecimals } from '@/utils/general';
import { useEffect, useState, useCallback } from 'react';

export function GetTradeHistoryStock(dataFromGraph: { [key: string]: RequestType[] }) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Transaction[]>([]);
  const { nexTokens } = useDashboard();

  const getHistory = useCallback(() => {
    setLoading(true);

    const stockTokensSet = new Set(
      nexTokens
        .filter(token => token.smartContractType === 'stocks')
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
      side: 'Minted' | 'Burned' | 'Cancelled Mint' | 'Cancelled Burn',
      status: 'SUCCESS' | 'CANCELLED'
    ): Transaction => {
      const isMint = side.includes('Mint');
      const tokenAddress = isMint ? log.inputToken : log.outputToken;
      const tokenDecimals = tokenDecimalsCache.get(tokenAddress?.toLowerCase() ?? '') || 18;

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

    const positionsData: Transaction[] = Object.entries(dataFromGraph)
      .filter(([key]) => Array.from(stockTokensSet).some(token => key.includes(token)))
      .flatMap(([key, logs]) => {
        if (key.includes('Issuanceds')) return logs.map(log => mapToTransaction(log, key, 'Minted', 'SUCCESS'));
        if (key.includes('IssuanceCancelleds')) return logs.map(log => mapToTransaction(log, key, 'Cancelled Mint', 'CANCELLED'));
        if (key.includes('Redemptions')) return logs.map(log => mapToTransaction(log, key, 'Burned', 'SUCCESS'));
        if (key.includes('RedemptionCancelleds')) return logs.map(log => mapToTransaction(log, key, 'Cancelled Burn', 'CANCELLED'));
        return [];
      });

    setPositions(positionsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    setLoading(false);
  }, [nexTokens, dataFromGraph]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  return {
    data: positions,
    reload: getHistory,
    loading,
  };
}
