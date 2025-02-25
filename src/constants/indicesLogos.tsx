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
            <Typography variant="caption" fontWeight={600} fontSize={{xs: '0.6rem'}}>ANFI</Typography>
        </Box>
    )
}

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
            <Typography variant="caption" fontWeight={600} fontSize={{xs: '0.6rem'}}>CR5</Typography>
        </Box>
    )
}

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
            <Typography variant="caption" fontWeight={600} fontSize={{xs: '0.6rem'}}>MAG7</Typography>
        </Box>
    )
}

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
            <Typography variant="caption" fontWeight={600} fontSize={{xs: '0.6rem'}}>ARBEI</Typography>
        </Box>
    )
}

export {AnfiLogo, Crypto5Logo, Mag7Logo, ArbeiLogo}