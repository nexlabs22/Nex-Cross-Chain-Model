import { Box, Typography } from "@mui/material"


function ArbeiLogo() {
    return (
        <Box sx={{
            background: "linear-gradient(to bottom, #000000, #142544)",
            borderRadius: "50%",
            paddingX: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: 1
        }}>
            <Typography variant="caption" fontWeight={600} fontSize={{xs: '0.5rem'}}>ARBEI</Typography>
        </Box>
    )
}

export default ArbeiLogo


