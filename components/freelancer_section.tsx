import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '@/constants/config';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Freelancer_Item from './items/freelancer_item';
import Freelancer_Skeleton from './skeletons/freelancer_skeleton';

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




// Freelancer item component with animation


export default function Freelancer_Section() {
    const [freelancers, setFreelancers] = useState<Freelancer[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useTheme();
    const { t } = useTranslation();

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
            setError(t('freelancers.error.fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 3 }, (_, index) => (
            <Freelancer_Skeleton key={`skeleton-${index}`} />
        ));
    };

    const renderFreelancers = () => {
        if (!freelancers || freelancers.length === 0) {
            return (
                <View className={`rounded-xl p-8 items-center mr-4 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`} style={{ width: 280 }}>
                    <Ionicons 
                        name="people-outline" 
                        size={48} 
                        color={isDark ? '#6B7280' : '#9CA3AF'} 
                    />
                    <Text className={`mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('freelancers.empty.title')}
                    </Text>
                    <Text className={`text-sm mt-1 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('freelancers.empty.message')}
                    </Text>
                </View>
            );
        }

        return freelancers.map((freelancer, index) => (
           
            <Freelancer_Item key={freelancer.id} freelancer={freelancer} index={index} />
        ));
    };

    if (error) {
        return (
            <View className="px-6 pb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t('freelancers.title')}
                    </Text>
                </View>
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
                        onPress={fetchFreelancers}
                    >
                        <Text className="text-white font-medium">{t('freelancers.error.tryAgain')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="px-6 pb-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('freelancers.title')}
                </Text>
                {freelancers && freelancers.length > 0 && (
                    <TouchableOpacity>
                        <Text className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
                            {t('freelancers.seeAll')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {loading ? renderSkeletons() : renderFreelancers()}
            </ScrollView>
        </View>
    );
}
