"use client"

import {
  Stack,
  Typography,
  Button,
  IconButton,
  Input,
  Avatar,
  Switch,
} from "@mui/material"
import theme from "@/theme/theme"
import { useEffect, useState } from "react"

import { LuSettings2, LuChevronDown, LuArrowUpRight } from "react-icons/lu"
import { TbArrowsExchange2 } from "react-icons/tb"
import { BigNumber } from "ethers"

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
import { getDecimals, isIndexCryptoAsset, isWETH } from "@/utils/general"
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
import {GetContract} from "@/hooks/getContract"
import { tokenAddresses } from "@/constants/contractAddresses"
import { useReadContract, useSendTransaction } from "thirdweb/react"
import { allowance, balanceOf, totalSupply } from "thirdweb/extensions/erc20"
import { GetCrossChainPortfolioBalance } from "@/hooks/getCrossChainPortfolioBalance"
import { GetCrossChainPortfolioBalance2 } from "@/hooks/getCrossChainPortfolioBalance2"
import { GetDefiPortfolioBalance } from "@/hooks/getDefiPortfolioBalance"
import {
  prepareContractCall,
  readContract,
  resolveMethod,
  ZERO_ADDRESS,
} from "thirdweb"
import Big from "big.js"
import {
  stockFactoryStorageABI,
} from "@/constants/abi"
import { parseEther, parseUnits } from "@ethersproject/units"
import { getWalletBalance } from "thirdweb/wallets"
import { client } from "@/utils/thirdWebClient"
import { getClient } from "@/utils/getRPCClient"
import { toast } from "react-toastify"
import TokensModal from "./tokensModal"
import { useTrade } from "@/providers/TradeProvider"
import FiatPaymentModal from "./FiatPaymentModal"
import { getNewCrossChainPortfolioBalance } from "@/hooks/getNewCrossChainPortfolioBalance"

interface SwapProps {
  side?: "buy" | "sell"
  selectedIndex?: IndexCryptoAsset
}

export default function Swap({ side }: SwapProps) {
  const {
    activeChainSetting,
    userAddress,
    activeThirdWebChain,
  } = useGlobal()
  const { network, chainName } = activeChainSetting
  const { swapFromToken, swapToToken, setSwapFromToken, setSwapToToken } =
    useTrade()
  const [selectedSide, setSelectedSide] = useState<"buy" | "sell" | undefined>(
    side
  )
  const { ethPriceUsd } = useDashboard()

  const [autoValue, setAutoValue] = useState<"min" | "half" | "max" | "auto">(
    "auto"
  )

  const [openFromTokensModal, setOpenFromTokensModal] = useState(false)
  const [openToTokensModal, setOpenToTokensModal] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(()=>{
    if(isIndexCryptoAsset(swapFromToken)) setTitle(`Sell ${swapFromToken.symbol} `)
      else setTitle(`Buy ${swapToToken.symbol} `)
  },[swapFromToken, swapToToken])

  const [isFiatPayment, setFiatPayment] = useState(false)
  const [showNexProductsFrom, setShowNexProductsFrom] = useState<boolean>(selectedSide == 'buy' ? false : true)

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
  const handleFiatPaymentChange = () => {
    setFiatPayment(!isFiatPayment)
  }

  useEffect(() => {
    if (isIndexCryptoAsset(swapFromToken)) {
      setShowNexProductsFrom(true)
    } else {
      setShowNexProductsFrom(false)
    }
  }, [swapFromToken])

  const [firstInputValue, setFirstInputValue] = useState("")
  const [secondInputValue, setSecondInputValue] = useState("")
  const [from1UsdPrice, setFrom1UsdPrice] = useState(0)
  const [to1UsdPrice, setTo1UsdPrice] = useState(0)
  const [feeRate, setFeeRate] = useState(0)
  const [currentPortfolioValue, setCurrentPortfolioBalance] = useState(0)
  const [currentPortfolioValue2, setCurrentPortfolioBalance2] = useState(0)
  const [userEthBalance, setUserEthBalance] = useState(0)

  const rpcClient = getClient(chainName, network)

  const activeSymbol = isIndexCryptoAsset(swapFromToken)
    ? swapFromToken.symbol
    : swapToToken.symbol
  const activeStorageAddress = tokenAddresses[activeSymbol as NexIndices]?.[chainName]?.[network]?.storage?.address as Address

  useEffect(() => {
    async function fetchData(tokenDetails: CryptoAsset) {
      try {
        const address = tokenDetails.tokenAddresses?.[chainName]?.[network]?.token
          ?.address as Address
        const decimals = getDecimals(
          tokenDetails.tokenAddresses?.[chainName]?.[network]?.token
        )

        const price = await convertToUSDUni(
          address,
          decimals,
          ethPriceUsd,
          activeChainSetting
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
  }, [swapFromToken, swapToToken, ethPriceUsd, activeChainSetting, chainName, network])

  const resetFirstValue = () => {
    setFirstInputValue("")
  }
  const resetSecondValue = () => {
    setSecondInputValue("")
  }

  function Switching() {
    const switchReserve = swapFromToken
    setSwapFromToken(swapToToken)
    setSwapToToken(switchReserve)
    setSelectedSide(selectedSide == 'buy' ? 'sell' : 'buy')
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
    const tokenAddress = swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address
    const isNativeETH = isWETH(tokenAddress, chainName, network)

    if (isNativeETH) {

      return userEthBalance
        ? { real: userEthBalance, fmt: formatToViewNumber({ value: userEthBalance, returnType: "currency" }) }
        : { real: 0, fmt: '0.00' }
    }

    const realValue = weiToNum(fromTokenBalance.data, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))
    return fromTokenBalance?.data
      ? {
        real: realValue,
        fmt: formatToViewNumber({
          value: realValue,
          returnType: "currency",
        })
      }
      : { real: 0, fmt: '0.00' }
  }

  function getSecondaryBalance() {
    const tokenAddress = swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address
    const isNativeETH = isWETH(tokenAddress, chainName, network)

    if (isNativeETH) {
      return userEthBalance
        ? { real: userEthBalance, fmt: formatToViewNumber({ value: userEthBalance, returnType: "currency" }) }
        : { real: 0, fmt: '0.00' }
    }

    const realValue = weiToNum(toTokenBalance.data, getDecimals(swapToToken.tokenAddresses?.[chainName]?.[network]?.token))
    return toTokenBalance?.data
      ? {
        real: realValue,
        fmt: formatToViewNumber({
          value: realValue,
          returnType: "currency",
        })
      }
      : { real: 0, fmt: '0.00' }
  }

  // function getAllowance() {
  //   return fromTokenAllowance?.data
  //     ? formatToViewNumber({
  //       value: weiToNum(fromTokenAllowance.data, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)),
  //       returnType: "currency",
  //     })
  //     : 0
  // }

  const indexTokenFactoryContract = GetContract(activeSymbol as AllowedTickers, 'factory')
  const indexTokenStorageContract = GetContract(activeSymbol as AllowedTickers, 'storage')

  const faucetContract = GetContract('USDC', 'faucet')

  const fromTokenContract = GetContract(swapFromToken.symbol as AllowedTickers, 'token')
  const toTokenContract = GetContract(swapToToken.symbol as AllowedTickers, 'token')

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
    spender: swapToToken.tokenAddresses?.[chainName]?.[network]?.factory?.address as Address
  }) as thirdwebReadContract


  const approveHook = useSendTransaction()
  const mintRequestHook = useSendTransaction()
  const mintRequestEthHook = useSendTransaction()
  const burnRequestHook = useSendTransaction()
  const faucetHook = useSendTransaction()
  const cancelMintRequestHook = useSendTransaction()
  const cancelBurnRequestHook = useSendTransaction()

  // const crossChainPortfolioValue = { data: 0 }
  // const crossChainPortfolioValue = GetCrossChainPortfolioBalance(swapFromToken, swapToToken)
  const crossChainPortfolioValue = GetCrossChainPortfolioBalance2(swapFromToken, swapToToken)
  const defiPortfolioValue = GetDefiPortfolioBalance(swapFromToken, swapToToken)

  async function approve() {
    if (
      swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address ==
      ZERO_ADDRESS
    ) {
      return GenericToast({
        type: "info",
        message: "Index will be live for trading soon, Stay Tuned!",
      })
    }
    let dinariFeeAmount = 0
    if (isIndexCryptoAsset(swapToToken) && swapToToken?.smartContractType === "stocks") {
      const feeAmountBigNumber = (await (rpcClient as PublicClient).readContract({
        address: tokenAddresses.MAG7?.[chainName]?.[network]?.storage
          ?.address as Address,
        abi: stockFactoryStorageABI,
        functionName: "calculateIssuanceFee",
        args: [
          numToWei(
            firstInputValue,
            getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)
          ),
        ],
      })) as BigNumber

      dinariFeeAmount = weiToNum(
        feeAmountBigNumber,
        getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)
      )
    }

    const firstInputValueNum = new Big(firstInputValue)
    const result = firstInputValueNum.times(1.001).plus(dinariFeeAmount)
    const valueWithCorrectDecimals = result.toFixed(getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))

    // Convert to BigNumber using parseUnits
    const convertedValue = parseUnits(valueWithCorrectDecimals, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))

    try {
      if (
        weiToNum(
          fromTokenBalance.data,
          getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)
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
          swapToToken.tokenAddresses?.[chainName]?.[network]?.factory?.address,
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
      swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address ==
      ZERO_ADDRESS
    ) {
      return GenericToast({
        type: "info",
        message: "Index will be live for trading soon, Stay Tuned!",
      })
    }

    if (isWETH(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network)) {
      mintRequestEth()
    } else {
      mintRequestTokens()
    }
  }
  async function mintRequestTokens() {
    try {
      if (weiToNum(fromTokenBalance.data, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)) < Number(firstInputValue)) {
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
          method: "function issuanceIndexTokens(address, address[], uint24[], uint256)",
          params: [
            swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address,
            [
              swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address,
              tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address
            ],
            [3000],
            BigInt(numToWei((firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())
          ],
        })

        mintRequestHook.mutate(transaction)
      } else if (swapToToken.smartContractType === "stocks") {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: 'function issuanceIndexTokens(uint256)',
          params: [BigInt(parseUnits(Number(firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())],
        })
        mintRequestHook.mutate(transaction)
      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: "function issuanceIndexTokens(address, address[], uint24[], uint256, uint256)",
          params: [
            swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, 
            [
              swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address,
              tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address
            ],
            [3000],
            BigInt(numToWei((firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString()),
            BigInt(0)
          ]
        })
        mintRequestHook.mutate(transaction)
      }
    } catch (error) {
      console.log("mint error", error)
    }
  }

  async function mintRequestEth() {
    try {

      const firstInputValueNum = new Big(firstInputValue)
      const result = firstInputValueNum.times(1.001)
      const valueWithCorrectDecimals = result.toFixed(getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))

      // Convert to BigNumber using parseUnits
      const valueWithFee = parseUnits(valueWithCorrectDecimals, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))

      if (userEthBalance < Number(firstInputValue)) {
        console.warn(`You don't have enough ${swapFromToken.symbol} balance!`)
        return GenericToast({
          type: "error",
          message: `You don't have enough ${swapFromToken.symbol} balance!`,
        })
      } else if (Number(firstInputValue) <= 0) {
        console.warn(`Please enter amount you want to mint`)
        return GenericToast({
          type: "error",
          message: `Please enter amount you want to mint`,
        })
      }

      if (isIndexCryptoAsset(swapToToken) && swapToToken?.smartContractType === "defi") {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokensWithEth"),
          params: [parseEther(Number(firstInputValue).toString())],
          value: BigInt(valueWithFee.toString()),
        })
        mintRequestEthHook.mutate(transaction)

      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: resolveMethod("issuanceIndexTokensWithEth"),
          params: [parseEther(Number(firstInputValue).toString()), "0"],
          value: BigInt(valueWithFee.toString()),
        })
        mintRequestEthHook.mutate(transaction)
      }
    } catch (error) {
      console.log("mint error", error)
    }
  }

  async function burnRequest() {
    try {
      // if (
      //   weiToNum(
      //     fromTokenBalance.data,
      //     getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)
      //   ) < Number(firstInputValue)
      // ) {
      //   return GenericToast({
      //     type: "error",
      //     message: `You don't have enough ${swapFromToken.symbol} balance!`,
      //   })
      // } else if (Number(firstInputValue) <= 0) {
      //   return GenericToast({
      //     type: "error",
      //     message: `Please enter amount you want to burn`,
      //   })
      // } else
       if (
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
          method: "function redemption(uint256, address, address[], uint24[])",
          params: [
            BigInt(numToWei((firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString()),            
            swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address,
            [
              tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address,
              swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address],
            [3000]
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
                swapFromToken.tokenAddresses?.[chainName]?.[network]?.token
              )
            ).toString(),
          ],
        })
        burnRequestHook.mutate(transaction)
      } else {
        const transaction = prepareContractCall({
          contract: indexTokenFactoryContract,
          method: "function redemption(uint256, uint256, address, address[], uint24[])",
          params: [
            BigInt(numToWei((firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString()),
            BigInt(0),
            swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address,
            [ tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address,
              swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address],
            [3000]
          ],
        })
        burnRequestHook.mutate(transaction)
      }
    } catch (error) {
      console.log("burn error", error)
    }
  }
  //TODO
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
          method: "function getToken(address, uint256)",
          params: [
            tokenAddresses.USDC?.[chainName]?.[network]?.token?.address as Address,
            BigInt(numToWei(100, getDecimals(tokenAddresses.USDC?.[chainName]?.[network]?.token)))
          ],
        })
        faucetHook.mutate(transaction)
      } catch (error) {
        console.log("faucet error", error)
      }
    }
  }

  function refetchBalances() {
    fromTokenBalance.refetch();
    toTokenBalance.refetch();
    fromTokenAllowance.refetch();
  }

  useEffect(() => {
    refetchBalances();
  }, [activeChainSetting])

  useEffect(() => {
    async function getFeeRate() {
      const feeRate = await (rpcClient as PublicClient).readContract({
        address: activeStorageAddress,
        abi: stockFactoryStorageABI,
        functionName: "feeRate",
        args: [],
      })

      setFeeRate(Number(feeRate) / 10000)
    }

    getFeeRate()
  }, [activeStorageAddress, network, rpcClient, chainName])

  useEffect(() => {
    const currentPortfolioValue =
      (isIndexCryptoAsset(swapToToken) &&
        swapToToken?.smartContractType === "defi") ||
        (isIndexCryptoAsset(swapFromToken) &&
          swapFromToken?.smartContractType === "defi")
        ? defiPortfolioValue.data
        : (crossChainPortfolioValue.data as number)
    setCurrentPortfolioBalance(currentPortfolioValue as number)

    // setPortfolioValue2
    const currentPortfolioValue2 =
    (isIndexCryptoAsset(swapToToken) &&
    swapToToken?.smartContractType === "defi") ||
    (isIndexCryptoAsset(swapFromToken) &&
      swapFromToken?.smartContractType === "defi")
    ? defiPortfolioValue.data
    : (crossChainPortfolioValue.data2 as number)
    setCurrentPortfolioBalance2(currentPortfolioValue2 as number)
  }, [
    crossChainPortfolioValue.data,
    crossChainPortfolioValue.data2,
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

        if (swapToToken.hasOwnProperty("smartContractType")) {
          const currentTotalSupply = Number(toTokenTotalSupply.data)
          let inputValue
          if (isWETH(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network)) {
            inputValue = Number(firstInputValue) * 1e18
          } else {
            const inputEthValue = await readContract({
              contract: indexTokenStorageContract,
              method:
                "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
              params: [
                [swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address],
                [3000],
                BigInt(numToWei(firstInputValue, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token))), // Convert ethAmountOut to bigint                  
              ],
            })

            inputValue = Number(inputEthValue)      
                 
          }
          if (isIndexCryptoAsset(swapToToken) && swapToToken?.smartContractType === "stocks") {
            const outAmount = await (rpcClient as PublicClient).readContract({
              address: tokenAddresses.MAG7?.[chainName]?.[network]?.storage
                ?.address as Address,
              abi: stockFactoryStorageABI,
              functionName: "getIssuanceAmountOut",
              args: [
                numToWei(
                  firstInputValue,
                  getDecimals(
                    swapFromToken.tokenAddresses?.[chainName]?.[network]?.token
                  )
                ),
              ],
            })
            setSecondInputValue(
              weiToNum(
                outAmount,
                getDecimals(
                  swapFromToken.tokenAddresses?.[chainName]?.[network]?.token
                )
              ).toFixed(2)
            )
          } else if (firstInputValue) {
            let newPortfolioValue: number = 0
            if (isIndexCryptoAsset(swapToToken) && swapToToken?.smartContractType === "crosschain") {
              console.log('---->',{inputValue})
              const portfolioValue  = await getNewCrossChainPortfolioBalance(Number(currentPortfolioValue), Number(inputValue), chainName, network, swapToToken.symbol)
              newPortfolioValue = portfolioValue
            } else {
              newPortfolioValue = Number(currentPortfolioValue) + Number(inputValue)
            }

            console.log({currentTotalSupply, newPortfolioValue, currentPortfolioValue})

            const newTotalSupply = (currentTotalSupply * newPortfolioValue) / Number(currentPortfolioValue)
            const amountToMint = Math.abs(newTotalSupply - currentTotalSupply)
            setSecondInputValue(num(amountToMint).toString())
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
    chainName,
    swapToToken,
    setSecondInputValue,
    toTokenTotalSupply.data,
    defiPortfolioValue.data,
    crossChainPortfolioValue.data,
    crossChainPortfolioValue.data2,
    network,
    currentPortfolioValue,
    rpcClient,
    indexTokenStorageContract
  ])

  /**
  useEffect(() => {
    async function getRedemptionOutput2() {
      try {
        if (firstInputValue === "") {
          resetSecondValue()
          return
        }
        if (swapFromToken.hasOwnProperty("smartContractType")) {
          const convertedInputValue = parseEther(Number(firstInputValue)?.toString() as string)
          let outputValue
          const currentTotalSupply = Number(fromTokenTotalSupply.data)
          const newTotalSupply = currentTotalSupply - Number(convertedInputValue)
          const newPortfolioValue = (Number(currentPortfolioValue) * newTotalSupply) / currentTotalSupply
          const ethAmountOut = (Number(currentPortfolioValue) - newPortfolioValue) * 0.999
          if (isWETH(swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network)) {
            outputValue = ethAmountOut
          } else {
            const outPutTokenValue = await readContract({
              contract: indexTokenStorageContract,
              method:
                "function getAmountOut(address[], uint24[], uint256 ) returns (uint256)",
              params: [
                [tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address, swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address],
                [3000],
                BigInt(Math.floor(ethAmountOut)), // Convert ethAmountOut to bigint                  
              ],
            })

            outputValue = Number(outPutTokenValue)
          }
          if (isIndexCryptoAsset(swapFromToken) && swapFromToken?.smartContractType === "stocks") {
            const outAmount = await readContract({
              contract: indexTokenStorageContract,
              method:
                "function getRedemptionAmountOut(uint256) returns (uint256)",
              params: [BigInt(firstInputValue)],
            })

            setSecondInputValue(weiToNum(outAmount, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())
          } else {
            setSecondInputValue(weiToNum(outputValue, getDecimals(swapToToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())
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
    chainName,
    swapToToken,
    setSecondInputValue,
    network,
    currentPortfolioValue,
    fromTokenTotalSupply.data,
    rpcClient,
    indexTokenStorageContract
  ])
  */

  useEffect(() => {
    async function getRedemptionOutput2() {
      try {
        if (firstInputValue === "") {
          resetSecondValue()
          return
        }
        if (swapFromToken.hasOwnProperty("smartContractType")) {
          const convertedInputValue = parseEther(Number(firstInputValue)?.toString() as string)
          let outputValue
          const currentTotalSupply = Number(fromTokenTotalSupply.data)
          const newTotalSupply = currentTotalSupply - Number(convertedInputValue)
          const newPortfolioValue = (Number(currentPortfolioValue2) * newTotalSupply) / currentTotalSupply
          const ethAmountOut = (Number(currentPortfolioValue2) - newPortfolioValue) * 0.999
          if (isWETH(swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network)) {
            outputValue = ethAmountOut
          } else {
            const outPutTokenValue = await readContract({
              contract: indexTokenStorageContract,
              method:
                "function getAmountOut(address[], uint24[], uint256 ) returns (uint256)",
              params: [
                [tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address, swapToToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address],
                [3000],
                BigInt(Math.floor(ethAmountOut)), // Convert ethAmountOut to bigint                  
              ],
            })

            outputValue = Number(outPutTokenValue)
          }
          if (isIndexCryptoAsset(swapFromToken) && swapFromToken?.smartContractType === "stocks") {
            const outAmount = await readContract({
              contract: indexTokenStorageContract,
              method:
                "function getRedemptionAmountOut(uint256) returns (uint256)",
              params: [BigInt(firstInputValue)],
            })

            setSecondInputValue(weiToNum(outAmount, getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())
          } else {
            setSecondInputValue(weiToNum(outputValue, getDecimals(swapToToken.tokenAddresses?.[chainName]?.[network]?.token)).toString())
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
    chainName,
    swapToToken,
    setSecondInputValue,
    network,
    currentPortfolioValue,
    fromTokenTotalSupply.data,
    rpcClient,
    indexTokenStorageContract
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
      toast.loading('Receiving USDC...')
    } else if (faucetHook.isSuccess) {
      toast.dismiss()
      toast.success('You received 100 USDC Successfully!')
    } else if (faucetHook.isError) {
      toast.dismiss()
      toast.error('Receiving Failed!')
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
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
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
                if (isWETH(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network)) {
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
                setFirstInputValue((Number(getPrimaryBalance().fmt) / 2).toString())
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
                setFirstInputValue(Number(getPrimaryBalance().fmt).toString())
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

        </Stack>
        <Stack gap={1} alignItems="center" position="relative">
          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            width={'100%'}
            sx={{
              backgroundColor: theme.palette.elevations.elevation900.main,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} width="100%">
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
                  border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  paddingX: 1.5,
                  paddingY: 1,
                  width: '40%',
                }}
                onClick={() => handleOpenFromTokensModal()}
              >
                <Avatar
                  src={swapFromToken.logoString}
                  sx={{
                    width: 36,
                    height: 36,
                    border: `none`,
                    backgroundColor: 'transparent',
                  }}
                />
                <Stack>
                  <Typography variant="h6">{swapFromToken.symbol}</Typography>
                  <Typography variant="caption">{network}</Typography>
                </Stack>
                <LuChevronDown />
              </Button>
            </Stack>
            <Stack width="100%">
            <Typography variant="subtitle2" color="text.secondary" title={getPrimaryBalance().real.toString()}>
            Balance :{" "}
            <span style={{ color: theme.palette.info.main, fontSize: 16 }}>
              {(0 < Number(getPrimaryBalance().real)) && (Number(getPrimaryBalance().real) < 0.01) ? '< 0.01' : getPrimaryBalance().fmt}
            </span>
          </Typography>
            </Stack>
          </Stack>
          <IconButton
            size="medium"
            color="primary"
            onClick={Switching}
            sx={{
              borderRadius: "50%",
              border: `3px solid ${theme.palette.elevations.elevation950.main}`,
              backgroundColor: theme.palette.elevations.elevation950.main,
              padding: 1,

              position: "absolute",
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              '&:hover': {
                backgroundColor: theme.palette.elevations.elevation950.main,
                border: `3px solid ${theme.palette.elevations.elevation950.main}`,
              },
            }}
          >
            <Stack sx={{
              transform: 'rotate(90deg)',
            }}>
              <TbArrowsExchange2 />
            </Stack>
          </IconButton>
          <Stack
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            width={'100%'}
            sx={{
              backgroundColor: theme.palette.elevations.elevation900.main,
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} width="100%">
              <Input
                disableUnderline
                size="small"
                placeholder="0.00"
                sx={{
                  width: "50%",
                  border: "none",
                  outline: "none",
                  "& .MuiInputBase-input": {
                    paddingY: 1.5,
                    paddingX: 1,
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
                  border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  paddingX: 1,
                  paddingY: 0.5,
                  width: '40%',
                }}
                onClick={() => handleOpenToTokensModal()}
              >
                <Avatar
                  src={swapToToken.logoString}
                  sx={{
                    width: 36,
                    height: 36,
                    border: `none`,
                    backgroundColor: 'transparent',
                  }}
                />
                <Stack>
                  <Typography variant="h6">{swapToToken?.symbol}</Typography>
                  <Typography variant="caption">{network}</Typography>
                </Stack>
                <LuChevronDown />
              </Button>
            </Stack>
            <Stack width="100%">
            <Typography variant="subtitle2" color="text.secondary" title={getSecondaryBalance().real.toString()}>
              Balance :{" "}
              <span style={{ color: theme.palette.info.main, fontSize: 16 }}>
                {(0 < Number(getSecondaryBalance().real)) && (Number(getSecondaryBalance().real) < 0.01) ? '< 0.01' : getSecondaryBalance().fmt}
              </span>
            </Typography>
            </Stack>
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
          {
            [swapFromToken.symbol, swapToToken.symbol].includes('USDC') &&
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" color="text.secondary">
                Testnet USDC
              </Typography>
              <Button
                sx={{
                  color: theme.palette.brand.nex1.main,
                  paddingRight: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
                onClick={faucet}
              >
                <Stack direction="row" alignItems="center">
                  <Typography variant="subtitle2">Get USDC</Typography>
                  <LuArrowUpRight />
                </Stack>
              </Button>
            </Stack>
          }

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="text.secondary">
              Fiat Payment
            </Typography>
            <Switch checked={isFiatPayment} onChange={handleFiatPaymentChange}></Switch>
          </Stack>

        </Stack>
        {swapToToken.hasOwnProperty("smartContractType") ? (
          <>
            {weiToNum(
              fromTokenAllowance.data,
              getDecimals(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token)
            ) < Number(firstInputValue) &&
              !isWETH(swapFromToken.tokenAddresses?.[chainName]?.[network]?.token?.address as Address, chainName, network) ?
              (<Button
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
        showNexProducts={showNexProductsFrom}
        showTokens={!showNexProductsFrom}
        onClose={handleCloseFromTokensModal}
        onSelect={(selectedToken) => {
          setSwapFromToken(selectedToken)
          handleCloseFromTokensModal()
        }}
      />
      {/* tokens modal for setting ToSwapToken */}
      <TokensModal
        open={openToTokensModal}
        showNexProducts={!showNexProductsFrom}
        showTokens={showNexProductsFrom}
        onClose={handleCloseToTokensModal}
        onSelect={(selectedToken) => {
          setSwapToToken(selectedToken)
          handleCloseToTokensModal()
        }}
      />

      <FiatPaymentModal
        open={isFiatPayment}
        onClose={handleFiatPaymentChange}
      />

      <FiatPaymentModal
        open={isFiatPayment}
        onClose={handleFiatPaymentChange}
      />
    </>
  )
}
