import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { config } from '@/constants/config';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Category_Item from './items/category_item';
import Category_Skeleton from './items/category_skeleton';

interface Category {
    id: number;
    documentId: string;
    title_en: string;
    title_ar: string;
    image: {
        url: string;
        alternativeText?: string;
        formats?: {
            thumbnail?: {
                url: string;
            };
            small?: {
                url: string;
            };
        };
    };
    task_ids: any[];
}




export default function Categories_Section() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useTheme();
    const { t } = useTranslation();

    const fetch_categories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${config.url}/categories?populate=*`, {
                headers: {
                    Authorization: `Bearer ${config.token}`
                }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(t('categories.errorFetching'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch_categories();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 6 }, (_, index) => (
           
            <Category_Skeleton key={`skeleton-${index}`} />
        ));
    };

    const renderCategories = () => {
        if (!categories || categories.length === 0) {
            return (
                <View className="w-full items-center py-8">
                    <Ionicons 
                        name="folder-open-outline" 
                        size={48} 
                        color={isDark ? '#6B7280' : '#9CA3AF'} 
                    />
                    <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('categories.noCategories')}
                    </Text>
                </View>
            );
        }

        return categories.map((category, index) => (
        
            <Category_Item key={category.id} category={category} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 py-6">
                <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('categories.title')}
                </Text>
                <View className={`rounded-xl p-4 items-center ${
                    isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50'
                }`}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className={`mt-2 text-center ${
                        isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="bg-red-500 px-4 py-2 rounded-lg mt-3"
                        onPress={fetch_categories}
                    >
                        <Text className="text-white font-medium">{t('categories.retry')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 py-6">
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('categories.title')}
            </Text>
            <View className="flex-row flex-wrap justify-between">
                {loading ? renderSkeletons() : renderCategories()}
            </View>
        </View>
    );
}
