import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components";

export default function TabsLayout () {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        header: ({ route }) => <Header title={route.name} />
      }}
    >
      <Tabs.Screen 
      name="home" 
      options={{ 
        title: "Home",
        headerShown: true,
        icon: "home" 
      }}  
      />

      <Tabs.Screen 
      name="profile/index" 
      options={{ 
        title: "Profile",
        headerShown: true,
        icon: "person" 
      }} 
      />

      <Tabs.Screen 
      name="favorites/index" 
      options={{ 
        title: "Favorites",
        headerShown: true,
        icon: "heart" 
      }} 
      />
    </Tabs>
  )
}