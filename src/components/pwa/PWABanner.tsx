import { Stack, Container, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { PWAGradientStack, PWABannerButton } from "@/theme/overrides";
import { lightTheme } from "@/theme/theme";

interface PWABannerProps {
    smallText: string,
    bigText: string,
    image: string,
    link: string,
    linkText: string,
    imgWidth?: string,
    imgHeight?: string
}

const PWABanner = ({ smallText, bigText, image, link, linkText, imgWidth, imgHeight }: PWABannerProps) => {
    return (
        <Stack width={"100%"} height={"fit-content"} position={"relative"} overflow={"hidden"} marginY={3} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
            <Typography variant="caption" marginBottom={1} sx={{
                color: lightTheme.palette.text.primary
                
            }}>
                {
                    smallText
                }
            </Typography>
            <Typography variant="body1" width={"95%"} sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,

            }}>
                {
                    bigText
                }
            </Typography>
            <Link href={link}  className="w-fit h-fit flex flex-row items-center justify-center">
                <Stack marginTop={3} sx={PWABannerButton}>
                    <Typography variant="caption" sx={{
                        color: lightTheme.palette.text.primary,
                        fontWeight: 600
                    }}>
                        {
                            linkText
                        }
                    </Typography>
                </Stack>
            </Link>
            <Image alt="banner image nex" src={image} className={`absolute -bottom-12 md:-bottom-15 -right-5 w-[${imgWidth}] h-[${imgHeight}] aspect-square`} width={150} height={150}/>
        </Stack>
    )
} 

export default PWABanner