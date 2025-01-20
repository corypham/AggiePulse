import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Button, Card } from "../../components";
import React from "react";

const index = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <ScrollView className="py-4">
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
        <Card title="Favorite Card" description="This is card one"></Card>
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

      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
