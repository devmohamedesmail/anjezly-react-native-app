import React from 'react'
import { View, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Category_Skeleton() {

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
        <View className={`w-[30%] mb-4 rounded-xl p-4 shadow-sm items-center ${isDark ? 'bg-gray-800' : 'bg-white'
            }`} style={{ minHeight: 100 }}>
            <Animated.View
                className={`w-12 h-12 rounded-full mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                style={{ opacity }}
            />
            <Animated.View
                className={`w-16 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                style={{ opacity }}
            />
        </View>
    )
}
