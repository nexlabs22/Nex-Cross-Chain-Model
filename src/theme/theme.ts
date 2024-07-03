

import { ThemeProvider, createTheme } from '@mui/material/styles';

// Font :
import "@fontsource/inter";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import { Inter } from "next/font/google"

// Assets : 
import mesh1 from "@assets/images/mesh1.png";
import mesh2 from "@assets/images/mesh2.png";


declare module '@mui/material/styles' {
  interface Palette {
    nexRed: Palette['primary']
    nexGreen: Palette['primary']
    nexLightRed: Palette['primary']
    nexLightGreen: Palette['primary']
    mobileTitleDot: Palette['primary']
    pageBackground: Palette['primary']
    mediaCardShadow: string
    gradientStackBg: Palette['primary']
    gradientStackShadow: string
    gradientHeroBg: string
    mobileHeroBg: string
    valuesBgImg: string
    valuesShadow: string
    sliderBoxBg: string
    footerShadow: string
    assetChipBg: string
    assetChipShadow: string
    assetChipBgImg: string
  }
  interface PaletteOptions {
    nexRed: PaletteOptions['primary']
    nexGreen: PaletteOptions['primary']
    nexLightRed: PaletteOptions['primary']
    nexLightGreen: PaletteOptions['primary']
    mobileTitleDot: PaletteOptions['primary']
    pageBackground: PaletteOptions['primary']
    mediaCardShadow: string
    gradientStackBg: PaletteOptions['primary']
    gradientStackShadow: string
    gradientHeroBg: string
    mobileHeroBg: string
    valuesBgImg: string
    valuesShadow: string
    sliderBoxBg: string
    footerShadow: string
    assetChipBg: string
    assetChipShadow: string
    assetChipBgImg: string
  }
}

export interface Theme {
  palette: {
    mode: 'light' | 'dark';
    primary: { main: string };
    secondary: { main: string };
    background: { default: string };
    text: { primary: string };
    mobileTitleDot: { main: string };
    pageBackground: { main: string };
    mediaCardShadow: string;
    gradientStackBg: { main: string };
    gradientStackShadow: string;
    gradientHeroBg: string;
    mobileHeroBg: string;
    valuesBgImg: string;
    valuesShadow: string;
    sliderBoxBg: string;
    footerShadow: string;
    assetChipBg: string;
    assetChipShadow: string;
    assetChipBgImg: string;
  };
}

const inter = Inter({
  weight: ['400', '500', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  },
}




export const darkTheme = createTheme({
  breakpoints: breakpoints,
  typography: {
    fontFamily: inter.style.fontFamily,
    allVariants: {color: "#F2F2F2"},
    h1: {
      fontWeight: 900,
      fontSize: "4.5rem",
    },
    h2: {
      fontWeight: 900,
      fontSize: "3.5rem",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.8rem",
      width: "70%"
    },
    h5: {
      fontWeight: 900,
      fontSize: "1.7rem",
    },
    h6: {
      fontWeight: 900,
      fontSize: "1.6rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    body1: {
      fontWeight: 500,
      fontSize: "1.4rem",
    },
    body2: {
      fontWeight: 500,
      fontSize: "1.6rem",
      textAlign: "justify"
    },
    caption: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "1.1rem",
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#28EB17', // Customize to your preference

    },
    secondary: {
      main: '#fff', // Customize to your preference
    },
    background: {
      default: '#070707', // Customize to your preference
    },
    info: { main: "#FFFFFF00" },
    nexRed: { main: "#F23645" },
    nexGreen: { main: "#089981" },
    nexLightRed: { main: "rgba(242, 54, 69, 0.2)" },
    nexLightGreen: { main: "rgba(8, 153, 129, 0.2)" },
    text: {
      primary: '#F2F2F2', // Customize to your preference
    },
    mobileTitleDot: {
      main: "#F2F2F2"
    },
    pageBackground: {
      main: "#000000"
    },
    mediaCardShadow: "0px 0px 6px 1px rgba(91,166,153,0.68)",
    gradientStackBg: {
      main: "#070707"
    },
    gradientStackShadow: "0px 0px 6px 1px rgba(91,166,153,0.68)",
    gradientHeroBg: "#070707",
    mobileHeroBg: "#070707",
    valuesBgImg: `url('${mesh1.src}')`,
    valuesShadow: "0px 0px 6px 1px rgba(91,166,153,0.68)",
    sliderBoxBg: "#101010",
    footerShadow: "1px -2px 5px 0px rgba(91,166,153,0.68)",
    assetChipBg: "none",
    assetChipShadow: "0px 0px 4px 1px rgba(91,166,153,0.68)",
    assetChipBgImg: `url('${mesh1.src}')`
  },

  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundImage: `url('${mesh1.src}')`,
            backgroundPosition: 'center',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            color: "#F2F2F2",
            fontWeight: 700,
            fontSize: "1.8em",
            borderRadius: "50%",
            width: "fit-content",
            aspectRatio: "1",
            textTransform: "capitalize",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            boxShadow: "rgba(91, 166, 153, 0.68) 0px 0px 6px 1px"
          }
        }
      ],
      styleOverrides: {
        root: {
          backgroundImage: `url('${mesh1.src}')`,
          backgroundPosition: 'center',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          color: "#F2F2F2",
          fontWeight: 700,
          fontSize: "1.8em",
          borderRadius: "16px",
          width: "16rem",
          textTransform: "capitalize",
          textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          boxShadow: "rgba(91, 166, 153, 0.68) 0px 0px 6px 1px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem"
        },


      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundImage: `url('${mesh1.src}')`,
          backgroundPosition: 'center',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          color: "#F2F2F2",
          fontWeight: 700,
          fontSize: "1.3em",
          textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          boxShadow: "rgba(91, 166, 153, 0.68) 0px 0px 6px 1px"
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "0px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)",
          marginBottom: "0rem",
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "0rem",
          position: "fixed",
          bottom: "0"
        }
      }
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundColor: "#F1F6F9",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
            borderRadius: "0.8rem",
            border: "none",
            paddingTop: "0px",
            color: "#000000",
            paddingBottom: "0px",
            '& .MuiOutlinedInput-root.Mui-focused': {
              border: "none",
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
              outlineColor: "none",
              color: "#000000"
            }
          }
        }
      ]
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F6F9",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
          borderRadius: "0.8rem",
          border: "none",
          paddingTop: "0px",
          color: "#000000",
          paddingBottom: "0px",
          '& .MuiOutlinedInput-root.Mui-focused': {
            border: "none",
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
            outlineColor: "none",
            color: "#000000"
          }
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          animation: "none"
        }
      }
    },
    MuiNativeSelect: {
      styleOverrides: {
        root: {
          color: "#000000",
          outline: "none",
          border: "none"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#000', // Black text color
          backgroundColor: 'transparent', // Transparent background
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove shadow
          '& .MuiSelect-select.Mui-focused': { // Target focused state
            color: '#000', // Black text color
            backgroundColor: 'transparent', // Transparent background
            border: 'none', // Remove border
            outline: 'none', // Remove outline
            boxShadow: 'none', // Remove shadow
          },
          '&:hover .MuiSelect-select': { // Target hover state (optional)
            color: '#000', // Black text color
            backgroundColor: 'transparent', // Transparent background
            border: 'none', // Remove border
            outline: 'none', // Remove outline
            boxShadow: 'none', // Remove shadow
          }
        }
      }
    },
    MuiDivider:{
      styleOverrides:{
        root:{
          color: "#FFFFFF",
          border: "solid 0.5px #FFFFFFAA",
          minHeight: "42vh",
          height: "80%",
          marginTop: "auto",
          marginBottom: "auto"
        }
      }
    }
  },
})

export const lightTheme = createTheme({
  breakpoints: breakpoints,
  typography: {
    fontFamily: inter.style.fontFamily,
    allVariants: {color: "#2A2A2A"},
    h1: {
      fontWeight: 900,
      fontSize: "4.5rem",
    },
    h2: {
      fontWeight: 900,
      fontSize: "3.5rem",
      marginBottom: "1.2rem"
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      marginBottom: "1.2rem"
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.8rem",
      width: "70%"
    },
    h5: {
      fontWeight: 900,
      fontSize: "1.8rem",
    },
    h6: {
      fontWeight: 900,
      fontSize: "1.6rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    body1: {
      fontWeight: 500,
      fontSize: "1.4rem",
    },
    body2: {
      fontWeight: 500,
      fontSize: "1.6rem",
      textAlign: "justify"
    },
    caption: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "1.1rem",
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Customize to your preference      
    },
    secondary: {
      main: '#f44336', // Customize to your preference
    },
    background: {
      default: '#fff', // Customize to your preference      
    },
    info: { main: "#FFFFFF00" },
    nexRed: { main: "#F23645" },
    nexGreen: { main: "#089981" },
    nexLightRed: { main: "rgba(242, 54, 69, 0.2)" },
    nexLightGreen: { main: "rgba(8, 153, 129, 0.2)" },
    text: {
      primary: '#2A2A2A', // Customize to your preference
    },
    mobileTitleDot: {
      main: "#2A2A2A"
    },
    pageBackground: {
      main: "#F2F2F2"
    },
    mediaCardShadow: "none",
    gradientStackBg: {
      main: "linear-gradient(90deg, #5E869B 0%, #8FB8CA 100%)"
    },
    gradientStackShadow: "none",
    gradientHeroBg: "#5E869B",
    mobileHeroBg: "linear-gradient(to bottom left, #5E869B 0%, #8FB8CA 100%)",
    valuesBgImg: "#AEC7E4",
    valuesShadow: "none",
    sliderBoxBg: "#5E869B",
    footerShadow: "none",
    assetChipBg: "linear-gradient(to bottom left, #5E869B 0%, #8FB8CA 100%)",
    assetChipShadow: "0px 0px 4px 1px rgba(37,37,37,0.5)",
    assetChipBgImg: "none"
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundImage: `linear-gradient(to left top, #8FB8CA 0%, #5E869B 100%)`,
            color: "#F2F2F2",
            fontWeight: 700,
            fontSize: "1.8em",
            borderRadius: "50%",
            width: "fit-content",
            aspectRatio: "1",
            textTransform: "capitalize",
            border: "none",
            animation: "none",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px",
            '&:hover': {
              boxShadow: "none",
              borderColor: "transparent",
              animation: "none",
            },
          }
        },
      ],
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(to left top, #8FB8CA 0%, #5E869B 100%)`,

          color: "#2A2A2A",
          fontWeight: 700,
          fontSize: "1.8em",
          borderRadius: "16px",
          width: "16rem",
          textTransform: "capitalize",
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(to left top, #8FB8CA 0%, #5E869B 100%)`,
          color: "#2A2A2A",
          fontWeight: 700,
          fontSize: "1.3em",
          textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px"
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "0px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)",
          marginBottom: "0rem",
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "0rem",
          position: "fixed",
          bottom: "0"
        }
      }
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundColor: "#F1F6F9",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
            borderRadius: "0.8rem",
            border: "none",
            paddingTop: "0px",
            color: "#000000",
            fontSize: "1rem",
            paddingBottom: "0px",
            '& .MuiOutlinedInput-root.Mui-focused': {
              border: "none",
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
              outlineColor: "none",
              color: "#000000"
            }
          }
        }
      ]
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F6F9",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
          borderRadius: "0.8rem",
          border: "none",
          paddingTop: "0px",
          paddingBottom: "0px",
          '& .MuiOutlinedInput-root.Mui-focused': {
            border: "none",
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
            outlineColor: "none"
          }
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          animation: "none"
        }
      }
    },
    MuiNativeSelect: {
      styleOverrides: {
        root: {
          color: "#000000"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#000', // Black text color
          backgroundColor: 'transparent', // Transparent background
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove shadow
          '& .MuiSelect-select.Mui-focused': { // Target focused state
            color: '#000', // Black text color
            backgroundColor: 'transparent', // Transparent background
            border: 'none', // Remove border
            outline: 'none', // Remove outline
            boxShadow: 'none', // Remove shadow
          },
          '&:hover .MuiSelect-select': { // Target hover state (optional)
            color: '#000', // Black text color
            backgroundColor: 'transparent', // Transparent background
            border: 'none', // Remove border
            outline: 'none', // Remove outline
            boxShadow: 'none', // Remove shadow
          }
        }
      }
    },
    MuiDivider:{
      styleOverrides:{
        root:{
          color: "#000000",
          border: "solid 0.5px #000000AA",
          minHeight: "42vh",
          height: "80%",
          marginTop: "auto",
          marginBottom: "auto"
        }
      }
    }
  },

})