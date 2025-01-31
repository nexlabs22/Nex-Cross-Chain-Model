import { Collection } from "mongodb"

import { MongoDb } from "@/types/mongoDb"
import connectToMongoDb from "@/utils/connectToMongoDb"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"

import {
  parseCommaSeparated,
  convertUnixToDate,
  uploadToMongo,
} from "./parse"

type ArbitrumData = {
  stampsec: number
  date: string
  active_add: Record<string, number>
  volume: Record<string, number>
}

const mapNameToTicker = {
  rigoblock: {
    name: "Rigoblock",
    ticker: "GRG",
    type: AssetCategory.Cryptocurrency,
  },
  dforce: {
    name: "dForce",
    ticker: "DF",
    type: AssetCategory.Cryptocurrency,
  },
  uniswap: {
    name: "Uniswap",
    ticker: "UNI",
    type: AssetCategory.Cryptocurrency,
  },
  "compound-v3": {
    name: "Compound",
    ticker: "COMP",
    type: AssetCategory.Cryptocurrency,
  },
  pnetwork: {
    name: "pNetwork",
    ticker: "PNT",
    type: AssetCategory.Cryptocurrency,
  },
  "balancer-v2": {
    name: "Balancer",
    ticker: "BAL",
    type: AssetCategory.Cryptocurrency,
  },
  "mux-protocol": {
    name: "MUX Protocol",
    ticker: "MCB",
    type: AssetCategory.Cryptocurrency,
  },
  "team-finance": {
    name: "Team Finance",
    ticker: "TEAM",
    type: AssetCategory.Cryptocurrency,
  },
  "yearn-finance": {
    name: "Yearn Finance",
    ticker: "YFI",
    type: AssetCategory.Cryptocurrency,
  },
  "cream-lending": {
    name: "Cream Finance",
    ticker: "CREAM",
    type: AssetCategory.Cryptocurrency,
  },
  dxsale: {
    name: "DxSale Network",
    ticker: "SALE",
    type: AssetCategory.Cryptocurrency,
  },
  hegic: {
    name: "Hegic",
    ticker: "HEGIC",
    type: AssetCategory.Cryptocurrency,
  },
  dodo: {
    name: "DODO",
    ticker: "DODO",
    type: AssetCategory.Cryptocurrency,
  },
  "sushiswap-v3": {
    name: "SushiSwap",
    ticker: "SUSHI",
    type: AssetCategory.Cryptocurrency,
  },
  "harvest-finance": {
    name: "Harvest Finance",
    ticker: "FARM",
    type: AssetCategory.Cryptocurrency,
  },
  barnbridge: {
    name: "BarnBridge",
    ticker: "BOND",
    type: AssetCategory.Cryptocurrency,
  },
  sushiswap: {
    name: "SushiSwap",
    ticker: "SUSHI",
    type: AssetCategory.Cryptocurrency,
  },
  pickle: {
    name: "Pickle Finance",
    ticker: "PICKLE",
    type: AssetCategory.Cryptocurrency,
  },
  dhedge: {
    name: "dHEDGE DAO",
    ticker: "DHT",
    type: AssetCategory.Cryptocurrency,
  },
  "uniswap-v3": {
    name: "Uniswap",
    ticker: "UNI",
    type: AssetCategory.Cryptocurrency,
  },
  pancakeswap: {
    name: "PancakeSwap",
    ticker: "CAKE",
    type: AssetCategory.Cryptocurrency,
  },
  "pancakeswap-amm-v3": {
    name: "PancakeSwap",
    ticker: "CAKE",
    type: AssetCategory.Cryptocurrency,
  },
  "aave-v3": {
    name: "Aave",
    ticker: "AAVE",
    type: AssetCategory.Cryptocurrency,
  },
  "uncx-network-v3": {
    name: "UniCrypt",
    ticker: "UNCX",
    type: AssetCategory.Cryptocurrency,
  },
  "woofi-earn": {
    name: "WOO Network",
    ticker: "WOO",
    type: AssetCategory.Cryptocurrency,
  },
  "rari-capital": {
    name: "Rari Governance Token",
    ticker: "RGT",
    type: AssetCategory.Cryptocurrency,
  },
  acryptos: {
    name: "ACryptoS",
    ticker: "ACS",
    type: AssetCategory.Cryptocurrency,
  },
  nftx: {
    name: "NFTX",
    ticker: "NFTX",
    type: AssetCategory.Cryptocurrency,
  },
  siren: {
    name: "Siren",
    ticker: "SI",
    type: AssetCategory.Cryptocurrency,
  },
  "badger-dao": {
    name: "Badger DAO",
    ticker: "BADGER",
    type: AssetCategory.Cryptocurrency,
  },
  futureswap: {
    name: "Futureswap",
    ticker: "FST",
    type: AssetCategory.Cryptocurrency,
  },
  swapr: {
    name: "Swapr",
    ticker: "SWPR",
    type: AssetCategory.Cryptocurrency,
  },
  "tornado-cash": {
    name: "Tornado Cash",
    ticker: "TORN",
    type: AssetCategory.Cryptocurrency,
  },
  "cvi-finance": {
    name: "CVI Finance",
    ticker: "GOVI",
    type: AssetCategory.Cryptocurrency,
  },
  "wise-lending-v2": {
    name: "Wise Token",
    ticker: "WISE",
    type: AssetCategory.Cryptocurrency,
  },
  xtoken: {
    name: "xToken",
    ticker: "XTK",
    type: AssetCategory.Cryptocurrency,
  },
  coinscope: {
    name: "Coinscope",
    ticker: "COINSCOPE",
    type: AssetCategory.Cryptocurrency,
  },
  railgun: {
    name: "Railgun",
    ticker: "RAIL",
    type: AssetCategory.Cryptocurrency,
  },
  "revest-finance": {
    name: "Revest Finance",
    ticker: "RVST",
    type: AssetCategory.Cryptocurrency,
  },
  angle: {
    name: "Angle Protocol",
    ticker: "ANGLE",
    type: AssetCategory.Cryptocurrency,
  },
  gamma: {
    name: "Gamma Strategies",
    ticker: "GAMMA",
    type: AssetCategory.Cryptocurrency,
  },
  tigris: {
    name: "Tigris",
    ticker: "TIG",
    type: AssetCategory.Cryptocurrency,
  },
  "silo-finance": {
    name: "Silo Finance",
    ticker: "SILO",
    type: AssetCategory.Cryptocurrency,
  },
  "arbis-finance": {
    name: "Arbis Finance",
    ticker: "ARBIS",
    type: AssetCategory.Cryptocurrency,
  },
  cougarswap: {
    name: "CougarSwap",
    ticker: "CGS",
    type: AssetCategory.Cryptocurrency,
  },
  "liquid-finance": {
    name: "Liquid Finance",
    ticker: "LQ",
    type: AssetCategory.Cryptocurrency,
  },
  thales: {
    name: "Thales",
    ticker: "THALES",
    type: AssetCategory.Cryptocurrency,
  },
  insuredao: {
    name: "InsureDAO",
    ticker: "INSURE",
    type: AssetCategory.Cryptocurrency,
  },
  "handle.fi": {
    name: "Handle Finance",
    ticker: "FOREX",
    type: AssetCategory.Cryptocurrency,
  },
  integral: {
    name: "Integral",
    ticker: "ITGR",
    type: AssetCategory.Cryptocurrency,
  },
  "volta-finance": {
    name: "Volta Finance",
    ticker: "VOLTA",
    type: AssetCategory.Cryptocurrency,
  },
  "notional-v3": {
    name: "Notional Finance",
    ticker: "NOTE",
    type: AssetCategory.Cryptocurrency,
  },
  spacedex: {
    name: "SpaceDex",
    ticker: "SPDX",
    type: AssetCategory.Cryptocurrency,
  },
  hmx: {
    name: "HMX",
    ticker: "HMX",
    type: AssetCategory.Cryptocurrency,
  },
  "solidly-v3": {
    name: "Solidly",
    ticker: "SOLID",
    type: AssetCategory.Cryptocurrency,
  },
  openleverage: {
    name: "OpenLeverage",
    ticker: "OLE",
    type: AssetCategory.Cryptocurrency,
  },
  ipor: {
    name: "IPOR Protocol",
    ticker: "IPOR",
    type: AssetCategory.Cryptocurrency,
  },
  "b.protocol": {
    name: "B.Protocol",
    ticker: "BPRO",
    type: AssetCategory.Cryptocurrency,
  },
  "deri-protocol": {
    name: "Deri Protocol",
    ticker: "DERI",
    type: AssetCategory.Cryptocurrency,
  },
  "mind-games": {
    name: "Mind Games",
    ticker: "MND",
    type: AssetCategory.Cryptocurrency,
  },
  iziswap: {
    name: "iZiSwap",
    ticker: "IZI",
    type: AssetCategory.Cryptocurrency,
  },
  "sterling-finance": {
    name: "Sterling Finance",
    ticker: "STR",
    type: AssetCategory.Cryptocurrency,
  },
  "cryptex-v2": {
    name: "Cryptex",
    ticker: "CTX",
    type: AssetCategory.Cryptocurrency,
  },
  bunni: {
    name: "Bunni",
    ticker: "BUNNI",
    type: AssetCategory.Cryptocurrency,
  },
  "ktx.finance": {
    name: "KTX Finance",
    ticker: "KTX",
    type: AssetCategory.Cryptocurrency,
  },
  liondex: {
    name: "LionDEX",
    ticker: "LDX",
    type: AssetCategory.Cryptocurrency,
  },
  ideamarket: {
    name: "IdeaMarket",
    ticker: "IDEA",
    type: AssetCategory.Cryptocurrency,
  },
  flashstake: {
    name: "Flashstake",
    ticker: "FLASH",
    type: AssetCategory.Cryptocurrency,
  },
  "saddle-finance": {
    name: "Saddle Finance",
    ticker: "SDL",
    type: AssetCategory.Cryptocurrency,
  },
  "magic-land": {
    name: "Magic Land",
    ticker: "MAGIC",
    type: AssetCategory.Cryptocurrency,
  },
  "dfx-v3": {
    name: "DFX Finance",
    ticker: "DFX",
    type: AssetCategory.Cryptocurrency,
  },
  equilibria: {
    name: "Equilibria",
    ticker: "EQB",
    type: AssetCategory.Cryptocurrency,
  },
  "carbon-finance": {
    name: "Carbon Finance",
    ticker: "CRBN",
    type: AssetCategory.Cryptocurrency,
  },
  "channels-finance": {
    name: "Channels Finance",
    ticker: "CAN",
    type: AssetCategory.Cryptocurrency,
  },
  "archi-finance": {
    name: "Archi Finance",
    ticker: "ARCHI",
    type: AssetCategory.Cryptocurrency,
  },
  "garbi-protocol": {
    name: "Garbi Protocol",
    ticker: "GRB",
    type: AssetCategory.Cryptocurrency,
  },
  unidex: {
    name: "UniDex",
    ticker: "UNIDX",
    type: AssetCategory.Cryptocurrency,
  },
  openocean: {
    name: "OpenOcean",
    ticker: "OOE",
    type: AssetCategory.Cryptocurrency,
  },
  "spool-v1": {
    name: "Spool DAO",
    ticker: "SPOOL",
    type: AssetCategory.Cryptocurrency,
  },
  "amy-finance": {
    name: "Amy Finance",
    ticker: "AMY",
    type: AssetCategory.Cryptocurrency,
  },
  "fringe-v2": {
    name: "Fringe Finance",
    ticker: "FRIN",
    type: AssetCategory.Cryptocurrency,
  },
  sohei: {
    name: "Sohei",
    ticker: "SOHEI",
    type: AssetCategory.Cryptocurrency,
  },
  relaychain: {
    name: "RelayChain",
    ticker: "RELAY",
    type: AssetCategory.Cryptocurrency,
  },
  elk: {
    name: "Elk Finance",
    ticker: "ELK",
    type: AssetCategory.Cryptocurrency,
  },
  "waterfall-bsc": {
    name: "Waterfall Finance",
    ticker: "WTF",
    type: AssetCategory.Cryptocurrency,
  },
  "tangible-rwa": {
    name: "Tangible",
    ticker: "TNGBL",
    type: AssetCategory.Cryptocurrency,
  },
  "guru-network": {
    name: "Guru Network",
    ticker: "GURU",
    type: AssetCategory.Cryptocurrency,
  },
  halodao: {
    name: "HaloDAO",
    ticker: "RNBW",
    type: AssetCategory.Cryptocurrency,
  },
  "hundred-finance": {
    name: "Hundred Finance",
    ticker: "HND",
    type: AssetCategory.Cryptocurrency,
  },
  "whitehole-finance": {
    name: "Whitehole Finance",
    ticker: "WHITE",
    type: AssetCategory.Cryptocurrency,
  },
  "cells-finance": {
    name: "Cells Finance",
    ticker: "CELLS",
    type: AssetCategory.Cryptocurrency,
  },
  "apex-protocol": {
    name: "Apex Protocol",
    ticker: "APEX",
    type: AssetCategory.Cryptocurrency,
  },
  "rhino.fi": {
    name: "Rhino.fi",
    ticker: "DVF",
    type: AssetCategory.Cryptocurrency,
  },
  "the-ennead-farm": {
    name: "The Ennead Farm",
    ticker: "ENNEAD",
    type: AssetCategory.Cryptocurrency,
  },
  roseonx: {
    name: "RoseonX",
    ticker: "ROSN",
    type: AssetCategory.Cryptocurrency,
  },
  array: {
    name: "Array",
    ticker: "ARRAY",
    type: AssetCategory.Cryptocurrency,
  },
  "monopoly-finance": {
    name: "Monopoly Finance",
    ticker: "MONO",
    type: AssetCategory.Cryptocurrency,
  },
  spherium: {
    name: "Spherium",
    ticker: "SPHRI",
    type: AssetCategory.Cryptocurrency,
  },
  "x-blue-finance": {
    name: "X-Blue Finance",
    ticker: "XBF",
    type: AssetCategory.Cryptocurrency,
  },
  "forge-sx-ovens": {
    name: "Forge SX Ovens",
    ticker: "FSX",
    type: AssetCategory.Cryptocurrency,
  },
  "parrot-defi": {
    name: "Parrot DeFi",
    ticker: "PRT",
    type: AssetCategory.Cryptocurrency,
  },
  "hashdao-finance": {
    name: "HashDAO Finance",
    ticker: "HASH",
    type: AssetCategory.Cryptocurrency,
  },
  ponyswap: {
    name: "PonySwap",
    ticker: "PONY",
    type: AssetCategory.Cryptocurrency,
  },
  ichi: {
    name: "ICHI",
    ticker: "ICHI",
    type: AssetCategory.Cryptocurrency,
  },
  "goldbank-finance": {
    name: "Goldbank Finance",
    ticker: "GLB",
    type: AssetCategory.Cryptocurrency,
  },
  "magicfox-vaults": {
    name: "MagicFox Vaults",
    ticker: "MGF",
    type: AssetCategory.Cryptocurrency,
  },
  waterdendy: {
    name: "WaterDendy",
    ticker: "WDND",
    type: AssetCategory.Cryptocurrency,
  },
  wepiggy: {
    name: "WePiggy",
    ticker: "WPC",
    type: AssetCategory.Cryptocurrency,
  },
  "unlimited-network": {
    name: "Unlimited Network",
    ticker: "UNL",
    type: AssetCategory.Cryptocurrency,
  },
  gmcash: {
    name: "GMCash",
    ticker: "GMC",
    type: AssetCategory.Cryptocurrency,
  },
  empyreal: {
    name: "Empyreal",
    ticker: "EMP",
    type: AssetCategory.Cryptocurrency,
  },
  "radiate-protocol": {
    name: "Radiate Protocol",
    ticker: "RAD",
    type: AssetCategory.Cryptocurrency,
  },
  "interport-finance": {
    name: "Interport Finance",
    ticker: "ITP",
    type: AssetCategory.Cryptocurrency,
  },
  envelop: {
    name: "Envelop",
    ticker: "NIFTSY",
    type: AssetCategory.Cryptocurrency,
  },
  sommelier: {
    name: "Sommelier",
    ticker: "SOMM",
    type: AssetCategory.Cryptocurrency,
  },
  "doora-inu": {
    name: "Doora Inu",
    ticker: "DOOR",
    type: AssetCategory.Cryptocurrency,
  },
  savvy: {
    name: "Savvy",
    ticker: "SVY",
    type: AssetCategory.Cryptocurrency,
  },
  "antfarm-finance": {
    name: "Antfarm Finance",
    ticker: "ATF",
    type: AssetCategory.Cryptocurrency,
  },
  arbiten: {
    name: "Arbiten",
    ticker: "ARB",
    type: AssetCategory.Cryptocurrency,
  },
  "wonderly-finance": {
    name: "Wonderly Finance",
    ticker: "WON",
    type: AssetCategory.Cryptocurrency,
  },
  "dbx-finance": {
    name: "DBX Finance",
    ticker: "DBX",
    type: AssetCategory.Cryptocurrency,
  },
  "dsu-money": {
    name: "DSU Money",
    ticker: "DSU",
    type: AssetCategory.Cryptocurrency,
  },
  neku: {
    name: "Neku",
    ticker: "NEKU",
    type: AssetCategory.Cryptocurrency,
  },
  "waterfall-dex": {
    name: "Waterfall DEX",
    ticker: "WDEX",
    type: AssetCategory.Cryptocurrency,
  },
  "atlas-aggregator": {
    name: "Atlas Aggregator",
    ticker: "ATLAS",
    type: AssetCategory.Cryptocurrency,
  },
  "union-protocol": {
    name: "Union Protocol",
    ticker: "UNN",
    type: AssetCategory.Cryptocurrency,
  },
  "arbirise-finance": {
    name: "Arbirise Finance",
    ticker: "ARF",
    type: AssetCategory.Cryptocurrency,
  },
  betswirl: {
    name: "BetSwirl",
    ticker: "BETS",
    type: AssetCategory.Cryptocurrency,
  },
  "neptune-mutual": {
    name: "Neptune Mutual",
    ticker: "NPM",
    type: AssetCategory.Cryptocurrency,
  },
  trainswap: {
    name: "TrainSwap",
    ticker: "TRAIN",
    type: AssetCategory.Cryptocurrency,
  },
  openworld: {
    name: "OpenWorld",
    ticker: "OPEN",
    type: AssetCategory.Cryptocurrency,
  },
  stella: {
    name: "Stella",
    ticker: "STELLA",
    type: AssetCategory.Cryptocurrency,
  },
  penpie: {
    name: "Penpie",
    ticker: "PNP",
    type: AssetCategory.Cryptocurrency,
  },
  "autoearn-finance": {
    name: "AutoEarn Finance",
    ticker: "AUTO",
    type: AssetCategory.Cryptocurrency,
  },
  "impermax-finance": {
    name: "Impermax Finance",
    ticker: "IMX",
    type: AssetCategory.Cryptocurrency,
  },
  "finext-finance": {
    name: "Finext Finance",
    ticker: "FNX",
    type: AssetCategory.Cryptocurrency,
  },
  multichain: {
    name: "Multichain",
    ticker: "MULTI",
    type: AssetCategory.Cryptocurrency,
  },
  virtuswap: {
    name: "VirtuSwap",
    ticker: "VIRTU",
    type: AssetCategory.Cryptocurrency,
  },
  "etherberry-finance": {
    name: "EtherBerry Finance",
    ticker: "EBERRY",
    type: AssetCategory.Cryptocurrency,
  },
  "joe-v2": {
    name: "Trader Joe",
    ticker: "JOE",
    type: AssetCategory.Cryptocurrency,
  },
  "solv-v2": {
    name: "Solv Protocol",
    ticker: "SOLV",
    type: AssetCategory.Cryptocurrency,
  },
  yfx: {
    name: "YFX",
    ticker: "YFX",
    type: AssetCategory.Cryptocurrency,
  },
  "lyra-v1": {
    name: "Lyra",
    ticker: "LYRA",
    type: AssetCategory.Cryptocurrency,
  },
  connext: {
    name: "Connext",
    ticker: "NEXT",
    type: AssetCategory.Cryptocurrency,
  },
  clipper: {
    name: "Clipper",
    ticker: "CLIP",
    type: AssetCategory.Cryptocurrency,
  },
  "the-standard": {
    name: "The Standard",
    ticker: "TST",
    type: AssetCategory.Cryptocurrency,
  },
  altitude: {
    name: "Altitude",
    ticker: "ALTD",
    type: AssetCategory.Cryptocurrency,
  },
  optionblitz: {
    name: "OptionBlitz",
    ticker: "BLITZ",
    type: AssetCategory.Cryptocurrency,
  },
  curve: {
    name: "Curve DAO",
    ticker: "CRV",
    type: AssetCategory.Cryptocurrency,
  },
  "level-finance": {
    name: "Level Finance",
    ticker: "LVL",
    type: AssetCategory.Cryptocurrency,
  },
  balancer: {
    name: "Balancer",
    ticker: "BAL",
    type: AssetCategory.Cryptocurrency,
  },
  kyberswap: {
    name: "KyberSwap",
    ticker: "KNC",
    type: AssetCategory.Cryptocurrency,
  },
  gmx: {
    name: "GMX",
    ticker: "GMX",
    type: AssetCategory.Cryptocurrency,
  },
  woofi: {
    name: "WOO Network",
    ticker: "WOO",
    type: AssetCategory.Cryptocurrency,
  },
  "joe-v2.1": {
    name: "Trader Joe",
    ticker: "JOE",
    type: AssetCategory.Cryptocurrency,
  },
  hashflow: {
    name: "Hashflow",
    ticker: "HFT",
    type: AssetCategory.Cryptocurrency,
  },
  "gmx-v2": {
    name: "GMX",
    ticker: "GMX",
    type: AssetCategory.Cryptocurrency,
  },
  native: {
    name: "Native",
    ticker: "NATIVE",
    type: AssetCategory.Cryptocurrency,
  },
  "vertex-protocol": {
    name: "Vertex Protocol",
    ticker: "VERT",
    type: AssetCategory.Cryptocurrency,
  },
  camelot: {
    name: "Camelot",
    ticker: "GRAIL",
    type: AssetCategory.Cryptocurrency,
  },
  "ramses-exchange": {
    name: "Ramses Exchange",
    ticker: "RAM",
    type: AssetCategory.Cryptocurrency,
  },
  "ramses-exchange-v2": {
    name: "Ramses Exchange",
    ticker: "RAM",
    type: AssetCategory.Cryptocurrency,
  },
  "wombat-exchange": {
    name: "Wombat Exchange",
    ticker: "WOM",
    type: AssetCategory.Cryptocurrency,
  },
  "0x": {
    name: "0x Protocol",
    ticker: "ZRX",
    type: AssetCategory.Cryptocurrency,
  },
  zyberswap: {
    name: "ZyberSwap",
    ticker: "ZYB",
    type: AssetCategory.Cryptocurrency,
  },
  "camelot-v3": {
    name: "Camelot",
    ticker: "GRAIL",
    type: AssetCategory.Cryptocurrency,
  },
  "frax-swap": {
    name: "Frax Swap",
    ticker: "FRAX",
    type: AssetCategory.Cryptocurrency,
  },
  dackieswap: {
    name: "DackieSwap",
    ticker: "DKIE",
    type: AssetCategory.Cryptocurrency,
  },
  "chronos-v2": {
    name: "Chronos",
    ticker: "CHR",
    type: AssetCategory.Cryptocurrency,
  },
  airswap: {
    name: "AirSwap",
    ticker: "AST",
    type: AssetCategory.Cryptocurrency,
  },
  rubicon: {
    name: "Rubicon",
    ticker: "RBC",
    type: AssetCategory.Cryptocurrency,
  },
  "arbitrum-exchange-v3": {
    name: "Arbitrum Exchange",
    ticker: "ARBEX",
    type: AssetCategory.Cryptocurrency,
  },
  traderjoe: {
    name: "Trader Joe",
    ticker: "JOE",
    type: AssetCategory.Cryptocurrency,
  },
  SmarDex: {
    name: "SmarDex",
    ticker: "SDEX",
    type: AssetCategory.Cryptocurrency,
  },
  apeswap: {
    name: "ApeSwap",
    ticker: "BANANA",
    type: AssetCategory.Cryptocurrency,
  },
  ktx: {
    name: "KTX Finance",
    ticker: "KTX",
    type: AssetCategory.Cryptocurrency,
  },
  swaap: {
    name: "Swaap",
    ticker: "SWAAP",
    type: AssetCategory.Cryptocurrency,
  },
  "shell-protocol": {
    name: "Shell Protocol",
    ticker: "SHELL",
    type: AssetCategory.Cryptocurrency,
  },
  "yfx-v3": {
    name: "YFX",
    ticker: "YFX",
    type: AssetCategory.Cryptocurrency,
  },
  solidlizard: {
    name: "SolidLizard",
    ticker: "SLIZ",
    type: AssetCategory.Cryptocurrency,
  },
  swapline: {
    name: "Swapline",
    ticker: "SWL",
    type: AssetCategory.Cryptocurrency,
  },
  e3: {
    name: "E3 Protocol",
    ticker: "E3",
    type: AssetCategory.Cryptocurrency,
  },
  wardenswap: {
    name: "WardenSwap",
    ticker: "WAD",
    type: AssetCategory.Cryptocurrency,
  },
  "mm-finance-arbitrum": {
    name: "MM Finance (Arbitrum)",
    ticker: "MMF",
    type: AssetCategory.Cryptocurrency,
  },
  alienfi: {
    name: "AlienFi",
    ticker: "ALIEN",
    type: AssetCategory.Cryptocurrency,
  },
  "crescent-swap": {
    name: "Crescent Swap",
    ticker: "CSWAP",
    type: AssetCategory.Cryptocurrency,
  },
  ryze: {
    name: "Ryze",
    ticker: "RYZE",
    type: AssetCategory.Cryptocurrency,
  },
  "abracadabra-spell": {
    name: "Abracadabra",
    ticker: "SPELL",
    type: AssetCategory.Cryptocurrency,
  },
  "premia-v3": {
    name: "Premia",
    ticker: "PREMIA",
    type: AssetCategory.Cryptocurrency,
  },
  "router-protocol": {
    name: "Router Protocol",
    ticker: "ROUTE",
    type: AssetCategory.Cryptocurrency,
  },
  kommunitas: {
    name: "Kommunitas",
    ticker: "KOM",
    type: AssetCategory.Cryptocurrency,
  },
  "xwin-finance": {
    name: "xWIN Finance",
    ticker: "XWIN",
    type: AssetCategory.Cryptocurrency,
  },
  pendle: {
    name: "Pendle",
    ticker: "PENDLE",
    type: AssetCategory.Cryptocurrency,
  },
  "grim-finance": {
    name: "Grim Finance",
    ticker: "REAPER",
    type: AssetCategory.Cryptocurrency,
  },
  tarot: {
    name: "Tarot",
    ticker: "TAROT",
    type: AssetCategory.Cryptocurrency,
  },
  "stryke-clamm": {
    name: "Stryke Clamm",
    ticker: "STRYKE",
    type: AssetCategory.Cryptocurrency,
  },
  boringdao: {
    name: "BoringDAO",
    ticker: "BOR",
    type: AssetCategory.Cryptocurrency,
  },
  antimatter: {
    name: "AntiMatter",
    ticker: "MATTER",
    type: AssetCategory.Cryptocurrency,
  },
  synapse: {
    name: "Synapse",
    ticker: "SYN",
    type: AssetCategory.Cryptocurrency,
  },
  paribus: {
    name: "Paribus",
    ticker: "PBX",
    type: AssetCategory.Cryptocurrency,
  },
  cygnusdao: {
    name: "CygnusDAO",
    ticker: "CYG",
    type: AssetCategory.Cryptocurrency,
  },
  "mountain-protocol": {
    name: "Mountain Protocol",
    ticker: "MP",
    type: AssetCategory.Cryptocurrency,
  },
  beefy: {
    name: "Beefy Finance",
    ticker: "BIFI",
    type: AssetCategory.Cryptocurrency,
  },
  sweep: {
    name: "Sweep",
    ticker: "SWEEP",
    type: AssetCategory.Cryptocurrency,
  },
  clober: {
    name: "Clober",
    ticker: "CLOBER",
    type: AssetCategory.Cryptocurrency,
  },
  "3xcalibur": {
    name: "3xcalibur",
    ticker: "XCAL",
    type: AssetCategory.Cryptocurrency,
  },
  "swapr-v2": {
    name: "Swapr",
    ticker: "SWPR",
    type: AssetCategory.Cryptocurrency,
  },
  mozaic: {
    name: "Mozaic",
    ticker: "MOZ",
    type: AssetCategory.Cryptocurrency,
  },
  auragi: {
    name: "Auragi",
    ticker: "AGI",
    type: AssetCategory.Cryptocurrency,
  },
  opium: {
    name: "Opium",
    ticker: "OPIUM",
    type: AssetCategory.Cryptocurrency,
  },
  arbinyan: {
    name: "Arbinyan",
    ticker: "NYAN",
    type: AssetCategory.Cryptocurrency,
  },
  "cap-v4": {
    name: "Cap",
    ticker: "CAP",
    type: AssetCategory.Cryptocurrency,
  },
  "fjord-foundry": {
    name: "Fjord Foundry",
    ticker: "FJORD",
    type: AssetCategory.Cryptocurrency,
  },
  "dackieswap-v2": {
    name: "DackieSwap",
    ticker: "DKIE",
    type: AssetCategory.Cryptocurrency,
  },
  filda: {
    name: "Filda",
    ticker: "FILDA",
    type: AssetCategory.Cryptocurrency,
  },
  tegro: {
    name: "Tegro",
    ticker: "TGR",
    type: AssetCategory.Cryptocurrency,
  },
  "deri-v4": {
    name: "Deri Protocol",
    ticker: "DERI",
    type: AssetCategory.Cryptocurrency,
  },
  "yield-yak-aggregator": {
    name: "Yield Yak",
    ticker: "YAK",
    type: AssetCategory.Cryptocurrency,
  },
  "mycelium-perpetual-pools": {
    name: "Mycelium Perpetual Pools",
    ticker: "MYC",
    type: AssetCategory.Cryptocurrency,
  },
  kromatika: {
    name: "Kromatika",
    ticker: "KROM",
    type: AssetCategory.Cryptocurrency,
  },
  "buffer-finance": {
    name: "Buffer Finance",
    ticker: "BFR",
    type: AssetCategory.Cryptocurrency,
  },
  pirex: {
    name: "Pirex",
    ticker: "PX",
    type: AssetCategory.Cryptocurrency,
  },
  aura: {
    name: "Aura Finance",
    ticker: "AURA",
    type: AssetCategory.Cryptocurrency,
  },
  crowdswap: {
    name: "CrowdSwap",
    ticker: "CROWD",
    type: AssetCategory.Cryptocurrency,
  },
  symbiosis: {
    name: "Symbiosis",
    ticker: "SIS",
    type: AssetCategory.Cryptocurrency,
  },
  "magik-farm": {
    name: "Magik Farm",
    ticker: "MAGIK",
    type: AssetCategory.Cryptocurrency,
  },
  mugenfinance: {
    name: "Mugen Finance",
    ticker: "MGN",
    type: AssetCategory.Cryptocurrency,
  },
  "gmd-protocol": {
    name: "GMD Protocol",
    ticker: "GMD",
    type: AssetCategory.Cryptocurrency,
  },
  zigzag: {
    name: "ZigZag",
    ticker: "ZZ",
    type: AssetCategory.Cryptocurrency,
  },
  gearbox: {
    name: "Gearbox Protocol",
    ticker: "GEAR",
    type: AssetCategory.Cryptocurrency,
  },
  "uniwswap-unia-farms": {
    name: "UniWswap",
    ticker: "UNIA",
    type: AssetCategory.Cryptocurrency,
  },
  swapfish: {
    name: "SwapFish",
    ticker: "FISH",
    type: AssetCategory.Cryptocurrency,
  },
  "lodestar-v1": {
    name: "Lodestar Finance",
    ticker: "LODE",
    type: AssetCategory.Cryptocurrency,
  },
  "poison-finance": {
    name: "Poison Finance",
    ticker: "PSN",
    type: AssetCategory.Cryptocurrency,
  },
  "dogs-of-elon": {
    name: "Dogs of Elon",
    ticker: "DOE",
    type: AssetCategory.Cryptocurrency,
  },
  "adamant-finance": {
    name: "Adamant Finance",
    ticker: "ADDY",
    type: AssetCategory.Cryptocurrency,
  },
  "convex-finance": {
    name: "Convex Finance",
    ticker: "CVX",
    type: AssetCategory.Cryptocurrency,
  },
  qidao: {
    name: "QiDao",
    ticker: "QI",
    type: AssetCategory.Cryptocurrency,
  },
  ooki: {
    name: "Ooki Protocol",
    ticker: "OOKI",
    type: AssetCategory.Cryptocurrency,
  },
  "kyberswap-classic": {
    name: "KyberSwap Classic",
    ticker: "KNC",
    type: AssetCategory.Cryptocurrency,
  },
  "mummy-finance": {
    name: "Mummy Finance",
    ticker: "MMY",
    type: AssetCategory.Cryptocurrency,
  },
  "astra-dao": {
    name: "Astra DAO",
    ticker: "ASTRA",
    type: AssetCategory.Cryptocurrency,
  },
  "el-dorado-exchange": {
    name: "El Dorado Exchange",
    ticker: "EDE",
    type: AssetCategory.Cryptocurrency,
  },
  footballmanager: {
    name: "Football Manager",
    ticker: "FM",
    type: AssetCategory.Cryptocurrency,
  },
  "mint-club-v2": {
    name: "Mint Club",
    ticker: "MINT",
    type: AssetCategory.Cryptocurrency,
  },
  "camel-farm": {
    name: "Camel Farm",
    ticker: "CMF",
    type: AssetCategory.Cryptocurrency,
  },
  "primex-finance": {
    name: "PrimeX Finance",
    ticker: "PRIME",
    type: AssetCategory.Cryptocurrency,
  },
  "apeswap-amm": {
    name: "ApeSwap",
    ticker: "BANANA",
    type: AssetCategory.Cryptocurrency,
  },
  "o3-swap": {
    name: "O3 Swap",
    ticker: "O3",
    type: AssetCategory.Cryptocurrency,
  },
  "vela-exchange": {
    name: "Vela Exchange",
    ticker: "VELA",
    type: AssetCategory.Cryptocurrency,
  },
  "gains-network": {
    name: "Gains Network",
    ticker: "GNS",
    type: AssetCategory.Cryptocurrency,
  },
  "tender-finance": {
    name: "Tender Finance",
    ticker: "TND",
    type: AssetCategory.Cryptocurrency,
  },
  vaultka: {
    name: "Vaultka",
    ticker: "VKA",
    type: AssetCategory.Cryptocurrency,
  },
  "equation-v3": {
    name: "Equation",
    ticker: "EQ",
    type: AssetCategory.Cryptocurrency,
  },
  unitus: {
    name: "Unitus",
    ticker: "UIS",
    type: AssetCategory.Cryptocurrency,
  },
  "aquarius-loan": {
    name: "Aquarius Loan",
    ticker: "AQUA",
    type: AssetCategory.Cryptocurrency,
  },
  "woken-exchange": {
    name: "Woken Exchange",
    ticker: "WOKEN",
    type: AssetCategory.Cryptocurrency,
  },
  "lumi-finance": {
    name: "Lumi Finance",
    ticker: "LUMI",
    type: AssetCategory.Cryptocurrency,
  },
  "umami-finance": {
    name: "Umami Finance",
    ticker: "UMAMI",
    type: AssetCategory.Cryptocurrency,
  },
  vertex: {
    name: "Vertex",
    ticker: "VERT",
    type: AssetCategory.Cryptocurrency,
  },
  "flux-protocol": {
    name: "Flux Protocol",
    ticker: "FLUX",
    type: AssetCategory.Cryptocurrency,
  },
  "possum-labs": {
    name: "Possum Labs",
    ticker: "PSM",
    type: AssetCategory.Cryptocurrency,
  },
  horiza: {
    name: "Horiza",
    ticker: "HORI",
    type: AssetCategory.Cryptocurrency,
  },
  "epoch-island": {
    name: "Epoch Island",
    ticker: "EPOCH",
    type: AssetCategory.Cryptocurrency,
  },
  "apx-finance": {
    name: "APX Finance",
    ticker: "APX",
    type: AssetCategory.Cryptocurrency,
  },
  "solidlizard-dex": {
    name: "SolidLizard DEX",
    ticker: "SLIZ",
    type: AssetCategory.Cryptocurrency,
  },
  oasisswap: {
    name: "OasisSwap",
    ticker: "OASIS",
    type: AssetCategory.Cryptocurrency,
  },
  "sudoswap-v2": {
    name: "SudoSwap",
    ticker: "SUDO",
    type: AssetCategory.Cryptocurrency,
  },
  "sharky-swap": {
    name: "Sharky Swap",
    ticker: "SHARKY",
    type: AssetCategory.Cryptocurrency,
  },
  arbitrove: {
    name: "Arbitrove",
    ticker: "TROVE",
    type: AssetCategory.Cryptocurrency,
  },
  mymetatrader: {
    name: "MyMetaTrader",
    ticker: "MMT",
    type: AssetCategory.Cryptocurrency,
  },
  "single-finance": {
    name: "Single Finance",
    ticker: "SINGLE",
    type: AssetCategory.Cryptocurrency,
  },
  "factor-leverage-vault": {
    name: "Factor Leverage Vault",
    ticker: "FLV",
    type: AssetCategory.Cryptocurrency,
  },
  "factor-v2": {
    name: "Factor",
    ticker: "FCTR",
    type: AssetCategory.Cryptocurrency,
  },
  vaultcraft: {
    name: "VaultCraft",
    ticker: "VCR",
    type: AssetCategory.Cryptocurrency,
  },
  "locus-finance": {
    name: "Locus Finance",
    ticker: "LOCUS",
    type: AssetCategory.Cryptocurrency,
  },
  thick: {
    name: "Thick",
    ticker: "THICK",
    type: AssetCategory.Cryptocurrency,
  },
  gridex: {
    name: "Gridex",
    ticker: "GDX",
    type: AssetCategory.Cryptocurrency,
  },
  "peapods-finance": {
    name: "Peapods Finance",
    ticker: "PEA",
    type: AssetCategory.Cryptocurrency,
  },
  spinaqdex: {
    name: "SpinaqDex",
    ticker: "SPDQ",
    type: AssetCategory.Cryptocurrency,
  },
  poolshark: {
    name: "PoolShark",
    ticker: "POOL",
    type: AssetCategory.Cryptocurrency,
  },
  plutusdao: {
    name: "PlutusDAO",
    ticker: "PLS",
    type: AssetCategory.Cryptocurrency,
  },
  axelar: {
    name: "Axelar",
    ticker: "AXL",
    type: AssetCategory.Cryptocurrency,
  },
  "vesta-finance": {
    name: "Vesta Finance",
    ticker: "VSTA",
    type: AssetCategory.Cryptocurrency,
  },
  "goat-protocol": {
    name: "Goat Protocol",
    ticker: "GOAT",
    type: AssetCategory.Cryptocurrency,
  },
  "curve-dex": {
    name: "Curve DEX",
    ticker: "CRV",
    type: AssetCategory.Cryptocurrency,
  },
  "curve-llamalend": {
    name: "Curve LlamaLend",
    ticker: "LLAMA",
    type: AssetCategory.Cryptocurrency,
  },
  "flokifi-locker": {
    name: "FlokiFi Locker",
    ticker: "FLOKI",
    type: AssetCategory.Cryptocurrency,
  },
  "jones-dao": {
    name: "Jones DAO",
    ticker: "JONES",
    type: AssetCategory.Cryptocurrency,
  },
  "duet-protocol": {
    name: "Duet Protocol",
    ticker: "DUET",
    type: AssetCategory.Cryptocurrency,
  },
  ripae: {
    name: "Ripae",
    ticker: "PAE",
    type: AssetCategory.Cryptocurrency,
  },
  "florence-finance": {
    name: "Florence Finance",
    ticker: "FLO",
    type: AssetCategory.Cryptocurrency,
  },
  "open-dollar": {
    name: "Open Dollar",
    ticker: "OD",
    type: AssetCategory.Cryptocurrency,
  },
  "a51-finance-v3": {
    name: "A51 Finance",
    ticker: "A51",
    type: AssetCategory.Cryptocurrency,
  },
  "pingu-exchange": {
    name: "Pingu Exchange",
    ticker: "PINGU",
    type: AssetCategory.Cryptocurrency,
  },
  lexer: {
    name: "Lexer",
    ticker: "LEX",
    type: AssetCategory.Cryptocurrency,
  },
  "synonym-finance": {
    name: "Synonym Finance",
    ticker: "SYN",
    type: AssetCategory.Cryptocurrency,
  },
  aevo: {
    name: "Aevo",
    ticker: "AEVO",
    type: AssetCategory.Cryptocurrency,
  },
  deltaswap: {
    name: "DeltaSwap",
    ticker: "DELTA",
    type: AssetCategory.Cryptocurrency,
  },
  "0xacid": {
    name: "0xAcid",
    ticker: "ACID",
    type: AssetCategory.Cryptocurrency,
  },
  "winr-protocol": {
    name: "WINR Protocol",
    ticker: "WINR",
    type: AssetCategory.Cryptocurrency,
  },
  "ramses-v2": {
    name: "Ramses V2",
    ticker: "RAM",
    type: AssetCategory.Cryptocurrency,
  },
  smardex: {
    name: "SmarDex",
    ticker: "SDEX",
    type: AssetCategory.Cryptocurrency,
  },
  "radiant-v2": {
    name: "Radiant Capital",
    ticker: "RDNT",
    type: AssetCategory.Cryptocurrency,
  },
  "solidlizard-lending": {
    name: "SolidLizard Lending",
    ticker: "SLEND",
    type: AssetCategory.Cryptocurrency,
  },
  "reaper-farm": {
    name: "Reaper Farm",
    ticker: "REAPER",
    type: AssetCategory.Cryptocurrency,
  },
  stargate: {
    name: "Stargate",
    ticker: "STG",
    type: AssetCategory.Cryptocurrency,
  },
  "brokkr-finance": {
    name: "Brokkr Finance",
    ticker: "BRO",
    type: AssetCategory.Cryptocurrency,
  },
  "wombex-finance": {
    name: "Wombex Finance",
    ticker: "WMX",
    type: AssetCategory.Cryptocurrency,
  },
  chaingpt: {
    name: "ChainGPT",
    ticker: "GPT",
    type: AssetCategory.Cryptocurrency,
  },
  "gnd-protocol": {
    name: "GND Protocol",
    ticker: "GND",
    type: AssetCategory.Cryptocurrency,
  },
  "lumin-finance": {
    name: "Lumin Finance",
    ticker: "LUM",
    type: AssetCategory.Cryptocurrency,
  },
  "archly-finance-v2": {
    name: "Archly Finance",
    ticker: "ARCH",
    type: AssetCategory.Cryptocurrency,
  },
  "hop-protocol": {
    name: "Hop Protocol",
    ticker: "HOP",
    type: AssetCategory.Cryptocurrency,
  },
  swaprum: {
    name: "Swaprum",
    ticker: "RUM",
    type: AssetCategory.Cryptocurrency,
  },
  magpie: {
    name: "Magpie",
    ticker: "MGP",
    type: AssetCategory.Cryptocurrency,
  },
  perfectswap: {
    name: "PerfectSwap",
    ticker: "PFS",
    type: AssetCategory.Cryptocurrency,
  },
  "lila-finance": {
    name: "Lila Finance",
    ticker: "LILA",
    type: AssetCategory.Cryptocurrency,
  },
}

const convertArbitrumDataTable = async () => {
  const { collection }: { collection: Collection<MongoDb> } =
    await connectToMongoDb("DailyAssets")
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query("SELECT * FROM arbitrum_data")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: ArbitrumData[] = data.rows.map((row: any) => ({
    stampsec: Number(row.stampsec),
    date: convertUnixToDate(Number(row.stampsec)),
    active_add: parseCommaSeparated(row.active_add),
    volume: parseCommaSeparated(row.volume),
  }))

  const mongoDbData: MongoDb[] = []

  for (const row of parsedData) {
    const { date, stampsec, active_add, volume } = row

    if (active_add) {
      for (const [name, activeAddressCount] of Object.entries(active_add)) {
        const mapping = mapNameToTicker[name as keyof typeof mapNameToTicker]
        if (mapping) {
          mongoDbData.push({
            ticker: mapping.ticker,
            name: mapping.name,
            date,
            timestamp: stampsec,
            activeAddressCount: activeAddressCount,
            type: AssetCategory.Cryptocurrency,
          })
        }
      }
    }

    if (volume) {
      for (const [name, volumeValue] of Object.entries(volume)) {
        const mapping = mapNameToTicker[name as keyof typeof mapNameToTicker]
        if (mapping) {
          const existingEntry = mongoDbData.find(
            (entry) => entry.ticker === mapping.ticker && entry.date === date
          )

          if (existingEntry) {
            existingEntry.volume = volumeValue
          } else {
            mongoDbData.push({
              ticker: mapping.ticker,
              name: mapping.name,
              date,
              timestamp: stampsec,
              volume: volumeValue,
              type: AssetCategory.Cryptocurrency,
            })
          }
        }
      }
    }
  }

  // console.log(mongoDbData, "mongoDbData")

  await uploadToMongo(mongoDbData, collection)

  // Now mongoDbData is an array of MongoDb objects with merged data and mapped tickers
  console.log("Data successfully processed and ready for MongoDB", mongoDbData)
}

export const getUniqueKeys = async () => {
  /*const { collection }: { collection: Collection<MongoDb> } =
    await connectToMongoDb("DailyAssets")*/

  const spotClient = await connectToSpotDb()

  const uniqueKeysSet = new Set<string>()

  const uniqueKeysData = await spotClient.query(
    "SELECT active_add, volume FROM arbitrum_data"
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uniqueKeysData.rows?.forEach((row: any) => {
    const activeAddKeys = row.active_add
      ?.split(",")
      .map((entry: string) => entry.split(":")[0])
    const volumeKeys = row.volume
      ?.split(",")
      .map((entry: string) => entry.split(":")[0])

    activeAddKeys?.forEach((key: string) => uniqueKeysSet.add(key))
    volumeKeys?.forEach((key: string) => uniqueKeysSet.add(key))
  })

  const uniqueKeys = Array.from(uniqueKeysSet)
  // console.log(uniqueKeys, "uniqueKeys")

  return uniqueKeys
}

export default convertArbitrumDataTable
