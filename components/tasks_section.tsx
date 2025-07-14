import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
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

// Skeleton component for loading state
const TaskSkeleton = () => {
    const pulseAnim = new Animated.Value(0);

    React.useEffect(() => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse());
        };
        pulse();
    }, []);

    const opacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View className="bg-white rounded-xl p-4 shadow-sm mb-3" style={{ opacity }}>
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-4">
                    <View className="w-3/4 h-5 bg-gray-300 rounded mb-2" />
                    <View className="w-full h-3 bg-gray-300 rounded" />
                </View>
                <View className="w-20 h-5 bg-gray-300 rounded" />
            </View>
            <View className="flex-row justify-between items-center">
                <View className="w-16 h-4 bg-gray-300 rounded" />
                <View className="w-16 h-4 bg-gray-300 rounded" />
            </View>
        </Animated.View>
    );
};

// Task item component with animation
const TaskItem = ({ task, index }: { task: Task; index: number }) => {
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

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

    const formatBudget = (budget: number) => {
        return `$${budget}`;
    };

    const getTypeColor = (type: string) => {
        return type === 'remote' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
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
                className="bg-white rounded-xl p-4 shadow-sm mb-3"
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-4">
                        <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
                            {task.title}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                            {task.description}
                        </Text>
                        <View className="flex-row items-center mb-2">
                            <View className={`px-2 py-1 rounded-full ${getTypeColor(task.type)}`}>
                                <View className="flex-row items-center">
                                    <Ionicons 
                                        name={getTypeIcon(task.type) as any} 
                                        size={12} 
                                        color={task.type === 'remote' ? '#166534' : '#1e40af'} 
                                    />
                                    <Text className={`text-xs font-medium ml-1 ${
                                        task.type === 'remote' ? 'text-green-800' : 'text-blue-800'
                                    }`}>
                                        {task.type === 'remote' ? 'Remote' : 'On-site'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="items-end">
                        <Text className="text-xl font-bold text-green-600 mb-1">
                            {formatBudget(task.budget)}
                        </Text>
                        <Text className="text-xs text-gray-500">Budget</Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                        <Text className="text-gray-600 ml-1 text-sm">{task.duration}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                        <Text className="text-gray-600 ml-1 text-sm" numberOfLines={1}>
                            {task.location}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function Tasks_Section() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 3 }, (_, index) => (
            <TaskSkeleton key={`skeleton-${index}`} />
        ));
    };

    const renderTasks = () => {
        if (!tasks || tasks.length === 0) {
            return (
                <View className="bg-white rounded-xl p-8 items-center">
                    <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2 text-center">No tasks available</Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">
                        Check back later for new opportunities
                    </Text>
                </View>
            );
        }

        return tasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 pb-20">
                <Text className="text-xl font-bold text-gray-900 mb-4">Recent Projects</Text>
                <View className="bg-red-50 rounded-xl p-6 items-center">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="text-red-600 mt-2 text-center font-medium">{error}</Text>
                    <TouchableOpacity
                        className="bg-red-500 px-6 py-3 rounded-lg mt-4"
                        onPress={fetchTasks}
                    >
                        <Text className="text-white font-medium">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 pb-20">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Recent Projects</Text>
                {tasks && tasks.length > 0 && (
                    <TouchableOpacity>
                        <Text className="text-blue-500 font-medium">View All</Text>
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
