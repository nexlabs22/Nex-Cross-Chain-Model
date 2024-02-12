"use client";
import useTradePageStore from '@/store/tradeStore';
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react';
import React, { createContext, useEffect, useState } from 'react';



interface User {
  email: string
  inst_name: string
  main_wallet: string
  name: string
  vatin: string
  address: string
  ppLink: string
  p1: boolean
  p2: boolean
  p3: boolean
  p4: boolean
  p5: boolean
  ppType: string
  creationDate: string
}



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

  useEffect(() => {
    // Logic to determine theme based on your variable
    if (tradeNavbarButton && selectedTradingCategory == "cefi") {
      setTheme({
        fontFamily: "Inter, sans-serif",
        colors: {
          modalBg: "#4992E2",
          // accentButtonBg: "#91AC9A",
          //primaryButtonBg: "#5E869B",

          // secondaryButtonBg: "#91AC9A",
          //connectedButtonBg: "#5E869B",
          dropdownBg: "#4992E2",
          //connectedButtonBgHover: "white",
          accentText: "black",
          secondaryText: "#000000",
          secondaryIconColor: "#FFFFFF",

          // ... etc
        },
      });
    } else {
      setTheme({
        fontFamily: "Inter, sans-serif",
        colors: {
          modalBg: "#5E869B",
          //accentButtonBg: "#91AC9A",
          //primaryButtonBg: "#5E869B",

          // secondaryButtonBg: "#91AC9A",
          //connectedButtonBg: "#5E869B",
          dropdownBg: "#5E869B",
          //connectedButtonBgHover: "white",
          accentText: "black",
          secondaryText: "#000000",
          secondaryIconColor: "#FFFFFF",

          // ... etc
        },
      });
    }
  }, [theme]);

  

  return (
    <ConnectWallet
      theme={darkTheme(theme)}
      className={`${tradeNavbarButton && selectedTradingCategory == "cefi" ? "cefiButton" : "defiButton"}`}
    />

  )
}
export default ConnectButton

