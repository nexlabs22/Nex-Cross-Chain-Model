import { CustomArrowProps } from "react-slick";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useLandingPageStore } from "@/store/store";
import mesh1 from "@assets/images/mesh1.png";
import { lightTheme } from "./theme";
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";


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
      backgroundImage: theme.palette.mode == "dark" ? `url('${mesh1.src}')` : "",
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
      transition: 'background 0.3s ease-in-out',
      '&:hover': {
        background: "linear-gradient(to top left, #5E869B 0%, #8FB8CA 100%)",
        boxShadow: "0px 0px 6px 1px rgba(94, 134, 155, 1)"
      },
    }
  )
}

export const AssetChips = () => {
  const { theme } = useLandingPageStore()
  return (
    {
      aspectRatio: 1,
      boxShadow: "0px 0px 4px 1px rgba(37,37,37,0.5)",
      background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
      transition: 'background 0.3s ease-in-out',
      '&:hover': {
        background: "linear-gradient(to top left, #5E869B 0%, #8FB8CA 100%)",

      },
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

export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const PWAProfileTextField = () => {
  const { theme } = useLandingPageStore()
  return (
    {
      backgroundColor: "#F1F6F9",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
      borderRadius: "2rem"
    }
  )
}

export const PWAComparisonChip = () => {
  const { theme } = useLandingPageStore()
  return (
    {
      backgroundColor: "#F8F9FA",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
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