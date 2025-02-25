import { tokenAddresses, poolAddresses } from "@/constants/contractAddresses"
import {
  AllowedTickers,
  IndexCryptoAsset,
  SmartContractType,
  TokenAddressMap,
} from "@/types/indexTypes"
import { SiBinance, SiRipple } from "react-icons/si"
import { GrBitcoin } from "react-icons/gr"
import { FaEthereum } from "react-icons/fa"
import { TbCurrencySolana } from "react-icons/tb"
import { PoolAddressMap } from "@/types/indexTypes"

import btcLogo from "@/assets/images/webpLogos/btc.webp"
import xautLogo from "@/assets/images/webpLogos/xaut.webp"
import ethLogo from "@/assets/images/webpLogos/eth.webp"
import bnbLogo from "@/assets/images/webpLogos/bnb.webp"
import xrpLogo from "@/assets/images/webpLogos/xrp.webp"
import solLogo from "@/assets/images/webpLogos/solana.webp"
import aaplLogo from "@/assets/images/webpLogos/apple.webp"
import amznLogo from "@/assets/images/webpLogos/amazon.webp"
import googlLogo from "@/assets/images/webpLogos/google.webp"
import msftLogo from "@/assets/images/webpLogos/microsoft.webp"
import tslaLogo from "@/assets/images/webpLogos/tesla.webp"
import nvdaLogo from "@/assets/images/webpLogos/nvidia.webp"
import metaLogo from "@/assets/images/webpLogos/meta.webp"
import arbLogo from "@/assets/images/webpLogos/arb.webp"
import aaveLogo from "@/assets/images/webpLogos/aave.webp"
import clipperLogo from "@/assets/images/webpLogos/clipper.webp"

import {
  AMAZONLogo,
  MICROSOFTLogo,
  GOOGLELogo,
  NVIDIALogo,
  TESLALogo,
  APPLELogo,
  METALogo,
} from "@/assets/icons/stocks/stocksLogos"

import {
  AAVELogo,
  CLIPPERLogo,
  XAUTLogo,
} from "@/assets/icons/crypto/cryptoLogos"

import { AnfiLogo, Crypto5Logo, Mag7Logo, ArbeiLogo } from "@/constants/indicesLogos"

export const nexTokensArray: IndexCryptoAsset[] = [
  {
    symbol: "ANFI",
    columnName: "ANFI",
    smartContractType: SmartContractType.Defi,
    name: "Anti-Inflation Index",
    shortDescription:
      "The Anti-Inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures.",
    description:
      "The Anti-inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures. Gold has traditionally been a reliable investment. Nevertheless, it's worth considering that Bitcoin, often referred to as 'digital gold,' has the potential to assume a prominent role in everyday life in the future.",
    tokenAddresses: tokenAddresses["ANFI"] as TokenAddressMap[AllowedTickers],
    poolAddresses: poolAddresses.ANFI as PoolAddressMap,
    logoComponent: <AnfiLogo />,
    assets: [
      {
        symbol: "XAUT",
        name: "gold",
        weight: 70,
        bgColor: "#CB9404",
        hoverColor: "#D4B460",
        logoComponent: <XAUTLogo />,
        logoString: xautLogo.src,
      },
      {
        symbol: "BTC",
        name: "bitcoin",
        weight: 30,
        bgColor: "#F7931A",
        hoverColor: "#F7931A",
        logoComponent: <GrBitcoin color="#F2F2F2" size={20} />,
        logoString: btcLogo.src,
      },
    ],
  },
  {
    name: "Crypto 5",
    symbol: "CRYPTO5",
    columnName: "CR5",
    smartContractType: SmartContractType.Crosschain,
    shortDescription:
      "Crypto 5 is a cross-chain index that provides investors with a diversified exposure to the top 5 cryptocurrencies by market capitalization.",
    description:
      'The "Crypto 5 Index" represents a meticulously curated basket of assets designed to provide investors with a secure and diversified entry into the digital assets industry. It not only offers stability through its carefully selected assets but also presents substantial growth potential. This makes it an ideal choice for crypto investors seeking a balanced and reliable investment option in the ever-evolving cryptocurrency landscape.',
    tokenAddresses: tokenAddresses[
      "CRYPTO5"
    ] as TokenAddressMap[AllowedTickers],
    poolAddresses: poolAddresses.CRYPTO5 as PoolAddressMap,
    logoComponent: <Crypto5Logo />,
    assets: [
      {
        symbol: "BTC",
        name: "bitcoin",
        weight: 50,
        bgColor: "#F7931A",
        hoverColor: "#F7931A",
        logoComponent: <GrBitcoin color="#F2F2F2" size={20} />,
        logoString: btcLogo.src,
      },
      {
        symbol: "ETH",
        name: "ethereum",
        weight: 25,
        bgColor: "#627EEA",
        hoverColor: "#627EEA",
        logoComponent: <FaEthereum color="#F2F2F2" size={19} />,
        logoString: ethLogo.src,
      },
      {
        symbol: "BNB",
        name: "binancecoin",
        weight: 8,
        bgColor: "#F0B90B",
        hoverColor: "#FCD535",
        logoComponent: <SiBinance color="#F2F2F2" size={19} />,
        logoString: bnbLogo.src,
      },
      {
        symbol: "XRP",
        name: "riplle",
        weight: 12,
        bgColor: "#008CFF",
        hoverColor: "#009393",
        logoComponent: <SiRipple color="#F2F2F2" size={19} />,
        logoString: xrpLogo.src,
      },

      {
        symbol: "SOL",
        name: "solana",
        weight: 5,
        bgColor: "#D02BFA",
        hoverColor: "#2775CA",
        logoComponent: <TbCurrencySolana color="#F2F2F2" size={19} />,
        logoString: solLogo.src,
      },
    ],
  },
  {
    name: "Magnificent 7",
    symbol: "MAG7",
    columnName: "MAG7",
    smartContractType: SmartContractType.Stocks,
    shortDescription:
      "Magnificent 7 is a stock index tracking the top 7 tech companies by market capitalization.",
    description:
      "The Magnificent 7 (MG7) refers to the top seven tech-driven companies dominating the stock market: Meta Platforms, Amazon, Apple, Netflix, Alphabet, Microsoft, and Nvidia. These companies hold significant market power, robust pricing, and strong earnings potential. The term, coined in 2023 by Michael Hartnett of Bank of America, reflects their innovative capabilities and dominant positions. MG7 is the first tokenized stocks index of this type, offering new digital investment opportunities on blockchain platforms.",
    tokenAddresses: tokenAddresses["MAG7"] as TokenAddressMap[AllowedTickers],
    poolAddresses: poolAddresses.MAG7 as PoolAddressMap,
    logoComponent: <Mag7Logo />,
    assets: [
      {
        symbol: "AAPL",
        name: "apple",
        weight: 14.29,
        bgColor: "#000000",
        hoverColor: "#F7931A",
        logoComponent: <APPLELogo />,
        logoString: aaplLogo.src,
      },
      {
        symbol: "AMZN",
        name: "amazon",
        weight: 14.29,
        bgColor: "#F7931A",
        hoverColor: "#627EEA",
        logoComponent: <AMAZONLogo />,
        logoString: amznLogo.src,
      },
      {
        symbol: "GOOG",
        name: "google",
        weight: 14.29,
        bgColor: "#4285F4",
        hoverColor: "#FCD535",
        logoComponent: <GOOGLELogo />,
        logoString: googlLogo.src,
      },
      {
        symbol: "MSFT",
        name: "microsoft",
        weight: 14.29,
        bgColor: "#EB5024",
        hoverColor: "#009393",
        logoComponent: <MICROSOFTLogo />,
        logoString: msftLogo.src,
      },
      {
        symbol: "TSLA",
        name: "tesla",
        weight: 14.29,
        bgColor: "#AC0509",
        hoverColor: "#2775CA",
        logoComponent: <TESLALogo />,
        logoString: tslaLogo.src,
      },
      {
        symbol: "NVDA",
        name: "nvidia",
        weight: 14.29,
        bgColor: "#76B900",
        hoverColor: "#2775CA",
        logoComponent: <NVIDIALogo />,
        logoString: nvdaLogo.src,
      },
      {
        symbol: "META",
        name: "meta",
        weight: 14.29,
        bgColor: "#007CF2",
        hoverColor: "#2775CA",
        logoComponent: <METALogo />,
        logoString: metaLogo.src,
      },
    ],
  },
  {
    name: "Arbitrum Index",
    symbol: "ARBEI",
    columnName: "ARBEI",
    smartContractType: SmartContractType.Defi,
    shortDescription: "Tracks the top defi protocols most used on Arbitrum.",
    description:
      "Tracks the top defi protocols most used/native to Arbitrum and includes the ARB blockchain token itself. Uses a proprietary collection of alpha generating variables.",
    tokenAddresses: tokenAddresses["ARBEI"] as TokenAddressMap[AllowedTickers],
    poolAddresses: poolAddresses.ARBEI as PoolAddressMap,
    logoComponent: <ArbeiLogo />,
    assets: [
      {
        symbol: "ARB",
        name: "arbitrum",
        weight: 15,
        bgColor: "#213147",
        hoverColor: "#F7931A",
        logoComponent: <GrBitcoin color="#F2F2F2" size={20} />,
        logoString: arbLogo.src,
      },
      {
        symbol: "Aave",
        name: "aave",
        weight: 12.5,
        bgColor: "#9391F7",
        hoverColor: "#627EEA",
        logoComponent: <AAVELogo />,
        logoString: aaveLogo.src,
      },
      {
        symbol: "Clipper",
        name: "clipper",
        weight: 12.5,
        bgColor: "#E9E9FF",
        hoverColor: "#FCD535",
        logoComponent: <CLIPPERLogo />,
        logoString: clipperLogo.src,
      },
    ],
  },
]
