import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  HomeSelected,
  HomeUnselected,
  FavoritesSelected,
  FavoritesUnselected,
  ProfileSelected,
  ProfileUnselected
} from '../../assets';

interface TabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
    }>;
  };
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean; }) => any;
    navigate: (name: string) => void;
  };
}

export default function TabBar({ state, navigation }: TabBarProps) {
  const getIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'home':
        return isFocused ? 
          <HomeSelected width={30} height={30} /> : 
          <HomeUnselected width={30} height={30} />;
      case 'favorites/index':
        return isFocused ? 
          <FavoritesSelected width={30} height={30} /> : 
          <FavoritesUnselected width={30} height={30} />;
      case 'profile/index':
        return isFocused ? 
          <ProfileSelected width={30} height={30} /> : 
          <ProfileUnselected width={30} height={30} />;
      default:
        return isFocused ? 
          <HomeSelected width={30} height={30} /> : 
          <HomeUnselected width={30} height={30} />;
    }
  };

  return (
    <View className="flex-row justify-around items-center bg-white pt-3 pb-8 border-t border-gray-300">
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

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="items-center flex-1"
          >
            {getIcon(route.name, isFocused)}
            <Text className={`text-sm mt-1 font-aileron ${
              isFocused ? 'text-primary font-aileron-bold' : 'text-secondary'
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
