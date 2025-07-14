import React from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import BottomNavigation from '@/components/BottomNavigation';
import Categories_Section from '@/components/categories_section';
import '../styles/global.css';
import Header from '@/components/header';
import Tasks_Section from '@/components/tasks_section';
import Freelancer_Section from '@/components/freelancer_section';

const featuredFreelancers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    profession: 'UI/UX Designer',
    rating: 4.9,
    reviews: 156,
    price: '$45/hr',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?w=150&h=150&fit=crop&crop=face',
    skills: ['Figma', 'Adobe XD', 'Prototyping']
  },
  {
    id: 2,
    name: 'Mike Chen',
    profession: 'Full Stack Developer',
    rating: 4.8,
    reviews: 203,
    price: '$60/hr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: ['React', 'Node.js', 'TypeScript']
  },
  {
    id: 3,
    name: 'Emma Davis',
    profession: 'Content Writer',
    rating: 4.9,
    reviews: 89,
    price: '$30/hr',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skills: ['SEO', 'Copywriting', 'Research']
  },
];

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header />

        {/* Quick Actions */}
        <Categories_Section />

        {/* Featured Freelancers */}
        <Freelancer_Section />

        {/* Recent Projects */}
        <Tasks_Section />
      </ScrollView>

      {/* Custom Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </SafeAreaView>
  );
}
