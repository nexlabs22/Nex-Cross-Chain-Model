import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useLandingPageStore } from "@/store/store";
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoMdArrowForward } from "react-icons/io";
import mediaBG from "@assets/images/NEX_media_bg.webp";
import { Stack, Box, Typography } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { useMediaQuery } from '@mui/material';

const PWATopStories = () => {
    const { selectedSlideIndex, changeSelectedSlideIndex, theme } =
        useLandingPageStore();
    const isLandscape = useMediaQuery('(orientation: landscape)'); 
    const articles = [
        {
            title: "NEX Joins Chainlink BUILD",
            source: "Mirror.xyz - NexLabs",
            link: "https://mirror.xyz/0xdd1ab1748180823cC8C4b0085B69723094aB2c9a/wxicrxLtCeD508d_uVg-WRgMYEJ1JV5Ndru1H_rDEjU",
            image: "https://images.mirror-media.xyz/publication-images/5XkeFZlY1Wh_BF8TTlSuh.jpeg?height=640&width=1280",
        },
        {
            title: "Maximize Your Investment Strategy with Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/maximize-your-investment-strategy-with-indices-18c53defb0e7",
            image: mediaBG.src,
        },
        {
            title: "Introducing Nex Labs: A Decentralized Exchange of Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/introducing-nex-labs-a-decentralized-exchange-on-polygon-a339659bfd7b",
            image: mediaBG.src,
        },
        {
            title: "Maximize Your Investment Strategy with Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/maximize-your-investment-strategy-with-indices-18c53defb0e7",
            image: mediaBG.src,
        },
        {
            title: "Introducing Nex Labs: A Decentralized Exchange of Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/introducing-nex-labs-a-decentralized-exchange-on-polygon-a339659bfd7b",
            image: mediaBG.src,
        },
        {
            title: "Maximize Your Investment Strategy with Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/maximize-your-investment-strategy-with-indices-18c53defb0e7",
            image: mediaBG.src,
        },
        {
            title: "Introducing Nex Labs: A Decentralized Exchange of Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/introducing-nex-labs-a-decentralized-exchange-on-polygon-a339659bfd7b",
            image: mediaBG.src,
        },
        {
            title: "Maximize Your Investment Strategy with Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/maximize-your-investment-strategy-with-indices-18c53defb0e7",
            image: mediaBG.src,
        },
        {
            title: "Introducing Nex Labs: A Decentralized Exchange of Indices",
            source: "Medium - NexLabs",
            link: "https://nexlabs.medium.com/introducing-nex-labs-a-decentralized-exchange-on-polygon-a339659bfd7b",
            image: mediaBG.src,
        },
    ];
    function nextArticle() {
        if (selectedSlideIndex < articles.length) changeSelectedSlideIndex(selectedSlideIndex + 1)
    }
    function prevArticle() {
        if (selectedSlideIndex > 0) changeSelectedSlideIndex(selectedSlideIndex - 1)
    }
    return (
        <Stack width={"100%"} height={"fit-content"} marginBottom={"5rem"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Top stories
                </Typography>
                <IoMdArrowForward size={30} color={lightTheme.palette.text.primary} />
            </Stack>

            <Stack width={"100%"}>
                <Carousel
                    className="m-0 h-full w-full p-0"
                    infiniteLoop={true}
                    showIndicators={false}
                    autoPlay={true}
                    interval={8000}
                    showStatus={false}
                    showArrows={false}
                    showThumbs={false}
                    swipeable={true}
                    selectedItem={selectedSlideIndex}
                    preventMovementUntilSwipeScrollTolerance={true}
                    swipeScrollTolerance={50}
                    onChange={(item, index) => {
                        changeSelectedSlideIndex(item);
                    }}
                >
                    {articles.map((item, id) => {
                        return (
                            <Stack
                                key={id}
                                height={isLandscape ? "60vh" : "30vh"} width={"100%"} direction={"column"} alignItems={"start"} justifyContent={"end"} gap={1.5} borderRadius={"1.2rem"} padding={{ xs: 2, md: 4 }}
                                className=""
                                sx={{
                                    backgroundImage: `url('${mediaBG.src}')`,
                                    boxShadow:
                                        theme.palette.mode == "dark"
                                            ? `0px 0px 6px 1px rgba(91,166,153,0.68)`
                                            : "",
                                    backgroundPosition: "center",
                                    backgroundSize: "100% 100%",
                                    backgroundRepeat: "no-repeat"
                                }}
                            >
                                <Typography variant="caption">{item.source}</Typography>
                                <Link href={item.link} target="_blank">
                                    <Typography variant="subtitle1" align="left" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                                </Link>
                            </Stack>
                        );
                    })}
                </Carousel>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"fit-content"} width={"100%"} gap={1}>
                <IoIosArrowRoundBack size={34} color="#5E869B" onClick={() => { prevArticle() }} />
                <Stack marginY={2} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={0.5}>
                    {articles.map((item, id) => {
                        return id == selectedSlideIndex ? (
                            <Stack key={id} onClick={() => { changeSelectedSlideIndex(id) }} height={{ xs: "0.5rem", md: "1rem" }} width={{ xs: "2rem", md: "3rem" }} borderRadius={"30px"} bgcolor={"#5E869B"}></Stack>
                        ) : (
                            <Stack
                                key={id}
                                onClick={() => { changeSelectedSlideIndex(id) }}
                                className={`h-2 w-3 rounded-full md:h-4 md:w-6 ${theme.palette.mode == "dark" ? " bg-[#5E869B] " : "bg-slate-400"
                                    }`}
                            >
                                <Stack key={id} onClick={() => { changeSelectedSlideIndex(id) }} height={{ xs: "0.5rem", md: "1rem" }} width={{ xs: "0.75rem", md: "1.5rem" }} borderRadius={"30px"} bgcolor={"slategray"}></Stack>
                            </Stack>
                        );
                    })}
                </Stack>
                <IoIosArrowRoundForward size={34} color="#5E869B" onClick={() => { nextArticle() }} />
            </Stack>
        </Stack>
    );
};

export default PWATopStories;
