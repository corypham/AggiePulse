import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Aileron-Bold": require("../assets/FONT-aileron/Aileron-Bold.otf"),
        "Aileron-Regular": require("../assets/FONT-aileron/Aileron-Regular.otf"),
        "Aileron-Light": require("../assets/FONT-aileron/Aileron-Light.otf"),
        "Aileron-Italic": require("../assets/FONT-aileron/Aileron-Italic.otf"),
        "Aileron-SemiBold": require("../assets/FONT-aileron/Aileron-SemiBold.otf"),
      });
    }
    loadFonts();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}