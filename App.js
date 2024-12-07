import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/map/MapScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'AggiePulse' }}
            />
            <Stack.Screen 
              name="Map" 
              component={MapScreen}
              options={{ title: 'Campus Map' }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});