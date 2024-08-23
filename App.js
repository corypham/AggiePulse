import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

function MyButton() {
  return (
    <button>
      Click me!
    </button>
  );
}

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text>
        AggiePulse made by Cory Pham

      </Text>
      {/* <MyButton /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
