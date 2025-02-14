import { ReactElement } from "react"
import { PublicClient } from 'viem'
import { ObjectId } from "mongodb"
import { MongoDb } from "./mongoDb"
import { Chain } from "thirdweb"

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
  | "factory"
  | "token"
  | "storage"
  | "processor"
  | "vault"
  | "ccip"
  | "faucet"
  | "dinari"

export type Chains = "Ethereum" | "Arbitrum" | "Polygon"
export type Networks = "Mainnet" | "Goerli" | "Sepolia" | "Mumbai"

export type ChainNetwork = {
  chainName: Chains
  network: Networks
  chain: Chain
}

export type ChainSelectorMap = {
  [chain in Chains]?: {
    [network in Networks]?: string | PublicClient
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
  historicalPrice?: MongoDb[]
}

export type MarketInfo = {
  marketCap?: number
  offChainPrice?: number
  change24h?: number
  change24hFmt?: string
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

export type thirdwebReadContract = {
  data: bigint
  refetch: () => void
}

export type AssetOverviewDocument = {
  _id?: ObjectId
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
  coinmarketcap?: object
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

type BaseTransaction = {
  nonce?: number
  messageId?: string
  inputAmount: number | string
  outputAmount: number | string
}

export type Transaction = BaseTransaction & {
  side: string
  userAddress: Address
  tokenAddress: Address
  timestamp: number
  tokenName: NexIndices | AllowedTickers
  txHash?: string
  sendStatus?: string
  receiveStatus?: string
  recieveSideMessageId?: string
}

export type RequestType = BaseTransaction & {
  __typename: string
  time: string
  user: Address
  transactionHash: string
  inputToken?: Address
  outputToken?: Address
}

