// src/theme.js
import { DefaultTheme, DarkTheme, configureFonts } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const fontConfig = {
  fontFamily: 'System', // Uses San Francisco on iOS, Roboto on Android
};

export const LightTheme = {
  ...DefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac6',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
    onSurface: '#000000',
    success: '#4caf50',
  },
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
};

export const DarkPaperTheme = {
  ...DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    error: '#cf6679',
    onSurface: '#ffffff',
    success: '#66bb6a',
  },
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
};