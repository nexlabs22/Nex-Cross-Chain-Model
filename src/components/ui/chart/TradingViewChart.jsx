"use client";

import React, { useEffect, useRef } from "react";
import Datafeed from "@/utils/trading-view/datafeed";
import TradingView from "../../../../public/charting_library/charting_library.standalone";

const TradingViewChart = () => {
  const chartContainerRef = useRef();
  const mode = "dark";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    // const ind = index ? index : 'CRYPTO5'
    window.tvWidget = new TradingView.widget({
      symbol: `Bitfinex:BTC/USD`,
      interval: "1D",
      height: chartContainerRef.current.clientHeight - 10,
      width: chartContainerRef.current.clientWidth,
      style: "2",
      fullscreen: false,
      theme: mode,
      container: chartContainerRef.current,
      allow_symbol_change: false,
      datafeed: Datafeed,
      autosize: true,
      enabled_features: ["header_in_fullscreen_mode"],
      overrides: {
        "mainSeriesProperties.style": 2,
        "paneProperties.background": "#020024",
      },
      library_path: "/charting_library/",
      time_frames: [
        { text: "1M", resolution: "1D", description: "1 month", title: "1M" },
        { text: "3M", resolution: "1D", description: "2 month", title: "3M" },
        { text: "6m", resolution: "1D", description: "6 month", title: "6M" },
        { text: "1y", resolution: "1D", description: "1 year", title: "1Y" },
        { text: "3y", resolution: "1D", description: "3 year", title: "3Y" },
        { text: "5y", resolution: "1D", description: "5 year", title: "5Y" },
        { text: "100y", resolution: "1D", description: "All", title: "All" },
      ],
    });

    return () => script.remove();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    />
  );
};

export default TradingViewChart;
