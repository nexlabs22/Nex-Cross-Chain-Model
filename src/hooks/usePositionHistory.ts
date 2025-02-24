import { useEffect, useState, useCallback } from 'react';
import { Transaction, RequestType } from '@/types/indexTypes';
import { useGlobal } from '@/providers/GlobalProvider';
import { nexTokensArray } from '@/constants/indices';
import { processDefiPositions } from '@/utils/transactionHistory/processDefiHistory';
import { processCrosschainPositions } from '@/utils/transactionHistory/processCrossChainHistory';
import { processStocksPositions } from '@/utils/transactionHistory/processStocksHistory';

export function UsePositionsHistory(dataFromGraph: { [key: string]: RequestType[] }, indexSymbol: string) {
    const { activeChainSetting: { chainName, network } } = useGlobal();
    const [positions, setPositions] = useState<{
        finalData: Transaction[];
        tradeHistory?: Transaction[];
        activeRequests?: Transaction[];
    }>({finalData:[]});
    const [loading, setLoading] = useState<boolean>(false);

    const getHistory = useCallback(() => {
        setLoading(true);

        // Find the smartContractType for the given index
        const token = nexTokensArray.find(token => token.symbol.toLowerCase() === indexSymbol.toLowerCase());
        if (!token) {
            console.error(`No token found for index symbol: ${indexSymbol}`);
            setPositions({finalData:[]});
            setLoading(false);
            return;
        }

        let processedPositions: {
            finalData: Transaction[];
            tradeHistory?: Transaction[];
            activeRequests?: Transaction[];
        } = {finalData:[]};

        switch (token.smartContractType) {
            case 'defi':
                processedPositions = processDefiPositions(dataFromGraph, chainName, network);
                break;
            case 'crosschain':
                processedPositions = processCrosschainPositions(dataFromGraph, chainName, network);
                break;
            case 'stocks':
                processedPositions = processStocksPositions(dataFromGraph);
                break;
            default:
                console.error(`Unknown smartContractType: ${token.smartContractType}`);
                processedPositions = {finalData:[]};
                break;
        }

        setPositions(processedPositions);
        setLoading(false);
    }, [dataFromGraph, indexSymbol, chainName, network]);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    return {
        data: positions,
        reload: getHistory,
        loading,
    };
}
