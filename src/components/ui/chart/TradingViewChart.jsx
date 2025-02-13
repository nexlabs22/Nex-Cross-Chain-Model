"use client";

import React, { useEffect, useRef } from "react";
import Datafeed from "@/utils/trading-view/datafeed";
import TradingView from "../../../../public/charting_library/charting_library.standalone";
import { Stack } from "@mui/material";

const TradingViewChart = ({ index }) => {
  const chartContainerRef = useRef();
  
  useEffect(() => {

    const script = document.createElement("script");
    script.type = "text/jsx";
    script.src = "public/charting_library/charting_library.js";
    document.head.appendChild(script);
    const ind = index || 'CRYPTO5'
    window.tvWidget = new TradingView.widget({
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
      enabled_features: ["header_in_fullscreen_mode", "library_custom_color_themes"],
      overrides: {
        'mainSeriesProperties.style': 2,
        "paneProperties.backgroundType": "solid",
        "paneProperties.background": "#0A0A0A",
        "paneProperties.separatorColor": "#0A0A0A",
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
      onChartReady: () => {
        // Now that the chart is ready, the customThemes API should be available.
        window.tvWidget.customThemes()
          .then(api => {
            // You can now use the API to update the theme dynamically.
            console.log("Custom Themes API is available.", api);
            api.applyCustomThemes({ dark: customDarkPalette });
          })
          .catch(error => {
            console.error("Custom Themes API error:", error);
          });
      }
    });
    

    return () => script.remove();
  }, [index]);

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
