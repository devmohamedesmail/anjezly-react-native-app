import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t } = useTranslation();
    
    return (
        <View className="bg-white px-6 py-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-2xl font-bold text-gray-900">{t('home.header.greeting')}</Text>
                    <Text className="text-gray-600">{t('home.header.subtitle')}</Text>
                </View>
                <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                    <Ionicons name="notifications-outline" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    placeholder={t('home.search.placeholder')}
                    className="flex-1 ml-3 text-gray-700"
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity className={`bg-primary p-2 rounded-lg`}>
                    <Ionicons name="options" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
