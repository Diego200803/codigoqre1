import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Checkout</Text>
      <Text style={styles.subtitle}>Escaneá un código para pagar</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(checkout)/scanner')}
      >
        <Text style={styles.buttonText}>📷 Abrir Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 40 },
  button: { backgroundColor: '#6C63FF', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 14 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});