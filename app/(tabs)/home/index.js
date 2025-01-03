import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import About from "./About";
import { Button, Card } from "../../components";
import Settings from "./Settings";

const index = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
      <Text className="text-white text-3xl font-bold m-4">This is the Home tab that were working on</Text>
      <Button title="About" onPress={() => router.push("home/About")} />
      <Button title="Settings" onPress={() => router.push("home/Settings")} />
      <Card />
    </SafeAreaView>
  );
};

export default index;
