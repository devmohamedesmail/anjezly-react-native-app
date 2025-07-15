import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '@/constants/config';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Task_Skeleton from './skeletons/task_skeleton';
import Task_Item from './items/task_item';

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

interface TasksResponse {
    data: Task[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}







export default function Tasks_Section() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<TasksResponse>(`${config.url}/tasks?populate=*`, {
                headers: {
                    Authorization: `Bearer ${config.token}`
                }
            });
            setTasks(response.data.data);
        } catch (error) {
            setError(t('tasks.error.fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 3 }, (_, index) => ( 
            <Task_Skeleton key={`skeleton-${index}`} />
        ));
    };

    const renderTasks = () => {
        if (!tasks || tasks.length === 0) {
            return (
                <View className={`rounded-xl p-8 items-center ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <Ionicons 
                        name="briefcase-outline" 
                        size={48} 
                        color={isDark ? '#6B7280' : '#9CA3AF'} 
                    />
                    <Text className={`mt-2 text-center ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {t('tasks.empty.title')}
                    </Text>
                    <Text className={`text-sm mt-1 text-center ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        {t('tasks.empty.message')}
                    </Text>
                </View>
            );
        }

        return tasks.map((task, index) => (   
            <Task_Item key={task.id} task={task} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 pb-20">
                <Text className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                } ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('tasks.title')}
                </Text>
                <View className={`rounded-xl p-6 items-center ${
                    isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50'
                }`}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className={`mt-2 text-center font-medium ${
                        isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="bg-red-500 px-6 py-3 rounded-lg mt-4"
                        onPress={fetchTasks}
                    >
                        <Text className="text-white font-medium">{t('tasks.error.tryAgain')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 pb-20">
            <View className={`flex-row justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    {t('tasks.title')}
                </Text>
                {tasks && tasks.length > 0 && (
                    <TouchableOpacity>
                        <Text className={`font-medium ${
                            isDark ? 'text-blue-400' : 'text-blue-500'
                        }`}>
                            {t('tasks.viewAll')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {loading ? (
                <View>{renderSkeletons()}</View>
            ) : (
                <View>{renderTasks()}</View>
            )}
        </View>
    );
}
