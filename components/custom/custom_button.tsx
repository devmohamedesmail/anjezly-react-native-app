import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function Custom_Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = ''
}: CustomButtonProps) {
  const { isDark } = useTheme();

  // Size configurations
  const sizeClasses = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-6 py-4'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Variant configurations
  const getVariantClasses = () => {
    const baseClasses = 'rounded-xl items-center justify-center flex-row';
    
    if (disabled || loading) {
      return `${baseClasses} ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`;
    }

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600`;
      case 'secondary':
        return `${baseClasses} ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`;
      case 'outline':
        return `${baseClasses} border-2 ${isDark ? 'border-gray-600 bg-transparent' : 'border-gray-300 bg-transparent'}`;
      case 'danger':
        return `${baseClasses} bg-red-600`;
      default:
        return `${baseClasses} bg-blue-600`;
    }
  };

  const getTextClasses = () => {
    if (disabled || loading) {
      return `font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
    }

    switch (variant) {
      case 'primary':
        return 'font-semibold text-white';
      case 'secondary':
        return `font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`;
      case 'outline':
        return `font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`;
      case 'danger':
        return 'font-semibold text-white';
      default:
        return 'font-semibold text-white';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' || variant === 'danger' ? 'white' : (isDark ? 'white' : 'gray')} 
          />
          <Text className={`${getTextClasses()} ${textSizeClasses[size]} ml-2`}>
            {title}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <View className="mr-2">
              {icon}
            </View>
          )}
          <Text className={`${getTextClasses()} ${textSizeClasses[size]}`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
