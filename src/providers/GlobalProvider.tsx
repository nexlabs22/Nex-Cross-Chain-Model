"use client"

import { Address, ChainNetwork } from "@/types/indexTypes"
import { allowedChainNetworks } from "@/utils/mappings"
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
    activeChainSetting: allowedChainNetworks[0],
    activeThirdWebChain: sepolia,
    userAddress: null,
    setActiveChainSetting: () => { }
})

const useGlobal = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeChainSetting, setActiveChainSetting] = useState<ChainNetwork>(allowedChainNetworks[0])
    const activeThirdWebChain = activeChainSetting.chain
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