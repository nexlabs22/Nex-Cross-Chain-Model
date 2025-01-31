'use client'

import { Stack, Typography, Button, Link } from "@mui/material";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { type ArrowProps } from 'react-multi-carousel/lib/types';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import mediaBG from '@/assets/images/NEX_media_bg.webp'

import { type Article, articlesList } from "@/constants/blogArticles";

interface CustomLeftArrowProps extends ArrowProps {
    myOwnStuff: string;
}

interface CustomRightArrowProps extends ArrowProps {
    myOwnStuff: string;
}

const CustomLeftArrow = ({ onClick }: CustomLeftArrowProps) => {
    return (
        <Stack alignItems={'center'} justifyContent={'center'} position={'absolute'} left={0} marginX={{ xs: 0.5, lg: 2 }} sx={{
            scale: { xs: '0.6', lg: '0.8' },
            top: {xs: '35%', lg: '45%'},
        }}>
            <Button onClick={onClick} sx={{
                paddingX: '0.1rem',
                borderRadius: '50%',
                aspectRatio: 1
            }}>
                <ArrowBackIosIcon fontSize="medium" color="info" sx={{
                    marginLeft: 1
                }} />
            </Button>
        </Stack>
    );
};

const CustomRightArrow = ({ onClick }: CustomRightArrowProps) => {
    return (
        <Stack alignItems={'center'} justifyContent={'center'} position={'absolute'} right={0} marginX={{ xs: 0.5, lg: 2 }} sx={{
            scale: { xs: '0.6', lg: '0.8' },
            top: {xs: '35%', lg: '45%'},
        }}>
            <Button onClick={onClick} sx={{
                paddingX: '0.1rem',
                borderRadius: '50%',
                aspectRatio: 1
            }}>
                <ArrowForwardIosIcon fontSize="medium" color="info" />
            </Button>
        </Stack>
    );
};

const News = () => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1820 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 1820, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <Stack width={'100%'} alignItems={'start'} spacing={{xs: 2, lg: 0}} sx={{
            backgroundColor: 'transparent',
            '& .carousel-container': {
                width: '100%',
                padding: {xs: 0, lg: '20px 0'}
            },
            '& .carousel-item': {
                padding: {xs: '0 5px', lg: '0 0px'}
            }
        }}>
            <Typography variant="h4">
                News & Insights
            </Typography>
            <Carousel
                responsive={responsive}
                customLeftArrow={<CustomLeftArrow myOwnStuff="" />}
                customRightArrow={<CustomRightArrow myOwnStuff="" />}
                infinite={true}
                containerClass="carousel-container"
                itemClass="carousel-item"
            >
                {articlesList.map((article: Article, index) => (
                    <Link key={index} href={article.link} target="_blank" underline="none">
                        <Stack
                            height={{xs: 200, lg: 250}}
                            width="100%"
                            alignItems={'center'}
                            marginX={0}
                            paddingX={{lg: 0.5 }}
                        >
                            <Stack width={'100%'} height={'100%'} position={'relative'} overflow={'hidden'} borderRadius={"1rem"} padding={3} sx={{
                                backgroundImage: `url('${mediaBG.src}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}>
                                <Stack height={'100%'} width={'100%'} justifyContent={'end'} gap={1} paddingTop={8}>
                                    <Typography variant="subtitle2">{article.source}</Typography>
                                    <Typography variant="h5" fontWeight={600}>{article.title}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Link>
                ))}
            </Carousel>
        </Stack>
    );
};

export default News;