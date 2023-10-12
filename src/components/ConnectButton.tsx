"use client";
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react';
import React from 'react'

const customDarkTheme = darkTheme({
    fontFamily: "Inter, sans-serif",
    colors: {
      modalBg: "#91AC9A",
      // accentButtonBg: "#91AC9A",
      primaryButtonBg: "#91AC9A",
      // secondaryButtonBg: "#91AC9A",
      connectedButtonBg: "#91AC9A",
      dropdownBg: "#91AC9A",
      connectedButtonBgHover: "white",
      accentText: "black",
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
