import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppColors, DarkColors, LightColors} from './Colors';
import {AppConstants} from '../constants/AppConstants';

interface ThemeContextValue {
  theme: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DarkColors,
  isDark: true,
  toggleTheme: () => {},
});

export const AppThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AppConstants.STORAGE_KEYS.THEME).then(val => {
      if (val !== null) {
        setIsDark(val === 'dark');
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(AppConstants.STORAGE_KEYS.THEME, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{theme: isDark ? DarkColors : LightColors, isDark, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
