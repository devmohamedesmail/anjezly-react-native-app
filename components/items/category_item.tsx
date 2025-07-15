import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';




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
export default function Category_Item({ category, index }: { category: Category; index: number }) {
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);
    const { isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        // Staggered animation entrance
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                delay: index * 100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const imageUrl = category.image?.formats?.thumbnail?.url ||
        category.image?.formats?.small?.url ||
        category.image?.url;

    return (
          <Animated.View
                    className="w-[30%] mb-4"
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
                    }}
                >
                    <TouchableOpacity
                        className={`rounded-xl p-4 shadow-sm items-center ${
                            isDark ? 'bg-gray-800' : 'bg-white'
                        }`}
                        style={{ minHeight: 100 }}
                        onPress={handlePress}
                        activeOpacity={0.8}
                    >
                        <View className={`w-14 h-14 rounded-xl items-center justify-center mb-3 overflow-hidden ${
                            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                        }`}>
                            {imageUrl ? (
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Ionicons name="briefcase-outline" size={28} color="#3B82F6" />
                            )}
                        </View>
                        <Text className={`text-xs font-medium text-center ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`} numberOfLines={2}>
                            {isRTL ? category.title_ar : category.title_en}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
    )
}
