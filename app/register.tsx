import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth_context';
import '../styles/global.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';



export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'freelancer' | 'client',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!credentials.name.trim()) {
      errors.name = 'Name is required';
    } else if (credentials.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!credentials.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(credentials);
      
      if (result.success) {
        Alert.alert(
          'Registration Successful!',
          'Welcome to Anjezly! You can now start using the app.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Please check your information');
        
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





const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'client',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: handleRegister,
  });












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
            
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-lg">Join Anjezly and start your journey</Text>
          </View>

          {/* Form */}
          <View className="px-6 mt-4">
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <View className="relative">
                <TextInput
                  value={credentials.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoComplete="name"
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 ${
                    fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                <View className="absolute right-4 top-4">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                </View>
              </View>
              {fieldErrors.name ? (
                <Text className="text-red-500 text-sm mt-1">{fieldErrors.name}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View className="mb-4">
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

            {/* Role Selection */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">I want to</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => handleInputChange('role', 'client')}
                  className={`flex-1 p-4 border rounded-xl items-center ${
                    credentials.role === 'client' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <Ionicons 
                    name="briefcase-outline" 
                    size={24} 
                    color={credentials.role === 'client' ? '#3B82F6' : '#9CA3AF'} 
                  />
                  <Text className={`mt-2 font-medium ${
                    credentials.role === 'client' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    Hire Freelancers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleInputChange('role', 'freelancer')}
                  className={`flex-1 p-4 border rounded-xl items-center ${
                    credentials.role === 'freelancer' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <Ionicons 
                    name="laptop-outline" 
                    size={24} 
                    color={credentials.role === 'freelancer' ? '#3B82F6' : '#9CA3AF'} 
                  />
                  <Text className={`mt-2 font-medium ${
                    credentials.role === 'freelancer' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    Work as Freelancer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
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

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  value={credentials.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 pr-12 ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.confirmPassword ? (
                <Text className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <Text className="text-red-700 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl items-center justify-center ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text className="text-gray-500 text-sm text-center mt-4 mb-6">
              By creating an account, you agree to our{' '}
              <Text className="text-blue-600">Terms of Service</Text> and{' '}
              <Text className="text-blue-600">Privacy Policy</Text>
            </Text>

            {/* Sign In Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-blue-600 font-medium">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
