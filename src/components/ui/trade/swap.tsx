'use client'

import { Stack, Box, Typography, Button, IconButton, Input } from "@mui/material";
import theme from "@/theme/theme";
import { useEffect, useState } from "react";

// assets : 
import { LuSettings2, LuChevronDown, LuArrowUpRight } from "react-icons/lu";
import { TbArrowsExchange2 } from "react-icons/tb";

import { BigNumber, ethers } from 'ethers'

// types:
import { Address, thirdwebReadContract, TokenObject } from "@/types/indexTypes";
import { useDashboard } from "@/providers/DashboardProvider";
import { sepoliaTokens } from "@/constants/tokens";
import { getDecimals, isWETH } from "@/utils/general";
import { useGlobal } from "@/providers/GlobalProvider";
import convertToUSDUni from "@/utils/convertToUSDUni";
import { GenericToast } from "../generic/genericToast";
import { formatNumber, formatToViewNumber, num, numToWei, weiToNum } from "@/utils/conversionFunctions";
import GetContract from "@/hooks/getContract";
import { tokenAddresses } from "@/constants/contractAddresses";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { allowance, balanceOf, totalSupply } from "thirdweb/extensions/erc20";
import { GetCrossChainPortfolioBalance } from "@/hooks/getCrossChainPortfolioBalance";
import { GetDefiPortfolioBalance } from "@/hooks/getDefiPortfolioBalance";
import { prepareContractCall, readContract, resolveMethod, ZERO_ADDRESS } from "thirdweb";
import Big from "big.js";
import { crossChainIndexFactoryV2Abi, stockFactoryStorageABI } from "@/constants/abi";
import { parseEther, parseUnits } from "@ethersproject/units";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "@/utils/thirdWebClient";
import { getClient } from "@/utils/getRPCClient";
import { toast } from "react-toastify";
import { getNewCrossChainPortfolioBalance } from "@/hooks/getNewCrossChainPortfolioBalance";


interface SwapProps {
    side?: 'buy' | 'sell';
    defaultToken?: TokenObject;
}

export default function Swap({ side = 'buy', defaultToken }: SwapProps) {

    const { activeChainSetting: { network, chain }, userAddress, activeThirdWebChain } = useGlobal()
    const { ethPriceUsd, nexTokens } = useDashboard()

    const [autoValue, setAutoValue] = useState<'min' | 'half' | 'max' | 'auto'>('auto')

    const [firstInputValue, setFirstInputValue] = useState('')
    const [secondInputValue, setSecondInputValue] = useState('')
    const [from1UsdPrice, setFrom1UsdPrice] = useState(0)
    // const [fromDollarPrice, setFromDollarPrice] = useState(0)
    const [to1UsdPrice, setTo1UsdPrice] = useState(0)
    // const [toDollarPrice, setToDollarPrice] = useState(0)
    const [coinsList, setCoinsList] = useState<TokenObject[]>([])
    const [mergedCoinList, setMergedCoinList] = useState<TokenObject[][]>([[], []])
    const [feeRate, setFeeRate] = useState(0)
    const [currentPortfolioValue, setCurrentPortfolioBalance] = useState(0)
    const [userEthBalance, setUserEthBalance] = useState(0)

    const sepoliaPublicClient = getClient('sepolia')
    const [swapFromToken, setSwapFromToken] = useState<TokenObject>(
        [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'USDT') as TokenObject
    );

    const [swapToToken, setSwapToToken] = useState<TokenObject>(
        [...nexTokens, ...sepoliaTokens].find((token) => token.symbol === 'ANFI') as TokenObject
    );


    useEffect(() => {
        const selectedCoin = defaultToken?.symbol || 'ANFI'
        const coinDetails = [...nexTokens, ...sepoliaTokens].filter((coin: TokenObject) => {
            return coin.symbol === selectedCoin
        })
        setSwapToToken(coinDetails[0])
    }, [defaultToken, nexTokens])


    useEffect(() => {
        async function fetchData(tokenDetails: TokenObject) {
            try {
                const address = tokenDetails.tokenAddresses?.[chain]?.[network]?.index?.address as Address
                const decimals = getDecimals(tokenDetails.tokenAddresses?.[chain]?.[network]?.index)

                const price = await convertToUSDUni(address, decimals, ethPriceUsd, network)
                return price as number
            } catch (err) {
                console.error(`Error fetching price:`, err)
                throw err // Rethrow the error for consistent error handling
            }
        }

        async function fetchTokenPrices() {
            try {
                const [fromPrice, toPrice] = await Promise.all([
                    fetchData(swapFromToken), fetchData(swapToToken),
                ])
                setFrom1UsdPrice(fromPrice)
                setTo1UsdPrice(toPrice)
            } catch (error) {
                // Handle errors if needed
                console.error('Error fetching token prices:', error)
            }
        }

        // Call fetchTokenPrices when needed
        fetchTokenPrices()
    }, [swapFromToken, swapToToken, ethPriceUsd, chain, network])

    const resetFirstValue = () => {
        setFirstInputValue('')
    }
    const resetSecondValue = () => {
        setSecondInputValue('')
    }

    const fetchAllLiFiTokens = async () => {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json' },
        }
        try {
            const response = await fetch(`https://li.quest/v1/tokens`, options)
            const data = await response.json()

            const tokenSets = data.tokens
            const coins: TokenObject[] = Object.keys(tokenSets).flatMap((key) => {
                const tokenSet = tokenSets[key]
                return tokenSet.map((coin: { address: Address; logoURI: string; name: string; symbol: string; decimals: number }) => ({
                    id: coin.address,
                    logo: coin.logoURI && coin.logoURI != '' ? coin.logoURI : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkV1AbgRiM148jZcCVDvdFhjx_vfKVS055A&usqp=CAU',
                    name: coin.name,
                    Symbol: coin.symbol,
                    address: coin.address,
                    factoryAddress: '',
                    decimals: coin.decimals,
                }))
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
        const finalCoinList = network === 'Mainnet' ? coinsList : (sepoliaTokens as TokenObject[])
        const OurIndexCoinList: TokenObject[] = finalCoinList.filter((coin) => coin.hasOwnProperty('smartContractType'))
        let OtherCoinList: TokenObject[] = finalCoinList.filter((coin) => !coin.hasOwnProperty('smartContractType'))

        if (swapToToken.symbol === 'MAG7' || swapFromToken.symbol === 'MAG7') {
            OtherCoinList = OtherCoinList.filter((coin) => {
                return coin.symbol !== 'USDT'
            })
            const usdcDetails = OtherCoinList.filter((coin) => {
                return coin.symbol === 'USDC'
            })[0]
            const usdtDetails = OtherCoinList.filter((coin) => {
                return coin.symbol === 'USDT'
            })[0]
            if (swapToToken.symbol === 'MAG7') {
                setSwapFromToken(usdcDetails)
            } else {
                setSwapFromToken(usdtDetails)
            }
        }
        setMergedCoinList([OtherCoinList, OurIndexCoinList])
    }, [network, swapToToken.symbol, swapFromToken.symbol, coinsList])

    function Switching() {
        const switchReserve: TokenObject = swapFromToken
        setSwapFromToken(swapToToken)
        setSwapToToken(switchReserve)
        if (switchReserve.hasOwnProperty('smartContractType')) {
            if (mergedCoinList[0].some((obj) => obj.hasOwnProperty('smartContractType'))) {
                const newArray = [mergedCoinList[1], mergedCoinList[0]]
                setMergedCoinList(newArray)
            } else {
                const newArray = [mergedCoinList[0], mergedCoinList[1]]
                setMergedCoinList(newArray)
            }
        } else {
            if (mergedCoinList[0].some((obj) => obj.hasOwnProperty('smartContractType'))) {
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
        setAutoValue('auto')
        const enteredValue = e?.target?.value
        if (Number(enteredValue) != 0 && Number(enteredValue) < 0.00001) {
            GenericToast({
                type: 'error',
                message: 'Please enter the input value greater than this value...',
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
        const convertedAmout = (Number(from1UsdPrice) / Number(to1UsdPrice)) * Number(firstInputValue)
        if (network == 'Mainnet') {
            setSecondInputValue(convertedAmout.toString())
        }
    }, [from1UsdPrice, to1UsdPrice, firstInputValue, network])

    const changeSecondInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecondInputValue(e?.target?.value)
    }

    function getPrimaryBalance() {
        if (isWETH(swapFromToken.tokenAddresses?.Ethereum?.[network]?.index?.address as Address)) {
            if (!userEthBalance) {
                return 0
            } else
                return formatToViewNumber({
                    value: Number(ethers.utils.formatEther(userEthBalance.toString())) as number,
                    returnType: 'string',
                })
        } else {
            if (!fromTokenBalance?.data) {
                return 0
            } else {
                const bal = formatToViewNumber({
                    value: Number(fromTokenBalance?.data) / Number(`1e${getDecimals(swapFromToken.tokenAddresses?.Ethereum?.[network]?.index)}`),
                    returnType: 'string',
                }).toString()
                const balWithoutComma = bal.includes(',') ? bal.split(',').join('') : bal
                return balWithoutComma
            }
        }
    }

    function getSecondaryBalance() {
        if (isWETH(swapToToken.tokenAddresses?.Ethereum?.[network]?.index?.address as Address)) {
            if (!userEthBalance) {
                return 0
            } else
                return formatToViewNumber({
                    value: parseFloat(ethers.utils.formatEther(userEthBalance.toString())) as number,
                    returnType: 'string',
                })
        } else {
            if (!toTokenBalance?.data) {
                return 0
            } else
                return formatToViewNumber({
                    value: Number(toTokenBalance.data) / Number(`1e${getDecimals(swapToToken.tokenAddresses?.Ethereum?.[network]?.index)}`),
                    returnType: 'string',
                })
        }
    }

    const factoryContract = swapFromToken.hasOwnProperty('smartContractType') ? swapFromToken.tokenAddresses?.[chain]?.[network]?.factory?.address : swapToToken.tokenAddresses?.[chain]?.[network]?.factory?.address
    const indexTokenFactoryContract = GetContract(factoryContract as Address)

    const faucetContract = GetContract(tokenAddresses.USDT?.[chain]?.[network]?.faucet?.address as Address)
    // const mag7FactoryContract = GetContract(tokenAddresses.MAG7?.[chain]?.[network]?.factory?.address as Address)
    const mag7StorageContract = GetContract(tokenAddresses.MAG7?.[chain]?.[network]?.storage?.address as Address)
    const cr5FactoryContract = GetContract(tokenAddresses.CRYPTO5?.[chain]?.[network]?.factory?.address as Address)

    const fromTokenContract = GetContract(swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)
    const toTokenContract = GetContract(swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)


    const fromTokenBalance = useReadContract(balanceOf, {
        contract: fromTokenContract,
        address: userAddress as Address,
    }) as thirdwebReadContract

    const toTokenBalance = useReadContract(balanceOf, {
        contract: toTokenContract,
        address: userAddress as Address,
    }) as thirdwebReadContract

    const fromTokenTotalSupply = useReadContract(totalSupply, { contract: fromTokenContract }) as thirdwebReadContract
    const toTokenTotalSupply = useReadContract(totalSupply, { contract: toTokenContract }) as thirdwebReadContract

    const fromTokenAllowance = useReadContract(allowance, {
        contract: toTokenContract,
        owner: userAddress as Address,
        spender: swapToToken.tokenAddresses?.[chain]?.[network]?.factory?.address as Address
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
        if (swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address == ZERO_ADDRESS) {
            return GenericToast({ type: 'info', message: 'Index will be live for trading soon, Stay Tuned!' })
        }

        let dinariFeeAmount = 0
        if (swapToToken.smartContractType === 'stocks') {
            const feeAmountBigNumber = (await sepoliaPublicClient.readContract({
                address: tokenAddresses.MAG7?.[chain]?.[network]?.storage?.address as Address,
                abi: stockFactoryStorageABI,
                functionName: 'calculateIssuanceFee',
                args: [numToWei(firstInputValue, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index))],
            })) as BigNumber

            dinariFeeAmount = weiToNum(feeAmountBigNumber, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index))
        }

        const firstInputValueNum = new Big(firstInputValue)
        const result = firstInputValueNum.times(1.001).plus(dinariFeeAmount)
        const valueWithCorrectDecimals = result.toFixed(getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index))

        // Convert to BigNumber using parseUnits
        const convertedValue = parseUnits(valueWithCorrectDecimals, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index))

        try {
            if (weiToNum(fromTokenBalance.data, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)) < Number(firstInputValue)) {
                return GenericToast({
                    type: 'error',
                    message: `You don't have enough ${swapFromToken.symbol} balance!`,
                })
            } else if (Number(firstInputValue) <= 0) {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount you want to approve`,
                })
            } else if (Number(firstInputValue) <= 15 && swapToToken.smartContractType === 'stocks') {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount greater than $15`,
                })
            }

            const transaction = prepareContractCall({
                contract: fromTokenContract,
                method: resolveMethod('approve'),
                params: [swapToToken.tokenAddresses?.[chain]?.[network]?.factory?.address, BigInt(convertedValue.toString())],
            })            

            approveHook.mutate(transaction)
        } catch (error) {
            console.log('approve error', error)
        }
    }

    async function mintRequest() {
        if (swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address == ZERO_ADDRESS) {
            return GenericToast({ type: 'info', message: 'Index will be live for trading soon, Stay Tuned!' })
        }

        if (isWETH(swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)) {
            mintRequestEth()
        } else {
            mintRequestTokens()
        }
    }
    async function mintRequestTokens() {
        try {
            if (weiToNum(fromTokenBalance.data, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)) < Number(firstInputValue)) {
                return GenericToast({
                    type: 'error',
                    message: `You don't have enough ${swapFromToken.symbol} balance!`,
                })
            } else if (Number(firstInputValue) <= 0) {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount you want to mint`,
                })
            } else if (Number(firstInputValue) <= 15 && swapToToken.smartContractType === 'stocks') {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount greater than $15`,
                })
            }

            if (swapToToken.smartContractType === 'defi') {


                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('issuanceIndexTokens'),
                    params: [swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address, parseEther(Number(firstInputValue).toString()), '3'],
                })

                mintRequestHook.mutate(transaction)

            } else if (swapToToken.smartContractType === 'stocks') {
                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('issuanceIndexTokens'),
                    params: [parseUnits(Number(firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)).toString()],
                })
                mintRequestHook.mutate(transaction)

            } else {


                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('issuanceIndexTokens'),
                    params: [swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address, parseEther(Number(firstInputValue).toString()), '0', '3'],
                })
                mintRequestHook.mutate(transaction)
            }
        } catch (error) {
            console.log('mint error', error)
        }
    }

    async function mintRequestEth() {
        try {
            const convertedValue = parseEther(((Number(firstInputValue) * 1001) / 1000).toString() as string)
            if (num(userEthBalance) < Number(firstInputValue)) {
                return GenericToast({
                    type: 'error',
                    message: `You don't have enough ${swapFromToken.symbol} balance!`,
                })
            } else if (Number(firstInputValue) <= 0) {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount you want to mint`,
                })
            }
            if (swapToToken.smartContractType === 'defi') {

                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('issuanceIndexTokensWithEth'),
                    params: [parseEther(Number(firstInputValue).toString())],
                    value: BigInt(convertedValue.toString())
                })
                mintRequestEthHook.mutate(transaction)


            } else {
                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('issuanceIndexTokensWithEth'),
                    params: [parseEther(Number(firstInputValue).toString()), '0'],
                    value: BigInt(convertedValue.toString()),
                })
                mintRequestEthHook.mutate(transaction)
            }

        } catch (error) {
            console.log('mint error', error)
        }
    }

    async function burnRequest() {
        try {
            if (weiToNum(fromTokenBalance.data, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)) < Number(firstInputValue)) {
                return GenericToast({
                    type: 'error',
                    message: `You don't have enough ${swapFromToken.symbol} balance!`,
                })
            } else if (Number(firstInputValue) <= 0) {
                return GenericToast({
                    type: 'error',
                    message: `Please enter amount you want to burn`,
                })
            } else if (Number(secondInputValue) <= 15 && swapFromToken.smartContractType === 'stocks') {
                return GenericToast({
                    type: 'error',
                    message: `Minimum USDC that you can get is $15`,
                })
            }
            if (swapFromToken.smartContractType === 'defi') {

                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('redemption'),
                    params: [parseEther(Number(firstInputValue).toString()), swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address, '3'],

                })
                burnRequestHook.mutate(transaction)

            } else if (swapFromToken.smartContractType === 'stocks') {

                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('redemption'),
                    params: [parseUnits(Number(firstInputValue).toString(), getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)).toString()],

                })
                burnRequestHook.mutate(transaction)

            } else {

                const transaction = prepareContractCall({
                    contract: indexTokenFactoryContract,
                    method: resolveMethod('redemption'),
                    params: [parseEther(Number(firstInputValue).toString()), '0', getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index), '3'],

                })
                burnRequestHook.mutate(transaction)
            }
        } catch (error) {
            console.log('burn error', error)
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
                    method: 'function getToken(address)',
                    params: [tokenAddresses.USDT?.[chain]?.[network]?.index?.address as Address],

                })
                faucetHook.mutate(transaction)
            } catch (error) {
                console.log('faucet error', error)
            }
        }
    }



    useEffect(() => {
        async function getFeeRate() {
            const activeSymbol = swapFromToken.hasOwnProperty('smartContractType') ? swapFromToken.symbol : swapToToken.symbol
            const feeRate = await sepoliaPublicClient.readContract({
                address: activeSymbol !== 'MAG7' ? tokenAddresses?.[activeSymbol]?.[chain]?.[network]?.factory?.address as Address : tokenAddresses?.[activeSymbol]?.[chain]?.[network]?.storage?.address as Address,
                abi: stockFactoryStorageABI,
                functionName: 'feeRate',
                args: [],
            })

            setFeeRate(Number(feeRate) / 10000)
        }

        getFeeRate()
    }, [swapFromToken, swapToToken, network, sepoliaPublicClient, chain])

    useEffect(() => {
        const currentPortfolioValue = swapToToken.smartContractType === 'defi' || swapFromToken.smartContractType === 'defi' ? defiPortfolioValue.data : (crossChainPortfolioValue.data as number)
        setCurrentPortfolioBalance(currentPortfolioValue as number)
    }, [crossChainPortfolioValue.data, defiPortfolioValue.data, swapToToken.smartContractType, swapFromToken.smartContractType])

    useEffect(() => {
        async function getIssuanceOutput2() {
            try {
                if (firstInputValue === '') {
                    resetSecondValue()
                    return
                }
                const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0
                if (swapToToken.hasOwnProperty('smartContractType')) {
                    const currentTotalSupply = Number(toTokenTotalSupply.data)
                    let inputValue
                    if (isWETH(swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)) {
                        inputValue = Number(firstInputValue) * 1e18
                    } else {
                        if (swapToToken.smartContractType === 'stocks') {
                            const outAmount = await sepoliaPublicClient.readContract({
                                address: tokenAddresses.MAG7?.[chain]?.[network]?.storage?.address as Address,
                                abi: stockFactoryStorageABI,
                                functionName: 'getIssuanceAmountOut',
                                args: [numToWei(firstInputValue, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index))],
                            })
                            setSecondInputValue(weiToNum(outAmount, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)).toFixed(2))
                        } else if (convertedInputValue) {
                            const inputEthValue = await sepoliaPublicClient.readContract({
                                address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.factory?.address as Address,
                                abi: crossChainIndexFactoryV2Abi,
                                functionName: 'getAmountOut',
                                args: [swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address, tokenAddresses.WETH?.[chain]?.[network]?.index?.address, convertedInputValue, 3],
                            })

                            inputValue = Number(inputEthValue)

                            let newPortfolioValue: number = 0
                            if (swapToToken.smartContractType === 'crosschain') {
                                newPortfolioValue = await getNewCrossChainPortfolioBalance(Number(currentPortfolioValue), Number(inputValue))
                            } else {
                                newPortfolioValue = Number(currentPortfolioValue) + Number(inputValue)
                            }
                            const newTotalSupply = (currentTotalSupply * newPortfolioValue) / Number(currentPortfolioValue)
                            const amountToMint = newTotalSupply - currentTotalSupply
                            setSecondInputValue(num(amountToMint).toString())
                        }
                    }
                }
            } catch (error) {
                console.log('getIssuanceOutput error:', error)
            }
        }
        getIssuanceOutput2()
    }, [firstInputValue, swapFromToken, chain, swapToToken, setSecondInputValue, toTokenTotalSupply.data, defiPortfolioValue.data, crossChainPortfolioValue.data, network, currentPortfolioValue, sepoliaPublicClient])

    useEffect(() => {
        async function getRedemptionOutput2() {
            try {

                if (firstInputValue === '') {
                    resetSecondValue()
                    return
                }
                if (swapFromToken.hasOwnProperty('smartContractType')) {
                    const convertedInputValue = firstInputValue ? parseEther(Number(firstInputValue)?.toString() as string) : 0
                    let outputValue
                    const currentTotalSupply = Number(fromTokenTotalSupply.data)
                    const newTotalSupply = currentTotalSupply - Number(convertedInputValue)
                    const newPortfolioValue = (Number(currentPortfolioValue) * newTotalSupply) / currentTotalSupply
                    const ethAmountOut = (Number(currentPortfolioValue) - newPortfolioValue) * 0.999
                    if (isWETH(swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)) {
                        outputValue = ethAmountOut
                    } else {
                        if (swapFromToken.smartContractType === 'stocks') {

                            const outAmount = await readContract({
                                contract: mag7StorageContract,
                                method: 'function getRedemptionAmountOut(uint256) returns (uint256)',
                                params: [BigInt(firstInputValue)]
                            })

                            setSecondInputValue(weiToNum(outAmount, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)).toString())
                        } else {
                            const outPutTokenValue = await readContract({
                                contract: cr5FactoryContract,
                                method: 'function getAmountOut(address, address, uint256, uint256 ) returns (uint256)',
                                params: [
                                    tokenAddresses.WETH?.[chain]?.[network]?.index?.address as Address,
                                    swapToToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address,
                                    BigInt(Math.floor(ethAmountOut)), // Convert ethAmountOut to bigint
                                    BigInt(3),
                                ],
                            })

                            outputValue = Number(outPutTokenValue)
                            setSecondInputValue(weiToNum(outputValue, getDecimals(swapToToken.tokenAddresses?.[chain]?.[network]?.index)).toString())
                        }
                    }
                }
            } catch (error) {
                console.log('getRedemptionOutput error:', error)
            }
        }
        getRedemptionOutput2()
    }, [firstInputValue, cr5FactoryContract, mag7StorageContract, swapFromToken, chain, swapToToken, setSecondInputValue, network, currentPortfolioValue, fromTokenTotalSupply.data, sepoliaPublicClient])

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
                type: 'loading',
                message: 'Receiving usdt...',
            })
        } else if (faucetHook.isSuccess) {
            toast.dismiss()
            GenericToast({
                type: 'success',
                message: 'You received 1000 usdt Successfully!',
            })
        } else if (faucetHook.isError) {
            toast.dismiss()
            GenericToast({
                type: 'error',
                message: `Receiving Failed!`,
            })
        }
    }, [faucetHook.isPending, faucetHook.isSuccess, faucetHook.isError])

    useEffect(() => {
        if (approveHook.isPending) {
            toast.dismiss()
            GenericToast({
                type: 'loading',
                message: 'Approving...',
            })
        } else if (approveHook.isSuccess) {
            toast.dismiss()
            GenericToast({
                type: 'success',
                message: 'Approved Successfully!',
            })
        } else if (approveHook.isError) {
            toast.dismiss()
            GenericToast({
                type: 'error',
                message: `Approving Failed!`,
            })
        }
    }, [approveHook.isPending, approveHook.isSuccess, approveHook.isError])

    useEffect(() => {
        if (cancelMintRequestHook.isPending || cancelBurnRequestHook.isPending) {
            toast.dismiss()
            GenericToast({
                type: 'loading',
                message: 'Cancelling...',
            })
        } else if (cancelMintRequestHook.isSuccess || cancelBurnRequestHook.isSuccess) {
            toast.dismiss()
            GenericToast({
                type: 'success',
                message: 'Sent Cancel Request Successfully!',
            })
        } else if (cancelMintRequestHook.isError || cancelBurnRequestHook.isError) {
            toast.dismiss()
            GenericToast({
                type: 'error',
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
                type: 'loading',
                message: 'Sending Request ...',
            })
        } else if (mintRequestHook.isSuccess || mintRequestEthHook.isSuccess) {
            toast.dismiss()
            GenericToast({
                type: 'success',
                message: 'Sent Request Successfully!',
            })
        } else if (mintRequestHook.isError || mintRequestEthHook.isError) {
            toast.dismiss()
            console.log(mintRequestHook.error)
            GenericToast({
                type: 'error',
                message: `Sending Request Failed!`,
            })
        }
    }, [mintRequestHook.isPending, mintRequestHook.error, mintRequestEthHook.isPending, mintRequestHook.isSuccess, mintRequestEthHook.isSuccess, mintRequestHook.isError, mintRequestEthHook.isError])

    useEffect(() => {
        if (burnRequestHook.isPending) {
            toast.dismiss()

            GenericToast({
                type: 'loading',
                message: 'Sending Request ...',
            })
        } else if (burnRequestHook.isSuccess) {
            toast.dismiss()
            GenericToast({
                type: 'success',
                message: 'Sent Request Successfully!',
            })
        } else if (burnRequestHook.isError) {
            toast.dismiss()
            GenericToast({
                type: 'error',
                message: 'Sending Request Failed!',
            })
        }
    }, [burnRequestHook.isPending, burnRequestHook.isSuccess, burnRequestHook.isError])

    useEffect(() => {
        const getEtherBalance = async () => {

            if (userAddress) {
                // Get the balance of the account
                const balance = await getWalletBalance({
                    address: userAddress as Address,
                    client,
                    chain: activeThirdWebChain,
                });
                setUserEthBalance(num(balance.value))
            }
        }
        getEtherBalance()
    }, [userAddress, activeThirdWebChain])

    return (
        <Stack width="100%" gap={2} sx={{
            backgroundColor: theme.palette.elevations.elevation950.main,
            border: `1px solid ${theme.palette.elevations.elevation800.main}`,
            borderRadius: 2,
            padding: 2,
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" color="primary">
                    {side === 'buy' ? 'Buy' : 'Sell'} {defaultToken?.symbol}
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                    <IconButton size="small" color="primary" onClick={Switching} sx={{
                        borderRadius: '50%',
                        border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                        padding: 1,
                    }}>
                        <TbArrowsExchange2 />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{
                        borderRadius: '50%',
                        border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                        padding: 1,
                    }}>
                        <LuSettings2 />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="end" justifyContent="space-between" gap={2}>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Button variant="contained" size="small" sx={{
                        backgroundColor: autoValue === 'min' ? theme.palette.brand.nex1.main : theme.palette.elevations.elevation700.main,
                        padding: 0.5,
                    }} onClick={() => {
                        setAutoValue('min')
                        if (isWETH(swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address)) {
                            setFirstInputValue('0.00001')
                        } else setFirstInputValue('1')
                    }}>
                        MIN
                    </Button>
                    <Button variant="contained" size="small" sx={{
                        backgroundColor: autoValue === 'half' ? theme.palette.brand.nex1.main : theme.palette.elevations.elevation700.main,
                        padding: 0.5,
                    }} onClick={() => {
                        setAutoValue('half')
                        setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
                    }}>
                        HALF
                    </Button>
                    <Button variant="contained" size="small" sx={{
                        backgroundColor: autoValue === 'max' ? theme.palette.brand.nex1.main : theme.palette.elevations.elevation700.main,
                        padding: 0.5,
                    }} onClick={() => {
                        setAutoValue('max')
                        setFirstInputValue(Number(getPrimaryBalance()).toString())
                    }}>
                        MAX
                    </Button>
                </Stack>
                <Typography variant="subtitle2" color="text.secondary">
                    Balance : <span style={{ color: theme.palette.info.main, fontSize: 16 }}>{getPrimaryBalance()}</span>
                </Typography>
            </Stack>
            <Stack gap={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{
                    border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                    borderRadius: 2,
                    padding: 2,
                }}>
                    <Input
                        disableUnderline
                        size="small"
                        placeholder="0.00"
                        sx={{
                            width: '50%',
                            border: 'none',
                            outline: 'none',
                            '& .MuiInputBase-input': {
                                paddingY: 1,
                                paddingX: 0.5,
                                fontSize: 20,
                            },
                        }}
                        onChange={changeFirstInputValue}
                        value={firstInputValue}
                    />
                    <Stack direction="row" alignItems="center" gap={1} paddingX={1} paddingY={0.5} sx={{
                        backgroundColor: theme.palette.elevations.elevation900.main,
                        borderRadius: 2,
                    }}>
                        <Box width={36} height={36} sx={{
                            backgroundImage: `url(${swapFromToken.logo})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                        </Box>
                        <Stack>
                            <Typography variant="h6">
                                {swapFromToken.symbol}
                            </Typography>
                            <Typography variant="caption">
                                {network}
                            </Typography>
                        </Stack>
                        <LuChevronDown />
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="end" justifyContent="space-between" gap={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {/* Allowance : <span style={{ color: theme.palette.info.main, fontSize: 16 }}>{num(fromTokenAllowance.data)}</span> */}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Balance : <span style={{ color: theme.palette.info.main, fontSize: 16 }}>{getSecondaryBalance()}</span>
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{
                    border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                    borderRadius: 2,
                    padding: 2,
                }}>
                    <Input
                        disableUnderline
                        size="small"
                        placeholder="0.00"
                        sx={{
                            width: '50%',
                            border: 'none',
                            outline: 'none',
                            '& .MuiInputBase-input': {
                                paddingY: 1,
                                paddingX: 0.5,
                                fontSize: 20,
                            },
                        }}
                        onChange={changeSecondInputValue}
                        value={formatNumber(Number(secondInputValue))}
                    />
                    <Stack direction="row" alignItems="center" gap={1} paddingX={1} paddingY={0.5} sx={{
                        backgroundColor: theme.palette.elevations.elevation900.main,
                        borderRadius: 2,
                    }}>
                        <Box width={36} height={36} sx={{
                            backgroundImage: `url(${swapToToken?.logo})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                        </Box>
                        <Stack>
                            <Typography variant="h6">
                                {swapToToken?.symbol}
                            </Typography>
                            <Typography variant="caption">
                                {network}
                            </Typography>
                        </Stack>
                        <LuChevronDown />
                    </Stack>
                </Stack>
            </Stack>
            <Stack gap={0.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="text.secondary">
                        Platform Fees
                    </Typography>
                    <Typography variant="subtitle2">
                        {formatToViewNumber({ value: Number(firstInputValue) * feeRate, returnType: 'string' })} {swapFromToken.symbol} ({feeRate * 100} %)
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="text.secondary">
                        Testnet USDC
                    </Typography>
                    <Button sx={{
                        color: theme.palette.brand.nex1.main
                    }}
                        onClick={faucet}
                    >

                        <Stack direction="row" alignItems="center">
                            <Typography variant="subtitle2">
                                Get USDT
                            </Typography>
                            <LuArrowUpRight />
                        </Stack>
                    </Button>
                </Stack>
            </Stack>
            {swapToToken.hasOwnProperty('smartContractType') ? (
                <>
                    {weiToNum(fromTokenAllowance.data, getDecimals(swapFromToken.tokenAddresses?.[chain]?.[network]?.index)) < Number(firstInputValue) && !isWETH(swapFromToken.tokenAddresses?.[chain]?.[network]?.index?.address as Address) ? (

                        <Button fullWidth variant="contained" sx={{
                            backgroundColor: Number(firstInputValue) ? theme.palette.brand.nex1.main : theme.palette.elevations.elevation800.main,
                            color: Number(firstInputValue) ? theme.palette.info.main : theme.palette.elevations.elevation400.main,
                            textTransform: 'capitalize',
                        }}
                            onClick={approve}
                        >
                            <Typography variant="h6">
                                Approve
                            </Typography>
                        </Button>
                    ) : (
                        <Button fullWidth variant="contained" sx={{
                            backgroundColor: Number(firstInputValue) > 0 ? theme.palette.brand.nex1.main : theme.palette.elevations.elevation800.main,
                            color: Number(firstInputValue) ? theme.palette.info.main : theme.palette.elevations.elevation400.main,
                            textTransform: 'capitalize',
                        }}
                            onClick={mintRequest}
                        >
                            <Typography variant="h6">
                                Mint
                            </Typography>
                        </Button>
                    )}
                </>
            ) : (
                <Button fullWidth variant="contained" sx={{
                    backgroundColor: Number(firstInputValue) ? theme.palette.brand.nexRed.main : theme.palette.elevations.elevation800.main,
                    color: Number(firstInputValue) ? theme.palette.info.main : theme.palette.elevations.elevation400.main,
                    textTransform: 'capitalize',
                }}
                    onClick={burnRequest}
                >
                    <Typography variant="h6">
                        Burn
                    </Typography>
                </Button>
            )}
        </Stack>
    );
}