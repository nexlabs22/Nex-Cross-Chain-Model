import { client } from "@/utils/thirdWebClient";
import { useActiveWallet, useActiveWalletChain, useNetworkSwitcherModal, useSwitchActiveWalletChain } from "thirdweb/react";
import { Button } from "@mui/material";
import { allowedChainNetworks } from "@/utils/mappings";
import { Chain } from "thirdweb";
import { useGlobal } from "@/providers/GlobalProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const NetworkSwitcher = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const wallet = useActiveWallet();
  const searchParams = useSearchParams();
  const queryIndexSymbol = searchParams.get("index");
  const { setActiveChainSetting } = useGlobal();

  const defaultChain = allowedChainNetworks[0].chain;

  const enforceAllowedChain = (chain: Chain) => {
    const allowed = allowedChainNetworks.find((option) => option.chain === chain);

    if (!allowed) {
      console.warn("Unsupported chain detected. Reverting to default.");
      switchChain(defaultChain);
      return;
      
      //below condition is temporary condition, as all indexes are not on mainnet
    }else if (chain.name === "Arbitrum One" && queryIndexSymbol?.toLowerCase() !== "arbei") {
      console.warn("Arbitrum is only allowed when index=arbei. Reverting to default.");
      switchChain(defaultChain);
      return;
    }else{
      setActiveChainSetting(allowed);
    }
  };

  useEffect(() => {
    if (wallet) {
      const unsubscribe = wallet.subscribe("chainChanged", (chain) => {
        enforceAllowedChain(chain);
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [wallet, queryIndexSymbol]); // Re-run if wallet or query param changes

  const networkSwitcher = useNetworkSwitcherModal();

  function handleClick() {
    try {
      networkSwitcher.open({
        client,
        theme: "dark",
        sections: [{ label: "Popular", chains: allowedChainNetworks.map(({ chain }) => chain) }],
      });
    } catch (err) {
      console.error("Error opening network switcher", err);
    }
  }

  return <Button onClick={handleClick}>{activeChain?.name}</Button>;
};

export default NetworkSwitcher;
