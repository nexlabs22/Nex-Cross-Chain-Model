'use client';
import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { Box } from '@mui/material';
import theme from '@/theme/theme';

interface GenericLineChartProps {
  label1: string;
  label2: string;
}

const series1Data = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const series2Data = [2500, 2200, 1900, 3200, 2100, 2900, 3700];
const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const GenericLineChart = ({ label1, label2 }: GenericLineChartProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;

  const seriesColors = [
    theme.palette.brand.anfi.main,
    theme.palette.brand.arbei.main,
  ];

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {width > 0 && height > 0 && (
        <LineChart
          width={width}
          height={height}
          series={[
            {
              data: series1Data,
              label: label1,
              showMark: false,
              color: seriesColors[0],
            },
            {
              data: series2Data,
              label: label2,
              showMark: false,
              color: seriesColors[1],
            },
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              disableLine: true,
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              valueFormatter: (value: number) =>
                value > 0 ? `${value / 1000}k` : '0',
            },
          ]}
          margin={{
            left: 40,
            right: 20,
            top: 5,
            bottom: 5,
          }}
          sx={{
            '& .MuiLineChart-grid': {
              stroke: theme.palette.grey[300],
              strokeDasharray: '4',
            },
            '& .MuiLineChart-axis': {
              color: theme.palette.grey[600],
            },
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 4,
            },
            [`& .${chartsGridClasses.line}`]: {
              strokeWidth: 2,
              stroke: theme.palette.grey[600],
            },
          }}
          grid={{ vertical: true, horizontal: false }}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      )}
    </Box>
  );
};

export default GenericLineChart;
