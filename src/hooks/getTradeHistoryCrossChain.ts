import { useDashboard } from '@/providers/DashboardProvider';
import { Transaction, RequestType, AllowedTickers, Address } from '@/types/indexTypes';
import { num } from '@/utils/conversionFunctions';
import { useEffect, useState, useCallback } from 'react';

export function GetTradeHistoryCrossChain(dataFromGraph: { [key: string]: RequestType[] }) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Transaction[]>([]);
  const { nexTokens } = useDashboard();

  const getHistory = useCallback(() => {
    setLoading(true);

    const crosschainTokensSet = new Set(
      nexTokens
        .filter(token => token.smartContractType === 'crosschain')
        .map(token => token.symbol.toLowerCase())
    );

    const mapToTransaction = (log: RequestType, key: string, isMint: boolean): Transaction => ({
      side: isMint ? 'Minted' : 'Burned',
      userAddress: log.user as Address,
      inputAmount: num(log.inputAmount),
      outputAmount: num(log.outputAmount),
      tokenAddress: (isMint ? log.inputToken : log.outputToken) as Address,
      timestamp: Number(log.time),
      txHash: log.transactionHash,
      tokenName: key.split(isMint ? 'Issuanceds' : 'Redemptions')[0].toUpperCase() as AllowedTickers,
      messageId: log.messageId,
      nonce: Number(log.nonce),
      sendStatus: 'SUCCESS',
      receiveStatus: 'SUCCESS',
    });

    const positionsData: Transaction[] = Object.entries(dataFromGraph)
      .filter(([key]) => Array.from(crosschainTokensSet).some(token => key.includes(token)))
      .flatMap(([key, logs]) =>
        logs.map(log => mapToTransaction(log, key, key.includes('Issuanceds')))
      );

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
