"use client"

import { Address, ChainNetwork } from "@/types/indexTypes"
import { allowedChainNetworks } from "@/utils/mappings"
import React, { createContext, useMemo, useCallback, useState, useEffect } from "react"
import { useContext } from "react"
import { Chain, sepolia } from "thirdweb/chains"
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react"

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
    setActiveChainSetting: () => {},
})

const useGlobal = () => useContext(GlobalContext)

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const chain = useActiveWalletChain()
    const account = useActiveAccount()

    const [activeChainSetting, setActiveChainSetting] = useState<ChainNetwork>(
        allowedChainNetworks.find((option) => option.chain === chain) || allowedChainNetworks[0]
    )

    useEffect(() => {
        const newChainSetting = allowedChainNetworks.find((option) => option.chain === chain) || allowedChainNetworks[0]
        setActiveChainSetting(newChainSetting)
    }, [chain])

    const activeThirdWebChain = activeChainSetting.chain
    const userAddress = (account?.address as Address) || null

    const updateActiveChainSetting = useCallback((network: ChainNetwork) => {
        setActiveChainSetting(network)
    }, [])

    const contextValue = useMemo(
        () => ({
            activeChainSetting,
            activeThirdWebChain,
            userAddress,
            setActiveChainSetting: updateActiveChainSetting,
        }),
        [activeChainSetting, activeThirdWebChain, userAddress, updateActiveChainSetting]
    )

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export { GlobalProvider, GlobalContext, useGlobal }
