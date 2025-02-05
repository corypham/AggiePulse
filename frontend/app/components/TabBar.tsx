import { View, Text, TouchableOpacity, Platform } from "react-native";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  HomeSelected,
  HomeUnselected,
  FavoritesSelected,
  FavoritesUnselected,
  ProfileSelected,
  ProfileUnselected
} from '../../assets';
import EventEmitter from '../_utils/EventEmitter';

export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 64;
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

  const handlePress = (route: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route);
    } else if (isFocused && route === 'home') {
      // Emit reset event when pressing home while on home screen
      EventEmitter.emit('resetHomeScreen');
    }
  };

  return (
    <View className="flex-row justify-around items-center bg-white pt-3 pb-8 border-t border-gray-300"
      style={{ height: TAB_BAR_HEIGHT }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => handlePress(route.name, isFocused)}
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
