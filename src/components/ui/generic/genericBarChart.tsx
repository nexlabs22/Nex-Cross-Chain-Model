'use client';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import theme from '@/theme/theme';
import { Box, Stack, Typography } from '@mui/material';

const GenericBarChart = () => {
  // Hardcoded data for the bar chart
  const data = [3000, 4000, 5000]; // Values for each bar
  const labels = ['ANFI', 'CR5', 'ARBEI']; // Labels for each bar
  const colors = [
    theme.palette.brand.anfi.main,
    theme.palette.brand.cr5.main,
    theme.palette.brand.arbei.main,
  ];

  return (
    <Stack gap={3} height={'100%'} width={'100%'}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: labels, disableLine: true, colorMap: {
            type: 'piecewise',
            thresholds: data,
            colors: colors,
          } }]} 
        yAxis={[{ disableLine: true, valueFormatter: (value: number) => (value > 0 ? `${value / 1000}k` : '0') }]}
        series={[
          {
            data: data,
          },
        ]}
        margin={{
          left: 40,
          right: 20,
          top: 5,
          bottom: 5,
        }}
        tooltip={undefined}
        borderRadius={10}
        slotProps={{
          legend: {
            hidden: true,
          },
          axisLine:{
            opacity: 0
          },
          axisLabel: {
            opacity: 0
          },
          axisTick: {
            opacity: 0
          },
          axisTickLabel: {
            opacity: 0
          },
        }}
        sx={{
          width: '100%',
          height: '100%',
          padding: 0,
          display: 'block',
          position: 'relative',
        }}
      />
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
        {labels.map((label, index) => (
          <Stack key={index} direction={'row'} alignItems={'center'} gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: colors[index],
                borderRadius: '50%',
              }}
            />
            <Typography variant={'body1'} color={'text.secondary'}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default GenericBarChart;
