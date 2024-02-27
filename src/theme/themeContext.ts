import React, { createContext, useState } from 'react';
import { Theme } from './theme';

interface ThemeContextValue {
  currentTheme: Theme;
  handleThemeChange: () => void;
}

const NexThemeContext = createContext<ThemeContextValue>(null!);

export default NexThemeContext;