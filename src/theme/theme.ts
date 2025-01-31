import { createTheme } from "@mui/material/styles";
import { brandColors } from "@/theme/brandColors";
import { lightElevations, darkElevations } from "@/theme/elevations";
declare module "@mui/material/styles" {

  interface Palette {
    elevations: typeof lightElevations | typeof darkElevations;
    brand: typeof brandColors;
  }

  interface PaletteOptions {
    elevations?: typeof lightElevations | typeof darkElevations;
    brand: typeof brandColors;
  }

  interface colorSchemes {
    light: {
      palette: Palette;
    };
    dark: {
      palette: Palette;
    };
  }
}

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#000000",
        },
        secondary: {
          main: "#FAFAFA",
        },
        background: {
          default: "#FFFFFF",
        },
        text: {
          primary: "#000000",
          secondary: "#737373",
        },
        info: {
          main: "#FFFFFF",
        },
        error: {
          main: "#DC2626",
        },
        success: {
          main: "#389685",
        },
        brand: brandColors,
        elevations: lightElevations,
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#FFFFFF",
        },
        secondary: {
          main: "#0A0A0A",
        },
        background: {
          default: "#000000",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#737373",
        },
        info: {
          main: "#FFFFFF",
        },
        error: {
          main: "#DC2626",
        },
        success: {
          main: "#389685",
        },
        brand: brandColors,

        elevations: darkElevations,
      },
    },
    
  },
  typography: {
    fontFamily: 'Satoshi-Variable',
    h1: { fontWeight: 700, fontSize: '5rem' },
    h2: { fontWeight: 700, fontSize: '2.5rem' },
    h3: { fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontWeight: 700, fontSize: '1.5rem' },
    h5: { fontWeight: 700, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    subtitle1: { fontWeight: 400, fontSize: '1rem' },
    subtitle2: { fontWeight: 400, fontSize: '0.875rem' },
    body1: { fontWeight: 400, fontSize: '1rem' },
    body2: { fontWeight: 400, fontSize: '0.875rem' },
    caption: { fontWeight: 400, fontSize: '0.75rem' },
    overline: { fontWeight: 400, fontSize: '0.75rem' },
  },
});

export default theme;
