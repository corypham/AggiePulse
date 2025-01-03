import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
      <Text className="text-white text-3xl font-bold m-4">This is the Profile tab</Text>
    </SafeAreaView>
  );
};

export default index;