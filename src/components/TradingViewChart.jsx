import React, { useEffect, useRef, useState } from "react";
import Datafeed from "./trading-view/datafeed";
import TradingView from "../charting_library/charting_library.standalone";
import { useLandingPageStore } from '@/store/store'

function compareArrays(oldArray, newArray) {
  const addedStrings = newArray.filter((item) => !oldArray.includes(item))
  const removedStrings = oldArray.filter((item) => !newArray.includes(item))

  return { addedStrings, removedStrings }
}

const colNameToSymbol = {
  sandp: 'GSPC',
  nasdaq: 'IXIC',
  dow: 'DJI',
  nyse: 'NYA',
  asml: 'ASML',
  paypal: 'PYPL',
  microsoft: 'MSFT',
  apple: 'AAPL',
  alphabet: 'GOOGL',
  amazon: 'AMZN',
  tencent: 'TCEHY',
  visa: 'V',
  tsmc: 'TSM',
  exxon_mob: 'XOM',
  unitedhealth_group: 'UNH',
  nvidia: 'NVDA',
  johnson_n_johnson: 'JNJ',
  lvmh: 'LVMHF',
  tesla: 'TSLA',
  jpmorgan: 'JPM',
  walmart: 'WMT',
  meta: 'META',
  spdr: 'SPY',
  mastercard: 'MA',
  chevron_corp: 'CVX',
  berkshire_hathaway: 'BRKA',
  gold: "GOLD",
  oil: "CRUDEOIL",
  copper: "COPPER",
  silver: "SILVER",
  bitcoin: "BTC",
}

const TradingViewChart = ({ index, selectedIndices }) => {

  const [wid, setWid] = useState()
  const chartContainerRef = useRef()
  const {mode } = useLandingPageStore()

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    const ind = index ? index : 'CRYPTO5'
    const widget = window.tvWidget = new TradingView.widget({
      symbol: `Nexlabs:${ind}/USD`,
      interval: "1D",
      // timeframe: '1Y',
      style: "2",
      fullscreen: true,
      theme: mode,
      container: chartContainerRef.current,
      allow_symbol_change: false,
      datafeed: Datafeed,
      autosize: true,
      overrides: {
        'mainSeriesProperties.style': 2,
        "paneProperties.background": "#020024",
      },
      custom_css_url: 'css/style.css',
      library_path: "/charting_library/",
      time_frames: [
        { text: '1M', resolution: '1D', description: '1 month', title: '1M' },
        { text: '3M', resolution: '1D', description: '2 month', title: '3M' },
        { text: '6m', resolution: '1D', description: '6 month', title: '6M' },
        { text: '1y', resolution: '1D', description: '1 year', title: '1Y' },
        { text: '3y', resolution: '1D', description: '3 year', title: '3Y' },
        { text: '5y', resolution: '1D', description: '5 year', title: '5Y' },
        { text: "100y", resolution: '1D', description: "All", title: 'All' },
      ],
    });

    widget.onChartReady(() => {
      setWid(widget)
    })

    return () => script.remove();
  }, []);

  useEffect(() => {
    if (wid && wid.setSymbol) {
      wid.setSymbol(`Nexlabs:${index}/USD`, 'D');
    }
  }, [index, wid])

  useEffect(() => {
    if (wid && wid.changeTheme) {
      wid.changeTheme(mode);
    }
  }, [mode, wid])

  const [oldSelectedIndices, setOldSelectedIndices] = useState([])
  const [ids, setIds] = useState({})
  useEffect(() => {
    if (wid && wid.activeChart) {
      const newSelectedIndices = selectedIndices
      const { addedStrings, removedStrings } = compareArrays(oldSelectedIndices, newSelectedIndices)

      addedStrings.map((index) => {
        const indName = index && colNameToSymbol[index] ? `Nexlabs:${colNameToSymbol[index]}/USD` : ''
        wid.activeChart()
          .createStudy('Compare', false, false, { source: 'open', symbol: `${indName}` })
          .then((id) => {
            const idList = ids
            idList[index] = id
            setIds(idList)
          })
      })
      removedStrings.map((index) => {
        const id = ids[index]
        wid.activeChart().removeEntity(id)
      })
      setOldSelectedIndices(newSelectedIndices)
    }
  }, [selectedIndices, wid])


  // <div 
  // id="tv_chart_container"></div>;
  return <div
    // id="tv_chart_container"
    ref={chartContainerRef}
    className="w-screen max-h-full h-full rounded-xl"
    style={{
      width: '100%',
      overflow: 'hidden',
      zIndex: 1,
    }}
  // className={ 'TVChartContainer' }
  />;
};

export default TradingViewChart;

// import React, { useEffect } from "react";
// import Datafeed from "./trading-view/datafeed";
// import TradingView from "../charting_library/charting_library.standalone";

// const TradingViewChart = ({ index }) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.type = "text/jsx";
//     script.src = "public/charting_library/charting_library.js";
//     document.head.appendChild(script);

//     let tvWidget;

//     const initializeChart = () => {
//       tvWidget = new TradingView.widget({
//         symbol: `NexLabs:${index}/USD`,
//         interval: "1D",
//         style: "2",
//         fullscreen: true,
//         container: "tv_chart_container",
//         allow_symbol_change: false,
//         datafeed: Datafeed,
//         library_path: "/charting_library/",
//       });

//       // Add a comparison symbol after initializing the main chart
//       addComparisonCrypto("NexLabs:ANFI/USD");
//     };

//     const addComparisonCrypto = (newSymbol) => {
//       if (tvWidget) {
//         console.log(tvWidget)
//         // Access the chart directly from the tvWidget instance
//         // const chart = tvWidget.chart();
//         // chart.addSymbol(newSymbol, "compare");
//       }
//     };

//     initializeChart();

//     return () => {
//       if (tvWidget) {
//         tvWidget.remove();
//       }
//       script.remove();
//     };
//   }, [index]);

//   return <div id="tv_chart_container"></div>;
// };

// export default TradingViewChart;