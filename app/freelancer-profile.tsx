import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { config } from '@/constants/config';

const { width } = Dimensions.get('window');

interface Review {
  id: number;
  rating: number;
  review: string;
  clientName?: string;
  date: string;
}

interface Portfolio {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function FreelancerProfile() {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const params = useLocalSearchParams();
  const freelancerId = params.id;
  
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchFreelancerProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.url}/users/${freelancerId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`
          }
        }
      );
      setFreelancer(response.data);
      console.log('Freelancer profile fetched:', response.data);
    } catch (error) {
      console.log('Error fetching freelancer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (freelancerId) {
      fetchFreelancerProfile();
    }
  }, [freelancerId]);

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!freelancer) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Ionicons name="person-outline" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
          <Text className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('profile.freelancer.notFound')}
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">
              {t('common.goBack')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color="#FFA500"
        />
      );
    }
    return stars;
  };

  const TabButton = ({ id, title, isActive, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-3 ${
        isActive 
          ? 'bg-blue-500' 
          : (isDark ? 'bg-gray-700' : 'bg-gray-100')
      }`}
    >
      <Text className={`font-medium ${
        isActive 
          ? 'text-white' 
          : (isDark ? 'text-gray-300' : 'text-gray-700')
      }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const OverviewTab = () => (
    <View>
      {/* About Section */}
      <View className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('profile.freelancer.about')}
        </Text>
        <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {freelancer.description || freelancer.bio || t('profile.freelancer.noDescription')}
        </Text>
      </View>

      {/* Skills Section */}
      <View className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('profile.freelancer.skills')}
        </Text>
        <View className="flex-row flex-wrap">
          {freelancer.skills && freelancer.skills.length > 0 ? (
            freelancer.skills.map((skill: any, index: number) => (
              <View key={index} className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-blue-400' : 'text-blue-800'
                }`}>
                  {skill}
                </Text>
              </View>
            ))
          ) : (
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('profile.freelancer.noSkills')}
            </Text>
          )}
        </View>
      </View>

      {/* Languages Section */}
      <View className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('profile.freelancer.languages')}
        </Text>
        <View className="flex-row flex-wrap">
          {freelancer.languages && freelancer.languages.length > 0 ? (
            freelancer.languages.map((language: any, index: number) => (
              <View key={index} className={`flex-row items-center mr-4 mb-2`}>
                <Ionicons name="language-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language}
                </Text>
              </View>
            ))
          ) : (
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('profile.freelancer.noLanguages')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const PortfolioTab = () => (
    <View>
      {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
        freelancer.portfolio.map((item: any) => (
          <View key={item.id} className={`rounded-xl mb-4 overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-start mb-2">
                <Text className={`text-lg font-bold flex-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title || t('profile.freelancer.untitledProject')}
                </Text>
                <View className={`px-2 py-1 rounded-full ${
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    isDark ? 'text-purple-400' : 'text-purple-800'
                  }`}>
                    {item.category || t('profile.freelancer.general')}
                  </Text>
                </View>
              </View>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.description || t('profile.freelancer.noDescription')}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-8">
          <Ionicons name="folder-outline" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
          <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('profile.freelancer.noPortfolio')}
          </Text>
        </View>
      )}
    </View>
  );

  const ReviewsTab = () => (
    <View>
      {freelancer.reviews && freelancer.reviews.length > 0 ? (
        freelancer.reviews.map((review: any) => (
          <View key={review.id} className={`rounded-xl p-4 mb-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {review.clientName || t('profile.freelancer.anonymousClient')}
                </Text>
                <View className="flex-row items-center mt-1">
                  {renderStars(review.rating || 0)}
                  <Text className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {review.date}
                  </Text>
                </View>
              </View>
            </View>
            <Text className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {review.review || review.comment || t('profile.freelancer.noReviewText')}
            </Text>
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-8">
          <Ionicons name="star-outline" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
          <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('profile.freelancer.noReviews')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <View className={`relative ${
          isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
        }`} style={{ backgroundColor: isDark ? '#374151' : '#3B82F6' }}>
          <View className="px-6 pt-4 pb-6">
            {/* Back button */}
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center bg-white/20 mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            {/* Profile Info */}
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={{ 
                    uri: freelancer.avatar?.url || 'https://via.placeholder.com/80x80.png?text=Avatar'
                  }}
                  className="w-20 h-20 rounded-full border-4 border-white/20"
                />
                <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              </View>
              
              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-white mb-1">
                  {freelancer.username || t('profile.freelancer.noName')}
                </Text>
                <Text className="text-white/80 mb-2">
                  {freelancer.role?.name || t('profile.freelancer.freelancer')}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="white" />
                  <Text className="text-white/80 ml-1">
                    {freelancer.location || t('profile.freelancer.noLocation')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row justify-between mt-6">
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  {freelancer.rating || '0.0'}
                </Text>
                <Text className="text-white/80 text-sm">{t('profile.freelancer.rating')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  {freelancer.completedProjects || '0'}
                </Text>
                <Text className="text-white/80 text-sm">{t('profile.freelancer.projects')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  ${freelancer.hourlyRate || '0'}
                </Text>
                <Text className="text-white/80 text-sm">{t('profile.freelancer.hourlyRate')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  {freelancer.responseTime || '< 24h'}
                </Text>
                <Text className="text-white/80 text-sm">{t('profile.freelancer.responseTime')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact buttons */}
        <View className="px-6 py-4 flex-row space-x-3">
          <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-xl">
            <Text className="text-white font-semibold text-center">
              {t('profile.freelancer.contact')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className={`flex-1 py-3 rounded-xl border ${
            isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
          }`}>
            <Text className={`font-semibold text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('profile.freelancer.message')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="px-6 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TabButton
              id="overview"
              title={t('profile.freelancer.overview')}
              isActive={activeTab === 'overview'}
              onPress={() => setActiveTab('overview')}
            />
            <TabButton
              id="portfolio"
              title={t('profile.freelancer.portfolio')}
              isActive={activeTab === 'portfolio'}
              onPress={() => setActiveTab('portfolio')}
            />
            <TabButton
              id="reviews"
              title={t('profile.freelancer.reviews')}
              isActive={activeTab === 'reviews'}
              onPress={() => setActiveTab('reviews')}
            />
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="px-6 pb-20">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'portfolio' && <PortfolioTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
