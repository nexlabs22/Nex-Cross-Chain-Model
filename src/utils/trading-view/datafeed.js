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
      MAG7: ['USD'], ARBEI: ['USD'],
      SPDR: ['USD'],
      NASDAQ: ['USD'],
      DJI: ['USD'],
      NYSE: ['USD'],
      ASML: ['USD'],
      PYPL: ['USD'],
      MSFT: ['USD'],
      AAPL: ['USD'],
      GOOGL: ['USD'],
      AMZN: ['USD'],
      V: ['USD'],
      '0700': ['USD'],
      TSM: ['USD'],
      XOM: ['USD'],
      NVDA: ['USD'],
      UNH: ['USD'],
      JNJ: ['USD'],
      MC: ['USD'],
      TSLA: ['USD'],
      JPM: ['USD'],
      WMT: ['USD'],
      META: ['USD'],
      SPY: ['USD'],
      MA: ['USD'],
      CVX: ['USD'],
      'BRK.A': ['USD'],
      XAU: ['USD'],
      HG: ['USD'],
      LITHIUM: ['USD'],
      CL: ['USD'],
      SI: ['USD'],
    }
  }
  const indexes = ['ANFI', 'CRYPTO5','MAG7', 'ARBEI', 'SPDR', 'NASDAQ', 'DJI', 'NYSE']
  const stocks = ['V', 'ASML', 'PYPL', 'MSFT', 'AAPL', 'GOOGL', 'AMZN', '0700', 'TSM', 'XOM', 'NVDA', 'UNH', 'JNJ', 'MC', 'TSLA', 'JPM', 'WMT', 'META', 'SPY', 'MA', 'CVX', 'BRK.A']
  const commodities = ['XAU', 'HG', 'LITHIUM', 'CL', 'SI']
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
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    
    // Construct API query parameters
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
        let bars = [];

        // First, attempt to fetch data from your API
        const filter = { ticker: urlParameters.fsym.toString() };
        const dataFromDB = await axios.post(`/api/chart-data`, filter)
            .then(res => mongoDataToOHLC(res.data.data))
            .catch(error => {
                console.log("[getBars]: Error fetching from database", error);
                return [];  // Ensure we return an empty array on failure
            });

        // If no data is found in your API, fall back to the third-party API
        if (!dataFromDB || dataFromDB.length === 0) {
            console.log("[getBars]: No data from DB, fetching from third-party API...");
            const dataFromAPI = await makeApiRequest(`data/histoday?${query}`);

            // Handle third-party API errors
            if (!dataFromAPI || dataFromAPI.Response === "Error" || !dataFromAPI.Data.length) {
                console.log("[getBars]: No data from third-party API either.");
                onHistoryCallback([], { noData: true });
                return;
            }

            bars = dataFromAPI.Data;
        } else {
            console.log("[getBars]: Using data from database.");
            bars = dataFromDB;
        }

        // Convert API response to TradingView's format
        const formattedBars = bars
            .filter(bar => bar.time >= from && bar.time < to)
            .map(bar => ({
                time: bar.time * 1000, // Convert to milliseconds
                low: bar.low,
                high: bar.high,
                open: bar.open,
                close: bar.close,
            }));

        // Cache last bar for reference
        if (firstDataRequest && formattedBars.length > 0) {
            lastBarsCache.set(symbolInfo.full_name, formattedBars[formattedBars.length - 1]);
        }

        console.log(`[getBars]: Returning ${formattedBars.length} bar(s).`);
        onHistoryCallback(formattedBars, { noData: formattedBars.length > 0 ? false: true });

    } catch (error) {
        console.log("[getBars]: Error", error);
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

