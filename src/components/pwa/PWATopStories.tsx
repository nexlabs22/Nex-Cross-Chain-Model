import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import { env } from "process";
import axios from 'axios';
import { useEffect, useState } from "react";
import { keysIn } from "lodash";
import { PWAGradientStack } from "@/theme/overrides";

interface article {
    title: string,
    link: string,
    imgUrl: string,
    creator: string
}

const PWATopStories = () => {

    const [articles, setArticles] = useState<article[]>([])

    async function getStories() {
        const response = await axios.get('https://newsdata.io/api/1/news?apikey=pub_421568b0f1807dfbee4623c8ed5f99360cd9e&q=defi,crypto&image=1&language=en');

        if (response) {
            //console.log(response.data.results)
            const fetchedArticles = response.data.results.slice(0, 3).map((articleData: { title: string; link: string; image_url: string; creator: string; }) => ({
                title: articleData.title,
                link: articleData.link,
                imgUrl: articleData.image_url,
                creator: articleData.creator,
            }));
            console.log(fetchedArticles)
            setArticles(fetchedArticles);
        }
    }

    useEffect(() => {
        //getStories()
    }, [])
    return (
        <Stack width={"100%"} height={"fit-content"} marginTop={1} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Top Stories
                </Typography>

            </Stack>
            <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
                {/*
                    articles.map((article, key) => {
                        return (
                            <Stack key={key} direction={"row"} alignItems={"stretch"} justifyContent={"space-between"} borderRadius={"1.2rem"} gap={1} paddingY={1.5} paddingX={1.5} sx={PWAGradientStack}>
                                <Stack direction={"column"} alignItems={"start"} justifyContent={"start"} width={"60%"}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                        marginBottom: "0.4rem"
                                    }}>
                                        {article.title.slice(0, 40)} ...
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: "0.8rem",
                                        marginBottom: "0.8rem"
                                    }}>
                                        {article.creator}
                                    </Typography>
                                </Stack>
                                <Stack width={"40%"} flexGrow={1} direction={"row"} alignItems={"center"} justifyContent={"center"}>
                                    <Stack width={"95%"} height={"80%"} borderRadius={"0.8rem"} sx={{
                                        backgroundImage: "url('https://miro.medium.com/v2/resize:fit:6000/1*tZRnVhlr5Ra67LqULE9J3g.png')",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat"
                                    }}></Stack>
                                </Stack>
                            </Stack>
                        )
                    })
                */}

            </Stack>
        </Stack>
    )
}

export default PWATopStories