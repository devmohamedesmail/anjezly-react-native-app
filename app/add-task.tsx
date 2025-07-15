import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Custom_Input from '@/components/custom/custom_input';
import Custom_Button from '@/components/custom/custom_button';
import '../styles/global.css';

const taskTypes = [
  { value: 'remote', label: 'Remote Work' },
  { value: 'on_site', label: 'On-site Work' },
  { value: 'hybrid', label: 'Hybrid Work' },
];

export default function AddTaskScreen() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      type: '',
      location: '',
      budget: '',
      duration: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, t('validation.titleMin'))
        .required(t('validation.titleRequired')),
      description: Yup.string()
        .min(10, t('validation.descriptionMin'))
        .required(t('validation.descriptionRequired')),
      type: Yup.string()
        .required(t('validation.typeRequired')),
      location: Yup.string()
        .required(t('validation.locationRequired')),
      budget: Yup.number()
        .min(1, t('validation.budgetMin'))
        .required(t('validation.budgetRequired')),
      duration: Yup.string()
        .required(t('validation.durationRequired')),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        Alert.alert(
          t('addTask.success.title'),
          t('addTask.success.message'),
          [
            { 
              text: t('common.ok'), 
              onPress: () => {
                formik.resetForm();
                router.back();
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert(t('addTask.error.title'), t('addTask.error.message'));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleTypeSelect = (type: string) => {
    formik.setFieldValue('type', type);
    setShowTypeModal(false);
  };

  const getSelectedTypeLabel = () => {
    const selectedType = taskTypes.find(type => type.value === formik.values.type);
    return selectedType ? selectedType.label : t('addTask.form.selectType');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
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
              {t('addTask.title')}
            </Text>
            
            <View className="w-10 h-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            {/* Title Input */}
            <Custom_Input
              label={t('addTask.form.title')}
              placeholder={t('addTask.form.titlePlaceholder')}
              value={formik.values.title}
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              error={formik.touched.title && formik.errors.title ? formik.errors.title : ''}
            />

            {/* Description Input */}
            <Custom_Input
              label={t('addTask.form.description')}
              placeholder={t('addTask.form.descriptionPlaceholder')}
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
              error={formik.touched.description && formik.errors.description ? formik.errors.description : ''}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Type Selector */}
            <View className="mb-4">
              <Text className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('addTask.form.type')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTypeModal(true)}
                className={`w-full px-4 py-4 border rounded-xl flex-row items-center justify-between ${
                  formik.touched.type && formik.errors.type 
                    ? 'border-red-500' 
                    : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white')
                }`}
              >
                <Text className={`${
                  formik.values.type 
                    ? (isDark ? 'text-white' : 'text-gray-900')
                    : (isDark ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {getSelectedTypeLabel()}
                </Text>
                <Ionicons 
                  name="chevron-down" 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
              </TouchableOpacity>
              {formik.touched.type && formik.errors.type && (
                <Text className="text-red-500 text-sm mt-1">{formik.errors.type}</Text>
              )}
            </View>

            {/* Location Input */}
            <Custom_Input
              label={t('addTask.form.location')}
              placeholder={t('addTask.form.locationPlaceholder')}
              value={formik.values.location}
              onChangeText={formik.handleChange('location')}
              onBlur={formik.handleBlur('location')}
              error={formik.touched.location && formik.errors.location ? formik.errors.location : ''}
              icon={<Ionicons name="location-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />}
            />

            {/* Budget Input */}
            <Custom_Input
              label={t('addTask.form.budget')}
              placeholder={t('addTask.form.budgetPlaceholder')}
              value={formik.values.budget}
              onChangeText={formik.handleChange('budget')}
              onBlur={formik.handleBlur('budget')}
              error={formik.touched.budget && formik.errors.budget ? formik.errors.budget : ''}
              keyboardType="numeric"
              icon={<Ionicons name="card-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />}
            />

            {/* Duration Input */}
            <Custom_Input
              label={t('addTask.form.duration')}
              placeholder={t('addTask.form.durationPlaceholder')}
              value={formik.values.duration}
              onChangeText={formik.handleChange('duration')}
              onBlur={formik.handleBlur('duration')}
              error={formik.touched.duration && formik.errors.duration ? formik.errors.duration : ''}
              icon={<Ionicons name="time-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />}
            />

            {/* Submit Button */}
            <View className="mt-6 mb-8">
              <Custom_Button
                title={isSubmitting ? t('addTask.posting') : t('addTask.postTask')}
                onPress={() => formik.handleSubmit()}
                loading={isSubmitting}
                disabled={!formik.isValid || isSubmitting}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        </ScrollView>

        {/* Type Selection Modal */}
        <Modal
          visible={showTypeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className={`rounded-t-3xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('addTask.form.selectType')}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTypeModal(false)}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Ionicons name="close" size={20} color={isDark ? '#F3F4F6' : '#374151'} />
                </TouchableOpacity>
              </View>
              
              {taskTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => handleTypeSelect(type.value)}
                  className={`py-4 px-4 rounded-xl mb-2 flex-row items-center justify-between ${
                    formik.values.type === type.value
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : (isDark ? 'bg-gray-700' : 'bg-gray-50')
                  }`}
                >
                  <Text className={`font-medium ${
                    formik.values.type === type.value
                      ? 'text-blue-600'
                      : (isDark ? 'text-white' : 'text-gray-900')
                  }`}>
                    {type.label}
                  </Text>
                  {formik.values.type === type.value && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
