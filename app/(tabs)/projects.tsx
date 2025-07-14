import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '@/components/BottomNavigation';
import '../../styles/global.css';

const myProjects = [
  {
    id: 1,
    title: 'E-commerce Website Design',
    status: 'In Progress',
    budget: '$1200',
    deadline: '5 days left',
    client: 'Tech Store LLC',
    progress: 75
  },
  {
    id: 2,
    title: 'Mobile App UI/UX',
    status: 'Completed',
    budget: '$800',
    deadline: 'Completed',
    client: 'StartupXYZ',
    progress: 100
  },
  {
    id: 3,
    title: 'Logo Design & Branding',
    status: 'Pending Review',
    budget: '$350',
    deadline: '2 days left',
    client: 'Coffee Shop Co.',
    progress: 90
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending Review':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function Projects() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">My Projects</Text>
            <Text className="text-gray-600">Manage your active projects</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">New Project</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
            <Text className="text-2xl font-bold text-blue-500">3</Text>
            <Text className="text-gray-600 text-sm">Active Projects</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm">
            <Text className="text-2xl font-bold text-green-500">12</Text>
            <Text className="text-gray-600 text-sm">Completed</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
            <Text className="text-2xl font-bold text-yellow-500">$2.5k</Text>
            <Text className="text-gray-600 text-sm">This Month</Text>
          </View>
        </View>
      </View>

      {/* Projects List */}
      <ScrollView className="flex-1 px-6 pb-20" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-gray-900 mb-4">Recent Projects</Text>
        
        {myProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-4">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {project.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  Client: {project.client}
                </Text>
                <View className={`self-start px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  <Text className="text-xs font-medium">{project.status}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-green-600">{project.budget}</Text>
                <Text className="text-sm text-gray-500">{project.deadline}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-600">Progress</Text>
                <Text className="text-sm font-medium text-gray-900">{project.progress}%</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View 
                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-600 ml-1 text-sm">Message Client</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="document-outline" size={16} color="#3B82F6" />
                <Text className="text-blue-500 ml-1 text-sm font-medium">View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="projects" />
    </SafeAreaView>
  );
}
