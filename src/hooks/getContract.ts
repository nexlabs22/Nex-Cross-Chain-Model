import { useGlobal } from "@/providers/GlobalProvider";
import { client } from "@/utils/thirdWebClient";
import { Address, getContract } from "thirdweb";
import { useCallback } from "react";

export default function GetContract(address: Address) {
  const { activeThirdWebChain } = useGlobal();

  // Memoized callback for getting the contract
  const contract = useCallback(() => {
    return getContract({ address, chain: activeThirdWebChain, client });
  }, [address, activeThirdWebChain]);

  return contract();
}
