import { View, Text } from "react-native";
import React from "react";

interface CardProps {
  title: string;
  description?: string;
}

const Card = ({ title, description }: CardProps) => {
  return (
    <View className="bg-indigo-400 rounded-lg p-4 shadow-slate-900 m-2">
      <Text className="text-white text-2xl font-bold">{title}</Text>
      {description && (<Text className="text-white mt-2">{description}</Text>)}
    </View>
  );
};

export default Card;