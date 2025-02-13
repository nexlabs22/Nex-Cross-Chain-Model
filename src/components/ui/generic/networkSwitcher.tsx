import { client } from "@/utils/thirdWebClient";
import { useActiveWallet, useActiveWalletChain, useNetworkSwitcherModal, useSwitchActiveWalletChain } from "thirdweb/react";
import { Button } from "@mui/material";
import { allowedChainNetworks } from "@/utils/mappings";
import { Chain } from "thirdweb";

const NetworkSwitcher = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const wallet = useActiveWallet();

  // Function to enforce allowed chains
  const enforceAllowedChain = (chain: Chain) => {
    const allowed = allowedChainNetworks.find((option) => option.chain === chain);
    if (!allowed) {
      console.warn("Unsupported chain detected. Reverting to default.");
      switchChain(allowedChainNetworks[0].chain); 
    }
  };

  wallet?.subscribe("chainChanged", (chain) => {
    enforceAllowedChain(chain);
  });

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
