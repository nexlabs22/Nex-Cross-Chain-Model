"use client";
import { useLandingPageStore } from '@/store/store';
import useTradePageStore from '@/store/tradeStore';
import { ConnectWallet, darkTheme, useConnectionStatus   } from '@thirdweb-dev/react';
import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';


interface ConnectWalletButton {
  tradeNavbarButton?: boolean
}
 

const PWAConnectButton: React.FC<ConnectWalletButton> = ({ tradeNavbarButton }) => {

  const router = useRouter()
  const connectionStatus = useConnectionStatus();

  const [theme, setTheme] = useState({
    fontFamily: "Inter, sans-serif",
    colors: {
      modalBg: "#5E869B",
      // accentButtonBg: "#91AC9A",
      //primaryButtonBg: "#5E869B",

      // secondaryButtonBg: "#91AC9A",
      //connectedButtonBg: "#5E869B",
      dropdownBg: "#5E869B",
      //connectedButtonBgHover: "white",
      accentText: "black",
      secondaryText: "#000000",
      secondaryIconColor: "#000000",

      // ... etc
    },
  });

  const { selectedTradingCategory } = useTradePageStore()
  const {mode} = useLandingPageStore()

  

  return (
    <ConnectWallet
      theme={darkTheme(theme)}
      className={"rounded-3xl text-black pwaConnectWallet"}
      style={{
        color: "#000000",
        scale: "0.9",
        borderRadius: "1.2rem"
      }}
    />

  )
}
export default PWAConnectButton

