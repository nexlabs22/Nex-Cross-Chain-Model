'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, GlobalStyles } from '@mui/material';
import theme from '@/theme/theme';

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
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
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
        <PieChart
          series={[
            {
              data: data.map((value, index) => ({
                value,
                label: labels[index],
                color: colors[index],
              })),
              innerRadius,
              outerRadius,
              paddingAngle: 5,
              cornerRadius: 10,
              startAngle: 0,
              endAngle: 360,
              cx,
              cy,
            },
          ]}
          slotProps={{
            legend: { hidden: true },
            pieArc: { stroke: 'none', strokeWidth: 0 },
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
            trigger: 'item',
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
