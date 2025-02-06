import { ReactElement } from "react"
import { MongoDb } from "./mongoDb"
export type Address = `0x${string}`

export enum SmartContractType {
  Stocks = "stocks",
  Defi = "defi",
  Crosschain = "crosschain",
}

export enum AssetCategory {
  Index = "index",
  Cryptocurrency = "cryptocurrency",
  Commodity = "commodity",
  Stock = "stock",
  Bond = "bond",
}

export type NexIndices = "ANFI" | "CRYPTO5" | "MAG7" | "ARBEI"
export type AllowedTickers =
  | NexIndices
  | "WETH"
  | "USDT"
  | "USDC"
  | "LINK"
  | "MATIC"
  | "THETER" //Morteza's token

export type ContractTypes =
  | "index"
  | "factory"
  | "token"
  | "storage"
  | "processor"
  | "vault"
  | "ccip"
  | "faucet"

export type Chains = "Ethereum" | "Arbitrum" | "Polygon"
export type Networks = "Mainnet" | "Goerli" | "Sepolia" | "Mumbai"

export type ChainNetwork = {
  chain: Chains
  network: Networks
}

export type ChainSelectorMap = {
  [chain in Chains]?: {
    [network in Networks]?: string
  }
}

export type TokenAddressMap = {
  [ticker in AllowedTickers]?: {
    [chain in Chains]?: {
      [network in Networks]?: {
        [type in ContractTypes]?: { address: Address; decimals?: number }
      }
    }
  }
}

export type PoolAddressMap = {
  [ticker in AllowedTickers]?: {
    [pairingToken in AllowedTickers]?: {
      [chain in Chains]?: {
        [network in Networks]?: string
      }
    }
  }
}

export type Asset = {
  name: string
  symbol: string
  columnName?: string //TODO: remove when no longer required
  logoComponent?: ReactElement
  logoString?: string
  shortDescription?: string
  description?: string
  category?: AssetCategory
  bgColor?: string
  hoverColor?: string
  marketInfo?: MarketInfo
  historicalPrice?: MongoDb[]
}

export type StockAsset = {
  symbol: string
  name: string
  cik?: string
  isin?: string
} & Omit<Asset, "category"> & {
    category: "stock"
  }

export type CryptoAsset = Asset & {
  address?: string
  factoryAddress?: string
  decimals?: number
  marketInfo?: MarketInfo
  tokenAddresses?: TokenAddressMap[AllowedTickers]
  poolAddresses?: PoolAddressMap
  smartContractInfo?: SmartContractInfo
}

export type MarketInfo = {
  marketCap?: number
  offChainPrice?: number
  change24h?: number
  change24hPer?: string
  volume?: number
}

export type SmartContractInfo = {
  poolPrice?: number
  underlyingAssetPrice?: number
  totalSupply?: number
  stakedSupply?: number
  managementFee?: number
  latestRebalanceUpdate?: string
}

export type AssetWithWeight = CryptoAsset & {
  weight?: number
}

export type IndexCryptoAsset = CryptoAsset & {
  smartContractType?: SmartContractType
  assets?: AssetWithWeight[]
}

export type Transaction = {
  side?: "send" | "receive"
  userAddress: string
  tokenAddress: string
  timestamp?: number
  inputAmount?: number
  outputAmount?: number
  tokenName: NexIndices | AllowedTickers
  txHash?: string
  messageId?: string
  nonce?: number
  status?: string
  recieveSideMessageId?: string
}

export type thirdwebReadContract = {
  data: bigint
  refetch: () => void
}
export type AssetOverviewDocument = {
  lastUpdate?: Date
  tradeStatus?: "active" | "upcoming" | "inactive"
  provider?: string[]
  description?: string
  name: string
  cik?: string
  isin?: string
  cusip?: string
  logo_url?: string
  ticker: string
}

export type DinariAssetDetails = {
  isFractionable: boolean
  id: string
  chainInfo?: {
    address: string
    chainId: string
    decimals: number
    is_active: boolean
    is_primary: boolean
  }[]
}
