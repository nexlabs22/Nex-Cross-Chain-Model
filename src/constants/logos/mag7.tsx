import { Box, Typography } from "@mui/material"


function Mag7Logo() {
    return (
        <Box sx={{
            background: "linear-gradient(to bottom, #000000, #602b6f)",
            borderRadius: "50%",
            paddingX: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: 1
        }}>
            <Typography variant="caption" fontWeight={600}>MAG7</Typography>
        </Box>
    )
}

export default Mag7Logo


