import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-blue-500 px-6 py-3 rounded-full mt-6"
    >
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;