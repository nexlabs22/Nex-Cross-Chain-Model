import { ReactElement } from "react";

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
  chain: Chains;
  network: Networks;
};

export type ChainSelectorMap = {
  [chain in Chains]?: {
    [network in Networks]?: string;
  };
};

export type TokenAddressMap = {
  [ticker in AllowedTickers]?: {
    [chain in Chains]?: {
      [network in Networks]?: {
        [type in ContractTypes]?: { address: Address; decimals?: number };
      };
    };
  };
};

export type PoolAddressMap = {
  [ticker in AllowedTickers]?: {
    [pairingToken in AllowedTickers]?: {
      [chain in Chains]?: {
        [network in Networks]?: string;
      };
    };
  };
};

export type Asset = {
  name: string
  symbol: string
  logoComponent?: ReactElement
  logoString?: string
  category?: AssetCategory
  bgColor?: string
  hoverColor?: string
  weight?: number
}

export type StockAsset = {
  symbol: string
  name: string
  cik?: string
  isin?: string
} & Omit<Asset, "category"> & {
    category: "stock"
  }

export type CryptoAsset = {
  address: string;
  factoryAddress: string;
  decimals: number;
} & Omit<Asset, "category"> & {
    category: "cryptocurrency";
  };

export type MarketInfo = {
  marketCap?: number;
  price?: number;
  change24h?: number;
  volume?: number;
};

export type SmartContractInfo = {
  price?: number
  totalSupply?: number;
  stakedSupply?: number;
  composition?: Asset[];
  managementFee?: number;
};

export type TokenObject = {
  tokenAddresses: TokenAddressMap[AllowedTickers]
  poolAddresses?: PoolAddressMap
  smartContractType?: SmartContractType
  name: string
  symbol: AllowedTickers
  columnName?: string
  logo: string
  shortDescription?: string
  description?: string
  marketInfo?: MarketInfo
  smartContractInfo?: SmartContractInfo  
  assets?: (Asset | CryptoAsset)[] | null
};

export type Index = Omit<TokenObject, "tokenAddress" | "indexType"> & {
  id: number;
  assetCategory: AssetCategory;
  selectionColor: string;
  tokenAddress?: string;
};

export type Transaction = {
  side?: "send" | "receive";
  userAddress: string;
  tokenAddress: string;
  timestamp?: number;
  inputAmount?: number;
  outputAmount?: number;
  tokenName: NexIndices | AllowedTickers;
  txHash?: string;
  messageId?: string;
  nonce?: number;
  status?: string;
  recieveSideMessageId?: string;
};

export type thirdwebReadContract = {
  data: bigint,
  refetch:()=>void
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
