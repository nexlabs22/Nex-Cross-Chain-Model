import { Stack, Container, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { PWAGradientStack } from "@/theme/overrides";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown, IoMdLink } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";
import Divider from '@mui/material/Divider';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import usePortfolioPageStore from '@/store/portfolioStore'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'
import etherscan from '@assets/images/etherscan2.png'
import ccip from '@assets/images/ccip.png'
import chainlink from '@assets/images/chainlink.png'
import { useLandingPageStore } from '@/store/store'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime, reduceAddress } from '@/utils/general'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetPositionsHistoryCrossChain } from '@/hooks/getPositiontHistoryCrosschain'
import { useAddress } from '@thirdweb-dev/react'

function PWAProfileHistoryList() {
	const address = useAddress()
	const { mode } = useLandingPageStore()
	const { swapFromCur, swapToCur, setTradeTableReload, tradeTableReload, crosschainTableReload, setEthPriceInUsd, ethPriceInUsd, isMainnet } = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()

	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain()

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [combinedPositionTableData, setCombinedPositionTableData] = useState<PositionType[]>([])
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	const activeIndexType = swapFromCur?.indexType === 'defi' || swapToCur?.indexType === 'defi' ? 'defi' : 'crosschain'

	useEffect(() => {
		const crossChainRequests = positionHistoryCrosschain.requests
		const crossChainHistory = positionHistoryCrosschain.history

		const activeRequests = crossChainRequests.filter((data) => {
			const isExist = crossChainHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...crossChainHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableData)) {
			setCombinedPositionTableData(combinedData)
		}
	}, [positionHistoryCrosschain])

	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))

	useEffect(() => {
		const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.history)
		setPortfolioData(combinedData)
	}, [setEthPriceInUsd, setPortfolioData, positionHistoryDefi.data, positionHistoryCrosschain.history])

	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : combinedPositionTableData
			const dataToShow = data.filter((data: { indexName: string }) => {
				return data.indexName === activeTicker[0]
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (path === '/portfolio' || path === '/history') {
			const data = positionHistoryCrosschain.history.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			setPositionHistoryData(data)
		} else if (path === '/assetActivity') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistoryDefi.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, combinedPositionTableData])

	useEffect(() => {
		if (tradeTableReload) {
			activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
			setTradeTableReload(false)
		}
	}, [positionHistoryDefi, setTradeTableReload, tradeTableReload, activeIndexType, positionHistoryCrosschain])

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({ tokenAddress: token.address, tokenDecimals: token.decimals }, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: PositionType[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
				sendStatus: '',
				receiveStatus: '',
			}
	)

	useEffect(() => {
        console.log(dataToShow)
    }, [dataToShow])

	return (
		<Stack id="PWAProfileHistory" width={"100%"} height={"fit-content"} minHeight={"100vh"} marginTop={1} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Transactions History
                </Typography>
                <Menu transition direction="bottom" align="end" position="anchor" menuButton={
                    <MenuButton className={"w-fit"}>
                        <Stack width={"100%"} height={"fit-content"} paddingY={0.5} paddingX={1} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>

                            <RiDownloadLine size={22} color={lightTheme.palette.text.primary}></RiDownloadLine>
                        </Stack>

                    </MenuButton>
                }>
                    <MenuItem>
                        <Typography variant="subtitle1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Export to PDF
                        </Typography>
                    </MenuItem>
                    <MenuItem >
                        <Typography variant="subtitle1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Export to CSV
                        </Typography>
                    </MenuItem>

                </Menu>
            </Stack>
            {
                address ? (
                    <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={1} marginY={2} sx={{
                        overflowY: "scroll"
                    }}>
                        {dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
                            return (
                                <Stack key={i} width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} borderRadius={"1.2rem"} paddingY={1} paddingX={1.5} sx={PWAGradientStack}>
                                    <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} width={"fit-content"} height={"fit-content"} gap={2}>
                                            <Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"/>
                                            <Stack direction={"column"} width={"fit-content"} height={"fit-content"} gap={1}>
                                                <Typography variant="caption" sx={{
                                                    color: lightTheme.palette.text.primary,
                                                    fontWeight: 600,
                                                }}>
                                                    ANFI
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: lightTheme.palette.text.primary,
                                                    fontWeight: 500,
                                                }}>
                                                    {position.nonce}
                                                    Amount: 5.42 ANFI
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: lightTheme.palette.text.primary,
                                                    fontWeight: 500,
                                                }}>
                                                    Fees: $24.5
                                                </Typography>
                                            </Stack>

                                        </Stack>
                                        <Stack paddingRight={1} direction={"column"} width={"fit-content"} height={"fit-content"} gap={1} alignItems={"end"} justifyContent={"center"}>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                                fontWeight: 600,
                                            }}>
                                                Total: $133.6
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                                fontWeight: 500,
                                            }}>
                                                27/05/24
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.nexGreen.main,
                                                fontWeight: 500,
                                            }}>
                                                Successful
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack width={"100%"} height={"fit-content"} borderTop={"solid 1px #252525"} marginTop={2} paddingTop={2} paddingBottom={1} direction={"row"} alignItems={"center"} justifyContent={"center"} divider={<Divider orientation="vertical" sx={{ backgroundColor: lightTheme.palette.text.primary }} flexItem />} gap={2}>
                                        <Stack width={"50%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}>
                                            <IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
                                            <Typography variant="caption" sx={{
                                                color: lightTheme.palette.text.primary,
                                                fontWeight: 600,
                                            }}>
                                                Etherscan
                                            </Typography>
                                        </Stack>


                                    </Stack>
                                </Stack>
                            )
                        })}
                    </Stack>
                ) : ("")
            }
        </Stack>
	)
}

export default PWAProfileHistoryList
