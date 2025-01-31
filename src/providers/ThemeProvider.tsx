"use client"

import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/theme"; // Import base theme
import { lightElevations, darkElevations } from "@/theme/elevations"; // Import elevations

function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("dark"); // Default to dark mode

  // Load saved mode from localStorage or default to dark
  useEffect(() => {
    const savedMode = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save the mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  // Dynamically select the correct elevations based on the mode
  const currentElevations = mode === "dark" ? darkElevations : lightElevations;

  // Create a new theme with dynamic elevations
  const currentTheme = {
    ...theme, // Start with the base theme
    palette: {
      ...theme.palette,
      mode, // Update mode (light or dark)
      elevations: currentElevations, // Use the correct elevations based on the mode
    },
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ClientThemeProvider;
