import { Box, Typography } from "@mui/material"


function Crypto5Logo() {
    return (
        <Box sx={{
            background: "linear-gradient(to bottom, #000000, #4f272c)",
            borderRadius: "50%",
            paddingX: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: 1
        }}>
            <Typography variant="caption" fontWeight={600}>CR5</Typography>
        </Box>
    )
}

export default Crypto5Logo


