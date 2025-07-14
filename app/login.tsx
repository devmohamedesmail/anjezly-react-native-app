import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth_context';
import '../styles/global.css';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!credentials.password.trim()) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(credentials);
      
      if (result.success) {
        // Navigate to home screen
        router.replace('/');
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials');
        
        // Handle field-specific errors
        if (result.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, messages]) => {
            formattedErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          });
          setFieldErrors(formattedErrors);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-8 pb-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
            
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-600 text-lg">Sign in to your account</Text>
          </View>

          {/* Form */}
          <View className="px-6 mt-8">
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="relative">
                <TextInput
                  value={credentials.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                <View className="absolute right-4 top-4">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                </View>
              </View>
              {fieldErrors.email ? (
                <Text className="text-red-500 text-sm mt-1">{fieldErrors.email}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  value={credentials.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 pr-12 ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password ? (
                <Text className="text-red-500 text-sm mt-1">{fieldErrors.password}</Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-8">
              <Text className="text-blue-600 font-medium text-right">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <Text className="text-red-700 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl items-center justify-center ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity className="w-full py-4 border border-gray-300 rounded-xl items-center justify-center mb-4 flex-row">
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="text-gray-700 font-medium ml-2">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full py-4 border border-gray-300 rounded-xl items-center justify-center mb-8 flex-row">
              <Ionicons name="logo-apple" size={20} color="#000" />
              <Text className="text-gray-700 font-medium ml-2">Continue with Apple</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-blue-600 font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
