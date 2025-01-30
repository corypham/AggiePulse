import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Aileron-Black": require("../assets/FONT-aileron/Aileron-Black.otf"),
        "Aileron-BlackItalic": require("../assets/FONT-aileron/Aileron-BlackItalic.otf"),
        "Aileron-Bold": require("../assets/FONT-aileron/Aileron-Bold.otf"),
        "Aileron-BoldItalic": require("../assets/FONT-aileron/Aileron-BoldItalic.otf"),
        "Aileron-Heavy": require("../assets/FONT-aileron/Aileron-Heavy.otf"),
        "Aileron-HeavyItalic": require("../assets/FONT-aileron/Aileron-HeavyItalic.otf"),
        "Aileron-Italic": require("../assets/FONT-aileron/Aileron-Italic.otf"),
        "Aileron-Light": require("../assets/FONT-aileron/Aileron-Light.otf"),
        "Aileron-LightItalic": require("../assets/FONT-aileron/Aileron-LightItalic.otf"),
        "Aileron-Regular": require("../assets/FONT-aileron/Aileron-Regular.otf"),
        "Aileron-SemiBold": require("../assets/FONT-aileron/Aileron-SemiBold.otf"),
        "Aileron-SemiBoldItalic": require("../assets/FONT-aileron/Aileron-SemiBoldItalic.otf"),
        "Aileron-Thin": require("../assets/FONT-aileron/Aileron-Thin.otf"),
        "Aileron-ThinItalic": require("../assets/FONT-aileron/Aileron-ThinItalic.otf"),
        "Aileron-UltraLight": require("../assets/FONT-aileron/Aileron-UltraLight.otf"),
        "Aileron-UltraLightItalic": require("../assets/FONT-aileron/Aileron-UltraLightItalic.otf"),
      });
    }
    loadFonts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}