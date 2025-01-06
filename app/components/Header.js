import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Header({ title = 'Default Title' }) { 
  const router = useRouter();

  return (
  <SafeAreaView className="bg-white">
    <View className="flex-row justify-between items-center bg-white px-6 py-2">
      <TouchableOpacity 
        onPress={() => router.back()}
        className="flex-row items-center"
      >
        <Text className="text-blue-700 text-lg font-bold">← Back</Text>
      </TouchableOpacity>
      <Text className="text-black text-lg font-bold">{title}</Text>
    </View>
  </SafeAreaView>
  );
}
