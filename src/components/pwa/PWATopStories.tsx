import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { lightTheme } from "@/theme/theme";
import { env } from "process";
import axios from 'axios';
import { useEffect, useState } from "react";
import { keysIn } from "lodash";

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
        getStories()
    }, [])
    return (
        <Stack width={"100%"} height={"fit-content"} marginTop={3} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={2}>
                <Typography variant="h6" sx={{
                    color: lightTheme.palette.text.primary,
                    fontWeight: 700
                }}>
                    Top Stories
                </Typography>

            </Stack>
            <Stack width={"100%"} height={"fit-content"}>
                {
                    articles.map((article, key) => {
                        return (
                            <Stack key={key} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginY={1} gap={2}>
                                <Stack direction={"column"} alignItems={"start"} justifyContent={"start"}>
                                    <Typography variant="subtitle1" sx={{
                                        color: lightTheme.palette.text.primary,
                                        fontWeight: 600,
                                        marginBottom: "0.4rem"
                                    }}>
                                        {article.title.slice(0,50)} ...
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
                                <Image alt={article.title} src={"https://miro.medium.com/v2/resize:fit:6000/1*tZRnVhlr5Ra67LqULE9J3g.png"} width={50} height={50} className=" w-5/12 aspect-video"></Image>
                            </Stack>
                        )
                    })
                }

            </Stack>
        </Stack>
    )
}

export default PWATopStories