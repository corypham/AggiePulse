import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const index = () => {
  return (
    <SafeAreaView className="flex-1  bg-gray-800">
      <Text className="text-white text-3xl font-bold m-4">This is the Favorites tab</Text>
      <View className="flex-1 bg-white">
        <Text className="text-black text-3xl font-bold m-4">This is the Favorites tab</Text>
      </View>
      <View className="flex-1 bg-gray-600">
        <Text className="text-white text-3xl font-bold m-4">This is the Favorites tab</Text>
      </View>
      <View className="flex-1 bg-orange-500">
        <Text className="text-white text-3xl font-bold m-4">This is the Favorites tab</Text>
      </View>
    </SafeAreaView>
  );
};

export default index;
