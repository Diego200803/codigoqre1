import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import CameraScanner from '../../components/scanner/CameraScanner';
import { isValidQR, extractProductId } from '../../lib/core/qr/qrUtils';

export default function ScannerScreen() {
  const handleData = (data: string) => {
    if (!isValidQR(data)) return;
    const productId = extractProductId(data);
    router.push({
      pathname: '/(checkout)/payment',
      params: { productId, amount: '1500' },
    });
  };

  return (
    <View style={styles.container}>
      <CameraScanner onDataDetected={handleData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});