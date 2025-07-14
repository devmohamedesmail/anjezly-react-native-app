import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BottomNavigationProps {
  activeTab: 'home' | 'explore' | 'projects' | 'messages' | 'profile';
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const handleNavigation = (route: string) => {
    switch (route) {
      case 'home':
        router.push('/(tabs)');
        break;
      case 'explore':
        router.push('/(tabs)/two');
        break;
      case 'projects':
        // TODO: Implement projects screen
        break;
      case 'messages':
        // TODO: Implement messages screen
        break;
      case 'profile':
        // TODO: Implement profile screen
        break;
    }
  };

  const navigationItems = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'explore', icon: 'search', label: 'Explore' },
    { key: 'projects', icon: 'briefcase-outline', label: 'Projects' },
    { key: 'messages', icon: 'chatbubble-outline', label: 'Messages' },
    { key: 'profile', icon: 'person-outline', label: 'Profile' },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center py-3 px-6">
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            className="items-center py-2"
            onPress={() => handleNavigation(item.key)}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                activeTab === item.key ? 'bg-blue-500' : ''
              }`}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={activeTab === item.key ? 'white' : '#9CA3AF'}
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                activeTab === item.key
                  ? 'text-blue-500 font-medium'
                  : 'text-gray-500'
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
