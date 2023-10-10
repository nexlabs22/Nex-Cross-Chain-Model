"use client";
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react';
import React from 'react'

const customDarkTheme = darkTheme({
    fontFamily: "Inter, sans-serif",
    colors: {
      modalBg: "#000000",
      accentText: "black",
      // ... etc
    },
  });

export default function ConnectButton() {
  return (
    <ConnectWallet theme={customDarkTheme}/>
  )
}
