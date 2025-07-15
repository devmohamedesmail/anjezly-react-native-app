import React, { useEffect } from 'react'
import { TouchableOpacity, Text, Animated, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { config } from '@/constants/config';




interface Task {
    id: number;
    documentId: string;
    title: string;
    description: string;
    type: 'remote' | 'on_site';
    location: string;
    budget: number;
    duration: string;
    task_status: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    assistant_id: string | null;
    client_id: string | null;
    task_types: Array<{
        id: number;
        documentId: string;
        type_en: string;
        type_ar: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }>;
    category: {
        id: number;
        documentId: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        title_en: string;
        title_ar: string;
    };
}
export default function Task_Item({ task, index }: { task: Task; index: number }) {

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
                toValue: 0.98,
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

   

   

    const getTypeColor = (type: string) => {
        if (isDark) {
            return type === 'remote' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400';
        }
        return type === 'remote' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    };

    const getTypeIconColor = (type: string) => {
        if (isDark) {
            return type === 'remote' ? '#4ADE80' : '#60A5FA';
        }
        return type === 'remote' ? '#166534' : '#1e40af';
    };

    const getTypeIcon = (type: string) => {
        return type === 'remote' ? 'laptop-outline' : 'location-outline';
    };
    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
            }}
        >
            <TouchableOpacity
                className={`rounded-xl p-4 shadow-sm mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View className={`flex-row justify-between items-start mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <View className={`flex-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                        <Text className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                            } ${isRTL ? 'text-right' : 'text-left'}`} numberOfLines={2}>
                            {task.title}
                        </Text>
                        <Text className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'
                            } ${isRTL ? 'text-right' : 'text-left'}`} numberOfLines={2}>
                            {task.description}
                        </Text>
                        <View className={`flex-row items-center mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <View className={`px-2 py-1 rounded-full ${getTypeColor(task.type)}`}>
                                <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Ionicons
                                        name={getTypeIcon(task.type) as any}
                                        size={12}
                                        color={getTypeIconColor(task.type)}
                                    />
                                    <Text className={`text-xs font-medium ${isRTL ? 'mr-1' : 'ml-1'} ${isDark
                                            ? (task.type === 'remote' ? 'text-green-400' : 'text-blue-400')
                                            : (task.type === 'remote' ? 'text-green-800' : 'text-blue-800')
                                        }`}>
                                      
                                        {task?.task_types?.[0] ? 
                                            (i18n.language === 'ar' ? task.task_types[0].type_ar : task.task_types[0].type_en)
                                            : (task.type === 'remote' ? t('tasks.type.remote') : t('tasks.type.onSite'))
                                        }
                                    </Text>
                                </View>
                            </View>
                            
                            {task?.category && (
                                <View className={`px-2 py-1 rounded-full ml-2 ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                                    }`}>
                                    <Text className={`text-xs font-medium ${isDark ? 'text-purple-400' : 'text-purple-800'
                                        }`}>
                                        
                                        {i18n.language === 'ar' ? task.category.title_ar : task.category.title_en}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View className={`items-${isRTL ? 'start' : 'end'}`}>
                        <Text className="text-xl font-bold text-green-500 mb-1">
                           
                            {task.budget} {i18n.language === 'ar' ? config?.currency_ar || 'ر.س' : config?.currency_en || 'USD'}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isRTL ? 'text-right' : 'text-left'
                            }`}>
                            {t('tasks.budget')}
                        </Text>
                    </View>
                </View>

                <View className={`flex-row justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Ionicons
                            name="time-outline"
                            size={16}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                        />
                        <Text className={`${isRTL ? 'mr-1' : 'ml-1'} text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {task.duration}
                        </Text>
                    </View>
                    <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                        />
                        <Text className={`${isRTL ? 'mr-1' : 'ml-1'} text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`} numberOfLines={1}>
                            {task.location}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}
