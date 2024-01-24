import React, { useEffect, useRef, useState } from "react";
import Datafeed from "./trading-view/datafeed";
import TradingView from "../charting_library/charting_library.standalone";

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
  // "GC=F": "gold",
  // "CL=F": "oil",
  asml: 'ASML',
  paypal: 'PYPL',
  // "HG=F": "copper",
  microsoft: 'MSFT',
  apple: 'AAPL',
  alphabet: 'GOOGL',
  // "SI=F": "silver",
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
}

const TradingViewChart = ({ index, selectedIndices }) => {

  const [wid, setWid] = useState()
  const chartContainerRef = useRef()

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    const widget = window.tvWidget = new TradingView.widget({
      symbol: `NexLabs:CRYPTO5/USD`,
      interval: "1D",
      style: "2",
      fullscreen: true,
      // container: "tv_chart_container",
      container: chartContainerRef.current,
      allow_symbol_change: false,
      datafeed: Datafeed,
      autosize: true,
      library_path: "/charting_library/",
    });

    widget.onChartReady(() => {
      setWid(widget)
    })

    return () => script.remove();
  }, []);

  useEffect(() => {
    if (wid && wid.setSymbol) {
      wid.setSymbol(`NexLabs:${index}/USD`, 'D', () => {
        // Your callback function
      });
    }
  }, [index, wid])

  const [oldSelectedIndices, setOldSelectedIndices] = useState([])
  const [ids, setIds] = useState({})
  useEffect(() => {
    if (wid && wid.activeChart) {
      const newSelectedIndices = selectedIndices
      const { addedStrings, removedStrings } = compareArrays(oldSelectedIndices, newSelectedIndices)

      addedStrings.map((index) => {
        const indName = index && colNameToSymbol[index] ? `NexLabs:${colNameToSymbol[index]}/USD` : ''
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
    className="w-screen"
    style={{
      width: '100%',
      height: '100%',
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