import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCheckout } from '../../lib/modules/useCheckout';

export default function PaymentScreen() {
  const { productId, productName, amount } = useLocalSearchParams<{
    productId: string;
    productName: string;
    amount: string;
  }>();
  const { loading, result, balance, processPayment } = useCheckout();

  const handlePay = () => {
    processPayment(productId, Number(amount), productName);
  };

  const newBalance = balance - Number(amount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Pago</Text>

      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Saldo actual</Text>
        <Text style={styles.balanceValue}>${balance.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Producto</Text>
        <Text style={styles.value}>{productName}</Text>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.valueSmall}>{productId}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Total a pagar</Text>
        <Text style={styles.amount}>${Number(amount).toLocaleString()}</Text>
        <Text style={styles.balanceAfter}>
          Saldo tras pago: ${newBalance.toLocaleString()}
        </Text>
      </View>

      {result && (
        <View style={[styles.result, result.success ? styles.success : styles.error]}>
          <Text style={styles.resultIcon}>{result.success ? '✅' : '❌'}</Text>
          <Text style={styles.resultText}>{result.message}</Text>
          {result.success && (
            <Text style={styles.txn}>ID Transacción: {result.transactionId}</Text>
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
            : <Text style={styles.buttonText}>💳 Pagar Ahora</Text>
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
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 24, paddingTop: 60 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  balanceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginBottom: 16,
  },
  balanceLabel: { color: '#888', fontSize: 14 },
  balanceValue: { color: '#6C63FF', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#1e1e1e', borderRadius: 16, padding: 20, marginBottom: 20 },
  label: { color: '#888', fontSize: 12, marginTop: 12 },
  value: { color: '#fff', fontSize: 18, fontWeight: '600' },
  valueSmall: { color: '#aaa', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 16 },
  amount: { color: '#6C63FF', fontSize: 34, fontWeight: 'bold', marginTop: 4 },
  balanceAfter: { color: '#555', fontSize: 12, marginTop: 6 },
  button: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  result: { borderRadius: 14, padding: 16, marginBottom: 20, alignItems: 'center' },
  success: { backgroundColor: '#1a3a2a' },
  error: { backgroundColor: '#3a1a1a' },
  resultIcon: { fontSize: 32, marginBottom: 8 },
  resultText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  txn: { color: '#888', fontSize: 11, marginTop: 6 },
  back: { alignItems: 'center', marginTop: 8 },
  backText: { color: '#6C63FF', fontSize: 15 },
});