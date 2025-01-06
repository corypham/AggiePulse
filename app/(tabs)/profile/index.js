import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Header, Button, Card } from "../../components";

const index = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
      <Text className="text-white text-3xl font-bold m-4">This is the Profile tab</Text>
      <Button title="Go to Home" onPress={() => router.push("home")} />
        <View className="flex-1 flex-column flex-wrap p-2">
          <Card title="Settings" description="This is a card" />
          <Card title="Card 2" description="This is a card" />
        </View>
    </SafeAreaView>
  );
};

export default index;