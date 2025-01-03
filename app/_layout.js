import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'AggiePulse',
            headerShown: true 
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}