import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface Route {
  key: string;
  name: string;
}

interface NavigationState {
  index: number;
  routes: Route[];
}

interface NavigationEvent {
  type: string;
  target: string;
  canPreventDefault: boolean;
  defaultPrevented?: boolean;
}

interface TabBarProps {
  state: NavigationState;
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean; }) => NavigationEvent;
    navigate: (name: string) => void;
  };
}

export default function TabBar({ state, navigation }: TabBarProps) {
  return (
    <View className="flex-row justify-around bg-white pt-3 pb-6 border-t border-gray-200">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Get icon name based on route
        const getIconName = (routeName: string): string => {
          switch (routeName) {
            case 'home':
              return 'home';
            case 'profile/index':
              return 'person';
            case 'favorites/index':
              return 'heart';
            default:
              return 'home';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="items-center px-3"
          >
            <Ionicons
              name={getIconName(route.name) as keyof typeof Ionicons.glyphMap}
              size={24}
              color={isFocused ? '#1d4ed8' : '#6b7280'}
            />
            <Text className={`text-sm mt-1 ${
              isFocused ? 'text-blue-700 font-bold' : 'text-gray-500'
            }`}>
              {route.name === 'home' ? 'Home' : 
               route.name === 'profile/index' ? 'Profile' : 'Favorites'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
