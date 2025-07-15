import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  type: 'task' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export default function Notifications() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task',
      title: t('notifications.task.title'),
      message: t('notifications.task.message'),
      time: '2 minutes ago',
      read: false,
      icon: 'briefcase'
    },
    {
      id: '2',
      type: 'message',
      title: t('notifications.message.title'),
      message: t('notifications.message.message'),
      time: '1 hour ago',
      read: false,
      icon: 'chatbubble'
    },
    {
      id: '3',
      type: 'payment',
      title: t('notifications.payment.title'),
      message: t('notifications.payment.message'),
      time: '3 hours ago',
      read: true,
      icon: 'card'
    },
    {
      id: '4',
      type: 'system',
      title: t('notifications.system.title'),
      message: t('notifications.system.message'),
      time: '1 day ago',
      read: true,
      icon: 'settings'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'task':
        return '#3B82F6';
      case 'message':
        return '#10B981';
      case 'payment':
        return '#F59E0B';
      case 'system':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      className={`p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      } ${!item.read ? (isDark ? 'bg-blue-900/10' : 'bg-blue-50') : ''}`}
    >
      <View className="flex-row items-start">
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Ionicons
            name={item.icon as any}
            size={20}
            color={getNotificationIconColor(item.type)}
          />
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.read && (
              <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
            )}
          </View>
          
          <Text className={`text-sm mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`} numberOfLines={2}>
            {item.message}
          </Text>
          
          <Text className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
          
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('notifications.title')}
          </Text>
          
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-blue-500 font-medium">
                {t('notifications.markAllRead')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {unreadCount > 0 && (
          <View className="mt-4">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('notifications.unreadCount', { count: unreadCount })}
            </Text>
          </View>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons 
            name="notifications-outline" 
            size={64} 
            color={isDark ? '#6B7280' : '#9CA3AF'} 
          />
          <Text className={`text-lg font-medium mt-4 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('notifications.empty.title')}
          </Text>
          <Text className={`text-sm mt-2 text-center ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t('notifications.empty.message')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      )}
    </SafeAreaView>
  );
}
