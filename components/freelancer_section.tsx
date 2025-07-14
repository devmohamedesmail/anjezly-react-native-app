import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '@/constants/config';

interface FreelancerRole {
    id: number;
    documentId: string;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface FreelancerAvatar {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
        thumbnail?: {
            name: string;
            hash: string;
            ext: string;
            mime: string;
            path?: string;
            width: number;
            height: number;
            size: number;
            sizeInBytes: number;
            url: string;
            provider_metadata?: {
                public_id: string;
                resource_type: string;
            };
        };
        small?: {
            name: string;
            hash: string;
            ext: string;
            mime: string;
            path?: string;
            width: number;
            height: number;
            size: number;
            sizeInBytes: number;
            url: string;
            provider_metadata?: {
                public_id: string;
                resource_type: string;
            };
        };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: {
        public_id: string;
        resource_type: string;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface FreelancerReview {
    id: number;
    documentId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface Freelancer {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    rating?: number;
    type: string;
    phone?: string;
    facebook?: string;
    linkedin?: string;
    whatsup?: string;
    role: FreelancerRole;
    tasks: any[];
    task: any[];
    avatar?: FreelancerAvatar;
    reviews: FreelancerReview[];
}

interface FreelancersResponse {
    data: Freelancer[];
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
const FreelancerSkeleton = () => {
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
        <Animated.View 
            className="bg-white rounded-xl p-4 mr-4 shadow-sm"
            style={{ width: 280, opacity }}
        >
            <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-gray-300 rounded-full" />
                <View className="ml-3 flex-1">
                    <View className="w-24 h-4 bg-gray-300 rounded mb-2" />
                    <View className="w-20 h-3 bg-gray-300 rounded" />
                </View>
                <View className="items-end">
                    <View className="w-16 h-4 bg-gray-300 rounded mb-1" />
                    <View className="w-12 h-3 bg-gray-300 rounded" />
                </View>
            </View>
            <View className="flex-row mb-3">
                <View className="w-12 h-6 bg-gray-300 rounded-full mr-2" />
                <View className="w-16 h-6 bg-gray-300 rounded-full mr-2" />
                <View className="w-14 h-6 bg-gray-300 rounded-full" />
            </View>
            <View className="w-full h-10 bg-gray-300 rounded-lg" />
        </Animated.View>
    );
};

// Freelancer item component with animation
const FreelancerItem = ({ freelancer, index }: { freelancer: Freelancer; index: number }) => {
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Staggered animation entrance
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 150,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                delay: index * 150,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.96,
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

    const getAvatarUrl = () => {
        return freelancer.avatar?.formats?.thumbnail?.url || 
               freelancer.avatar?.formats?.small?.url || 
               freelancer.avatar?.url ||
               'https://via.placeholder.com/150/E5E7EB/9CA3AF?text=User';
    };

    const calculateAverageRating = () => {
        if (!freelancer.reviews || freelancer.reviews.length === 0) {
            return { average: 0, count: 0 };
        }
        const totalRating = freelancer.reviews.reduce((sum, review) => sum + review.rating, 0);
        return {
            average: Math.round((totalRating / freelancer.reviews.length) * 10) / 10,
            count: freelancer.reviews.length
        };
    };

    const { average: avgRating, count: reviewCount } = calculateAverageRating();

    const getDisplayName = () => {
        if (freelancer.username && freelancer.username !== freelancer.email) {
            return freelancer.username;
        }
        return freelancer.email.split('@')[0];
    };

    const getSkills = () => {
        // Since skills aren't in the API data, we'll generate some based on role/type
        const skillSets = {
            assistant: ['Virtual Assistant', 'Data Entry', 'Admin Support'],
            developer: ['React', 'Node.js', 'TypeScript'],
            designer: ['Figma', 'Photoshop', 'UI/UX'],
            writer: ['Content Writing', 'SEO', 'Copywriting']
        };
        return skillSets[freelancer.type as keyof typeof skillSets] || ['General Services'];
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
            }}
        >
            <TouchableOpacity
                className="bg-white rounded-xl p-4 mr-4 shadow-sm"
                style={{ width: 280 }}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center mb-3">
                    <View className="relative">
                        <Image
                            source={{ uri: getAvatarUrl() }}
                            className="w-12 h-12 rounded-full"
                            style={{ backgroundColor: '#E5E7EB' }}
                        />
                        {freelancer.confirmed && (
                            <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full items-center justify-center">
                                <Ionicons name="checkmark" size={10} color="white" />
                            </View>
                        )}
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                            {getDisplayName()}
                        </Text>
                        <Text className="text-gray-600 capitalize" numberOfLines={1}>
                            {freelancer.type.replace('_', ' ')}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-lg font-bold text-blue-500">$25/hr</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFA500" />
                            <Text className="text-sm text-gray-600 ml-1">
                                {avgRating > 0 ? `${avgRating} (${reviewCount})` : 'New'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row flex-wrap mb-3">
                    {getSkills().map((skill, skillIndex) => (
                        <View key={skillIndex} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1">
                            <Text className="text-xs text-gray-700">{skill}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row items-center mb-3">
                    <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                    <Text className="text-sm text-gray-500 ml-1">
                        {freelancer.phone ? 'Available' : 'Contact for details'}
                    </Text>
                    {freelancer.reviews.length > 0 && (
                        <>
                            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                            <Text className="text-sm text-green-600 font-medium">
                                {freelancer.reviews.length} review{freelancer.reviews.length !== 1 ? 's' : ''}
                            </Text>
                        </>
                    )}
                </View>

                <TouchableOpacity className="bg-blue-500 py-3 rounded-lg">
                    <Text className="text-white font-medium text-center">Contact Now</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function Freelancer_Section() {
    const [freelancers, setFreelancers] = useState<Freelancer[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<Freelancer[]>(
                `${config.url}/users?filters[type][$eq]=assistant&populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${config.token}`
                    }
                }
            );
            setFreelancers(response.data);
            
        } catch (error) {
            console.error('Error fetching freelancers:', error);
            setError('Failed to load freelancers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 3 }, (_, index) => (
            <FreelancerSkeleton key={`skeleton-${index}`} />
        ));
    };

    const renderFreelancers = () => {
        if (!freelancers || freelancers.length === 0) {
            return (
                <View className="bg-white rounded-xl p-8 items-center mr-4" style={{ width: 280 }}>
                    <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2 text-center">No freelancers available</Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">
                        Check back later for new talent
                    </Text>
                </View>
            );
        }

        return freelancers.map((freelancer, index) => (
            <FreelancerItem key={freelancer.id} freelancer={freelancer} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 pb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-gray-900">Top Freelancers</Text>
                </View>
                <View className="bg-red-50 rounded-xl p-6 items-center">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="text-red-600 mt-2 text-center font-medium">{error}</Text>
                    <TouchableOpacity
                        className="bg-red-500 px-6 py-3 rounded-lg mt-4"
                        onPress={fetchFreelancers}
                    >
                        <Text className="text-white font-medium">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 pb-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Top Freelancers</Text>
                {freelancers && freelancers.length > 0 && (
                    <TouchableOpacity>
                        <Text className="text-blue-500 font-medium">See All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {loading ? renderSkeletons() : renderFreelancers()}
            </ScrollView>
        </View>
    );
}
