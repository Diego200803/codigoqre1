import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCheckout } from '../../lib/modules/useCheckout';

export default function PaymentScreen() {
  const { productId, amount } = useLocalSearchParams<{ productId: string; amount: string }>();
  const { loading, result, processPayment } = useCheckout();

  const handlePay = () => {
    processPayment(productId, Number(amount));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Pago</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Producto</Text>
        <Text style={styles.value}>{productId}</Text>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.amount}>${amount}</Text>
      </View>

      {result && (
        <View style={[styles.result, result.success ? styles.success : styles.error]}>
          <Text style={styles.resultText}>{result.message}</Text>
          {result.success && (
            <Text style={styles.txn}>ID: {result.transactionId}</Text>
          )}
        </View>
      )}

      {!result && (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Pagar Ahora</Text>
          }
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver a escanear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: '#1e1e1e', borderRadius: 16, padding: 20, marginBottom: 24 },
  label: { color: '#888', fontSize: 13, marginTop: 12 },
  value: { color: '#fff', fontSize: 18, fontWeight: '600' },
  amount: { color: '#6C63FF', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  button: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  result: { borderRadius: 14, padding: 16, marginBottom: 20, alignItems: 'center' },
  success: { backgroundColor: '#1a3a2a' },
  error: { backgroundColor: '#3a1a1a' },
  resultText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  txn: { color: '#888', fontSize: 12, marginTop: 8 },
  back: { alignItems: 'center', marginTop: 8 },
  backText: { color: '#6C63FF', fontSize: 15 },
});