'use client';
import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { Box, GlobalStyles } from '@mui/material';
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
        <GlobalStyles
        styles={{
          '.customTooltipRoot': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px 0px 0px 0px !important',
            borderRadius: '4px',
            width: 'fit-content',
            border: `none !important`,
            boxShadow: `0px 0px 1px 1px ${theme.palette.elevations.elevation800.main} !important`,
            minWidth: 'none !important',
            maxWidth: 'fit-content !important',
          },
          '.customTooltipTable': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px 0px 0px 0px !important',
            borderRadius: '0px',
            width: '100%',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
            borderStyle: 'dotted',
          },
          '.customTooltipPaper': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px 0px 0px 0px !important',
            borderRadius: '0px',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
            maxWidth: 'fit-content !important',
          },
          '.customTooltipRow': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px 0px 0px 0px !important',
            borderRadius: '0px',
            width: '100%',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          '.customTooltipTableCell': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: '100%',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          '.customTooltipMarkCell': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          '.customTooltipLabelCell': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
          '.customTooltipValueCell': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
            border: `0px solid ${theme.palette.elevations.elevation900.main} !important`,
          },
        }}
      />
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
          tooltip={{
            classes: {
                root: 'customTooltipRoot',
                paper: 'customTooltipPaper',
                table: 'customTooltipTable',
                row: 'customTooltipRow',
                cell: 'customTooltipTableCell',
                mark: 'customTooltipMark',
                markCell: 'customTooltipMarkCell',
                labelCell: 'customTooltipLabelCell',
                valueCell: 'customTooltipValueCell',
              },
            trigger: 'axis',
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
