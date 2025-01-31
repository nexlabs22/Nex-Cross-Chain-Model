import { Chip, ChipProps } from "@mui/material"

const StyledChip = ({ children, ...props }: ChipProps) => (
  <Chip
    {...props}
    sx={{
      backgroundImage: "linear-gradient(to left top, #8FB8CA 0%, #5E869B 100%)",
      color: "#2A2A2A",
      fontWeight: 700,
      fontSize: "1.3em",
      textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px",
    }}
  >
    {children}
  </Chip>
)
export default StyledChip
