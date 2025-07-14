import React from 'react';
import { ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomNavigation from '@/components/BottomNavigation';
import Categories_Section from '@/components/categories_section';
import '../styles/global.css';
import Header from '@/components/header';
import Tasks_Section from '@/components/tasks_section';
import Freelancer_Section from '@/components/freelancer_section';
import { useTheme } from '@/contexts/ThemeContext';



export default function Home() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
