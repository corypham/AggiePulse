import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Button from "./components/button";

const index = () => {
  const router = useRouter();
  
  return (
    <View className="flex-1 items-center justify-center p-20 bg-slate-700">
      <Text className="font-aileron-bold text-4xl text-white mb-2 flex-wrap">Welcome to AggiePulse</Text>
      <Text className="text-lg text-white">Made by UCD Students</Text>
      <Button 
        title="Get Started" 
        onPress={() => router.push("/(tabs)/home")} 
      />
    </View>
  );
};

export default index;