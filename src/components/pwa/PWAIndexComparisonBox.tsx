import { Stack, Container, Box, Chip, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PWAComparisonChip } from "@/theme/overrides";

const PWAIndexComparisonBox = () => {
    return (
        <Stack width={"100%"} height={"fit-content"} direction={"row"} marginTop={0.5} alignItems={"center"} justifyContent={"start"} id="PWAIndexComparisonSlider">
            <Slider
                dots={false}
                infinite={false}
                speed={500}
                slidesToShow={4}
                slidesToScroll={4}
                autoplay={false}
                centerMode={false}
                arrows={false}
                className="relative m-0 h-full w-full p-0"
                responsive={[
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: true,
                        },
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            initialSlide: 2,
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                ]}
            >
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                <Stack width={"25vw"} height={"fit-content"} direction={"row"} paddingY={0.8} paddingX={0.6} alignItems={"center"} justifyContent={"space-between"} sx={PWAComparisonChip}>
                    <Stack width={"3rem"} bgcolor={"#F4A100"} sx={{
                        aspectRatio: "1"
                    }}></Stack>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 700,
                        marginRight: "0.3rem"
                    }}>
                        BTC
                    </Typography>
                </Stack>
                


            </Slider>
        </Stack>
    )
}

export default PWAIndexComparisonBox