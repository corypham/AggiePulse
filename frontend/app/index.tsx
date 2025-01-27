import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Button from "./components/button";

const index = () => {
  const router = useRouter();
  
  return (
    <View className="flex-1 items-center justify-center p-20 bg-background">
      <Text className="font-aileron-bold text-2xl text-primary mb-2 flex-wrap">Welcome to AggiePulse</Text>
      <Text className="text-lg text-primary">Made by UCD Students</Text>
      <Button 
        title="Get Started" 
        onPress={() => router.push("/(tabs)/home")} 
      />
    </View>
  );
};

export default index;