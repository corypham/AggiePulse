import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Button from "./components/button";

const index = () => {
  const router = useRouter();
  
  return (
    <View className="flex-1 items-center justify-center p-20 bg-gray-800">
      <Text className="text-white text-4xl font-bold m-4">Welcome to AggiePulse</Text>
      <Text className="text-white text-lg">Made by Cory Pham</Text>
      <Button 
        title="Get Started" 
        onPress={() => router.push("/(tabs)/home")} 
      />
    </View>
  );
};

export default index;