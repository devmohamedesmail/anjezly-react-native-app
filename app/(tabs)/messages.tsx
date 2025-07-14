import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '@/components/BottomNavigation';
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

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Messages</Text>
            {totalUnread > 0 && (
              <Text className="text-gray-600">{totalUnread} unread messages</Text>
            )}
          </View>
          <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
            <Ionicons name="add" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search conversations..."
            className="flex-1 ml-3 text-gray-700"
            placeholderTextColor="#9CA3AF"
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
              <Text className="text-white font-medium ml-2">All</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full mr-3">
            <View className="flex-row items-center">
              <Ionicons name="mail-unread" size={16} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Unread ({totalUnread})</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full mr-3">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Starred</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conversations List */}
      <ScrollView className="flex-1 px-6 pb-20" showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">No conversations found</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              {searchText ? 'Try a different search term' : 'Start a new conversation'}
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
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
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                      {conversation.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-500 mr-2">
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
                    className={`text-sm ${conversation.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="call-outline" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 ml-1 text-sm">Call</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="videocam-outline" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 ml-1 text-sm">Video</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="chatbubble-outline" size={16} color="#3B82F6" />
                  <Text className="text-blue-500 ml-1 text-sm font-medium">Reply</Text>
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
