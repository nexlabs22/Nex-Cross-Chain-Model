import React, { useEffect } from 'react'
import { useContractEvents, useContract, useAddress } from "@thirdweb-dev/react";
import { goerliAnfiFactory } from '@/constants/contractAddresses';
import { indexFactoryAbi } from '@/constants/abi';

export default function OrderBook() {
 const address = useAddress()
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

//   useEffect(() => {
//     console.log("OrderBook mint event data: ", mintEventData.data);
//     console.log("OrderBook burn event data: ", burnEventData.data);
//   },[mintEventData.data, burnEventData.data])

  useEffect(() => {
    if(address){
    mintEventData.refetch()
    burnEventData.refetch()
    }else{
    mintEventData.remove()
    burnEventData.remove()
    }
  },[address])

  return (
    <div className="h-1/5 w-full border border-colorTwo-500/40 shadow shadow-colorTwo-500 flex flex-row items-start justify-start p-2 rounded-xl">
					<div className='flex gap-3'>
					<h5 className='montrealBold text-lg text-blackText-500'>
						Order Book
					</h5>
					<div className="w-auto h-auto flex justify-center">
					{/* {nftImage &&
					<Image 
					alt="image" 
					src={nftImage}
					width={100}
					height={100}
					// fill={true}
					/>
					} */}
					</div>
					</div>
				</div>
  )
}
