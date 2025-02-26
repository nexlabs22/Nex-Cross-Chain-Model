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
    const coloredWidth = 3; // Fixed width for colored ticks
    const gapWidth = 5; // Fixed width for transparent gaps

    // State to track the hovered tick
    const [hoveredIndex, setHoveredIndex] = useState<{ segment: number; unit: number } | null>(null);

    return (
        <Stack width="100%" spacing={1}>
            <Stack width="100%" direction="row" height={250} alignItems="flex-end">
                {sortedData.map((item, segmentIndex) => {
                    // Calculate total segment width in pixels
                    const containerWidth = document.documentElement.clientWidth || window.innerWidth;
                    const segmentWidthPx = (item.weight / 100) * containerWidth;

                    // Calculate number of tick-gap pairs needed
                    const totalUnitWidth = coloredWidth + gapWidth;
                    const units = Math.floor(segmentWidthPx / totalUnitWidth);

                    // Calculate exact width needed to prevent subpixels
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
                            {/* Label and Logo */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={2}
                                position="absolute"
                                left="10px"
                                bottom="40%"
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

                            {/* Ticks and Gaps */}
                            <Box
                                display="flex"
                                flexDirection="row"
                                height="100%"
                                alignItems="flex-end"
                                width={`${exactSegmentWidth}px`}
                            >
                                {[...Array(units)].map((_, unitIndex) => {
                                    // Check if the current tick is hovered or adjacent to the hovered tick
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
                                            {/* Colored Tick */}
                                            <Box
                                                className="tick"
                                                width={`${coloredWidth}px`}
                                                height={
                                                    isHovered && unitIndex !== 0 ? '35%' :
                                                    (isPrev || isNext) && unitIndex !== 0 ? '32%' :
                                                    unitIndex === 0 ? '100%' : '30%'
                                                }
                                                bgcolor={colors[segmentIndex % colors.length]}
                                                sx={{
                                                    transition: 'height 0.2s ease, opacity 0.2s ease',
                                                    opacity: hoveredIndex ? (
                                                        isHovered ? 1 : // Hovered tick: 100% opacity
                                                        isPrev || isNext ? 0.8 : // Adjacent ticks: 80% opacity
                                                        0.5 // All other ticks: 50% opacity
                                                    ) : 1, // Default: 100% opacity
                                                }}
                                            />
                                            {/* Transparent Gap */}
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