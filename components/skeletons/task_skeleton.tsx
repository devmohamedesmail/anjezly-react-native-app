import React from 'react'
import { Animated , View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Task_Skeleton() {
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
    <Animated.View className={`rounded-xl p-4 shadow-sm mb-3 ${
               isDark ? 'bg-gray-800' : 'bg-white'
           }`} style={{ opacity }}>
               <View className="flex-row justify-between items-start mb-2">
                   <View className="flex-1 mr-4">
                       <View className={`w-3/4 h-5 rounded mb-2 ${
                           isDark ? 'bg-gray-600' : 'bg-gray-300'
                       }`} />
                       <View className={`w-full h-3 rounded ${
                           isDark ? 'bg-gray-600' : 'bg-gray-300'
                       }`} />
                   </View>
                   <View className={`w-20 h-5 rounded ${
                       isDark ? 'bg-gray-600' : 'bg-gray-300'
                   }`} />
               </View>
               <View className="flex-row justify-between items-center">
                   <View className={`w-16 h-4 rounded ${
                       isDark ? 'bg-gray-600' : 'bg-gray-300'
                   }`} />
                   <View className={`w-16 h-4 rounded ${
                       isDark ? 'bg-gray-600' : 'bg-gray-300'
                   }`} />
               </View>
           </Animated.View>
  )
}
