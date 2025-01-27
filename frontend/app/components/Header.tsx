import { View, Text, SafeAreaView } from "react-native";
import React from "react";

export default function Header({ title = 'Default Title' }) { 
  return (
    <SafeAreaView className="bg-transparent">
      <View className="flex-row justify-center items-center px-6 py-2">
        <Text className="text-black text-lg font-bold">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
