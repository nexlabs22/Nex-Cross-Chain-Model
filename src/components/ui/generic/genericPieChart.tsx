'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import theme from '@/theme/theme';
import { Box, Stack, Typography } from '@mui/material';

const GenericPieChart = () => {
    const data = [30, 40, 50]; // Pie slices values
    const labels = ['ANFI', 'CR5', 'ARBEI']; // Pie slices labels
    const colors = [theme.palette.brand.anfi.main, theme.palette.brand.cr5.main, theme.palette.brand.arbei.main];
    return (
        <Stack gap={3} height={'100%'} width={'100%'}>
            <PieChart
                series={[
                    {
                        data: data.map((value, index) => ({
                            value, // The value of each slice
                            label: labels[index],
                            color: colors[index],// The label for each slice
                        })),
                        innerRadius: 40, // Inner radius for donut effect
                        outerRadius: 90, // Outer radius of the pie
                        paddingAngle: 5, // Space between slices
                        cornerRadius: 10, // Rounded corners for slices
                        startAngle: 0, // Starting angle for the chart
                        endAngle: 360, // Ending angle for the chart
                        cx: 150, // Center X position of the pie chart
                        cy: 90, // Center Y position of the pie chart
                    },
                ]}
                slotProps={{
                    legend: {
                        hidden: true,
                    },
                }}
                sx={{
                    width: '100%',
                    height: '100%',
                    marginBottom: 1,
                    padding: 0,
                    display: 'block',
                    position: 'relative',
                }}
            />
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                {
                    labels.map((label, index) => (
                        <Stack key={index} direction={'row'} alignItems={'center'} gap={1}>
                            <Box sx={{
                                width: 10,
                                height: 10,
                                backgroundColor: colors[index],
                                borderRadius: '50%',
                            }} />
                            <Typography variant={'body1'} color={'text.secondary'}>
                                {label}
                            </Typography>
                        </Stack>
                    ))
                }
            </Stack>
        </Stack>
    );
};

export default GenericPieChart;
