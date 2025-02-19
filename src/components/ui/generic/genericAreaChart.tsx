"use client"

import { areaElementClasses, LineChart } from "@mui/x-charts/LineChart"
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks"
import { ScaleLinear } from "d3-scale"
import theme from "@/theme/theme"
import { GlobalStyles } from "@mui/material"

interface GenericAreaLineChartProps {
  label: string
  chartData: { xValue: number[]; yValue: number[] | string[] }
}

function ColorPalette({ id }: { id: string }) {
  const { top, height, bottom } = useDrawingArea()
  const svgHeight = top + bottom + height

  const scale = useYScale() as ScaleLinear<number, number> // You can provide the axis Id if you have multiple ones

  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        x2="0"
        y1="0"
        y2={`${svgHeight}px`}
        gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
      >
        <stop
          offset={scale(1000) / svgHeight}
          stopColor={theme.palette.brand.greenAreaChart1.main}
          stopOpacity={1}
        />
        <stop
          offset={scale(0) / svgHeight}
          stopColor={theme.palette.brand.greenAreaChart2.main}
          stopOpacity={1}
        />
      </linearGradient>
    </defs>
  )
}

const GenericAreaLineChart = ({
  label,
  chartData,
}: GenericAreaLineChartProps) => {
  return (
    <>
      <GlobalStyles
        styles={{
          ".customTooltipRoot": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px 0px 0px 0px !important",
            borderRadius: "4px",
            width: "fit-content",
            border: `none !important`,
            minWidth: "none !important",
            boxShadow: `0px 0px 1px 1px ${theme.palette.elevations.elevation800.main} !important`,
            maxWidth: "fit-content !important",
          },
          ".customTooltipTable": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px 0px 0px 0px !important",
            borderRadius: "0px",
            width: "100%",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
            borderStyle: "dotted",
          },
          ".customTooltipPaper": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px 0px 0px 0px !important",
            borderRadius: "0px",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
            maxWidth: "fit-content !important",
          },
          ".customTooltipRow": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px 0px 0px 0px !important",
            borderRadius: "0px",
            width: "100%",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          ".customTooltipTableCell": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px",
            borderRadius: "0px",
            width: "100%",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          ".customTooltipMarkCell": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px",
            borderRadius: "0px",
            width: "fit-content",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          ".customTooltipLabelCell": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px",
            borderRadius: "0px",
            width: "fit-content",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          ".customTooltipValueCell": {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: "0px",
            borderRadius: "0px",
            width: "fit-content",
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
        }}
      />
      <LineChart
        series={[
          { data: chartData.xValue, label: label, area: true, showMark: false },
        ]}
        xAxis={[
          { scaleType: "point", data: chartData.yValue, hideTooltip: true },
        ]}
        yAxis={[
          {
            scaleType: "linear",
            min: Math.min(...chartData.xValue) * 0.9, // Adds padding below the min value
            max: Math.max(...chartData.xValue) * 1.1, // Adds padding above the max value
          },
        ]}
        leftAxis={null}
        bottomAxis={null}
        tooltip={{
          classes: {
            root: "customTooltipRoot",
            paper: "customTooltipPaper",
            table: "customTooltipTable",
            row: "customTooltipRow",
            cell: "customTooltipTableCell",
            mark: "customTooltipMark",
            markCell: "customTooltipMarkCell",
            labelCell: "customTooltipLabelCell",
            valueCell: "customTooltipValueCell",
          },
          trigger: "axis",
        }}
        slotProps={{
          legend: { hidden: true },
          area: { begin: "url(#colorUv)" },
        }}
        margin={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: "url(#swich-color-id-2)",
          },
          "& .MuiChartsTooltip-root": {
            display: "none",
          },
          "& .MuiChartsTooltip-paper": {
            display: "none",
          },
        }}
      >
        <ColorPalette id="swich-color-id-2" />
      </LineChart>
    </>
  )
}

export default GenericAreaLineChart
