import { indexFactoryAbi, nftAbi } from "@/constants/abi";
import { goerliAnfiFactory, goerliAnfiNFT } from "@/constants/contractAddresses";
import useTradePageStore from "@/store/tradeStore";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import Image from "next/image";
import { useState } from "react";

const RecieptsBox = () => {

	const {nftImage, setNftImage } = useTradePageStore()

    const testURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJsaWdodGdyYXkiIC8+PHRleHQgeD0iNTAlIiB5PSIzMCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiPk1pbnQgVG9rZW4gUmVxdWVzdDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+QW1vdW50OiAxMDAwMDAwMDAwMDAwMDAwMDAwPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij5UaW1lOiAxNjk3MjMwNTk2PC90ZXh0Pjwvc3ZnPg=="

    const [imageURI, setImageURI] = useState<string>('')

	const address = useAddress();


    const factoryContract = useContract(
		goerliAnfiFactory,
		indexFactoryAbi,
	  );
    
    const nftContract = useContract(
    goerliAnfiNFT,
    nftAbi,
    );
    
    // var listener = factoryContract?.contract.events.ListenToAll((ContractEvent<object> anyEvent) => Debug.Log("Event occurred: " + anyEvent.data));
    var listener = factoryContract.contract?.events.listenToAllEvents(async (event) => {
        if(event.data?.requester == address){
            const ownIds: BigNumber[] | undefined = await nftContract.contract?.erc721.getOwnedTokenIds(address)
            const lastIndex = ownIds && ownIds?.length - 1 as number
            const lastId = ownIds?[lastIndex]:0
            // console.log("ownIds: ", lastId)
            const metadata = await nftContract.contract?.erc721.getTokenMetadata(lastId as number)
            // console.log("metadata: ", metadata)
            setImageURI(metadata?.image as string)
        }
    })

    return(
        <section className="w-full h-full rounded-xl border border-colorTwo-500/40 shadow shadow-colorTwo-500 p-2">
            <h5 className="montrealBold text-blackText-500 text-base">
                Reciepts
            </h5>
            {/* {true && */}
            (
            <div className="w-auto h-auto flex justify-center">
            <Image 
            alt="image" 
            src={testURI}
            width={100}
            height={100}
            // fill={true}
            />
            <p className="montrealBold text-blackText-500 text-base">HHH</p>
            </div>
            {/* )} */}
        </section>
    )
}

export default RecieptsBox;