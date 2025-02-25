import { Box, Typography } from "@mui/material"


function AnfiLogo() {
    return (
        <Box sx={{
            background: "linear-gradient(to bottom, #000000, #564922)",
            borderRadius: "50%",
            paddingX: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: 1
        }}>
            <Typography variant="caption" fontWeight={600}>ANFI</Typography>
        </Box>
    )
}

export default AnfiLogo


