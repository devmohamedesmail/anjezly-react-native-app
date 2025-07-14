import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '@/components/BottomNavigation';
import '../../styles/global.css';

const categories = [
  'All', 'Design', 'Development', 'Writing', 'Marketing', 'Video', 'Music', 'Translation'
];

const freelancers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    profession: 'UI/UX Designer',
    rating: 4.9,
    reviews: 156,
    price: '$45/hr',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?w=150&h=150&fit=crop&crop=face',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    location: 'New York, USA',
    available: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    profession: 'Full Stack Developer',
    rating: 4.8,
    reviews: 203,
    price: '$60/hr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: ['React', 'Node.js', 'TypeScript'],
    location: 'San Francisco, USA',
    available: true
  },
  {
    id: 3,
    name: 'Emma Davis',
    profession: 'Content Writer',
    rating: 4.9,
    reviews: 89,
    price: '$30/hr',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skills: ['SEO', 'Copywriting', 'Research'],
    location: 'London, UK',
    available: false
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    profession: 'Video Editor',
    rating: 4.7,
    reviews: 134,
    price: '$40/hr',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skills: ['After Effects', 'Premiere Pro', 'Motion Graphics'],
    location: 'Madrid, Spain',
    available: true
  },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Explore Freelancers</Text>
          <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
            <Ionicons name="filter" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search freelancers by skill or name..."
            className="flex-1 ml-3 text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Categories */}
      <View className="bg-white px-6 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-4 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Freelancers List */}
      <ScrollView className="flex-1 px-6 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        {freelancers.map((freelancer) => (
          <TouchableOpacity
            key={freelancer.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <View className="flex-row items-start">
              <View className="relative">
                <Image
                  source={{ uri: freelancer.image }}
                  className="w-16 h-16 rounded-full"
                />
                {freelancer.available && (
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                    <View className="w-3 h-3 bg-white rounded-full" />
                  </View>
                )}
              </View>

              <View className="ml-4 flex-1">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{freelancer.name}</Text>
                    <Text className="text-gray-600">{freelancer.profession}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                      <Text className="text-sm text-gray-500 ml-1">{freelancer.location}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-blue-500">{freelancer.price}</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={14} color="#FFA500" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {freelancer.rating} ({freelancer.reviews})
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row flex-wrap mb-3">
                  {freelancer.skills.map((skill, index) => (
                    <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1">
                      <Text className="text-xs text-gray-700">{skill}</Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row space-x-3">
                  <TouchableOpacity className="flex-1 bg-blue-500 py-2 rounded-lg">
                    <Text className="text-white font-medium text-center text-sm">Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 border border-blue-500 py-2 rounded-lg">
                    <Text className="text-blue-500 font-medium text-center text-sm">View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Custom Bottom Navigation */}
      <BottomNavigation activeTab="explore" />
    </SafeAreaView>
  );
}
