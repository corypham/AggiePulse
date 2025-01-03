import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default index;
