import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { config } from '@/constants/config';

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

// Skeleton component for loading state
const CategorySkeleton = () => {
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
        <View className="w-[30%] mb-4 bg-white rounded-xl p-4 shadow-sm items-center" style={{ minHeight: 100 }}>
            <Animated.View 
                className="w-12 h-12 bg-gray-300 rounded-full mb-2"
                style={{ opacity }}
            />
            <Animated.View 
                className="w-16 h-4 bg-gray-300 rounded"
                style={{ opacity }}
            />
        </View>
    );
};

// Category item component with animation
const CategoryItem = ({ category, index }: { category: Category; index: number }) => {
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
                className="bg-white rounded-xl p-4 shadow-sm items-center"
                style={{ minHeight: 100 }}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View className="w-14 h-14 rounded-xl items-center justify-center mb-3 bg-blue-50 overflow-hidden">
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
                <Text className="text-xs font-medium text-gray-700 text-center" numberOfLines={2}>
                    {category.title_en}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function Categories_Section() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch_categories();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 6 }, (_, index) => (
            <CategorySkeleton key={`skeleton-${index}`} />
        ));
    };

    const renderCategories = () => {
        if (!categories || categories.length === 0) {
            return (
                <View className="w-full items-center py-8">
                    <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2">No categories available</Text>
                </View>
            );
        }

        return categories.map((category, index) => (
            <CategoryItem key={category.id} category={category} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 py-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">What do you need help with?</Text>
                <View className="bg-red-50 rounded-xl p-4 items-center">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="text-red-600 mt-2 text-center">{error}</Text>
                    <TouchableOpacity
                        className="bg-red-500 px-4 py-2 rounded-lg mt-3"
                        onPress={fetch_categories}
                    >
                        <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 py-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">What do you need help with?</Text>
            <View className="flex-row flex-wrap justify-between">
                {loading ? renderSkeletons() : renderCategories()}
            </View>
        </View>
    );
}
