import Image from "next/image";
import Link from "next/link";
import bg2 from "@assets/images/dca3.png";
import mesh1 from "@assets/images/mesh1.png";

import { GoArrowRight } from "react-icons/go";
import { useLandingPageStore } from "@/store/store";
import { Stack, Typography, Box, Button } from "@mui/material";
import { GradientStack } from "@theme/overrides";

const DCASection = () => {
    const { theme } = useLandingPageStore();

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"fit-content"} marginTop={1} width={"100%"} >
            <Stack
                position={"relative"}
                width={"100%"}
                height={"fit-content"}
                borderRadius={"30px"}
                paddingX={3}
                paddingY={1}
                sx={GradientStack}
                id="haha"

            >
                <Stack position={"absolute"} right={0} top={0} zIndex={10} height={"100%"} width={"100%"} direction={"row"} alignItems={"center"} justifyContent={{ lg: "flex-end", xl: "normal" }} overflow={"hidden"}>
                    <Stack height={"100%"} width={"50%"}></Stack>

                    <Stack
                        marginRight={{ lg: 6, xl: 10 }}
                        width={{ lg: "40%", xl: "50%" }}
                        height={{ lg: "80%", xl: "80%" }}
                        sx={{
                            backgroundImage: `url('${bg2.src}')`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain"
                        }}
                        className="cefiCsDefiAnimated"

                    ></Stack>
                </Stack>
                <Stack position={"relative"} left={0} top={0} zIndex={40} paddingY={5} paddingLeft={2} sx={{
                    background: "transparent"
                }}>
                    <Typography variant="h3" component="h3">
                        DCA Calculator
                    </Typography>
                    <Typography variant="body1" component="p" className=" mb-4 w-6/12" sx={{ fontSize: "1.2rem" }}>
                        Explore our Dollar Cost Averaging (DCA) Calculator, a strategic tool designed for investors aiming to mitigate market volatility and enhance portfolio growth. This calculator
                        enables a disciplined investment approach by automating the DCA strategy, which involves regular, fixed-amount investments.
                    </Typography>
                    <Link
                        href={'/dcaCalculator'}
                    >
                        <Button variant="contained" sx={{
                            
                            fontSize: "1.1rem",
                            width: "fit-content",
                            paddingX: "1.5rem",
                            paddingY: "0.75rem",
                        }}>
                            <span>Learn More</span>
                            {
                                theme.palette.mode == "dark" ? <GoArrowRight color="#FFFFFF" size={30} /> : <GoArrowRight color="#252525" size={30} />
                            }
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
};

export default DCASection;
