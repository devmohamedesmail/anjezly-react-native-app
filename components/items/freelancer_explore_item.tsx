import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export default function Freelancer_Explore_Item({ freelancer }: any) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      key={freelancer.id}
      className={`rounded-xl p-4 mb-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'
        }`}
    >
      <View className="flex-row items-start">
        {/* Avatar */}
        <View className="relative">
          <Image
            source={{
              uri: freelancer.avatar?.url || 'https://via.placeholder.com/64x64.png?text=Avatar'
            }}
            className="w-16 h-16 rounded-full"
          />
          {freelancer.isOnline && (
            <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
              <View className="w-3 h-3 bg-white rounded-full" />
            </View>
          )}
        </View>

        {/* Freelancer Info */}
        <View className="ml-4 flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                {freelancer.username}
              </Text>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {freelancer.role?.name || t('explore.freelancer')}
              </Text>
              {freelancer.phone && (
                <View className="flex-row items-center mt-1">
                  <Ionicons name="call-outline" size={14} color="#9CA3AF" />
                  <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{freelancer.phone}</Text>
                </View>
              )}
            </View>

            {/* Rating */}
            <View className="items-end">
              {freelancer.reviews && freelancer.reviews.length > 0 && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text className={`text-sm ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {freelancer.reviews[0].rating} ({freelancer.reviews.length} {t('explore.reviews')})
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Status */}
          <View className="flex-row items-center mb-3">
            <View className={`px-2 py-1 rounded-full ${freelancer.confirmed ? 'bg-green-100' : 'bg-red-100'
              }`}>
              <Text className={`text-xs font-medium ${freelancer.confirmed ? 'text-green-800' : 'text-red-800'
                }`}>
                {freelancer.confirmed ? t('explore.verified') : t('explore.unverified')}
              </Text>
            </View>

            {freelancer.type && (
              <View className="px-2 py-1 rounded-full bg-blue-100 ml-2">
                <Text className="text-xs font-medium text-blue-800 capitalize">
                  {t(`explore.type.${freelancer.type}`)}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-blue-500 py-2 rounded-lg">
              <Text className="text-white font-medium text-center text-sm">
                {t('explore.contact')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-blue-500 py-2 rounded-lg"
              onPress={() => router.push(`/freelancer-profile?id=${freelancer.id}`)}
            >
              <Text className="text-blue-500 font-medium text-center text-sm">
                {t('explore.viewProfile')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
