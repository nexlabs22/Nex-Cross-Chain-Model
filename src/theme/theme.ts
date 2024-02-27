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


export interface Theme {
  palette: {
    mode: 'light' | 'dark';
    primary: { main: string };
    secondary: { main: string };
    background: { default: string };
    text: { primary: string };
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
    h1: {
      color: "#F2F2F2",
      fontWeight: 900,
      fontSize: "4.5rem",
    },
    h2: {
      color: "#F2F2F2",
      fontWeight: 900,
      fontSize: "3.5rem",
      marginBottom: "1.2rem"

    },
    h3:{
      color: "#F2F2F2",
      fontWeight: 700,
      fontSize: "2rem",
      marginBottom: "1.2rem"
    },
    h4:{
      color: "#F2F2F2",
      fontWeight: 500,
      fontSize: "1.8rem",
      width: "70%"
    },
    h5:{
      color: "#F2F2F2",
      fontWeight: 900,
      fontSize: "1.8rem",
    },
    h6:{
      color: "#F2F2F2",
      fontWeight: 900,
      fontSize: "1.6rem",
    },
    subtitle1:{
      color: "#F2F2F2",
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    body1:{
      color: "#F2F2F2",
      fontWeight: 500,
      fontSize: "1.4rem",
    },
    body2:{
      color: "#F2F2F2",
      fontWeight: 500,
      fontSize: "1.6rem",
      textAlign: "justify"
    },
    caption:{
      color: "#F2F2F2",
      fontWeight: 500,
      fontSize: "1rem",
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
    text: {
      primary: '#F2F2F2', // Customize to your preference
    },
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
          justifyContent:"center",
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
    }
  },
})

export const lightTheme = createTheme({
  breakpoints: breakpoints,
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      color: "#2A2A2A",
      fontWeight: 900,
      fontSize: "4.5rem",
    },
    h2: {
      color: "#2A2A2A",
      fontWeight: 900,
      fontSize: "3.5rem",
      marginBottom: "1.2rem"
    },
    h3:{
      color: "#2A2A2A",
      fontWeight: 700,
      fontSize: "2rem",
      marginBottom: "1.2rem"
    },
    h4:{
      color: "#2A2A2A",
      fontWeight: 500,
      fontSize: "1.8rem",
      width: "70%"
    },
    h5:{
      color: "#2A2A2A",
      fontWeight: 900,
      fontSize: "1.8rem",
    },
    h6:{
      color: "#2A2A2A",
      fontWeight: 900,
      fontSize: "1.6rem",
    },
    subtitle1:{
      color: "#2A2A2A",
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    body1:{
      color: "#2A2A2A",
      fontWeight: 500,
      fontSize: "1.4rem",
    },
    body2:{
      color: "#2A2A2A",
      fontWeight: 500,
      fontSize: "1.6rem",
      textAlign: "justify"
    },
    caption:{
      color: "#2A2A2A",
      fontWeight: 500,
      fontSize: "1rem",
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
    text: {
      primary: '#2A2A2A', // Customize to your preference
    },
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
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 6px 1px"
          }
        }
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
          justifyContent:"center",
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
    }
  },
})