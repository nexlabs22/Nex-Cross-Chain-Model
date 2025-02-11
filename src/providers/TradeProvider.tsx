"use client"

import { sepoliaTokens } from "@/constants/tokens"
import { TokenObject } from "@/types/indexTypes"
import React, { createContext, useState } from "react"
import { useContext } from "react"
import { useDashboard } from "./DashboardProvider"
import { nexTokensArray } from "@/constants/indices"


interface TradeContextProps {
    swapFromToken: TokenObject
    swapToToken: TokenObject
    setSwapFromToken: (token: TokenObject)=>void,
    setSwapToToken: (token: TokenObject)=>void,
}

const TradeContext = createContext<TradeContextProps>({
    swapFromToken: sepoliaTokens.find((token) => token.symbol === 'USDT') as TokenObject,
    swapToToken: nexTokensArray.find((token) => token.symbol === 'ARBEI') as TokenObject,
    setSwapFromToken: ()=>{},
    setSwapToToken: ()=>{},
})

const useTrade = () => {
    return useContext(TradeContext)
}

const TradeProvider = ({ children }: { children: React.ReactNode }) => {

    const { nexTokens} = useDashboard()

        const [swapFromToken, setSwapFrom] = useState<TokenObject>(
            [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'USDT') as TokenObject
        );
    
        const [swapToToken, setSwapTo] = useState<TokenObject>(
            [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'ARBEI') as TokenObject
        );

        const setSwapFromToken = (token: TokenObject) => {            
            setSwapFrom(token) 
        }
        const setSwapToToken = (token: TokenObject) => {
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