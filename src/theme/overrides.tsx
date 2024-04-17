import { CustomArrowProps } from "react-slick";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useLandingPageStore } from "@/store/store";
import mesh1 from "@assets/images/mesh1.png";
import { lightTheme } from "./theme";

export const MainStack = () => {
  const { theme } = useLandingPageStore()
  return (
      {
          background: theme.palette.mode == "dark" ? "#050505" : theme.palette.text,
          overflowX: "hidden"
      }
  )
}

export const GradientStack = () => {
  const { theme } = useLandingPageStore()
  return (
      {
        
        background: theme.palette.mode == "dark" ? '' : "linear-gradient(to bottom left, #5E869B 0%, #8FB8CA 100%)",
        backgroundImage: theme.palette.mode == "dark" ? `url('${mesh1.src }')`: "",
        backgroundPosition: theme.palette.mode == "dark" ? "center" : "",
        backgroundRepeat: theme.palette.mode == "dark" ? "no-repeat" : "",
        backgroundSize: theme.palette.mode == "dark" ? "100% 100%" : "",
        boxShadow: theme.palette.mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : ""
      }
  )
}

export const PWAGradientStack = () => {
  const { theme } = useLandingPageStore()
  return (
      {
        background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",

      }
  )
}

export const PWABannerButton = () => {
  const { theme } = useLandingPageStore()
  return (
      {
        backgroundColor: "#FFFFFF",
        borderRadius: "0.8rem", 
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingY: "0.5rem",
        paddingX: "0.8rem",
        width: "fit-content",
      }
  )
}

export const PWAGradientTradeButton = () => {
  const { theme } = useLandingPageStore()
  return (
      {
        background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
        width: "50%",
        paddingY: "2rem"
      }
  )
}


export const NormalGradientStack = () => {
  const { theme } = useLandingPageStore()
  return (
      {
          background: theme.palette.mode == "dark" ? theme.palette.background.default : "linear-gradient(to bottom left, #5E869B 0%, #8FB8CA 100%)",
          boxShadow: theme.palette.mode == "dark" ? `1px -2px 5px 0px rgba(91,166,153,0.68)` : " "
      }
  )
}

export const CustomNextArrow: React.FC<CustomArrowProps> = ({
    onClick,
    className,
  }) => {
    return (
      <div
        className="glassy absolute right-5 top-[45%] z-10 aspect-square w-fit cursor-pointer rounded-full border-none p-2 hover:scale-110"
        onClick={onClick}
      >
        <BsChevronCompactRight color="#FFFFFF" size={25} />
      </div>
    );
  };

  export const CustomPrevArrow: React.FC<CustomArrowProps> = ({
    onClick,
    className,
  }) => {
    return (
      <div
        className="glassy absolute left-5 top-[45%] z-10 aspect-square w-fit cursor-pointer rounded-full border-none p-2 hover:scale-110"
        onClick={onClick}
      >
        <BsChevronCompactLeft color="#FFFFFF" size={25} />
      </div>
    );
  };