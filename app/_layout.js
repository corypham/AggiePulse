import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
    }
    loadFonts();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false, 
        }}
      />
      <StatusBar style="light" />
    </>
  );
}