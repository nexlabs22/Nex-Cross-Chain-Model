import React, { useEffect, useState } from 'react'
import { useContractEvents, useContract, useAddress } from "@thirdweb-dev/react";
import { goerliAnfiFactory } from '@/constants/contractAddresses';
import { indexFactoryAbi } from '@/constants/abi';
import { GetPositionsHistory } from '@/hooks/getTradeHistory';
import HistoryTable from './TradeTable';

export default function OrderBook() {

 const [finalOrders, setFinalOrders] = useState<any>()

 const address = useAddress()

 const trades = GetPositionsHistory(goerliAnfiFactory, "ANFI");

 useEffect(() => {
  console.log("trades:", trades.data)
 },[trades.data])

  // Your smart contract address
 const factoryContract = useContract(goerliAnfiFactory, indexFactoryAbi)
 const mintEventData = useContractEvents(
    factoryContract.contract,
    "MintRequestAdd", // Event name being emitted by your smart contract
    {
        queryFilter: {
          filters: {
            requester: address, // e.g. Only events where tokenId = 123
          },
       
        },
      },
  );


  const burnEventData = useContractEvents(
    factoryContract.contract,
    "Burned", // Event name being emitted by your smart contract
    {
        queryFilter: {
          filters: {
            requester: address, // e.g. Only events where tokenId = 123
          },
       
        },
      },
  );

  const mergedArray =(mintEventData.data && burnEventData.data) && mintEventData.data.concat(burnEventData.data);

    // useEffect(() => {
      // console.log("mintEventData", mintEventData.data)
      // console.log("burnEventData", burnEventData.data)
      // if(mintEventData.data && burnEventData.data){
        // const mergedArray = mintEventData.data.concat(burnEventData.data);
        // const filteredMergedArray = mergedArray.filter()
        // setFinalOrders(mergedArray)
        // console.log("mergedArray", mergedArray)
      // }
    // }, [mintEventData, burnEventData])

  // useEffect(() => {
  //   if(address){
  //   mintEventData.refetch()
  //   burnEventData.refetch()
  //   }else{
  //   mintEventData.remove()
  //   burnEventData.remove()
  //   }
  // },[address])

  return (
    <div className="h-1/5 w-full shadow shadow-blackText-500 flex flex-row items-start justify-start p-2 rounded-xl">
		<div className='grid gap-3'>
		  <h5 className='montrealBold text-lg text-blackText-500'>
		  	Order Book
			</h5>
    <div className="overflow-auto py-2">
    <HistoryTable/>
    </div>
    </div>
    </div>
  )
}
