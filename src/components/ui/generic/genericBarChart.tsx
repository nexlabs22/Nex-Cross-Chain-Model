'use client';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import theme from '@/theme/theme';
import { Box, GlobalStyles } from '@mui/material';

const GenericBarChart = () => {
  // Create a ref to measure the container's dimensions.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const updateDimensions = React.useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, []);

  React.useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const { width, height } = dimensions;

  // Your unified data array.
  const exampleData = [
    {
      value: 3000,
      label: 'ANFI',
      color: theme.palette.brand.anfi.main,
    },
    {
      value: 4000,
      label: 'CR5',
      color: theme.palette.brand.cr5.main,
    },
    {
      value: 5000,
      label: 'ARBEI',
      color: theme.palette.brand.arbei.main,
    },
  ];

  // Extract labels.
  const labels = exampleData.map((item) => item.label);

  // Transform data: one series per category with nulls for other positions.
  const series = exampleData.map((item, idx) => ({
    data: exampleData.map((_, j) => (j === idx ? item.value : null)),
    color: item.color,
    label: item.label,
    stacked: true,
  }));

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
            padding: '0px',
            borderRadius: '4px',
            width: 'fit-content',
          },
          '.customTooltipTable': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
          },
          '.customTooltipPaper': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
          },
          '.customTooltipRow': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
          },
          '.customTooltipTableCell': {
            backgroundColor: theme.palette.elevations.elevation900.main,
            color: theme.palette.text.primary,
            padding: '0px',
            borderRadius: '0px',
            width: 'fit-content',
          },
        }}
      />
      {width > 0 && height > 0 && (
        <BarChart
          width={width}
          height={height}
          xAxis={[
            {
              scaleType: 'band',
              data: labels,
              disableLine: true
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              valueFormatter: (value: number) => (value > 0 ? `${value / 1000}k` : '0'),
            },
          ]}
          series={series}
          margin={{
            left: 40,
            right: 20,
            top: 5,
            bottom: 5,
          }}
          tooltip={{
            classes: {
              root: 'customTooltipRoot',
              paper: 'customTooltipPaper',
              table: 'customTooltipTable',
              row: 'customTooltipRow',
              cell: 'customTooltipTableCell',
            },
            trigger: 'item', // or 'axis' if desired
          }}
          borderRadius={10}
          slotProps={{
            legend: { hidden: true },
            axisLine: { opacity: 0 },
            axisLabel: { opacity: 0 },
            axisTick: { opacity: 0 },
            axisTickLabel: { opacity: 0 },
          }}
          sx={{
            padding: 0,
            display: 'block',
            position: 'relative',
          }}
        />
      )}
    </Box>
  );
};

export default GenericBarChart;
