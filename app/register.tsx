import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth_context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/global.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Custom_Input from '@/components/custom/custom_input';
import { Toast } from 'toastify-react-native';



export default function RegisterScreen() {
    const { handle_register, isLoading } = useAuth();
    const { isDark } = useTheme();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
           
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('validation.nameRequired')).min(2, t('validation.nameMinLength')),
            email: Yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
            password: Yup.string().required(t('validation.passwordRequired')).min(6, t('validation.passwordMinLength')),
            
        }),
        onSubmit: async (values) => {
            try {
                const result = await handle_register(
                    values.name,
                    values.email, 
                    values.password,
                  
                );

                if (result.success) {
                    
                    Toast.show({
                        text1: t('register.success.title'),
                        text2: t('register.success.message'),
                        type: 'success',
                        visibilityTime: 4000,
                    })
                } else {
                    Toast.show({
                        text1: t('register.error.title'),
                        text2: t('register.error.message'),
                        type: 'error',
                        visibilityTime: 4000,
                    })
                   
                }
            } catch (error) {
               Toast.show({
                        text1: t('register.error.title'),
                        text2: t('register.error.message'),
                        type: 'error',
                        visibilityTime: 4000,
                    })
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
                            className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} items-center justify-center mb-6`}
                        >
                            <Ionicons name="arrow-back" size={20} color={isDark ? '#D1D5DB' : '#374151'} />
                        </TouchableOpacity>

                        <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {t('register.title')}
                        </Text>
                        <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                            {t('register.subtitle')}
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="px-6 mt-4">
                        {/* Name Input */}
                        <Custom_Input
                            label={t('register.form.name')}
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}
                            onBlur={formik.handleBlur('name')}
                            error={formik.touched.name && formik.errors.name}
                            placeholder={t('register.form.namePlaceholder')}
                            icon={<Ionicons name="person-outline" size={20} color="#9CA3AF" />}
                        />

                        {/* Email Input */}
                        <Custom_Input
                            label={t('register.form.email')}
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                            error={formik.touched.email && formik.errors.email}
                            placeholder={t('register.form.emailPlaceholder')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                        />

                        {/* Password Input */}
                        <Custom_Input
                            label={t('register.form.password')}
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            onBlur={formik.handleBlur('password')}
                            error={formik.touched.password && formik.errors.password}
                            placeholder={t('register.form.passwordPlaceholder')}
                            isPassword={true}
                            icon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                        />

                      

                        
                       


                        {/* Role Selection */}
                        {/* <View className="mb-6">
                            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                                {t('register.form.roleLabel')}
                            </Text>
                            <View className="flex-row space-x-3">
                                <TouchableOpacity
                                    onPress={() => formik.setFieldValue('role', 'client')}
                                    className={`flex-1 p-4 border rounded-xl mx-1 items-center ${
                                        formik.values.role === 'client'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : (isDark ? 'border-gray-600' : 'border-gray-300')
                                    }`}
                                >
                                    <Ionicons
                                        name="briefcase-outline"
                                        size={24}
                                        color={formik.values.role === 'client' ? '#3B82F6' : '#9CA3AF'}
                                    />
                                    <Text className={`mt-2 font-medium ${
                                        formik.values.role === 'client' 
                                            ? 'text-blue-600' 
                                            : (isDark ? 'text-gray-300' : 'text-gray-600')
                                    }`}>
                                        {t('register.form.roleClient')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => formik.setFieldValue('role', 'freelancer')}
                                    className={`flex-1 p-4 border rounded-xl mx-1 items-center ${
                                        formik.values.role === 'freelancer'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : (isDark ? 'border-gray-600' : 'border-gray-300')
                                    }`}
                                >
                                    <Ionicons
                                        name="laptop-outline"
                                        size={24}
                                        color={formik.values.role === 'freelancer' ? '#3B82F6' : '#9CA3AF'}
                                    />
                                    <Text className={`mt-2 font-medium ${
                                        formik.values.role === 'freelancer' 
                                            ? 'text-blue-600' 
                                            : (isDark ? 'text-gray-300' : 'text-gray-600')
                                    }`}>
                                        {t('register.form.roleFreelancer')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={() => formik.handleSubmit()}
                            disabled={isLoading || !formik.isValid}
                            className={`w-full py-4 rounded-xl items-center justify-center mb-6 ${
                                isLoading || !formik.isValid 
                                    ? (isDark ? 'bg-gray-600' : 'bg-gray-400') 
                                    : 'bg-blue-600'
                            }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-white font-semibold text-lg">
                                    {t('register.createAccount')}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('register.terms.byCreating')}{' '}
                            <Text className="text-blue-600">{t('register.terms.termsOfService')}</Text> {t('register.terms.and')}{' '}
                            <Text className="text-blue-600">{t('register.terms.privacyPolicy')}</Text>
                        </Text>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center mb-6">
                            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('register.haveAccount')} 
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text className="text-blue-600 font-medium">{t('register.signIn')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
