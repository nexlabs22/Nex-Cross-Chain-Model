import { AssetWithWeight } from "@/types/indexTypes";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

interface VaultScaleProps {
    data: {
        index: AssetWithWeight;
        weight: number;
    }[];
}

const VaultScale = ({ data }: VaultScaleProps) => {
    const theme = useTheme();
    const sortedData = useMemo(() => [...data].sort((a, b) => b.weight - a.weight), [data]);
    const colors = ['#EF8E19', '#5F7AE3', '#006CA5'];
    const coloredWidth = 3;
    const gapWidth = 5;

    const [hoveredIndex, setHoveredIndex] = useState<{ segment: number; unit: number } | null>(null);

    return (
        <Stack width="100%" spacing={1}>
            <Stack width="100%" direction="row" height={250} alignItems="flex-end">
                {sortedData.map((item, segmentIndex) => {
                    const containerWidth = document.documentElement.clientWidth || window.innerWidth;
                    const segmentWidthPx = (item.weight / 100) * containerWidth;

                    const totalUnitWidth = coloredWidth + gapWidth;
                    const units = Math.floor(segmentWidthPx / totalUnitWidth);

                    const exactSegmentWidth = units * totalUnitWidth;

                    return (
                        <Box
                            key={item.index.symbol}
                            width={`${item.weight}%`}
                            overflow="hidden"
                            height="100%"
                            display="flex"
                            flexDirection="row"
                            alignItems="flex-end"
                            position="relative"
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={2}
                                position="absolute"
                                left="3%"
                                bottom="45%"
                            >
                                <Box width={40} height={40} borderRadius="50%">
                                    {item.index.logoComponent}
                                </Box>
                                <Stack>
                                    <Typography variant="h6">
                                        {item.index.name}
                                    </Typography>
                                    <Typography variant="body1" color={theme.palette.text.secondary}>
                                        {item.weight}%
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box
                                display="flex"
                                flexDirection="row"
                                height="100%"
                                alignItems="flex-end"
                                width={`${exactSegmentWidth}px`}
                            >
                                {[...Array(units)].map((_, unitIndex) => {
                                    const isHovered = hoveredIndex?.segment === segmentIndex && hoveredIndex?.unit === unitIndex;
                                    const isPrev = hoveredIndex?.segment === segmentIndex && hoveredIndex?.unit === unitIndex - 1;
                                    const isNext = hoveredIndex?.segment === segmentIndex && hoveredIndex?.unit === unitIndex + 1;

                                    return (
                                        <Box
                                            key={unitIndex}
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="flex-end"
                                            flexShrink={0}
                                            height="100%"
                                            onMouseEnter={() => setHoveredIndex({ segment: segmentIndex, unit: unitIndex })}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <Box
                                                className="tick"
                                                width={`${coloredWidth}px`}
                                                height={
                                                    isHovered && unitIndex !== 0 ? '35%' :
                                                    (isPrev || isNext) && unitIndex !== 0 ? '32%' :
                                                    unitIndex === 0 ? '85%' : '30%'
                                                }
                                                bgcolor={colors[segmentIndex % colors.length]}
                                                sx={{
                                                    transition: 'height 0.2s ease',
                                                }}
                                            />
                                            <Box
                                                className="gap"
                                                width={`${gapWidth}px`}
                                                height={unitIndex === 0 ? '100%' : '30%'}
                                                bgcolor="transparent"
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Stack>
    );
};

export default VaultScale;