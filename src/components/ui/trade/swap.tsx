"use client"

import {
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
  Input,
} from "@mui/material"
import theme from "@/theme/theme"
import { useEffect, useState } from "react"

import { LuSettings2, LuChevronDown, LuArrowUpRight } from "react-icons/lu"
import { TbArrowsExchange2 } from "react-icons/tb"
import { BigNumber, ethers } from "ethers"

import {
  Address,
  thirdwebReadContract,
  IndexCryptoAsset,
  CryptoAsset,
  NexIndices,
  AllowedTickers,
} from "@/types/indexTypes"
import { PublicClient } from "viem"
import { useDashboard } from "@/providers/DashboardProvider"
import { sepoliaTokens } from "@/constants/tokens"
import { getDecimals, isWETH } from "@/utils/general"
import { useGlobal } from "@/providers/GlobalProvider"
import convertToUSDUni from "@/utils/convertToUSDUni"
import { GenericToast } from "../generic/genericToast"
import {
  formatNumber,
  formatToViewNumber,
  num,
  numToWei,
  weiToNum,
} from "@/utils/conversionFunctions"
import GetContract from "@/hooks/getContract"
import { tokenAddresses } from "@/constants/contractAddresses"
import { useReadContract, useSendTransaction } from "thirdweb/react"
import { allowance, balanceOf, totalSupply } from "thirdweb/extensions/erc20"
import { GetCrossChainPortfolioBalance } from "@/hooks/getCrossChainPortfolioBalance"
import { GetDefiPortfolioBalance } from "@/hooks/getDefiPortfolioBalance"
import { GetNewCrossChainPortfolioBalance } from "@/hooks/getNewCrossChainPortfolioBalance"
import {
  prepareContractCall,
  readContract,
  resolveMethod,
  ZERO_ADDRESS,
} from "thirdweb"
import Big from "big.js"
import {
  crossChainIndexFactoryV2Abi,
  stockFactoryStorageABI,
} from "@/constants/abi"
import { parseEther, parseUnits } from "@ethersproject/units"
import { getWalletBalance } from "thirdweb/wallets"
import { client } from "@/utils/thirdWebClient"
import { getClient } from "@/utils/getRPCClient"
import { toast } from "react-toastify"
import TokensModal from "./tokensModal"
import { useTrade } from "@/providers/TradeProvider"

interface SwapProps {
  side?: "buy" | "sell"
  selectedIndex?: IndexCryptoAsset
}

function isIndexCryptoAsset(
  token: CryptoAsset | IndexCryptoAsset
): token is IndexCryptoAsset {
  return token && typeof token === "object" && "smartContractType" in token
}

export default function Swap({ selectedIndex, side }: SwapProps) {
  const {
    activeChainSetting: { network, chain },
    userAddress,
    activeThirdWebChain,
  } = useGlobal()
  const { swapFromToken, swapToToken, setSwapFromToken, setSwapToToken } =
    useTrade()
  const [selectedSide , setSelectedSide] = useState<"buy" | "sell" | undefined>(side)
  const { ethPriceUsd, nexTokens } = useDashboard()

  const [autoValue, setAutoValue] = useState<"min" | "half" | "max" | "auto">(
    "auto"
  )

  const [openFromTokensModal, setOpenFromTokensModal] = useState(false)
  const [openToTokensModal, setOpenToTokensModal] = useState(false)

  const handleOpenFromTokensModal = () => {
    setOpenFromTokensModal(true)
  }
  const handleCloseFromTokensModal = () => {
    setOpenFromTokensModal(false)
  }

  const handleOpenToTokensModal = () => {
    setOpenToTokensModal(true)
  }
  const handleCloseToTokensModal = () => {
    setOpenToTokensModal(false)
  }

  const [firstInputValue, setFirstInputValue] = useState("")
  const [secondInputValue, setSecondInputValue] = useState("")
  const [from1UsdPrice, setFrom1UsdPrice] = useState(0)
  // const [fromDollarPrice, setFromDollarPrice] = useState(0)
  const [to1UsdPrice, setTo1UsdPrice] = useState(0)
  // const [toDollarPrice, setToDollarPrice] = useState(0)
  const [coinsList, setCoinsList] = useState<CryptoAsset[]>([])
  const [mergedCoinList, setMergedCoinList] = useState<CryptoAsset[][]>([
    [],
    [],
  ])
  const [feeRate, setFeeRate] = useState(0)
  const [currentPortfolioValue, setCurrentPortfolioBalance] = useState(0)
  const [userEthBalance, setUserEthBalance] = useState(0)

  const rpcClient = getClient(chain, network)

  const activeSymbol = isIndexCryptoAsset(swapFromToken)
    ? swapFromToken.symbol
    : swapToToken.symbol
  const activeAddress = tokenAddresses[activeSymbol as NexIndices]?.[chain]?.[
    network
  ]?.factory?.address as Address

  useEffect(() => {
    const selectedCoin = selectedIndex?.symbol || "ANFI"
    const coinDetails = [...nexTokens, ...sepoliaTokens].filter(
      (coin: CryptoAsset) => {
        return coin.symbol === selectedCoin
      }
    )
    setSwapToToken(coinDetails[0])
  }, [selectedIndex, nexTokens])

  useEffect(() => {
    async function fetchData(tokenDetails: CryptoAsset) {
      try {
        const address = tokenDetails.tokenAddresses?.[chain]?.[network]?.token
          ?.address as Address
        const decimals = getDecimals(
          tokenDetails.tokenAddresses?.[chain]?.[network]?.token
        )

        const price = await convertToUSDUni(
          address,
          decimals,
          ethPriceUsd,
          network
        )
        return price as number
      } catch (err) {
        console.error(`Error fetching price:`, err)
        throw err // Rethrow the error for consistent error handling
      }
    }

    async function fetchTokenPrices() {
      try {
        const [fromPrice, toPrice] = await Promise.all([
          fetchData(swapFromToken),
          fetchData(swapToToken),
        ])
        setFrom1UsdPrice(fromPrice)
        setTo1UsdPrice(toPrice)
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching token prices:", error)
      }
    }

    // Call fetchTokenPrices when needed
    fetchTokenPrices()
  }, [swapFromToken, swapToToken, ethPriceUsd, chain, network])

  const resetFirstValue = () => {
    setFirstInputValue("")
  }
  const resetSecondValue = () => {
    setSecondInputValue("")
  }

  const fetchAllLiFiTokens = async () => {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    }
    try {
      const response = await fetch(`https://li.quest/v1/tokens`, options)
      const data = await response.json()

      const tokenSets = data.tokens
      const coins: CryptoAsset[] = Object.keys(tokenSets).flatMap((key) => {
        const tokenSet = tokenSets[key]
        return tokenSet.map(
          (coin: {
            address: Address
            logoURI: string
            name: string
            symbol: string
            decimals: number
          }) => ({
            id: coin.address,
            logo:
              coin.logoURI && coin.logoURI != ""
                ? coin.logoURI
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkV1AbgRiM148jZcCVDvdFhjx_vfKVS055A&usqp=CAU",
            name: coin.name,
            Symbol: coin.symbol,
            address: coin.address,
            decimals: coin.decimals,
          })
        )
      })
      return coins
    } catch (error) {
      console.error(error)
      return [] // Ensure a value is returned even in case of an error
    }
  }

  function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  useEffect(() => {
    const fetchData = async () => {
      const initialCoins = await fetchAllLiFiTokens()
      const dividedArrays = chunkArray(initialCoins, 100)

      setCoinsList(dividedArrays[0])
    }

    fetchData()
  }, [])

  useEffect(() => {
    const finalCoinList =
      network === "Mainnet"
        ? coinsList
        : ([...nexTokens, ...sepoliaTokens] as IndexCryptoAsset[])
    const OurIndexCoinList: IndexCryptoAsset[] = finalCoinList.filter((coin) =>
      coin.hasOwnProperty("smartContractType")
    )
    const OtherCoinList: IndexCryptoAsset[] = finalCoinList.filter(
      (coin) => !coin.hasOwnProperty("smartContractType")
    )

    if (swapToToken.symbol === "MAG7" || swapFromToken.symbol === "MAG7") {
      const usdcDetails = OtherCoinList.filter((coin) => {
        return coin.symbol === "USDC"
      })[0]
      if (swapToToken.symbol === "MAG7") {
        setSwapFromToken(usdcDetails)
      }
    }
    setMergedCoinList([OtherCoinList, OurIndexCoinList])
  }, [
    network,
    swapToToken.symbol,
    swapFromToken.symbol,
    coinsList,
    nexTokens,
    setSwapFromToken,
  ])

  function Switching() {
    const switchReserve = swapFromToken
    setSwapFromToken(swapToToken)
    setSwapToToken(switchReserve)
    setSelectedSide(selectedSide == 'buy' ? 'sell' : 'buy')
    if (switchReserve.hasOwnProperty("smartContractType")) {
      if (
        mergedCoinList[0].some((obj) => obj.hasOwnProperty("smartContractType"))
      ) {
        const newArray = [mergedCoinList[1], mergedCoinList[0]]
        setMergedCoinList(newArray)
      } else {
        const newArray = [mergedCoinList[0], mergedCoinList[1]]
        setMergedCoinList(newArray)
      }
    } else {
      if (
        mergedCoinList[0].some((obj) => obj.hasOwnProperty("smartContractType"))
      ) {
        const newArray = [mergedCoinList[0], mergedCoinList[1]]
        setMergedCoinList(newArray)
      } else {
        const newArray = [mergedCoinList[1], mergedCoinList[0]]
        setMergedCoinList(newArray)
      }
    }
    setSecondInputValue(firstInputValue)
  }

  const changeFirstInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoValue("auto")
    const enteredValue = e?.target?.value
    if (Number(enteredValue) != 0 && Number(enteredValue) < 0.00001) {
      GenericToast({
        type: "error",
        message: "Please enter the input value greater than this value...",
      })
      return
    }
    setFirstInputValue(e?.target?.value)
  }

  // useEffect(() => {
  //     const fromNewPrice = Number(firstInputValue) * Number(from1UsdPrice)
  //     setFromDollarPrice(fromNewPrice)
  // }, [from1UsdPrice, firstInputValue, secondInputValue, to1UsdPrice])

  // useEffect(() => {
  //     const toNewPrice = Number(secondInputValue) * Number(to1UsdPrice)
  //     setToDollarPrice(toNewPrice)
  // }, [secondInputValue, to1UsdPrice])

  useEffect(() => {
    const convertedAmout =
      (Number(from1UsdPrice) / Number(to1UsdPrice)) * Number(firstInputValue)
    if (network == "Mainnet") {
      setSecondInputValue(convertedAmout.toString())
    }
  }, [from1UsdPrice, to1UsdPrice, firstInputValue, network])

  const changeSecondInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondInputValue(e?.target?.value)
  }

  function getPrimaryBalance() {
    if (
      isWETH(
        swapFromToken.tokenAddresses?.Ethereum?.[network]?.token
          ?.address as Address
      )
    ) {
      if (!userEthBalance) {
        return 0
      } else
        return formatToViewNumber({
          value: Number(
            ethers.utils.formatEther(userEthBalance.toString())
          ) as number,
          returnType: "string",
        })
    } else {
      if (!fromTokenBalance?.data) {
        return 0
      } else {
        const bal = formatToViewNumber({
          value:
            Number(fromTokenBalance?.data) /
            Number(
              `1e${getDecimals(
                swapFromToken.tokenAddresses?.Ethereum?.[network]?.token
              )}`
            ),
          returnType: "string",
        }).toString()
        const balWithoutComma = bal.includes(",")
          ? bal.split(",").join("")
          : bal
        return balWithoutComma
      }
    }
  }

  function getSecondaryBalance() {
    if (
      isWETH(
        swapToToken.tokenAddresses?.Ethereum?.[network]?.token
          ?.address as Address
      )
    ) {
      if (!userEthBalance) {
        return 0
      } else
        return formatToViewNumber({
          value: parseFloat(
            ethers.utils.formatEther(userEthBalance.toString())
          ) as number,
          returnType: "string",
        })
    } else {
      if (!toTokenBalance?.data) {
        return 0
      } else
        return formatToViewNumber({
          value:
            Number(toTokenBalance.data) /
            Number(
              `1e${getDecimals(
                swapToToken.tokenAddresses?.Ethereum?.[network]?.token
              )}`
            ),
          returnType: "string",
        })
    }
  }

  const indexTokenFactoryContract = GetContract(
    activeSymbol as AllowedTickers,
    "factory"
  )
  const faucetContract = GetContract("USDT", "faucet")

  const fromTokenContract = GetContract(
    swapFromToken.symbol as AllowedTickers,
    "token"
  )
  const toTokenContract = GetContract(
    swapToToken.symbol as AllowedTickers,
    "token"
  )

  const fromTokenBalance = useReadContract(balanceOf, {
    contract: fromTokenContract,
    address: userAddress as Address,
  }) as thirdwebReadContract

  const toTokenBalance = useReadContract(balanceOf, {
    contract: toTokenContract,
    address: userAddress as Address,
  }) as thirdwebReadContract

  const fromTokenTotalSupply = useReadContract(totalSupply, {
    contract: fromTokenContract,
  }) as thirdwebReadContract
  const toTokenTotalSupply = useReadContract(totalSupply, {
    contract: toTokenContract,
  }) as thirdwebReadContract

  const fromTokenAllowance = useReadContract(allowance, {
    contract: fromTokenContract,
    owner: userAddress as Address,
    spender: swapToToken.tokenAddresses?.[chain]?.[network]?.factory
      ?.address as Address,
  }) as thirdwebReadContract

  const approveHook = useSendTransaction()
  const mintRequestHook = useSendTransaction()
  const mintRequestEthHook = useSendTransaction()
  const burnRequestHook = useSendTransaction()
  const faucetHook = useSendTransaction()
  const cancelMintRequestHook = useSendTransaction()
  const cancelBurnRequestHook = useSendTransaction()

  const crossChainPortfolioValue = GetCrossChainPortfolioBalance()
  const defiPortfolioValue = GetDefiPortfolioBalance(swapFromToken, swapToToken)

  async function approve() {
    if (
      swapToToken.tokenAddresses?.[chain]?.[network]?.token?.address ==
      ZERO_ADDRESS
    ) {
      return GenericToast({
        type: "info",
        message: "Index will be live for trading soon, Stay Tuned!",
      })
    }
    let dinariFeeAmount = 0
    if (
      isIndexCryptoAsset(swapToToken) &&
      swapToToken?.smartContractType === "stocks"
    ) {
      const feeAmountBigNumber = (await (
        rpcClient as PublicClient
      ).readContract({
        address: tokenAddresses.MAG7?.[chain]?.[network]?.storage
          ?.address as Address,
        abi: stockFactoryStorageABI,
        functionName: "calculateIssuanceFee",
        args: [
          numToWei(
            firstInputValue,
            getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
          ),
        ],
      })) as BigNumber

      dinariFeeAmount = weiToNum(
        feeAmountBigNumber,
        getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
      )
    }

    const firstInputValueNum = new Big(firstInputValue)
    const result = firstInputValueNum.times(1.001).plus(dinariFeeAmount)
    const valueWithCorrectDecimals = result.toFixed(
      getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
    )

    // Convert to BigNumber using parseUnits
    const convertedValue = parseUnits(
      valueWithCorrectDecimals,
      getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
    )

    try {
      if (
        weiToNum(
          fromTokenBalance.data,
          getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
        ) < Number(firstInputValue)
      ) {
        return GenericToast({
          type: "error",
          message: `You don't have enough ${swapFromToken.symbol} balance!`,
        })
      } else if (Number(firstInputValue) <= 0) {
        return GenericToast({
          type: "error",
          message: `Please enter amount you want to approve`,
        })
      } else if (
        Number(firstInputValue) <= 15 &&
        isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "stocks"
      ) {
        return GenericToast({
          type: "error",
          message: `Please enter amount greater than $15`,
        })
      }

      const transaction = prepareContractCall({
        contract: fromTokenContract,
        method: resolveMethod("approve"),
        params: [
          swapToToken.tokenAddresses?.[chain]?.[network]?.factory?.address,
          BigInt(convertedValue.toString()),
        ],
      })

      approveHook.mutate(transaction)
    } catch (error) {
      console.log("approve error", error)
    }
  }

  async function mintRequest() {
    if (
      swapToToken.tokenAddresses?.[chain]?.[network]?.token?.address ==
      ZERO_ADDRESS
    ) {
      return GenericToast({
        type: "info",
        message: "Index will be live for trading soon, Stay Tuned!",
      })
    }

    if (
      isWETH(
        swapFromToken.tokenAddresses?.[chain]?.[network]?.token
          ?.address as Address
      )
    ) {
      mintRequestEth()
    } else {
      mintRequestTokens()
    }
  }
  async function mintRequestTokens() {
    try {
      if (
        weiToNum(
          fromTokenBalance.data,
          getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
        ) < Number(firstInputValue)
      ) {
        return GenericToast({
          type: "error",
          message: `You don't have enough ${swapFromToken.symbol} balance!`,
        })
      } else if (Number(firstInputValue) <= 0) {
        return GenericToast({
          type: "error",
          message: `Please enter amount you want to mint`,
        })
      } else if (
        Number(firstInputValue) <= 15 &&
        isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "stocks"
      ) {
        return GenericToast({
          type: "error",
          message: `Please enter amount greater than $15`,
        })
      }

      if (
        isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "defi"
      ) {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokens"),
          params: [
            swapFromToken.tokenAddresses?.[chain]?.[network]?.token?.address,
            parseEther(Number(firstInputValue).toString()),
            "3",
          ],
        })

        mintRequestHook.mutate(transaction)
      } else if (swapToToken.smartContractType === "stocks") {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: "function issuanceIndexTokens(uint256)",
          params: [
            BigInt(
              parseUnits(
                Number(firstInputValue).toString(),
                getDecimals(
                  swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                )
              ).toString()
            ),
          ],
        })
        mintRequestHook.mutate(transaction)
      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokens"),
          params: [
            swapFromToken.tokenAddresses?.[chain]?.[network]?.token?.address,
            parseEther(Number(firstInputValue).toString()),
            "0",
            "3",
          ],
        })
        mintRequestHook.mutate(transaction)
      }
    } catch (error) {
      console.log("mint error", error)
    }
  }

  async function mintRequestEth() {
    try {
      const convertedValue = parseEther(
        ((Number(firstInputValue) * 1001) / 1000).toString() as string
      )
      if (num(userEthBalance) < Number(firstInputValue)) {
        return GenericToast({
          type: "error",
          message: `You don't have enough ${swapFromToken.symbol} balance!`,
        })
      } else if (Number(firstInputValue) <= 0) {
        return GenericToast({
          type: "error",
          message: `Please enter amount you want to mint`,
        })
      }
      if (
        isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "defi"
      ) {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokensWithEth"),
          params: [parseEther(Number(firstInputValue).toString())],
          value: BigInt(convertedValue.toString()),
        })
        mintRequestEthHook.mutate(transaction)
      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokensWithEth"),
          params: [parseEther(Number(firstInputValue).toString()), "0"],
          value: BigInt(convertedValue.toString()),
        })
        mintRequestEthHook.mutate(transaction)
      }
    } catch (error) {
      console.log("mint error", error)
    }
  }

  async function burnRequest() {
    try {
      if (
        weiToNum(
          fromTokenBalance.data,
          getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.token)
        ) < Number(firstInputValue)
      ) {
        return GenericToast({
          type: "error",
          message: `You don't have enough ${swapFromToken.symbol} balance!`,
        })
      } else if (Number(firstInputValue) <= 0) {
        return GenericToast({
          type: "error",
          message: `Please enter amount you want to burn`,
        })
      } else if (
        Number(secondInputValue) <= 15 &&
        isIndexCryptoAsset(swapFromToken) &&
        swapFromToken?.smartContractType === "stocks"
      ) {
        return GenericToast({
          type: "error",
          message: `Minimum USDC that you can get is $15`,
        })
      }
      if (
        isIndexCryptoAsset(swapFromToken) &&
        swapFromToken?.smartContractType === "defi"
      ) {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("redemption"),
          params: [
            parseEther(Number(firstInputValue).toString()),
            swapToToken.tokenAddresses?.[chain]?.[network]?.token?.address,
            "3",
          ],
        })
        burnRequestHook.mutate(transaction)
      } else if (
        isIndexCryptoAsset(swapFromToken) &&
        swapFromToken?.smartContractType === "stocks"
      ) {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("redemption"),
          params: [
            parseUnits(
              Number(firstInputValue).toString(),
              getDecimals(
                swapFromToken.tokenAddresses?.[chain]?.[network]?.token
              )
            ).toString(),
          ],
        })
        burnRequestHook.mutate(transaction)
      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("redemption"),
          params: [
            parseEther(Number(firstInputValue).toString()),
            "0",
            getDecimals(
              swapFromToken.tokenAddresses?.[chain]?.[network]?.token
            ),
            "3",
          ],
        })
        burnRequestHook.mutate(transaction)
      }
    } catch (error) {
      console.log("burn error", error)
    }
  }

  // async function cancelMintRequest(nonce: number) {
  //     try {
  //         const transaction = prepareContractCall({
  //             contract: mag7FactoryContract,
  //             method: resolveMethod('cancelIssuance'),
  //             params: [nonce],

  //         })
  //         cancelMintRequestHook.mutate(transaction)

  //     } catch (error) {
  //         console.log('cancel error', error)
  //     }
  // }

  // async function cancelBurnRequest(nonce: number) {

  //     try {
  //         const transaction = prepareContractCall({
  //             contract: mag7FactoryContract,
  //             method: resolveMethod('cancelRedemption'),
  //             params: [nonce],

  //         })
  //         cancelBurnRequestHook.mutate(transaction)

  //     } catch (error) {
  //         console.log('cancel error', error)
  //     }
  // }

  async function faucet() {
    if (userAddress) {
      try {
        const transaction = prepareContractCall({
          contract: faucetContract,
          method: "function getToken(address)",
          params: [
            tokenAddresses.USDT?.[chain]?.[network]?.token?.address as Address,
          ],
        })
        faucetHook.mutate(transaction)
      } catch (error) {
        console.log("faucet error", error)
      }
    }
  }

  useEffect(() => {
    async function getFeeRate() {
      const feeRate = await (rpcClient as PublicClient).readContract({
        address: activeAddress,
        abi: stockFactoryStorageABI,
        functionName: "feeRate",
        args: [],
      })

      setFeeRate(Number(feeRate) / 10000)
    }

    getFeeRate()
  }, [network, rpcClient, activeAddress, chain])

  useEffect(() => {
    const currentPortfolioValue =
      (isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "defi") ||
      (isIndexCryptoAsset(swapFromToken) &&
        swapFromToken?.smartContractType === "defi")
        ? defiPortfolioValue.data
        : (crossChainPortfolioValue.data as number)
    setCurrentPortfolioBalance(currentPortfolioValue as number)
  }, [
    crossChainPortfolioValue.data,
    defiPortfolioValue.data,
    swapToToken,
    swapFromToken,
  ])

  useEffect(() => {
    async function getIssuanceOutput2() {
      try {
        if (firstInputValue === "") {
          resetSecondValue()
          return
        }
        const convertedInputValue = firstInputValue
          ? parseEther(Number(firstInputValue)?.toString() as string)
          : 0
        if (swapToToken.hasOwnProperty("smartContractType")) {
          const currentTotalSupply = Number(toTokenTotalSupply.data)
          let inputValue
          if (
            isWETH(
              swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                ?.address as Address
            )
          ) {
            inputValue = Number(firstInputValue) * 1e18
          } else {
            if (
              isIndexCryptoAsset(swapToToken) &&
              swapToToken?.smartContractType === "stocks"
            ) {
              const outAmount = await (rpcClient as PublicClient).readContract({
                address: tokenAddresses.MAG7?.[chain]?.[network]?.storage
                  ?.address as Address,
                abi: stockFactoryStorageABI,
                functionName: "getIssuanceAmountOut",
                args: [
                  numToWei(
                    firstInputValue,
                    getDecimals(
                      swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                    )
                  ),
                ],
              })
              setSecondInputValue(
                weiToNum(
                  outAmount,
                  getDecimals(
                    swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                  )
                ).toFixed(2)
              )
            } else if (convertedInputValue) {
              const inputEthValue = await (
                rpcClient as PublicClient
              ).readContract({
                address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.factory
                  ?.address as Address,
                abi: crossChainIndexFactoryV2Abi,
                functionName: "getAmountOut",
                args: [
                  swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                    ?.address,
                  tokenAddresses.WETH?.[chain]?.[network]?.token?.address,
                  convertedInputValue,
                  3,
                ],
              })

              inputValue = Number(inputEthValue)

              let newPortfolioValue: number = 0
              if (
                isIndexCryptoAsset(swapToToken) &&
                swapToToken?.smartContractType === "crosschain"
              ) {
                const { portfolioValue } = GetNewCrossChainPortfolioBalance(
                  Number(currentPortfolioValue),
                  Number(inputValue)
                )
                newPortfolioValue = portfolioValue
              } else {
                newPortfolioValue =
                  Number(currentPortfolioValue) + Number(inputValue)
              }
              const newTotalSupply =
                (currentTotalSupply * newPortfolioValue) /
                Number(currentPortfolioValue)
              const amountToMint = newTotalSupply - currentTotalSupply
              setSecondInputValue(num(amountToMint).toString())
            }
          }
        }
      } catch (error) {
        console.log("getIssuanceOutput error:", error)
      }
    }
    getIssuanceOutput2()
  }, [
    firstInputValue,
    swapFromToken,
    chain,
    swapToToken,
    setSecondInputValue,
    toTokenTotalSupply.data,
    defiPortfolioValue.data,
    crossChainPortfolioValue.data,
    network,
    currentPortfolioValue,
    rpcClient,
  ])

  useEffect(() => {
    async function getRedemptionOutput2() {
      try {
        if (firstInputValue === "") {
          resetSecondValue()
          return
        }
        if (swapFromToken.hasOwnProperty("smartContractType")) {
          const convertedInputValue = firstInputValue
            ? parseEther(Number(firstInputValue)?.toString() as string)
            : 0
          let outputValue
          const currentTotalSupply = Number(fromTokenTotalSupply.data)
          const newTotalSupply =
            currentTotalSupply - Number(convertedInputValue)
          const newPortfolioValue =
            (Number(currentPortfolioValue) * newTotalSupply) /
            currentTotalSupply
          const ethAmountOut =
            (Number(currentPortfolioValue) - newPortfolioValue) * 0.999
          if (
            isWETH(
              swapToToken.tokenAddresses?.[chain]?.[network]?.token
                ?.address as Address
            )
          ) {
            outputValue = ethAmountOut
          } else {
            if (
              isIndexCryptoAsset(swapFromToken) &&
              swapFromToken?.smartContractType === "stocks"
            ) {
              const storageContract = GetContract(
                swapFromToken.symbol as AllowedTickers,
                "storage"
              )
              const outAmount = await readContract({
                contract: storageContract,
                method:
                  "function getRedemptionAmountOut(uint256) returns (uint256)",
                params: [BigInt(firstInputValue)],
              })

              setSecondInputValue(
                weiToNum(
                  outAmount,
                  getDecimals(
                    swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                  )
                ).toString()
              )
            } else {
              const factoryContract = GetContract("CRYPTO5", "factory")
              const outPutTokenValue = await readContract({
                contract: factoryContract,
                method:
                  "function getAmountOut(address, address, uint256, uint256 ) returns (uint256)",
                params: [
                  tokenAddresses.WETH?.[chain]?.[network]?.token
                    ?.address as Address,
                  swapToToken.tokenAddresses?.[chain]?.[network]?.token
                    ?.address as Address,
                  BigInt(Math.floor(ethAmountOut)), // Convert ethAmountOut to bigint
                  BigInt(3),
                ],
              })

              outputValue = Number(outPutTokenValue)
              setSecondInputValue(
                weiToNum(
                  outputValue,
                  getDecimals(
                    swapToToken.tokenAddresses?.[chain]?.[network]?.token
                  )
                ).toString()
              )
            }
          }
        }
      } catch (error) {
        console.log("getRedemptionOutput error:", error)
      }
    }
    getRedemptionOutput2()
  }, [
    firstInputValue,
    swapFromToken,
    chain,
    swapToToken,
    setSecondInputValue,
    network,
    currentPortfolioValue,
    fromTokenTotalSupply.data,
    rpcClient,
  ])

  useEffect(() => {
    if (approveHook.isSuccess) {
      fromTokenAllowance.refetch()
      approveHook.reset()
    }
  }, [approveHook.isSuccess, approveHook, fromTokenAllowance])

  useEffect(() => {
    if (mintRequestHook.isSuccess || burnRequestHook.isSuccess) {
      mintRequestHook.reset()
      burnRequestHook.reset()

      resetFirstValue()
      resetSecondValue()
    }
  }, [mintRequestHook, burnRequestHook])

  useEffect(() => {
    if (cancelMintRequestHook.isSuccess || cancelBurnRequestHook.isSuccess) {
      cancelMintRequestHook.reset()
      cancelBurnRequestHook.reset()
    }
  }, [cancelMintRequestHook, cancelBurnRequestHook])

  useEffect(() => {
    if (faucetHook.isPending) {
      toast.dismiss()
      GenericToast({
        type: "loading",
        message: "Receiving usdt...",
      })
    } else if (faucetHook.isSuccess) {
      toast.dismiss()
      GenericToast({
        type: "success",
        message: "You received 1000 usdt Successfully!",
      })
    } else if (faucetHook.isError) {
      toast.dismiss()
      GenericToast({
        type: "error",
        message: `Receiving Failed!`,
      })
    }
  }, [faucetHook.isPending, faucetHook.isSuccess, faucetHook.isError])

  useEffect(() => {
    if (approveHook.isPending) {
      toast.dismiss()
      GenericToast({
        type: "loading",
        message: "Approving...",
      })
    } else if (approveHook.isSuccess) {
      toast.dismiss()
      GenericToast({
        type: "success",
        message: "Approved Successfully!",
      })
    } else if (approveHook.isError) {
      toast.dismiss()
      GenericToast({
        type: "error",
        message: `Approving Failed!`,
      })
    }
  }, [approveHook.isPending, approveHook.isSuccess, approveHook.isError])

  useEffect(() => {
    if (cancelMintRequestHook.isPending || cancelBurnRequestHook.isPending) {
      toast.dismiss()
      GenericToast({
        type: "loading",
        message: "Cancelling...",
      })
    } else if (
      cancelMintRequestHook.isSuccess ||
      cancelBurnRequestHook.isSuccess
    ) {
      toast.dismiss()
      GenericToast({
        type: "success",
        message: "Sent Cancel Request Successfully!",
      })
    } else if (cancelMintRequestHook.isError || cancelBurnRequestHook.isError) {
      toast.dismiss()
      GenericToast({
        type: "error",
        message: `Sending Cancel Request Failed!`,
      })
    }
  }, [
    cancelMintRequestHook.isSuccess,
    cancelMintRequestHook.isPending,
    cancelMintRequestHook.isError,
    cancelBurnRequestHook.isSuccess,
    cancelBurnRequestHook.isPending,
    cancelBurnRequestHook.isError,
  ])

  useEffect(() => {
    if (mintRequestHook.isPending || mintRequestEthHook.isPending) {
      toast.dismiss()
      GenericToast({
        type: "loading",
        message: "Sending Request ...",
      })
    } else if (mintRequestHook.isSuccess || mintRequestEthHook.isSuccess) {
      toast.dismiss()
      GenericToast({
        type: "success",
        message: "Sent Request Successfully!",
      })
    } else if (mintRequestHook.isError || mintRequestEthHook.isError) {
      toast.dismiss()
      console.log(mintRequestHook.error)
      GenericToast({
        type: "error",
        message: `Sending Request Failed!`,
      })
    }
  }, [
    mintRequestHook.isPending,
    mintRequestHook.error,
    mintRequestEthHook.isPending,
    mintRequestHook.isSuccess,
    mintRequestEthHook.isSuccess,
    mintRequestHook.isError,
    mintRequestEthHook.isError,
  ])

  useEffect(() => {
    if (burnRequestHook.isPending) {
      toast.dismiss()

      GenericToast({
        type: "loading",
        message: "Sending Request ...",
      })
    } else if (burnRequestHook.isSuccess) {
      toast.dismiss()
      GenericToast({
        type: "success",
        message: "Sent Request Successfully!",
      })
    } else if (burnRequestHook.isError) {
      toast.dismiss()
      GenericToast({
        type: "error",
        message: "Sending Request Failed!",
      })
    }
  }, [
    burnRequestHook.isPending,
    burnRequestHook.isSuccess,
    burnRequestHook.isError,
  ])

  useEffect(() => {
    const getEtherBalance = async () => {
      if (userAddress) {
        // Get the balance of the account
        const balance = await getWalletBalance({
          address: userAddress as Address,
          client,
          chain: activeThirdWebChain,
        })
        setUserEthBalance(num(balance.value))
      }
    }
    getEtherBalance()
  }, [userAddress, activeThirdWebChain])

  return (
    <>
      <Stack
        width="100%"
        gap={2}
        sx={{
          backgroundColor: theme.palette.elevations.elevation950.main,
          border: `1px solid ${theme.palette.elevations.elevation800.main}`,
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" color="primary">
            {isIndexCryptoAsset(swapFromToken)
              ? `Sell ${swapFromToken.symbol} `
              : `Buy ${swapToToken.symbol} `}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={Switching}
              sx={{
                borderRadius: "50%",
                border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                padding: 1,
              }}
            >
              <TbArrowsExchange2 />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              sx={{
                borderRadius: "50%",
                border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                padding: 1,
              }}
            >
              <LuSettings2 />
            </IconButton>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="end"
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor:
                  autoValue === "min"
                    ? theme.palette.brand.nex1.main
                    : theme.palette.elevations.elevation700.main,
                paddingY: 0.5,
                paddingX: { xs: 0, sm: 0.5 },
              }}
              onClick={() => {
                setAutoValue("min")
                if (
                  isWETH(
                    swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                      ?.address as Address
                  )
                ) {
                  setFirstInputValue("0.00001")
                } else setFirstInputValue("1")
              }}
            >
              <Typography
                display={{ xs: "none", sm: "block" }}
                variant="caption"
                fontWeight={600}
              >
                MIN
              </Typography>
              <Typography
                display={{ xs: "block", sm: "none" }}
                variant="body2"
                fontWeight={600}
              >
                MIN
              </Typography>
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor:
                  autoValue === "half"
                    ? theme.palette.brand.nex1.main
                    : theme.palette.elevations.elevation700.main,
                paddingY: 0.5,
                paddingX: { xs: 0, sm: 0.5 },
              }}
              onClick={() => {
                setAutoValue("half")
                setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
              }}
            >
              <Typography
                display={{ xs: "none", sm: "block" }}
                variant="caption"
                fontWeight={600}
              >
                HALF
              </Typography>
              <Typography
                display={{ xs: "block", sm: "none" }}
                variant="body2"
                fontWeight={600}
              >
                HALF
              </Typography>
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor:
                  autoValue === "max"
                    ? theme.palette.brand.nex1.main
                    : theme.palette.elevations.elevation700.main,
                paddingY: 0.5,
                paddingX: { xs: 0, sm: 0.5 },
              }}
              onClick={() => {
                setAutoValue("max")
                setFirstInputValue(Number(getPrimaryBalance()).toString())
              }}
            >
              <Typography
                display={{ xs: "none", sm: "block" }}
                variant="caption"
                fontWeight={600}
              >
                MAX
              </Typography>
              <Typography
                display={{ xs: "block", sm: "none" }}
                variant="body2"
                fontWeight={600}
              >
                MAX
              </Typography>
            </Button>
          </Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Balance :{" "}
            <span style={{ color: theme.palette.info.main, fontSize: 16 }}>
              {getPrimaryBalance()}
            </span>
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{
              border: `1px solid ${theme.palette.elevations.elevation700.main}`,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Input
              disableUnderline
              size="small"
              placeholder="0.00"
              sx={{
                width: "50%",
                border: "none",
                outline: "none",
                "& .MuiInputBase-input": {
                  paddingY: 1,
                  paddingX: 0.5,
                  fontSize: 20,
                },
              }}
              onChange={changeFirstInputValue}
              value={firstInputValue}
            />
            <Button
              variant="outlined"
              sx={{
                backgroundColor: theme.palette.elevations.elevation900.main,
                border: "none",
                borderRadius: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                paddingX: 1,
                paddingY: 0.5,
              }}
              onClick={() => handleOpenFromTokensModal()}
            >
              <Box
                width={36}
                height={36}
                sx={{
                  backgroundImage: `url(${swapFromToken.logoString})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></Box>
              <Stack>
                <Typography variant="h6">{swapFromToken.symbol}</Typography>
                <Typography variant="caption">{network}</Typography>
              </Stack>
              <LuChevronDown />
            </Button>
          </Stack>
          <Stack
            direction="row"
            alignItems="end"
            justifyContent="space-between"
            gap={2}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {/* Allowance : <span style={{ color: theme.palette.info.main, fontSize: 16 }}>{num(fromTokenAllowance.data)}</span> */}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Balance :{" "}
              <span style={{ color: theme.palette.info.main, fontSize: 16 }}>
                {getSecondaryBalance()}
              </span>
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{
              border: `1px solid ${theme.palette.elevations.elevation700.main}`,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Input
              disableUnderline
              size="small"
              placeholder="0.00"
              sx={{
                width: "50%",
                border: "none",
                outline: "none",
                "& .MuiInputBase-input": {
                  paddingY: 1,
                  paddingX: 0.5,
                  fontSize: 20,
                },
              }}
              onChange={changeSecondInputValue}
              value={formatNumber(Number(secondInputValue))}
            />
            <Button
              variant="outlined"
              sx={{
                backgroundColor: theme.palette.elevations.elevation900.main,
                border: "none",
                borderRadius: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                paddingX: 1,
                paddingY: 0.5,
              }}
              onClick={() => handleOpenToTokensModal()}
            >
              <Box
                width={36}
                height={36}
                sx={{
                  backgroundImage: `url(${swapToToken.logoString})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></Box>
              <Stack>
                <Typography variant="h6">{swapToToken?.symbol}</Typography>
                <Typography variant="caption">{network}</Typography>
              </Stack>
              <LuChevronDown />
            </Button>
          </Stack>
        </Stack>
        <Stack gap={0.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="text.secondary">
              Platform Fees
            </Typography>
            <Typography variant="subtitle2">
              {formatToViewNumber({
                value: Number(firstInputValue) * feeRate,
                returnType: "string",
              })}{" "}
              {swapFromToken.symbol} ({feeRate * 100} %)
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="text.secondary">
              Testnet USDT
            </Typography>
            <Button
              sx={{
                color: theme.palette.brand.nex1.main,
              }}
              onClick={faucet}
            >
              <Stack direction="row" alignItems="center">
                <Typography variant="subtitle2">Get USDT</Typography>
                <LuArrowUpRight />
              </Stack>
            </Button>
          </Stack>
        </Stack>
        {swapToToken.hasOwnProperty("smartContractType") ? (
          <>
            {weiToNum(
              fromTokenAllowance.data,
              getDecimals(
                swapFromToken.tokenAddresses?.[chain]?.[network]?.token
              )
            ) < Number(firstInputValue) &&
            !isWETH(
              swapFromToken.tokenAddresses?.[chain]?.[network]?.token
                ?.address as Address
            ) ? (
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: Number(firstInputValue)
                    ? theme.palette.brand.nex1.main
                    : theme.palette.elevations.elevation800.main,
                  color: Number(firstInputValue)
                    ? theme.palette.info.main
                    : theme.palette.elevations.elevation400.main,
                  textTransform: "capitalize",
                }}
                onClick={approve}
              >
                <Typography variant="h6">Approve</Typography>
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor:
                    Number(firstInputValue) > 0
                      ? theme.palette.brand.nex1.main
                      : theme.palette.elevations.elevation800.main,
                  color: Number(firstInputValue)
                    ? theme.palette.info.main
                    : theme.palette.elevations.elevation400.main,
                  textTransform: "capitalize",
                }}
                onClick={mintRequest}
              >
                <Typography variant="h6">Mint</Typography>
              </Button>
            )}
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: Number(firstInputValue)
                ? theme.palette.brand.nexRed.main
                : theme.palette.elevations.elevation800.main,
              color: Number(firstInputValue)
                ? theme.palette.info.main
                : theme.palette.elevations.elevation400.main,
              textTransform: "capitalize",
            }}
            onClick={burnRequest}
          >
            <Typography variant="h6">Burn</Typography>
          </Button>
        )}
      </Stack>
      {/* tokens modal for setting FromSwapToken */}
      <TokensModal
        open={openFromTokensModal}
        showNexProducts={selectedSide == 'buy' ? false : true}
        showTokens={selectedSide == 'buy' ? true : false}
        onClose={handleCloseFromTokensModal}
        onSelect={(selectedToken) => { setSwapFromToken(selectedToken); handleCloseFromTokensModal(); }}
      />
      {/* tokens modal for setting ToSwapToken */}
      <TokensModal
        open={openToTokensModal}
        showNexProducts={selectedSide == 'buy' ? true : false}
        showTokens={selectedSide == 'buy' ? false : true}
        onClose={handleCloseToTokensModal}
        onSelect={(selectedToken) => { setSwapToToken(selectedToken); handleCloseToTokensModal(); }}
      />
    </>
  )
}