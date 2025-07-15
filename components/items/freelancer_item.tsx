import React, { useRef, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth_context';






export default function Freelancer_Item({ freelancer, index }: { freelancer: any; index: number }) {
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const { auth } = useAuth();

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
        const totalRating = freelancer.reviews.reduce((sum: any, review: any) => sum + review.rating, 0);
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
            assistant: [t('freelancerItem.skills.virtualAssistant'), t('freelancerItem.skills.dataEntry'), t('freelancerItem.skills.adminSupport')],
            developer: [t('freelancerItem.skills.react'), t('freelancerItem.skills.nodejs'), t('freelancerItem.skills.typescript')],
            designer: [t('freelancerItem.skills.figma'), t('freelancerItem.skills.photoshop'), t('freelancerItem.skills.uiux')],
            writer: [t('freelancerItem.skills.contentWriting'), t('freelancerItem.skills.seo'), t('freelancerItem.skills.copywriting')]
        };
        return skillSets[freelancer.type as keyof typeof skillSets] || [t('freelancerItem.skills.generalServices')];
    };


    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
            }}
        >
            <TouchableOpacity
                className={`rounded-xl p-4 mr-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
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
                        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                            {getDisplayName()}
                        </Text>
                        <Text className={`capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`} numberOfLines={1}>
                            {freelancer.type.replace('_', ' ')}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-lg font-bold text-blue-500">${t('freelancerItem.hourlyRate')}</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFA500" />
                            <Text className={`text-sm ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {avgRating > 0 ? `${avgRating} (${reviewCount})` : t('freelancerItem.new')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row flex-wrap mb-3">
                    {getSkills().map((skill, skillIndex) => (
                        <View key={skillIndex} className={`px-2 py-1 rounded-full mr-2 mb-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                            <Text className={`text-xs ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                {skill}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row items-center mb-3">
                    <Ionicons name="location-outline" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {freelancer.phone ? t('freelancerItem.available') : t('freelancerItem.contactForDetails')}
                    </Text>
                    {freelancer.reviews.length > 0 && (
                        <>
                            <View className={`w-1 h-1 rounded-full mx-2 ${isDark ? 'bg-gray-500' : 'bg-gray-400'
                                }`} />
                            <Text className="text-sm text-green-500 font-medium">
                                {freelancer.reviews.length} {freelancer.reviews.length === 1 ? t('freelancerItem.review') : t('freelancerItem.reviews')}
                            </Text>
                        </>
                    )}
                </View>


                <View className='flex-row justify-between items-center mt-4'>
                    <TouchableOpacity 
                        className="bg-primary py-3 mr-2 px-3 rounded-lg"
                        onPress={() => {
                            if (auth?.user) {
                                router.push({
                                    pathname: '/chat',
                                    params: {
                                        freelancerId: freelancer.id,
                                        freelancerName: getDisplayName(),
                                        freelancerAvatar: getAvatarUrl(),
                                        userId: auth.user.id
                                    }
                                } as any);
                            } else {
                                router.push('/login');
                            }
                        }}
                    >
                        <Ionicons name="chatbubble-outline" size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 border border-primary py-2 rounded-lg"
                        onPress={() => router.push(`/freelancer-profile?id=${freelancer.id}`)}
                    >
                        <Text className="text-primary font-medium text-center text-sm">
                            {t('explore.viewProfile')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}
