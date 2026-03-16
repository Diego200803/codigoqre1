import React from 'react';
import { StyleSheet, View, Dimensions, Platform, Text } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
};

export default function MapComponent({ latitude, longitude }: Props) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webText}>🗺️ El mapa solo está disponible en la app móvil</Text>
      </View>
    );
  }

  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_GOOGLE } = require('react-native-maps');

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Estás aquí"
          description="Tu ubicación actual"
          pinColor="#6C63FF"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  webFallback: {
    height: 200, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#1e1e1e',
    borderRadius: 14, margin: 16,
  },
  webText: { color: '#888', fontSize: 14 },
});