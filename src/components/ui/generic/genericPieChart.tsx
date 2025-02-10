'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import theme from '@/theme/theme';
import { Box } from '@mui/material';

const GenericPieChart = () => {
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

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) * 0.4;
  const innerRadius = outerRadius * 0.4;

  const data = [30, 40, 50];
  const labels = ['ANFI', 'CR5', 'ARBEI'];
  const colors = [
    theme.palette.brand.anfi.main,
    theme.palette.brand.cr5.main,
    theme.palette.brand.arbei.main,
  ];

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: '100%' }}>
      {width > 0 && height > 0 && (
        <PieChart
          series={[
            {
              data: data.map((value, index) => ({
                value,
                label: labels[index],
                color: colors[index],
              })),
              innerRadius: innerRadius,
              outerRadius: outerRadius,
              paddingAngle: 5,
              cornerRadius: 10,
              startAngle: 0,
              endAngle: 360,
              cx: cx,
              cy: cy,
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
            pieArc: {
              stroke: 'none',
              strokeWidth: 0,
            },
          }}
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'relative',
          }}
        />
      )}
    </Box>
  );
};

export default GenericPieChart;
