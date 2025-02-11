
import theme from "@/theme/theme"
import { Stack } from "@mui/material"

interface GenericCardProps {
    children: React.ReactNode
    width?: string | number
}

const GenericCard: React.FC<GenericCardProps> = ({ children, width }) => {
    return (
        <Stack width={width ? width : '100%'} height={'100%'} padding={2} borderRadius={2} sx={{
            backgroundColor: theme.palette.elevations.elevation900.main,
            overflow: 'hidden',
            position: 'relative',
        }}>
            {children}
        </Stack>
    )
}

export default GenericCard