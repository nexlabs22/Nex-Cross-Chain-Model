"use client"

import { sepoliaTokens } from "@/constants/tokens"
import React, { createContext, useState, useEffect, useMemo, useCallback } from "react"
import { useContext } from "react"
import { useDashboard } from "./DashboardProvider"
import { nexTokensArray } from "@/constants/indices"
import { IndexCryptoAsset } from "@/types/indexTypes"
import { useSearchParams } from "next/navigation"

interface TradeContextProps {
    swapFromToken: IndexCryptoAsset
    swapToToken: IndexCryptoAsset
    setSwapFromToken: (token: IndexCryptoAsset) => void
    setSwapToToken: (token: IndexCryptoAsset) => void
}

const defaultFromToken = sepoliaTokens.find((token) => token.symbol === "USDC") as IndexCryptoAsset
const defaultToToken = nexTokensArray.find((token) => token.symbol === "ARBEI") as IndexCryptoAsset

const TradeContext = createContext<TradeContextProps>({
    swapFromToken: defaultFromToken,
    swapToToken: defaultToToken,
    setSwapFromToken: () => {},
    setSwapToToken: () => {},
})

const useTrade = () => useContext(TradeContext)

const TradeProvider = ({ children }: { children: React.ReactNode }) => {
    const { nexTokens } = useDashboard()
    const searchParams = useSearchParams()

    const allTokens = useMemo(() => [...nexTokens, ...sepoliaTokens], [nexTokens])

    const getTokenBySymbol = useCallback(
        (symbol: string | null) => allTokens.find((token) => token.symbol === symbol) || null,
        [allTokens]
    )

    const queryIndexSymbol = searchParams.get("index")
    const querySide = searchParams.get("side")

    const [swapFromToken, setSwapFrom] = useState<IndexCryptoAsset>(() =>
        querySide === "buy" ? defaultFromToken : getTokenBySymbol(queryIndexSymbol) || defaultToToken
    )

    const [swapToToken, setSwapTo] = useState<IndexCryptoAsset>(() =>
        querySide === "buy" ? getTokenBySymbol(queryIndexSymbol) || defaultToToken : defaultFromToken
    )

    useEffect(() => {
        if (!queryIndexSymbol) return

        const token = getTokenBySymbol(queryIndexSymbol)
        if (!token) return

        if (querySide === "buy") setSwapTo(token)
        else setSwapFrom(token)
    }, [queryIndexSymbol, querySide, getTokenBySymbol])

    const setSwapFromToken = useCallback((token: IndexCryptoAsset) => setSwapFrom(token), [])
    const setSwapToToken = useCallback((token: IndexCryptoAsset) => setSwapTo(token), [])

    const contextValue = useMemo(
        () => ({ swapFromToken, swapToToken, setSwapFromToken, setSwapToToken }),
        [swapFromToken, swapToToken, setSwapFromToken, setSwapToToken]
    )

    return <TradeContext.Provider value={contextValue}>{children}</TradeContext.Provider>
}

export { TradeProvider, TradeContext, useTrade }
