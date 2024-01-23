import React, { useEffect } from "react";
import Datafeed from "./trading-view/datafeed";
import TradingView from "../charting_library/charting_library.standalone";

const TradingViewChart = ({index}) => {

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    var widget = window.tvWidget = new TradingView.widget({
      symbol: `NexLabs:${index}/USD`, 
      interval: "1D", 
      style: "2",
      fullscreen: true, 
      container: "tv_chart_container",
      allow_symbol_change: false,
      datafeed: Datafeed,
      compare_symbols: [
				{ symbol: 'NexLabs:ANFI/USD', title: 'Delta Air Lines' },
				{ symbol: 'V', title: 'Verizon' },
				// ...
			],
      library_path: "/charting_library/",
    });

    console.log(widget)

    // function addComparisonCrypto(newSymbol) {
    //   if(window.tvWidget){
    //     window.tvWidget.chart().createStudy('Compare', false, false, ["open", newSymbol]);;
    //   }
    // }


    // addComparisonCrypto('NexLabs:ANFI/USD')
    
    return () => script.remove();
  }, [index]); 

  return <div id="tv_chart_container"></div>;
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