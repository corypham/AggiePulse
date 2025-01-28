import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Button, Card } from "../../components";
import React from "react";

const index = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="py-2">
      <Card
      title="Silo Market"
      status="Fairly Busy"
      isOpen={true}
      closingTime="00:00 XM"
      distance={0.0}
      isFavorite={false}
      onFavoritePress={() => {
        // Handle favorite toggle
      }}
      />

<Card
      title="Activities and Recreation Center"
      status="Fairly Busy"
      isOpen={true}
      closingTime="00:00 XM"
      distance={0.0}
      isFavorite={false}
      onFavoritePress={() => {
        // Handle favorite toggle
      }}
      />

<Card
      title="Memorial Union"
      status="Fairly Busy"
      isOpen={true}
      closingTime="00:00 XM"
      distance={0.0}
      isFavorite={true}
      onFavoritePress={() => {
        // Handle favorite toggle
      }}
      />

<Card
      title="Peter J. Shields Library"
      status="Fairly Busy"
      isOpen={true}
      closingTime="00:00 XM"
      distance={0.0}
      isFavorite={false}
      onFavoritePress={() => {
        // Handle favorite toggle
      }}
      />

      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
