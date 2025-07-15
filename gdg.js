 {freelancers && freelancers.map((freelancer) => (
          <TouchableOpacity
            key={freelancer.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <View className="flex-row items-start">
              <View className="relative">
                <Image
                  source={{ uri: freelancer.image }}
                  className="w-16 h-16 rounded-full"
                />
                {freelancer.available && (
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                    <View className="w-3 h-3 bg-white rounded-full" />
                  </View>
                )}
              </View>

              <View className="ml-4 flex-1">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{freelancer.name}</Text>
                    <Text className="text-gray-600">{freelancer.profession}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                      <Text className="text-sm text-gray-500 ml-1">{freelancer.location}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-blue-500">{freelancer.price}</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={14} color="#FFA500" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {freelancer.rating} ({freelancer.reviews})
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row flex-wrap mb-3">
                  {freelancer.skills.map((skill, index) => (
                    <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1">
                      <Text className="text-xs text-gray-700">{skill}</Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row space-x-3">
                  <TouchableOpacity className="flex-1 bg-blue-500 py-2 rounded-lg">
                    <Text className="text-white font-medium text-center text-sm">Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 border border-blue-500 py-2 rounded-lg">
                    <Text className="text-blue-500 font-medium text-center text-sm">View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}