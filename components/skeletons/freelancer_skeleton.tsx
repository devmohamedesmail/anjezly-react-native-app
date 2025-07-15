import React from 'react'
import { Animated , View, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Freelancer_Skeleton() {
     const pulseAnim = new Animated.Value(0);
        const { isDark } = useTheme();
    
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
                className={`rounded-xl p-4 mr-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                style={{ width: 280, opacity }}
            >
                <View className="flex-row items-center mb-3">
                    <View className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    <View className="ml-3 flex-1">
                        <View className={`w-24 h-4 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                        <View className={`w-20 h-3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    </View>
                    <View className="items-end">
                        <View className={`w-16 h-4 rounded mb-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                        <View className={`w-12 h-3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    </View>
                </View>
                <View className="flex-row mb-3">
                    <View className={`w-12 h-6 rounded-full mr-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    <View className={`w-16 h-6 rounded-full mr-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    <View className={`w-14 h-6 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                </View>
                <View className={`w-full h-10 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </Animated.View>
  )
}
