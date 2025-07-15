import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth_context';

export default function Header() {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const {auth} = useAuth();
   

    return (
        <View className={`px-6 py-4 shadow-sm ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-1">
                    {auth?.user ? (
                        // Logged in user info
                        <View>
                            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('home.header.welcomeBack')}, {auth.user.username || auth.user.email?.split('@')[0] || t('home.header.user')}! 👋
                            </Text>
                            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {t('home.header.readyToWork')}
                            </Text>
                        </View>
                    ) : (
                        // Guest user motivational message
                        <View>
                            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('home.header.discover')} ✨
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                                    {t('home.header.loginToStart')} →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={()=>router.push('/notifications')} className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Ionicons 
                        name="notifications-outline" 
                        size={24} 
                        color={isDark ? '#F3F4F6' : '#374151'} 
                    />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className={`rounded-xl px-4 py-3 flex-row items-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
                <Ionicons 
                    name="search" 
                    size={20} 
                    color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <TextInput
                    placeholder={t('home.search.placeholder')}
                    className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-700'}`}
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
                <TouchableOpacity className={`bg-primary p-2 rounded-lg`}>
                    <Ionicons name="options" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
