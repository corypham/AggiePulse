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
            latitude: 33.72689000,
            longitude: -117.76233300,
          }}
          title="UC Irvine"
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