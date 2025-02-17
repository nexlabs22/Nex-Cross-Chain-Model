import { useGlobal } from "@/providers/GlobalProvider";
import { client } from "@/utils/thirdWebClient";
import { getContract } from "thirdweb";
import { useCallback } from "react";
import { tokenAddresses } from "@/constants/contractAddresses";
import { Address, AllowedTickers, ContractTypes } from "@/types/indexTypes";

export default function GetContract(symbol: AllowedTickers, contractType: ContractTypes) {
  const { activeThirdWebChain, activeChainSetting:{chainName, network} } = useGlobal();
  
  const contract = useCallback(() => {
  const address = tokenAddresses?.[symbol]?.[chainName]?.[network]?.[contractType]?.address as Address

  if(address == undefined) console.log({symbol, chainName, network, contractType, address})

    return getContract({ address, chain: activeThirdWebChain, client });
  }, [symbol,chainName,network,contractType, activeThirdWebChain]);

  return contract();
}
