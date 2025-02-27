import { useGlobal } from "@/providers/GlobalProvider";
import { client } from "@/utils/thirdWebClient";
import { getContract } from "thirdweb";
import { useCallback } from "react";
import { tokenAddresses } from "@/constants/contractAddresses";
import { Address, AllowedTickers, Chains, ContractTypes, Networks } from "@/types/indexTypes";
import { allowedChainNetworks } from "@/utils/mappings";

export function GetContract(symbol: AllowedTickers, contractType: ContractTypes) {
  const { activeThirdWebChain, activeChainSetting:{chainName, network} } = useGlobal();
  
  const contract = useCallback(() => {
  const address = tokenAddresses?.[symbol]?.[chainName]?.[network]?.[contractType]?.address as Address

  if(address == undefined) console.log({symbol, chainName, network, contractType, address})

    return getContract({ address, chain: activeThirdWebChain, client });
  }, [symbol,chainName,network,contractType, activeThirdWebChain]);

  return contract();
}

export function getContractByNetwork(symbol: AllowedTickers, contractType: ContractTypes, chainName: Chains, network: Networks) {
  const thirdWebChain = allowedChainNetworks.find((settings)=> settings.chainName === chainName && settings.network === network)?.chain

  // const contract = useCallback(() => {
  if( !thirdWebChain) return (null)
  const address = tokenAddresses?.[symbol]?.[chainName]?.[network]?.[contractType]?.address as Address

  if(address == undefined) console.log({symbol, chainName, network, contractType, address})

    return getContract({ address, chain: thirdWebChain, client });
  // }, [symbol,chainName,network,contractType, thirdWebChain]);

  // return contract();
}
