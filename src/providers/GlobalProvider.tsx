"use client"

import { Address, ChainNetwork } from "@/types/indexTypes"
import { networkToChain } from "@/utils/mappings"
import React, { createContext, useState } from "react"
import { useContext } from "react"
import { Chain, sepolia } from "thirdweb/chains"
import { useActiveAccount } from "thirdweb/react"

interface GlobalContextProps {
    activeChainSetting: ChainNetwork
    activeThirdWebChain: Chain
    userAddress: Address | null
    setActiveChainSetting: (network: ChainNetwork) => void
}

const GlobalContext = createContext<GlobalContextProps>({
    activeChainSetting: {chain: 'Ethereum', network: 'Sepolia'},
    activeThirdWebChain: sepolia,
    userAddress: null,
    setActiveChainSetting: () => { }
})

const useGlobal = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeChainSetting, setActiveChainSetting] = useState<ChainNetwork>({chain: 'Ethereum', network: 'Sepolia'})
    const activeThirdWebChain = networkToChain[activeChainSetting.network]
    const account = useActiveAccount()
    const userAddress = account?.address as Address

    const contextValue = {
        activeChainSetting,
        activeThirdWebChain,
        userAddress,
        setActiveChainSetting
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export { GlobalProvider, GlobalContext, useGlobal }