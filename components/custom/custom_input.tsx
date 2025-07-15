import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export default function Custom_Input({value, label, onChangeText, error, icon, isPassword = false, placeholder, ...props}:any) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { isDark } = useTheme();
    const getBorderColor = () => {
        if (error) return 'border-red-500';
        if (isFocused) return 'border-primary';
        return isDark ? 'border-gray-600' : 'border-gray-300';
    };

    return (
        <View className="mb-4">
            <Text className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</Text>
            <View className="relative">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full px-4 py-4 border  rounded-xl ${
                        isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'
                    } ${getBorderColor()}`}
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    {...props}
                />
                <View className="absolute right-4 top-4 flex-row items-center">
                    {isPassword && (
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            className="mr-2"
                        >
                            <Ionicons 
                                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color={isDark ? '#9CA3AF' : '#6B7280'} 
                            />
                        </TouchableOpacity>
                    )}
                    {icon}
                </View>
            </View>
           
            {error ? ( <Text className="text-red-500 text-sm mt-1">{error}</Text>): null}
        </View>
    )
}
