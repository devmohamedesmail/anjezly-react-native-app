import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  currentLanguage: string;
  isRTL: boolean;
  toggleLanguage: () => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load saved language from storage
    loadSavedLanguage();
  }, []);

  useEffect(() => {
    // Update RTL status when language changes
    const rtl = currentLanguage === 'ar';
    setIsRTL(rtl);
    
    // Update React Native's RTL layout
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
  }, [currentLanguage]);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const toggleLanguage = async () => {
    try {
      const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
      await i18n.changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      
      // Save language preference
      await AsyncStorage.setItem('app_language', newLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    isRTL,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
