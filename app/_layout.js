import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
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