import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import CameraScanner from '../../components/scanner/CameraScanner';
import { getProductInfo } from '../../lib/core/payments/paymentService';

export default function ScannerScreen() {
  const handleData = (data: string) => {
    const product = getProductInfo(data);
    router.push({
      pathname: '/(checkout)/payment',
      params: {
        productId: data,
        productName: product.name,
        amount: String(product.price),
      },
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