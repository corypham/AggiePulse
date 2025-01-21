import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components";
import TabBar from '../components/TabBar';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type TabParamList = {
  'favorites/index': undefined;
  'home': undefined;
  'profile/index': undefined;
};

type TabsLayoutProps = BottomTabScreenProps<TabParamList>;

export default function TabsLayout(): JSX.Element {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => <Header title={options?.title || ''} />
      }}
      tabBar={(props: any) => <TabBar {...props} />}
    >
      <Tabs.Screen 
      name="favorites/index" 
      options={{ 
        title: "Favorites",
        headerShown: true,
        tabBarIcon: ({color, size}) => (
          <Ionicons name="heart" size={size} color={color} />
        )
      }} 
      />

      <Tabs.Screen 
      name="home" 
      options={{ 
        title: "Home",
        headerShown: true,
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home" size={size} color={color} />
        )
      }}  
      />

      <Tabs.Screen 
      name="profile/index" 
      options={{ 
        title: "Profile",
        headerShown: true,
        tabBarIcon: ({color, size}) => (
          <Ionicons name="person" size={size} color={color} />
        )
      }} 
      />
    </Tabs>
  );
}