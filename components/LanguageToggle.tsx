import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'button' | 'icon' | 'text';
}

export default function LanguageToggle({ 
  showLabel = true, 
  size = 'medium',
  variant = 'button'
}: LanguageToggleProps) {
  const { currentLanguage, toggleLanguage, t, isRTL } = useLanguage();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          text: 'text-xs',
          icon: 12
        };
      case 'large':
        return {
          container: 'px-6 py-3',
          text: 'text-base',
          icon: 20
        };
      default:
        return {
          container: 'px-4 py-2',
          text: 'text-sm',
          icon: 16
        };
    }
  };

  const styles = getSizeStyles();

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={toggleLanguage}
        className="bg-gray-100 p-3 rounded-full"
      >
        <Ionicons name="language" size={styles.icon} color="#374151" />
      </TouchableOpacity>
    );
  }

  if (variant === 'text') {
    return (
      <TouchableOpacity
        onPress={toggleLanguage}
        className="flex-row items-center"
      >
        <Text className={`font-medium text-blue-500 ${styles.text}`}>
          {currentLanguage === 'en' ? 'عربي' : 'English'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      className={`bg-gray-100 rounded-lg flex-row items-center ${styles.container}`}
      style={{ 
        flexDirection: isRTL ? 'row-reverse' : 'row' 
      }}
    >
      <Ionicons 
        name="language" 
        size={styles.icon} 
        color="#374151" 
        style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}
      />
      {showLabel && (
        <Text className={`font-medium text-gray-700 ${styles.text}`}>
          {currentLanguage === 'en' ? t('arabic') : t('english')}
        </Text>
      )}
    </TouchableOpacity>
  );
}
