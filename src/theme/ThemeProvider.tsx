import React, { useEffect, useState } from 'react';
import NexThemeContext from './themeContext';
import { Theme, darkTheme, lightTheme} from './theme';
import { useLandingPageStore } from '@/store/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const NexThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const {theme, setTheme} = useLandingPageStore()
    const [currentTheme, setCurrentTheme] = useState<Theme>(theme); // Replace with your initial theme
  

  const handleThemeChange = () => {
    setTheme(currentTheme === lightTheme ? darkTheme : lightTheme);
  };

  useEffect(() => {
    console.log(theme.palette.mode)
  }, []);
  return (
    <NexThemeContext.Provider value={{ currentTheme, handleThemeChange }}>
      {children}
    </NexThemeContext.Provider>
  );
};