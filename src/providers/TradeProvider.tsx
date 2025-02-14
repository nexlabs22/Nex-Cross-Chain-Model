"use client"

import { sepoliaTokens } from "@/constants/tokens"
import React, { createContext, useState } from "react"
import { useContext } from "react"
import { useDashboard } from "./DashboardProvider"
import { nexTokensArray } from "@/constants/indices"
import { IndexCryptoAsset } from "@/types/indexTypes"


interface TradeContextProps {
    swapFromToken: IndexCryptoAsset
    swapToToken: IndexCryptoAsset
    setSwapFromToken: (token: IndexCryptoAsset)=>void,
    setSwapToToken: (token: IndexCryptoAsset)=>void,
}

const TradeContext = createContext<TradeContextProps>({
    swapFromToken: sepoliaTokens.find((token) => token.symbol === 'USDC') as IndexCryptoAsset,
    swapToToken: nexTokensArray.find((token) => token.symbol === 'ARBEI') as IndexCryptoAsset,
    setSwapFromToken: ()=>{},
    setSwapToToken: ()=>{},
})

const useTrade = () => {
    return useContext(TradeContext)
}

const TradeProvider = ({ children }: { children: React.ReactNode }) => {

    const { nexTokens} = useDashboard()

        const [swapFromToken, setSwapFrom] = useState<IndexCryptoAsset>(
            [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'USDC') as IndexCryptoAsset
        );
    
        const [swapToToken, setSwapTo] = useState<IndexCryptoAsset>(
            [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'ARBEI') as IndexCryptoAsset
        );

        const setSwapFromToken = (token: IndexCryptoAsset) => {            
            setSwapFrom(token) 
        }
        const setSwapToToken = (token: IndexCryptoAsset) => {
            setSwapTo(token) 
        }

    const contextValue = {
        swapFromToken,
        swapToToken,
        setSwapFromToken,
        setSwapToToken
    }

    return <TradeContext.Provider value={contextValue}>{children}</TradeContext.Provider>
}

export { TradeProvider, TradeContext, useTrade }