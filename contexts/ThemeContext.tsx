import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  // Determine if dark mode should be active
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Load theme preference on app start
  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme changes to the document class (for NativeWind)
  useEffect(() => {
    // This would be handled by NativeWind automatically based on our className usage
    // But we can store the current state for components that need it
  }, [isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware styles helper
export const useThemeStyles = () => {
  const { isDark } = useTheme();
  
  return {
    // Background colors
    background: isDark ? 'bg-dark-background' : 'bg-gray-50',
    cardBackground: isDark ? 'bg-dark-card' : 'bg-white',
    surfaceBackground: isDark ? 'bg-gray-800' : 'bg-gray-100',
    
    // Text colors
    primaryText: isDark ? 'text-dark-text' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Border colors
    border: isDark ? 'border-dark-border' : 'border-gray-200',
    divider: isDark ? 'border-gray-700' : 'border-gray-100',
    
    // Interactive elements
    button: isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
    buttonSecondary: isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
    
    // Status colors (same for both themes)
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
  };
};

export default ThemeContext;
