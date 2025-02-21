"use client";

import React, { useEffect, useRef, useState } from "react";
import Datafeed from "@/utils/trading-view/datafeed";
import TradingView from "../../../../public/charting_library/charting_library.standalone";
import { Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { useTrade } from "@/providers/TradeProvider";
import { isIndexCryptoAsset } from "@/utils/general";

const TradingViewChart = ({ index }) => {
  const chartContainerRef = useRef();
  const pathname = usePathname();
  const [wid, setWid] = useState();
  const { swapFromToken, swapToToken } = useTrade();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    const ind = index || "CRYPTO5";
    const widget = (window.tvWidget = new TradingView.widget({
      symbol: `Nexlabs:${ind}/USD`,
      interval: "1D",
      height: chartContainerRef.current.clientHeight - 10,
      width: chartContainerRef.current.clientWidth,
      style: "2",
      fullscreen: false,
      theme: "dark",
      container: chartContainerRef.current,
      allow_symbol_change: false,
      datafeed: Datafeed,
      autosize: true,
      enabled_features: [
        "header_in_fullscreen_mode",
        "library_custom_color_themes",
      ],
      overrides: {
        "mainSeriesProperties.style": 2,
        "paneProperties.backgroundType": "solid",
        "paneProperties.background": "#171717",
        "paneProperties.separatorColor": "#171717",
      },
      custom_css_url: "/static/tradingview-custom.css",
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
    }));
    widget.onChartReady(() => {
      setWid(widget);
    });

    return () => script.remove();
  }, [index]);

  useEffect(() => {
    if (wid && pathname === "/trade") {
      const symbolToSet = isIndexCryptoAsset(swapFromToken)
        ? swapFromToken.symbol
        : swapToToken.symbol;
      wid.setSymbol(`Nexlabs:${symbolToSet}/USD`, "D");
    }
  }, [pathname, wid, swapFromToken, swapToToken]);

  return (
    <Stack
      ref={chartContainerRef}
      sx={{
        width: "100%",
        height: "100%",
        zIndex: 1,
        borderRadius: 2,
      }}
    />
  );
};

export default TradingViewChart;
