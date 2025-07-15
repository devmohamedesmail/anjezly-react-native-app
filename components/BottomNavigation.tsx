import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

interface BottomNavigationProps {
  activeTab: 'home' | 'explore' | 'projects' | 'messages' | 'profile';
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const handleNavigation = (route: string) => {
    switch (route) {
      case 'home':
        router.push('/');
        break;
      case 'explore':
        router.push('/(tabs)/two');
        break;
      case 'add-task':
        router.push('/(tabs)/add-task' as any);
        break;
      case 'messages':
        router.push('/(tabs)/messages');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
    }
  };

  const navigationItems = [
    { key: 'home', icon: 'home', label: t('nav.home') },
    { key: 'explore', icon: 'search', label: t('nav.explore') },
    { key: 'add-task', icon: 'add', label: 'Post', isCenter: true },
    { key: 'messages', icon: 'chatbubble-outline', label: t('nav.messages') },
    { key: 'profile', icon: 'person-outline', label: t('nav.profile') },
  ];

  return (
    <View className={`absolute bottom-0 left-0 right-0 border-t ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <View className="flex-row justify-around items-center py-3 px-6">
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            className="items-center py-2"
            onPress={() => handleNavigation(item.key)}
          >
            {item.isCenter ? (
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg">
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color="white"
                />
              </View>
            ) : (
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  activeTab === item.key ? 'bg-primary' : ''
                }`}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={
                    activeTab === item.key 
                      ? 'white' 
                      : (isDark ? '#9CA3AF' : '#6B7280')
                  }
                />
              </View>
            )}
            <Text
              className={`text-xs mt-1 ${
                item.isCenter 
                  ? 'text-primary font-medium'
                  : activeTab === item.key
                    ? 'text-primary font-medium'
                    : (isDark ? 'text-gray-400' : 'text-gray-500')
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
