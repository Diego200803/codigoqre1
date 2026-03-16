import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, RefreshCw, XCircle } from 'lucide-react-native';
import * as Location from 'expo-location';
import MapComponent from '../components/MapView';
import { notify } from '../lib/core/notifications/notificationService';


export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { getLocation(); }, []);

  const getLocation = async () => {
    setLoading(true);
    await notify.mapOpened();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso de ubicación denegado');
      setLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    await notify.locationDetected();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#6C63FF" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Ubicación</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
        </View>
      )}

      {error !== '' && (
        <View style={styles.center}>
          <XCircle size={40} color="#f87171" style={{ marginBottom: 12 }} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={getLocation}>
            <RefreshCw size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && location && (
        <>
          <MapComponent latitude={location.latitude} longitude={location.longitude} />
          <View style={styles.coordsCard}>
            <View style={styles.coordsLeft}>
              <MapPin size={18} color="#6C63FF" style={{ marginRight: 8 }} />
              <Text style={styles.coordsTitle}>Coordenadas</Text>
            </View>
            <View>
              <Text style={styles.coordsText}>Lat: {location.latitude.toFixed(6)}</Text>
              <Text style={styles.coordsText}>Lng: {location.longitude.toFixed(6)}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 55, backgroundColor: '#0f0f0f' },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 16, gap: 6 },
  backText: { color: '#6C63FF', fontSize: 16, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: '#888', fontSize: 15, marginTop: 12 },
  errorText: { color: '#ff6b6b', fontSize: 16 },
  retryBtn: { backgroundColor: '#6C63FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  retryText: { color: '#fff', fontWeight: 'bold' },
  coordsCard: { backgroundColor: '#1e1e1e', margin: 16, borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coordsLeft: { flexDirection: 'row', alignItems: 'center' },
  coordsTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  coordsText: { color: '#888', fontSize: 13 },
});