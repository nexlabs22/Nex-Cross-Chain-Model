import { useGlobal } from "@/providers/GlobalProvider";
import { client } from "@/utils/thirdWebClient";
import { getContract } from "thirdweb";
import { useCallback } from "react";
import { tokenAddresses } from "@/constants/contractAddresses";
import { Address, AllowedTickers, ContractTypes } from "@/types/indexTypes";

export default function GetContract(symbol: AllowedTickers, contractType: ContractTypes) {
  const { activeThirdWebChain, activeChainSetting:{chain, network} } = useGlobal();

  const address = tokenAddresses?.[symbol]?.[chain]?.[network]?.[contractType]?.address as Address

  const contract = useCallback(() => {
    return getContract({ address, chain: activeThirdWebChain, client });
  }, [address, activeThirdWebChain]);

  return contract();
}
