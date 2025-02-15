import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();

  const Divider = () => (
    <View className="flex-row justify-center">
      <View className="h-[1px] bg-gray-200 flex-1 mx-4" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center mt-8 mb-6">
        <Image
          source={require('../../../assets/default-avatar.png')}
          className="w-28 h-28 rounded-full"
        />
        <Text className="text-xl font-semibold mt-4">Username</Text>
        <TouchableOpacity 
          className="mt-2 px-6 py-1.5 rounded-full bg-black"
          onPress={() => console.log('Edit profile')}
        >
          <Text className="text-white text-base">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Account Information Section */}
      <View className="px-6">
        <Text className="text-lg font-semibold mb-2">Account Information</Text>
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="heart-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Your Preferences</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="pulse-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Your Activity</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="lock-closed-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Change Password</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="settings-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Account Settings</Text>
        </TouchableOpacity>
      </View>

      {/* AggiePulse Section */}
      <View className="mt-6 px-6">
        <Text className="text-lg font-semibold mb-2">AggiePulse</Text>
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="help-circle-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">FAQ</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="shield-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Privacy</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity className="flex-row items-center py-3">
          <Ionicons name="mail-outline" size={22} color="black" />
          <Text className="ml-3 text-gray-700 text-base">Contact Us</Text>
        </TouchableOpacity>
        <Divider />
        
        <TouchableOpacity 
          className="flex-row items-center py-3"
          onPress={() => console.log('Logout')}
        >
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text className="ml-3 text-red-500 text-base">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;