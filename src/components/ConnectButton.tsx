"use client";
import { useLandingPageStore } from '@/store/store';
import useTradePageStore from '@/store/tradeStore';
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react';
import React, { createContext, useEffect, useState } from 'react';



interface ConnectWalletButton {
  tradeNavbarButton?: boolean
}


const ConnectButton: React.FC<ConnectWalletButton> = ({ tradeNavbarButton }) => {

  const [theme, setTheme] = useState({
    fontFamily: "Inter, sans-serif",
    colors: {
      modalBg: "#7335CA",
      // accentButtonBg: "#91AC9A",
      //primaryButtonBg: "#5E869B",

      // secondaryButtonBg: "#91AC9A",
      //connectedButtonBg: "#5E869B",
      dropdownBg: "#7335CA",
      //connectedButtonBgHover: "white",
      accentText: "black",
      secondaryText: "#000000",
      secondaryIconColor: "#FFFFFF",

      // ... etc
    },
  });

  const { selectedTradingCategory } = useTradePageStore()
  const {mode} = useLandingPageStore()

  // useEffect(() => {
  //   // Logic to determine theme based on your variable
  //   if (tradeNavbarButton && selectedTradingCategory == "cefi") {
  //     setTheme({
  //       fontFamily: "Inter, sans-serif",
  //       colors: {
  //         modalBg: "#4992E2",
  //         // accentButtonBg: "#91AC9A",
  //         //primaryButtonBg: "#5E869B",

  //         // secondaryButtonBg: "#91AC9A",
  //         //connectedButtonBg: "#5E869B",
  //         dropdownBg: "#4992E2",
  //         //connectedButtonBgHover: "white",
  //         accentText: "black",
  //         secondaryText: "#000000",
  //         secondaryIconColor: "#FFFFFF",

  //         // ... etc
  //       },
  //     });
  //   } else {
  //     setTheme({
  //       fontFamily: "Inter, sans-serif",
  //       colors: {
  //         modalBg: "#5E869B",
  //         //accentButtonBg: "#91AC9A",
  //         //primaryButtonBg: "#5E869B",

  //         // secondaryButtonBg: "#91AC9A",
  //         //connectedButtonBg: "#5E869B",
  //         dropdownBg: "#5E869B",
  //         //connectedButtonBgHover: "white",
  //         accentText: "black",
  //         secondaryText: "#000000",
  //         secondaryIconColor: "#FFFFFF",

  //         // ... etc
  //       },
  //     });
  //   }
  // }, [theme]);

  

  return (
    <ConnectWallet
      theme={darkTheme(theme)}
      className={`${tradeNavbarButton && selectedTradingCategory == "cefi" ?  "cefiButton" : mode == "dark" ? "defiButton" : ""}`}
    />

  )
}
export default ConnectButton

