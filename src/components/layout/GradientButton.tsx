import { Button, ButtonProps } from "@mui/material"

const GradientButton = (props: ButtonProps) => (
  <Button
    {...props}
    sx={{
      backgroundImage: "linear-gradient(to left top, #8FB8CA 0%, #5E869B 100%)",
      color: "#F2F2F2",
      fontWeight: 700,
      fontSize: "1.8em",
      borderRadius: "50%",
      textTransform: "capitalize",
      boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px",
      "&:hover": {
        boxShadow: "none",
        borderColor: "transparent",
      },
    }}
  />
)
export default GradientButton
