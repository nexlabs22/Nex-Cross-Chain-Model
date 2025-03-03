// utils/positionHandlers.ts
import { Transaction, RequestType, AllowedTickers, Address, Chains, Networks } from '@/types/indexTypes';
import { getDecimals, getTokenInfoByAddress } from '@/utils/general';
import { tokenAddresses } from '@/constants/contractAddresses';
import { weiToNum } from '@/utils/conversionFunctions';
import { nexTokensArray } from '@/constants/indices';

export function processDefiPositions(
    dataFromGraph: { [key: string]: RequestType[] },
    chainName: Chains,
    network: Networks
) {

    const defiTokensSet = new Set(
        nexTokensArray
            .filter(token => token.smartContractType === 'defi')
            .map(token => token.symbol.toLowerCase())
    );

    const positions: Transaction[] = Object.entries(dataFromGraph)
        .filter(([key]) => Array.from(defiTokensSet).some(token => key.includes(token)))
        .flatMap(([key, logs]) =>
            logs.map(log => {
                const isMint = key.includes('issuanceds');
                const tokenName = key.split(isMint ? 'issuanceds' : 'redemptions')[0].toUpperCase() as AllowedTickers;
                const tokenAddress = isMint ? log.inputToken : log.outputToken;
                const decimalsForInput = isMint
                    ? Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal'))
                    : Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token));
                const decimalsForOutput = isMint
                    ? Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token))
                    : Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal'));

                return {
                    side: isMint ? 'Mint Request' : 'Burn Request',
                    userAddress: log.user as Address,
                    inputAmount: weiToNum(log.inputAmount, decimalsForInput),
                    outputAmount: weiToNum(log.outputAmount, decimalsForOutput),
                    tokenAddress: tokenAddress as Address,
                    timestamp: Number(log.time),
                    txHash: log.transactionHash,
                    tokenName,
                };
            })
        );

    const finalData = positions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return {
        finalData
    }
}
