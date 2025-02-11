import axios from "axios";
import { mongoDataToOHLC } from "../convertToMongo/parse.ts";
import { makeApiRequest, generateSymbol, parseFullSymbol, generateNexSymbol } from "./helpers.js";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ["1D", "1W", "1M"],
  exchanges: [
    {
      value: "Nexlabs",
      name: "Nex Labs",
      desc: "Nex Labs",
    },
    {
      value: "Bitfinex",
      name: "Bitfinex",
      desc: "Bitfinex",
    },
    {
      value: "Kraken",
      name: "Kraken",
      desc: "Kraken bitcoin exchange",
    },

  ],
  symbols_types: [
    {
      name: 'All',
      value: 'all'
    },
    {
      name: "Crypto",
      value: "crypto",
    },
    {
      name: "Index",
      value: 'index'
    },
    {
      name: 'Stocks',
      value: 'stocks'
    },
    {
      name: 'Commodities',
      value: 'commodities'
    }
  ],
};

async function getAllSymbols() {
  const data = await makeApiRequest("data/v3/all/exchanges");
  const nexLabsData = {
    isActive: true,
    isTopTier: true,
    pairs: {
      ANFI: ['USD'], CRYPTO5: ['USD'],
      MAG7: ['USD'], ARBIn: ['USD'], ARBEI: ['USD'],
      GSPC: ['USD'],
      IXIC: ['USD'],
      DJI: ['USD'],
      NYA: ['USD'],
      ASML: ['USD'],
      PYPL: ['USD'],
      MSFT: ['USD'],
      AAPL: ['USD'],
      GOOGL: ['USD'],
      AMZN: ['USD'],
      V: ['USD'],
      TCEHY: ['USD'],
      TSM: ['USD'],
      XOM: ['USD'],
      NVDA: ['USD'],
      UNH: ['USD'],
      JNJ: ['USD'],
      LVMHF: ['USD'],
      TSLA: ['USD'],
      JPM: ['USD'],
      WMT: ['USD'],
      META: ['USD'],
      SPY: ['USD'],
      MA: ['USD'],
      CVX: ['USD'],
      BRKA: ['USD'],
      GOLD: ['USD'],
      COPPER: ['USD'],
      LITHIUM: ['USD'],
      CRUDEOIL: ['USD'],
      SILVER: ['USD'],
      BTC: ['USD'],
      ARB: ['USD'],
      ETH: ['USD']

    }
  }
  const indexes = ['ANFI', 'CRYPTO5', 'GSPC', 'IXIC', 'DJI', 'NYA','MAG7', 'ARBEI']
  const stocks = ['V', 'ASML', 'PYPL', 'MSFT', 'AAPL', 'GOOGL', 'AMZN', 'TCEHY', 'TSM', 'XOM', 'NVDA', 'UNH', 'JNJ', 'LVMHF', 'TSLA', 'JPM', 'WMT', 'META', 'SPY', 'MA', 'CVX', 'BRKA']
  const commodities = ['GOLD', 'COPPER', 'LITHIUM', 'CRUDEOIL', 'SILVER']
  data.Data.Nexlabs = nexLabsData;
  let allSymbols = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;
    if (exchange.value === 'Nexlabs') {
      for (const leftPairPart of Object.keys(pairs)) {
        const symbols = pairs[leftPairPart].map((rightPairPart) => {
          const symbol = generateNexSymbol(
            exchange.value,
            leftPairPart,
            rightPairPart
          );
          return {
            symbol: symbol.short,
            full_name: symbol.full,
            description: symbol.desc,
            exchange: exchange.value,
            type: indexes.includes(symbol.short.split('/')[0]) ? "index" :
              stocks.includes(symbol.short.split('/')[0]) ? "stocks" :
                commodities.includes(symbol.short.split('/')[0]) ? "commodities" :
                  "crypto"
          };
        });
        allSymbols = [...allSymbols, ...symbols];
      }
    } else {
      for (const leftPairPart of Object.keys(pairs)) {
        const symbols = pairs[leftPairPart].map((rightPairPart) => {
          const symbol = generateSymbol(
            exchange.value,
            leftPairPart,
            rightPairPart
          );
          return {
            symbol: symbol.short,
            full_name: symbol.full,
            description: symbol.short,
            exchange: exchange.value,
            type: 'crypto'
          };
        });
        allSymbols = [...allSymbols, ...symbols];
      }
    }
  }
  return allSymbols;
}

const dataFeed = {
  onReady: (callback) => {
    // console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    // console.log("[searchSymbols]: Method call");
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
        const isDescContainsInput = symbol.description.split(" ").join('').toLowerCase().indexOf(userInput.toLowerCase()) !== -1
      if (symbolType !== 'all') {
        const isTypeValid = symbol.type === symbolType;
        return isExchangeValid && isTypeValid && (isDescContainsInput || isFullSymbolContainsInput);
      } else {
        return isExchangeValid && (isFullSymbolContainsInput || isDescContainsInput);
      }
    });
    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    // console.log("[resolveSymbol]: Method call", symbolName);
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(
      ({ full_name }) => full_name === symbolName
    );
    if (!symbolItem) {
      // console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("cannot resolve symbol");
      return;
    }
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      has_no_volume: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };

    // console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    // console.log("[getBars]: Method call", symbolInfo, resolution, from, to, periodParams);
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const urlParameters = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      toTs: to,
      limit: 2000,
    };
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join("&");
    try {

      const filter = {
        ticker: urlParameters.fsym
      }
      const data1 = await axios.post(`/api/chart-data`, filter).then( res => mongoDataToOHLC(res.data.data)).catch(error => console.log(error));
      const data2 = await makeApiRequest(`data/histoday?${query}`);

      const data = data2.Response === 'Error' ? data1 : data2.Data

      let bars = [];

      data.forEach((bar) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      // console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, {
        noData: false,
      });
      return;
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    // console.log(
    //   "[subscribeBars]: Method call with subscribeUID:",
    //   subscribeUID
    // );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },

  unsubscribeBars: (subscriberUID) => {
    // console.log(
    //   "[unsubscribeBars]: Method call with subscriberUID:",
    //   subscriberUID
    // );
    unsubscribeFromStream(subscriberUID);
  },
};

export default dataFeed;

