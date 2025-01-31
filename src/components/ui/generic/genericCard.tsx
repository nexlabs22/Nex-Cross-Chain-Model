
import { Paper } from "@mui/material"

interface GenericCardProps {
    children: React.ReactNode
    width?: string | number
}

const GenericCard: React.FC<GenericCardProps> = ({ children, width }) => {
    return (
        <Paper component={'div'} elevation={2} sx={{
            width: width ? width : '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            padding: 2,
            borderRadius: 2,
        }}>
            {children}
        </Paper>
    )
}

export default GenericCard