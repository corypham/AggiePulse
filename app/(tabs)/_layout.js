import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function TabsLayout () {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.push("/")}
            style={{ marginLeft: 16 }}
          >
            <Text className="text-blue-300 text-10lg">← Back</Text>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          backgroundColor: 'black',
        },
      }}
    >
      <Tabs.Screen 
      name="home/index" 
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