"use client";
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react';
import React from 'react'

const customDarkTheme = darkTheme({
    fontFamily: "Inter, sans-serif",
    colors: {
      modalBg: "#5E869B",
      // accentButtonBg: "#91AC9A",
      primaryButtonBg: "#5E869B",
      // secondaryButtonBg: "#91AC9A",
      connectedButtonBg: "#5E869B",
      dropdownBg: "#5E869B",
      connectedButtonBgHover: "white",
      accentText: "black",
      secondaryText: "#000000",
      secondaryIconColor: "#FFFFFF",
      
      // ... etc
    },
  });

export default function ConnectButton() {
  return (
    <ConnectWallet
      theme={customDarkTheme}
      />
  )
}
