'use client'
import * as React from 'react';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';
import { useYScale, useDrawingArea } from '@mui/x-charts/hooks';
import { ScaleLinear } from 'd3-scale';
import theme from '@/theme/theme';
import { Stack } from '@mui/material';

interface GenericAreaLineChartProps {
    label: string;
}

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

function ColorPalette({ id }: { id: string }) {
    const { top, height } = useDrawingArea();
    const scale = useYScale() as ScaleLinear<number, number>;

    return (
        <defs>
            <linearGradient
                id={id}
                x1="0"
                x2="0"
                y1={top}
                y2={top + height}
                gradientUnits="userSpaceOnUse"
            >
                <stop
                    offset={(scale(3000) - top) / height}
                    stopColor={theme.palette.brand.greenAreaChart1.main}
                    stopOpacity={1}
                />
                <stop
                    offset={(scale(0) - top) / height}
                    stopColor={theme.palette.brand.greenAreaChart2.main}
                    stopOpacity={1}
                />
            </linearGradient>
        </defs>
    );
}

const GenericAreaLineChart = ({ label }: GenericAreaLineChartProps) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <LineChart
                series={[{ data: uData, label: label, area: true, showMark: false }]}
                xAxis={[{ scaleType: 'point', data: xLabels, hideTooltip: true }]}
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
        </div>
    );
}

export function ChartWrapper() {
    return (
        <Stack
            width={'100%'}
            height={{ xs: '16vh', lg: 100 }}
            marginX={'auto'}
            paddingTop={{ xs: 3, lg: 0 }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <GenericAreaLineChart label="Your Label" />
        </Stack>
    );
}

export default GenericAreaLineChart;