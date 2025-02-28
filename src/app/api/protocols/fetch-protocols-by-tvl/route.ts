import { NextRequest, NextResponse } from "next/server"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import axios from "axios"
import { AssetOverviewDocument } from "@/types/mongoDb"
import evmChainsNativeTokens from "../nativeTokenMapping"
// import { CmcV2Metadata } from "../../cmc/fetchCmcMetadata"

interface Query {
  date: string
  [key: string]: string | { $exists: boolean }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const chain = url.searchParams.get("chain")
  const nativeTokenParam = url.searchParams.get("nativeToken")
  const nativeTokenWeight = parseFloat(url.searchParams.get("nativeTokenWeight") || "0.15");
  const limit = parseInt(url.searchParams.get("limit") || "0", 10)

  let nativeToken: boolean | null = null;
  if (nativeTokenParam !== null) {
    if (nativeTokenParam.toLowerCase() === "true") {
      nativeToken = true;
    } else if (nativeTokenParam.toLowerCase() === "false") {
      nativeToken = false;
    } else {
      return NextResponse.json(
        { message: "nativeToken must be either 'true' or 'false'" },
        { status: 400 }
      );
    }
  }

  if (chain === null && nativeToken === true) {
    return NextResponse.json(
      { message: "mention chain for native token" },
      { status: 400 }
    );
  }

  if (isNaN(nativeTokenWeight) || nativeTokenWeight <= 0 || nativeTokenWeight >= 1) {
    return NextResponse.json(
      { message: "percentage should lie between 0 and 1" },
      { status: 400 }
    );
  }

  const { collection } = await DailyAssetsClient()

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Build the query
  const query: Query = { date: today }
  if (chain) {
    query["chainTvls." + chain] = { $exists: true }
  }

  // Fetch data from MongoDB
  const protocols = await collection
    .find(query)
    .sort({ tvl: -1 })
    .toArray()


  const protocolsWithTvl = protocols.filter(
    (protocol) => protocol.tvl !== undefined && protocol.tvl !== null
  )

  const commaSeparatedSymbols = protocolsWithTvl.map(protocol => protocol.ticker).join(',');

  const baseUrl = 'http://localhost:3000/api'
  const protocolsData = await axios.get(`${baseUrl}/protocols/fetch-asset-overview?tickers=${commaSeparatedSymbols}`)

  const protocolAvailableAddresses = protocolsData.data.assetOverview.filter((data: AssetOverviewDocument) => {
    const coinmarketCapContractAddressObj = data.coinmarketcap?.contract_address
    const arbitrumObj = coinmarketCapContractAddressObj?.find((data) => data.platform.name.toLowerCase() === 'arbitrum')
    return arbitrumObj?.contract_address
  })

  const protocolsWithAddresses = protocolsWithTvl
    .map((protocolData) => {
      const matchedProtocol = protocolAvailableAddresses.find(
        (data: AssetOverviewDocument) =>
          data.ticker === protocolData.ticker
      );

      if (matchedProtocol) {
        const coinmarketCapContractAddressObj = matchedProtocol.coinmarketcap?.contract_address
        const arbitrumObj = coinmarketCapContractAddressObj?.find((data: { platform: { name: string } }) => data.platform?.name.toLowerCase() === 'arbitrum')
        return {
          ...protocolData,
          arbitrum_address: arbitrumObj?.contract_address,
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, limit);


  // Calculate total TVL for weight calculation
  const totalTvl = protocolsWithAddresses.reduce(
    (sum, protocol) => sum + (protocol?.tvl || 0),
    0
  )

  const result = []

  if (nativeToken && chain) {
    result.push({
      name: chain,
      ticker: evmChainsNativeTokens[chain].nativeToken,
      weight: nativeTokenWeight,
      arbitrumOneAddress: evmChainsNativeTokens[chain].address,
    })
  }

  protocolsWithAddresses.forEach((protocol) => {
    const protocolWeight = protocol?.tvl ? protocol.tvl / totalTvl : 0
    result.push({
    name: protocol?.name,
    ticker: protocol?.ticker,
    tvl: protocol?.tvl,
    weight: nativeToken && chain ? (1- nativeTokenWeight) * protocolWeight : protocolWeight,
    arbitrumOneAddress: protocol?.arbitrum_address    
  })
})

  return NextResponse.json({
    message: "Protocols fetched successfully",
    data: result,
  })
}
