import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { MAP_INITIAL_REGION } from '../../store';

export default function MapScreen() {
  const locations = useSelector(state => state.locations);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={MAP_INITIAL_REGION}
      >
        <Marker
          coordinate={{
            latitude: 38.54138,
            longitude: 121.75388,
          }}
          title="UC Davis"
          description="Main Campus"
        />
      </MapView>
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