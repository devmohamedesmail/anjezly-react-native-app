import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '@/components/BottomNavigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../../styles/global.css';

const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    lastMessage: 'The design looks great! Can we discuss the timeline?',
    timestamp: '2 min ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?w=150&h=150&fit=crop&crop=face',
    online: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    lastMessage: 'Thanks for the quick turnaround on the project',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    online: false
  },
  {
    id: 3,
    name: 'Emma Davis',
    lastMessage: 'Could you send me the final files?',
    timestamp: '3 hours ago',
    unread: 1,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    online: true
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    lastMessage: 'Perfect! The video editing is exactly what I wanted',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    online: false
  }
];

export default function Messages() {
  const [searchText, setSearchText] = useState('');
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`px-6 py-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <View className="flex-row items-center mb-4">
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('messages.title')}
            </Text>
            {totalUnread > 0 && (
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {totalUnread} {t('messages.unreadMessages')}
              </Text>
            )}
          </View>
          <TouchableOpacity className={`p-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Ionicons name="add" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className={`rounded-xl px-4 py-3 flex-row items-center ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            placeholder={t('messages.searchPlaceholder')}
            className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-700'}`}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full mr-3">
            <View className="flex-row items-center">
              <Ionicons name="people" size={16} color="white" />
              <Text className="text-white font-medium ml-2">{t('messages.filters.all')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className={`px-4 py-2 rounded-full mr-3 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <View className="flex-row items-center">
              <Ionicons name="mail-unread" size={16} color={isDark ? '#F3F4F6' : '#374151'} />
              <Text className={`font-medium ml-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('messages.filters.unread')} ({totalUnread})
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className={`px-4 py-2 rounded-full mr-3 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color={isDark ? '#F3F4F6' : '#374151'} />
              <Text className={`font-medium ml-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('messages.filters.starred')}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conversations List */}
      <ScrollView className="flex-1 px-6 pb-20" showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View className={`rounded-xl p-8 items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Ionicons name="chatbubbles-outline" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
            <Text className={`mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('messages.empty.title')}
            </Text>
            <Text className={`text-sm mt-1 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {searchText ? t('messages.empty.searchHint') : t('messages.empty.hint')}
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className={`rounded-xl p-4 mb-3 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <View className="flex-row items-center">
                <View className="relative">
                  <Image
                    source={{ uri: conversation.avatar }}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.online && (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </View>
                
                <View className="ml-3 flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                      {conversation.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className={`text-sm mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {conversation.timestamp}
                      </Text>
                      {conversation.unread > 0 && (
                        <View className="bg-blue-500 w-5 h-5 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {conversation.unread}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text 
                    className={`text-sm ${
                      conversation.unread > 0 
                        ? (isDark ? 'text-white font-medium' : 'text-gray-900 font-medium')
                        : (isDark ? 'text-gray-300' : 'text-gray-600')
                    }`}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                </View>
              </View>

              <View className={`flex-row justify-between items-center mt-3 pt-3 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="call-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`ml-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('messages.actions.call')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="videocam-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text className={`ml-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('messages.actions.video')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="chatbubble-outline" size={16} color="#3B82F6" />
                  <Text className="text-blue-500 ml-1 text-sm font-medium">
                    {t('messages.actions.reply')}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="messages" />
    </SafeAreaView>
  );
}
