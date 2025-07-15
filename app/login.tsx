import React, { useState } from 'react';
import {
  View,
  Text,
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
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Custom_Input from '@/components/custom/custom_input';
import '../styles/global.css';
import { Toast } from 'toastify-react-native';

export default function LoginScreen() {
  const { handle_login, isLoading } = useAuth();
  
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .email(t('validation.emailInvalid'))
        .required(t('validation.emailRequired')),
      password: Yup.string()
        .min(6, t('validation.passwordMin'))
        .required(t('validation.passwordRequired')),
    }),
    onSubmit: async (values) => {
      try {
       setLoading(true);
        const result = await handle_login(values.identifier, values.password);

        if (result.success) {
          Toast.show({
            text1: t('login.success'),
            type: 'success',
             visibilityTime: 4000,
          })
          router.replace('/');
        } else {
          Toast.show({
            text1: t('login.error.title'),
            type: 'success',
             visibilityTime: 4000,
          })
         
        }
      } catch (error) {
        setLoading(false);
        Toast.show({
            text1: t('login.error.title'),
            type: 'success',
             visibilityTime: 4000,
          })
        
      }finally{
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-8 pb-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className={`w-10 h-10 rounded-full items-center justify-center mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="arrow-back" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
            </TouchableOpacity>
            
            <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('login.title')}
            </Text>
            <Text className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('login.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 mt-8">
            {/* Email Input */}
            <Custom_Input
              label={t('login.form.email')}
              placeholder={t('login.form.emailPlaceholder')}
              value={formik.values.identifier}
              onChangeText={formik.handleChange('identifier')}
              onBlur={formik.handleBlur('identifier')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="identifier"
              error={formik.touched.identifier && formik.errors.identifier ? formik.errors.identifier : ''}
              icon="mail-outline"
            />

            {/* Password Input */}
            <Custom_Input
              label={t('login.form.password')}
              placeholder={t('login.form.passwordPlaceholder')}
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              isPassword={true}
              autoComplete="password"
              error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            />

            {/* Forgot Password */}
            <TouchableOpacity className="mb-8">
              <Text className={`font-medium text-right ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {t('login.forgotPassword')}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={() => formik.handleSubmit()}
              disabled={loading || !formik.isValid}
              className={`w-full py-4 rounded-xl items-center justify-center mb-8 ${
                isLoading || !formik.isValid 
                  ? (isDark ? 'bg-gray-600' : 'bg-gray-400') 
                  : 'bg-primary'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  {t('login.signIn')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <Text className={`mx-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('login.divider')}
              </Text>
              <View className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity className={`w-full py-4 border rounded-xl items-center justify-center mb-4 flex-row ${
              isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
            }`}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className={`font-medium ml-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                {t('login.social.google')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className={`w-full py-4 border rounded-xl items-center justify-center mb-8 flex-row ${
              isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
            }`}>
              <Ionicons name="logo-apple" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
              <Text className={`font-medium ml-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                {t('login.social.apple')}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('login.noAccount')} 
              </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {t('login.signUp')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
