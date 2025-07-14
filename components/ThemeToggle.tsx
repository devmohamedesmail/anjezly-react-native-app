import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeStyles } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  variant?: 'full' | 'compact' | 'icon';
  showLabel?: boolean;
}

export default function ThemeToggle({ variant = 'full', showLabel = true }: ThemeToggleProps) {
  const { theme, isDark, setTheme } = useTheme();
  const { t } = useTranslation();
  const styles = useThemeStyles();

  const themeOptions = [
    { key: 'light', label: t('theme.light'), icon: 'sunny-outline' },
    { key: 'dark', label: t('theme.dark'), icon: 'moon-outline' },
    { key: 'system', label: t('theme.system'), icon: 'phone-portrait-outline' },
  ];

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={() => setTheme(isDark ? 'light' : 'dark')}
        className={`p-2 rounded-full ${styles.surfaceBackground}`}
      >
        <Ionicons 
          name={isDark ? 'sunny-outline' : 'moon-outline'} 
          size={20} 
          color={isDark ? '#F59E0B' : '#6B7280'} 
        />
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <View className="flex-row items-center">
        <View className={`flex-row rounded-lg ${styles.surfaceBackground} p-1`}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setTheme(option.key as any)}
              className={`px-3 py-2 rounded-md ${
                theme === option.key 
                  ? 'bg-blue-600' 
                  : 'transparent'
              }`}
            >
              <Ionicons 
                name={option.icon as any} 
                size={16} 
                color={theme === option.key ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#6B7280')} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      {showLabel && (
        <Text className={`font-medium mb-3 ${styles.primaryText}`}>
          {t('theme.title')}
        </Text>
      )}
      <View className={`rounded-xl ${styles.cardBackground} ${styles.border} border overflow-hidden`}>
        {themeOptions.map((option, index) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => setTheme(option.key as any)}
            className={`p-4 flex-row items-center justify-between ${
              index !== themeOptions.length - 1 ? `border-b ${styles.divider}` : ''
            } ${theme === option.key ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <View className="flex-row items-center">
              <View className={`w-10 h-10 rounded-full items-center justify-center ${
                theme === option.key ? 'bg-blue-100 dark:bg-blue-800' : styles.surfaceBackground
              }`}>
                <Ionicons 
                  name={option.icon as any} 
                  size={20} 
                  color={theme === option.key ? '#3B82F6' : (isDark ? '#D1D5DB' : '#6B7280')} 
                />
              </View>
              <View className="ml-3">
                <Text className={`font-medium ${
                  theme === option.key ? 'text-blue-600 dark:text-blue-400' : styles.primaryText
                }`}>
                  {option.label}
                </Text>
                {option.key === 'system' && (
                  <Text className={`text-sm ${styles.secondaryText}`}>
                    {t('theme.systemDesc')}
                  </Text>
                )}
              </View>
            </View>
            {theme === option.key && (
              <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
