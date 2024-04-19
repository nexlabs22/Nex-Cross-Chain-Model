import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const PWAPNLChartBox = () => {

    const [chartType, setChartType] = useState<string>("Pie Chart")
    return(
        <Stack id="PWAPNLChartBox" width={"100%"} height={"fit-content"} marginTop={0} direction={"column"} alignItems={"center"} justifyContent={"start"}>
            <Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
                <Menu transition menuButton={
                    <MenuButton className={"w-fit"}>
                        <Stack width={"100%"} height={"fit-content"} paddingY={0.5} paddingX={1} direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
                            <Typography variant="h6" sx={{
                                color: lightTheme.palette.text.primary,
                                fontWeight: 700
                            }}>
                                {chartType}
                            </Typography>
                            <IoIosArrowDown size={22} color={lightTheme.palette.text.primary}></IoIosArrowDown>
                        </Stack>
                        
                    </MenuButton>
                }>
                    <MenuItem onClick={()=>{setChartType("Pie Chart")}}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Pie Chart
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={()=>{setChartType("Treemap")}}>
                        <Typography variant="body1" sx={{
                            color: lightTheme.palette.text.primary,
                            fontWeight: 600
                        }}>
                            Treemap
                        </Typography>
                    </MenuItem>
                    
                </Menu>
                

            </Stack>
            <Stack width={"100%"} height={"25vh"} bgcolor={"#e2e2e2"} borderRadius={"1.2rem"}></Stack>
        </Stack>
    )
}

export default PWAPNLChartBox