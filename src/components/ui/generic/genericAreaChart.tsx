'use client'
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';
import { useYScale, useDrawingArea } from '@mui/x-charts/hooks';
import { ScaleLinear } from 'd3-scale';
import theme from '@/theme/theme';

interface GenericAreaLineChartProps {
    label: string;
    chartData: {xValue: number[], yValue: number[]|string[]};
}


function ColorPalette({ id }: { id: string }) {
    const { top, height, bottom } = useDrawingArea();
    const svgHeight = top + bottom + height;

    const scale = useYScale() as ScaleLinear<number, number>; // You can provide the axis Id if you have multiple ones

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
                <stop offset={scale(0) / svgHeight} stopColor={theme.palette.brand.greenAreaChart2.main} stopOpacity={1} />

            </linearGradient>
        </defs>
    );
}

const GenericAreaLineChart = ({ label, chartData }: GenericAreaLineChartProps) => {

    return (
        <LineChart
            series={[{ data: chartData.xValue, label: label, area: true, showMark: false }]}
            xAxis={[{ scaleType: 'point', data: chartData.yValue, hideTooltip: true }]}
            yAxis={[
                { 
                    scaleType: 'linear', 
                    min: Math.min(...chartData.xValue) * 0.9,  // Adds padding below the min value
                    max: Math.max(...chartData.xValue) * 1.1,  // Adds padding above the max value
                }
            ]}
            leftAxis={null}
            bottomAxis={null}
            tooltip={undefined}
            slotProps={{
                legend: { hidden: true },
                area: { begin: 'url(#colorUv)' },
            }}
            margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }}
            sx={{
                [`& .${areaElementClasses.root}`]: {
                    fill: 'url(#swich-color-id-2)',
                },
            }}
        >
            <ColorPalette id="swich-color-id-2" />
        </LineChart>
    );
}

export default GenericAreaLineChart