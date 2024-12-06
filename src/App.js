import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
// import { GOOGLE_MAPS_API_KEY, FIREBASE_API_KEY } from '@env';

// console.log(GOOGLE_MAPS_API_KEY);



function MyButton() {
  return (
    <button>
      Click me!
    </button>
  );
}

// export default function MyApp() {
//   return (
//     <View style={styles.container}>
//       <Text>
//         AggiePulse made by Cory Pham

//       </Text>
//       {/* <MyButton /> */}
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 33.72689000,
          longitude: -117.76233300,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
