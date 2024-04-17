import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import { PWAGradientStack, PWAGradientTradeButton } from "@/theme/overrides";

const PWAProfileOverviewHeader = () => {
    return (
        <Stack width={"100%"} height={"fit-content"} position={"relative"} overflow={"hidden"} marginTop={3} marginBottom={1} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
            <Typography variant="caption" marginBottom={1} sx={{
                color: lightTheme.palette.text.primary
            }}>
                My Portfolio
            </Typography>
            <Typography variant="body1" width={"95%"} sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 600,
                
            }}>
                $1,586.3
            </Typography>
            <Typography variant="caption" width={"95%"} sx={{
                color: lightTheme.palette.text.primary,
                fontWeight: 400,
                
            }}>
                $586.3 (58.6%)
            </Typography>
        </Stack>
    )
}

export default PWAProfileOverviewHeader