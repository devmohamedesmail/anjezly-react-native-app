import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';
import '../../styles/global.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { config } from '@/constants/config';
import Freelancer_Explore_Item from '@/components/items/freelancer_explore_item';

const categories = [
  'All', 'Design', 'Development', 'Writing', 'Marketing', 'Video', 'Music', 'Translation'
];

// Skeleton Component
const FreelancerSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <View className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="flex-row items-start">
        {/* Avatar Skeleton */}
        <View className={`w-16 h-16 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
        
        {/* Content Skeleton */}
        <View className="ml-4 flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <View className={`w-3/4 h-5 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <View className={`w-1/2 h-4 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <View className={`w-1/3 h-3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </View>
            <View className={`w-16 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </View>
          
          <View className="flex-row mb-3">
            <View className={`w-16 h-6 rounded-full mr-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <View className={`w-20 h-6 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </View>
          
          <View className="flex-row space-x-3">
            <View className={`flex-1 h-8 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <View className={`flex-1 h-8 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </View>
        </View>
      </View>
    </View>
  );
};



export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [freelancers, setFreelancers] = useState<any[] | null>(null);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const fetchFreelancers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${config.url}/users?filters[type][$eq]=assistant&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`
          }
        }
      );
      setFreelancers(response.data);
      console.log('Freelancers fetched:', response.data);
    } catch (error) {
      console.log('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers()
  }, [])


  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`px-6 py-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="arrow-back" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
            </TouchableOpacity>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('explore.title')}
            </Text>
          </View>
          <TouchableOpacity className={`p-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Ionicons name="filter" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className={`rounded-xl px-4 py-3 flex-row items-center ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
          <TextInput
            placeholder={t('explore.searchPlaceholder')}
            className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-700'}`}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Categories */}
      <View className={`px-6 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-4 px-4 py-2 rounded-full ${selectedCategory === category
                ? 'bg-blue-500'
                : (isDark ? 'bg-gray-700' : 'bg-gray-100')
                }`}
            >
              <Text
                className={`font-medium ${selectedCategory === category
                  ? 'text-white'
                  : (isDark ? 'text-gray-300' : 'text-gray-700')
                  }`}
              >
                {t(`explore.categories.${category.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Freelancers List */}
      <ScrollView className="flex-1 px-6 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View>
            {Array.from({ length: 3 }, (_, index) => (
              <FreelancerSkeleton key={index} />
            ))}
          </View>
        ) : (
          <View>
            {freelancers && freelancers.length > 0 ? (
              freelancers.map((freelancer: any) => (
                <Freelancer_Explore_Item key={freelancer.id} freelancer={freelancer} />
              ))
            ) : (
              <View className="items-center justify-center mt-8">
                <Ionicons 
                  name="people-outline" 
                  size={48} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('explore.empty.title')}
                </Text>
                <Text className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('explore.empty.message')}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>


      <BottomNavigation activeTab="explore" />
    </SafeAreaView>
  );
}
