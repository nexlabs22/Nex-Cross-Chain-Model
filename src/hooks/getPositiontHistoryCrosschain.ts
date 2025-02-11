import { useEffect, useState, useCallback } from "react";
import { GetTradeHistoryCrossChain } from "./getTradeHistoryCrossChain";
import { PositionType, RequestType } from "@/types/indexTypes";
import { useDashboard } from "@/providers/DashboardProvider";
import { num } from "@/utils/conversionFunctions";

export function GetPositionsHistoryCrossChain(dataFromGraph: { [key: string]: RequestType[] }) {
  const { nexTokens } = useDashboard();
  const crossChainpositionHistory = GetTradeHistoryCrossChain(dataFromGraph);

  const [positions, setPositions] = useState<PositionType[]>([]);

  const getHistory = useCallback(async () => {
    try {
      const positions0: PositionType[] = []      

      const crosschainTokens = nexTokens.filter((token) => {
        return token.smartContractType === 'crosschain'
      }).map((token) => {
        return token.symbol.toLowerCase()
      })

      Object.entries(dataFromGraph).forEach(([key, logs]) => {
        if (crosschainTokens.some(token => key.includes(token))) {          
          if (key.includes('RequestIssuances')) {
            
            // const isExist = crossChainpositionHistory.data.find((data) => {
            // 	return data.nonce === Number(log.nonce) && data.side === 'Mint Request'
            // })

            let sendStatus = "";
            let receiveStatus = "";
            // let recieveSideMessageId = ''

            // if (!isExist) {
            // 	sendStatus = await getCCIPStatusById(log.messageId as string, 'ethereumSepolia', 'arbitrumSepolia')
            // 	if (sendStatus == 'SUCCESS') {
            // 		const messageId = await client2.readContract({
            // 			address: arbtirumSepoliaCR5CrossChainFactory,
            // 			abi: crossChainIndexFactoryV2Abi,
            // 			functionName: 'issuanceMessageIdByNonce',
            // 			args: [log.nonce],
            // 		})
            // 		receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
            // 		recieveSideMessageId = messageId as string
            // 	}
            // } else {
            sendStatus = "SUCCESS";
            receiveStatus = "SUCCESS";
            // }

            logs.forEach((log: RequestType) => {
              const obj: PositionType = {
                side: 'Mint Request',
                user: log.user as `0x${string}`,
                inputAmount: num(log.inputAmount),
                outputAmount: num(log.outputAmount),
                tokenAddress: log.inputToken as `0x${string}`,
                timestamp: Number(log.time),
                txHash: log.transactionHash,
                indexName: key.split('RequestIssuances')[0].toUpperCase(),
                messageId: log.messageId,
                nonce: Number(log.nonce),
                sendStatus,
                receiveStatus,
                // recieveSideMessageId,
              }


              positions0.push(obj)
            })
          }if (key.includes('RequestRedemptions')) {            

            // const isExist = crossChainpositionHistory.data.find((data) => {
            // 	return data.nonce === Number(log.nonce) && data.side === 'Burn Request'
            // })

            let sendStatus = "";
            let receiveStatus = "";
            // let recieveSideMessageId = ''

            // if (!isExist) {
            // 	sendStatus = await getCCIPStatusById(log.messageId as `0x${string}`, 'ethereumSepolia', 'arbitrumSepolia')
            // 	if (sendStatus == 'SUCCESS') {
            // 		const messageId = await client2.readContract({
            // 			address: arbtirumSepoliaCR5CrossChainFactory,
            // 			abi: crossChainIndexFactoryV2Abi,
            // 			functionName: 'redemptionMessageIdByNonce',
            // 			args: [log.nonce],
            // 		})
            // 		receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
            // 		recieveSideMessageId = messageId as string
            // 	}
            // } else {
            sendStatus = "SUCCESS";
            receiveStatus = "SUCCESS";
            // }


            logs.forEach(async (log: RequestType) => {
              const obj: PositionType = {
                side: 'Burn Request',
                user: log.user as `0x${string}`,
                inputAmount: num(log.inputAmount),
                outputAmount: num(log.outputAmount),
                tokenAddress: log.outputToken as `0x${string}`,
                timestamp: Number(log.time),
                txHash: log.transactionHash,
                indexName: key.split('RequestRedemptions')[0].toUpperCase(),
                messageId: log.messageId,
                // recieveSideMessageId,
                nonce: Number(log.nonce),
                sendStatus,
                receiveStatus,
              }

              positions0.push(obj)
            })
          }
        }
      })


      const sortedPositionsData = positions0.sort(function (a, b) {
        if (!a.timestamp || !b.timestamp) return 0;
        return Number(b.timestamp) - Number(a.timestamp);
      });

      setPositions(sortedPositionsData);

    } catch (err) {
      console.log(err);
    }
  }, [nexTokens, dataFromGraph]);

  useEffect(() => {
    getHistory()
  }, [getHistory]);

  function handleReload() {
    crossChainpositionHistory.reload();
    getHistory();
  }

  return {
    history: crossChainpositionHistory.data,
    requests: positions,
    reload: handleReload,
  };
}
