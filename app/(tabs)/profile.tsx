import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/auth_context';
import { useTheme } from '@/contexts/ThemeContext';
import '../../styles/global.css';

export default function Profile() {
  const { t } = useTranslation();
  const { logout, user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  

  const handleMenuPress = async (item: any) => {
    if (item.isDestructive) {
      // Handle sign out
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace('/login');
              } catch (error) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            }
          }
        ]
      );
    } else if (item.isLanguage || item.isTheme) {
      // Language and theme toggles are handled within their components
      return;
    } else {
      // Handle other menu items
      console.log(`${item.label} pressed`);
    }
  };

  const profileStats = [
    { label: t('profile.stats.projectsCompleted'), value: '24', icon: 'checkmark-circle' },
    { label: t('profile.stats.clientRating'), value: '4.9', icon: 'star' },
    { label: t('profile.stats.totalEarned'), value: '$12.5k', icon: 'card' },
    { label: t('profile.stats.responseTime'), value: '< 1hr', icon: 'time' }
  ];

  const menuItems = [
    { icon: 'person-outline', label: t('profile.menu.editProfile'), description: t('profile.menu.editProfileDesc') },
    { icon: 'briefcase-outline', label: t('profile.menu.portfolio'), description: t('profile.menu.portfolioDesc') },
    { icon: 'card-outline', label: t('profile.menu.paymentMethods'), description: t('profile.menu.paymentMethodsDesc') },
    { icon: 'star-outline', label: t('profile.menu.reviewsRatings'), description: t('profile.menu.reviewsRatingsDesc') },
    { icon: 'globe-outline', label: t('profile.menu.language'), description: t('profile.menu.languageDesc'), isLanguage: true },
    { icon: 'color-palette-outline', label: t('profile.menu.theme'), description: t('profile.menu.themeDesc'), isTheme: true },
    { icon: 'settings-outline', label: t('profile.menu.settings'), description: t('profile.menu.settingsDesc') },
    { icon: 'help-circle-outline', label: t('profile.menu.helpSupport'), description: t('profile.menu.helpSupportDesc') },
    { icon: 'shield-outline', label: t('profile.menu.privacyPolicy'), description: t('profile.menu.privacyPolicyDesc') },
    { icon: 'log-out-outline', label: t('profile.menu.signOut'), description: t('profile.menu.signOutDesc'), isDestructive: true }
  ];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} px-6 py-4 shadow-sm`}>
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('profile.title')}</Text>
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('profile.subtitle')}</Text>
          </View>
          <TouchableOpacity className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-full`}>
            <Ionicons name="settings-outline" size={20} color={isDark ? '#D1D5DB' : '#374151'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} mx-6 mt-4 rounded-xl p-6 shadow-sm`}>
          <View className="items-center">
            <View className="relative">
              <Image
                source={{ 
                  uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
                }}
                className="w-20 h-20 rounded-full"
              />
              <TouchableOpacity className="absolute -bottom-2 -right-2 bg-blue-500 w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="camera" size={14} color="white" />
              </TouchableOpacity>
            </View>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-3`}>{user?.username || 'Guest User'}</Text>
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {user?.type === 'assistant' ? "Assistant" : 'Client'}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className={`w-2 h-2 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-gray-400'}`} />
              <Text className={`text-sm font-medium ${isAuthenticated ? 'text-green-600' : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                {isAuthenticated ? t('profile.status.available') : 'Not signed in'}
              </Text>
            </View>
          </View>
        </View>

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && (
          <View className={`${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border mx-6 mt-4 rounded-xl p-4`}>
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-medium ml-2 flex-1`}>
                Sign in to access all features
              </Text>
            </View>
            <View className="flex-row mt-3 space-x-3">
              <TouchableOpacity 
                onPress={() => router.push('/login')}
                className="flex-1 bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white font-medium text-center">Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/register')}
                className="flex-1 border border-blue-600 py-3 rounded-lg"
              >
                <Text className="text-blue-600 font-medium text-center">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Grid - Only show for authenticated users */}
        {isAuthenticated && (
          <View className="px-6 mt-4">
            <View className="flex-row flex-wrap justify-between">
              {profileStats.map((stat, index) => (
                <View key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm mb-3`} style={{ width: '48%' }}>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name={stat.icon as any} size={20} color="#3B82F6" />
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} ml-2`}>{stat.value}</Text>
                  </View>
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions - Only show for authenticated users */}
        {isAuthenticated && (
          <View className="px-6 mt-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>{t('profile.quickActions.title')}</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm items-center flex-1 mr-2`}>
                <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} text-center`}>{t('profile.quickActions.addSkill')}</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm items-center flex-1 mx-1`}>
                <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                  <Ionicons name="document-text" size={24} color="#10B981" />
                </View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} text-center`}>{t('profile.quickActions.viewResume')}</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm items-center flex-1 ml-2`}>
                <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trophy" size={24} color="#8B5CF6" />
                </View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} text-center`}>{t('profile.quickActions.achievements')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="px-6 mt-6">
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>{t('profile.account')}</Text>
          <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`p-4 flex-row items-center ${index !== menuItems.length - 1 ? (isDark ? 'border-b border-gray-700' : 'border-b border-gray-100') : ''}`}
                onPress={() => handleMenuPress(item)}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  item.isDestructive ? 'bg-red-100' : (isDark ? 'bg-gray-700' : 'bg-gray-100')
                }`}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={item.isDestructive ? '#EF4444' : (isDark ? '#D1D5DB' : '#6B7280')} 
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`font-medium ${item.isDestructive ? 'text-red-600' : (isDark ? 'text-white' : 'text-gray-900')}`}>
                    {item.label}
                  </Text>
                  <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{item.description}</Text>
                </View>
                {item.isLanguage ? (
                  <LanguageToggle variant="text" />
                ) : item.isTheme ? (
                  <ThemeToggle variant="compact" />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={isDark ? '#6B7280' : '#9CA3AF'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View className="px-6 mt-6 mb-4">
          <Text className={`text-center ${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
            Anjezly v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </SafeAreaView>
  );
}
