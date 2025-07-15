import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth_context';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'freelancer';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export default function ChatBox() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { auth } = useAuth();
  const params = useLocalSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chat.welcomeMessage'),
      sender: 'freelancer',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2', 
      text: t('chat.userResponse'),
      sender: 'user',
      timestamp: new Date(Date.now() - 1800000),
      status: 'read'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get data from params
  const freelancer = {
    id: params.freelancerId || '1',
    name: params.freelancerName || 'Ahmed Hassan',
    avatar: Array.isArray(params.freelancerAvatar) ? params.freelancerAvatar[0] : (params.freelancerAvatar || 'https://res.cloudinary.com/dkcoe5fam/image/upload/v1752481686/boy_6f633c7c83.png'),
    isOnline: true,
    lastSeen: new Date()
  };
  
  const userId = params.userId || auth?.user?.id;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: `${userId}_${Date.now()}`, // Include user ID in message ID
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate message sent status
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 1000);

    // Simulate freelancer typing and response
    setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    setTimeout(() => {
      setIsTyping(false);
      const autoReply: Message = {
        id: `${freelancer.id}_${Date.now()}`, // Include freelancer ID in response
        text: t('chat.autoReply'),
        sender: 'freelancer',
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 4000);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';
    
    return (
      <View className={`flex-row mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <Image
            source={{ uri: freelancer.avatar }}
            className="w-8 h-8 rounded-full mr-2 mt-1"
          />
        )}
        
        <View className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 rounded-br-md' 
            : (isDark ? 'bg-gray-700 rounded-bl-md' : 'bg-gray-100 rounded-bl-md')
        }`}>
          <Text className={`${
            isUser 
              ? 'text-white' 
              : (isDark ? 'text-white' : 'text-gray-900')
          }`}>
            {message.text}
          </Text>
          
          <View className={`flex-row items-center mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <Text className={`text-xs ${
              isUser 
                ? 'text-blue-100' 
                : (isDark ? 'text-gray-400' : 'text-gray-500')
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            
            {isUser && (
              <View className="ml-2">
                {message.status === 'sending' && (
                  <Ionicons name="time-outline" size={12} color="#DBEAFE" />
                )}
                {message.status === 'sent' && (
                  <Ionicons name="checkmark" size={12} color="#DBEAFE" />
                )}
                {message.status === 'delivered' && (
                  <Ionicons name="checkmark-done" size={12} color="#DBEAFE" />
                )}
                {message.status === 'read' && (
                  <Ionicons name="checkmark-done" size={12} color="#10B981" />
                )}
              </View>
            )}
          </View>
        </View>

        {isUser && (
          <Image
            source={{ uri: auth?.user?.avatar || 'https://via.placeholder.com/32' }}
            className="w-8 h-8 rounded-full ml-2 mt-1"
          />
        )}
      </View>
    );
  };

  const TypingIndicator = () => (
    <View className="flex-row items-center mb-3">
      <Image
        source={{ uri: freelancer.avatar }}
        className="w-8 h-8 rounded-full mr-2"
      />
      <View className={`px-4 py-3 rounded-2xl rounded-bl-md ${
        isDark ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <View className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full mr-1 ${
            isDark ? 'bg-gray-400' : 'bg-gray-500'
          }`} />
          <View className={`w-2 h-2 rounded-full mr-1 ${
            isDark ? 'bg-gray-400' : 'bg-gray-500'
          }`} />
          <View className={`w-2 h-2 rounded-full ${
            isDark ? 'bg-gray-400' : 'bg-gray-500'
          }`} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Animated.View 
        className={`px-6 py-4 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        style={{ opacity: fadeAnim }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
          
          <Image
            source={{ uri: freelancer.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {freelancer.name}
            </Text>
            <View className="flex-row items-center">
              {freelancer.isOnline ? (
                <>
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <Text className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {t('chat.online')}
                  </Text>
                </>
              ) : (
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('chat.lastSeen')} {freelancer.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
            {/* Debug Info - Show IDs */}
            <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {t('chat.freelancerId')}: {freelancer.id} | {t('chat.userId')}: {userId}
            </Text>
          </View>
          
          <TouchableOpacity className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Ionicons name="call" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
          
          <TouchableOpacity className={`w-10 h-10 rounded-full items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Ionicons name="videocam" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <Animated.View 
          className={`px-4 py-3 border-t ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          style={{ opacity: fadeAnim }}
        >
          <View className="flex-row items-end">
            <TouchableOpacity className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Ionicons name="add" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
            </TouchableOpacity>
            
            <View className={`flex-1 rounded-2xl px-4 py-3 mr-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={t('chat.placeholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                className={`${isDark ? 'text-white' : 'text-gray-900'}`}
                multiline
                maxLength={1000}
                style={{ maxHeight: 100 }}
              />
            </View>
            
            <TouchableOpacity
              onPress={sendMessage}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim().length > 0 ? 'bg-blue-500' : (isDark ? 'bg-gray-600' : 'bg-gray-300')
              }`}
              disabled={inputText.trim().length === 0}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={inputText.trim().length > 0 ? 'white' : (isDark ? '#9CA3AF' : '#6B7280')} 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
