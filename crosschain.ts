import { ContractOptions, getContract, readContract } from "thirdweb"
import { EthereumPrice, Index, IndexProduct, NexIndices, TickerPrices } from "../types"
import { allChains, sideChainMap } from "../utils/chainInfoMapping"
import { redis } from "../redis/client"
import { client } from "../thirdweb/client"
import { tokenAddresses } from "../constants/tokenAddresses"
import { formatUnits, parseUnits } from "ethers"
import { formatUnitsToNumber } from "../utils/helper"

export async function getCrossChainPrice(index: Index): Promise<{ price: number } | null> {
    const ticker = index.symbol

    const mainChain = allChains.find((o) => o.chainName === "Arbitrum" && o.network === "Mainnet")!

    const indexData = await redis?.get(`INDEX_${ticker.toUpperCase()}`).then(res => res ? JSON.parse(res).data : null) as IndexProduct
    if (!indexData) throw new Error(`index data from redis not found for ${ticker}`)

    const cryptoPrices = await redis?.get("TICKER_PRICES").then(res => res ? JSON.parse(res).prices : null) as TickerPrices["prices"]
    if (!cryptoPrices) throw new Error(`Crypto prices from redis not found for ${ticker}`)

    // console.log(cryptoPrices)

    const { portfolioBalance, totalSupply, underlyings } = indexData.variables?.onchain!

    // console.log(ticker, "portfolioBalance: ", portfolioBalance)

    const sideChain = sideChainMap[mainChain.chainName]?.[mainChain.network]?.[ticker as NexIndices]
    if (!sideChain) return null

    const { storage, token, functions_oracle } = index.tokenAddresses?.[mainChain.chainName]?.[mainChain.network] || {}
    const { storage: sideStorage } = index.tokenAddresses?.[sideChain.chainName]?.[sideChain.network] || {}

    if (!storage?.address || !token?.address || !functions_oracle?.address || !sideStorage?.address) {
        return null
    }

    const [factoryStorageContract, sideChainStorageContract] = [
        getContract({ client, chain: mainChain.chain, address: storage.address }),
        getContract({ client, chain: sideChain.chain, address: sideStorage.address })
    ]

    const [mainChainPrice, sideChainPrice] = await Promise.all([
        readContract({ contract: factoryStorageContract, method: "function priceInWei() returns(uint256)", params: [] }),
        readContract({ contract: sideChainStorageContract, method: "function priceInWei() returns(uint256)", params: [] })
    ])

    let totalPortfolioBalance = portfolioBalance * Number(mainChainPrice) / 1e18

    // console.log(ticker, "totalPortfolioBalance: ", totalPortfolioBalance)

    const sideTokens = underlyings.filter((t) => t.chain !== mainChain.chainName)

    const sideTokenValuePromises = sideTokens.map(async ({ ticker, address, amount, pathAddrs, pathFees }) => {

        if (!pathAddrs || !pathFees) throw new Error(`pathAdd/pathFees not found for ${ticker}`)

        const isWrappedNative = address === tokenAddresses.ETH?.[sideChain.chainName]?.[sideChain.network]?.token?.address
        if (isWrappedNative) return (Number(amount) / 1e18) * Number(sideChainPrice)

        // console.log(ticker, "amount: ", amount)

        const tokenValue = await readContract({
            contract: sideChainStorageContract,
            method: "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
            params: [pathAddrs, pathFees, BigInt(amount)]
        })
        // console.log(ticker, "tokenValue: ", tokenValue)
        // console.log(ticker, "sideChainPrice: ", sideChainPrice)

        return (Number(tokenValue) / 1e18) * Number(sideChainPrice)
    })

    const sideValues = await Promise.all(sideTokenValuePromises)
    // console.log(ticker, "sideValues: ", sideValues)
    for (const val of sideValues) totalPortfolioBalance += val

    // console.log("totalPortfolioBalance: ", totalPortfolioBalance)

    const price = await calculatePrice(
        indexData,
        mainChainPrice,
        BigInt(totalPortfolioBalance),
        BigInt(totalSupply),
        factoryStorageContract
    )

    // console.log(price)
    return {
        price: formatUnitsToNumber(price, 18)
    }
}

function getNetSentAndReceivedAmounts(
    indexData: IndexProduct
): bigint {

    const {
        mainTotalSentAmount,
        mainTotalReceiveAmount,
        sideTotalSentAmount,
        sideTotalReceiveAmount
    } = indexData.variables?.onchain!

    if (!mainTotalSentAmount || !sideTotalSentAmount || !mainTotalReceiveAmount || !sideTotalReceiveAmount) throw new Error("Sent and Receive Values not found")

    const [ms, mr, ss, sr] = [mainTotalSentAmount, mainTotalReceiveAmount, sideTotalSentAmount, sideTotalReceiveAmount]
        .map(v => BigInt(v));

    const diff = (ms + mr) - (ss + sr);
    return diff >= BigInt(0) ? diff : -diff;
}

async function calculatePrice(
    indexData: IndexProduct,
    mainChainPrice: bigint,
    totalPortfolioValue: bigint,
    totalSupply: bigint,
    factoryStorageContract: Readonly<ContractOptions<[], `0x${string}`>>,
): Promise<bigint> {

    const {
        mainChainCCIPPath,
        totalPendingRedemptionHoldValue,
        totalPendingExtraWeth,
        totalPendingIssuanceInput,
        totalPendingRedemptionInput
    } = indexData.variables?.onchain!

    const ethPrice = parseUnits(mainChainPrice.toString(), 18)
    const totalValue = (totalPortfolioValue * BigInt(1e18)) / ethPrice
    const netReceivedAmount = getNetSentAndReceivedAmounts(indexData)

    // console.log(netReceivedAmount)
    // console.log(indexData.variables?.onchain)

    if (
        mainChainCCIPPath == null ||
        totalPendingRedemptionHoldValue == null ||
        totalPendingExtraWeth == null ||
        totalPendingIssuanceInput == null ||
        totalPendingRedemptionInput == null
    ) {
        throw new Error(`onChain Values for ${indexData.ticker} not found`);
    }
    const [
        pRedHold,
        pExtraWeth,
        pIssuanceInput,
        pRedInput
    ] = [
        totalPendingRedemptionHoldValue,
        totalPendingExtraWeth,
        totalPendingIssuanceInput,
        totalPendingRedemptionInput
    ].map(v => BigInt(v));

    const [path, fees] = mainChainCCIPPath

    const [crossChainTokenValue] = await Promise.all([
        readContract({
            contract: factoryStorageContract, method: "function getAmountOut(address[], uint24[], uint256) returns(uint256)",
            params: [path, fees, netReceivedAmount]
        }),
    ])

    const numerator = totalValue + crossChainTokenValue + pRedHold + pExtraWeth - pIssuanceInput
    const denominator = totalSupply + pRedInput
    // console.log(ethPrice, numerator, denominator)
    return (numerator * ethPrice) / denominator
}
