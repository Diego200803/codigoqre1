import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useBalance } from '../lib/modules/BalanceContext';
import { getStats } from '../lib/core/supabase/transactionService';

export default function HomeScreen() {
  const { balance } = useBalance();
  const [stats, setStats] = useState({ compras: 0, gastado: 0, exitos: 0, fracasos: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bienvenido 👋</Text>
        <Text style={styles.name}>Juan Dev</Text>
      </View>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        <Text style={styles.balanceSub}>USD • Cuenta Principal</Text>
      </View>

      {/* ✅ Stats tocables → navegan a /stats */}
      <TouchableOpacity
        style={styles.statsRow}
        onPress={() => router.push('/stats')}
        activeOpacity={0.8}
      >
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statLabel}>Compras</Text>
          <Text style={styles.statValue}>{stats.compras}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>💸</Text>
          <Text style={styles.statLabel}>Gastado</Text>
          <Text style={styles.statValue}>${stats.gastado.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statLabel}>Éxitos</Text>
          <Text style={styles.statValue}>{stats.exitos}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>❌</Text>
          <Text style={styles.statLabel}>Fracasos</Text>
          <Text style={styles.statValue}>{stats.fracasos}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.statsHint}>Toca para ver detalles →</Text>

      {/* Botón escanear */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(checkout)/scanner')}
      >
        <Text style={styles.buttonIcon}>📷</Text>
        <Text style={styles.buttonText}>Escanear y Pagar</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Apuntá la cámara a cualquier código QR o de barras</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0f0f0f', padding: 24, paddingTop: 60 },
  header:        { marginBottom: 28 },
  greeting:      { color: '#888', fontSize: 15 },
  name:          { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  balanceCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  balanceLabel:  { color: '#ffffffaa', fontSize: 13, marginBottom: 6 },
  balanceAmount: { color: '#fff', fontSize: 38, fontWeight: 'bold' },
  balanceSub:    { color: '#ffffffaa', fontSize: 12, marginTop: 6 },
  statsRow:      { flexDirection: 'row', gap: 8, marginBottom: 4 },
  statsHint:     { color: '#555', fontSize: 11, textAlign: 'right', marginBottom: 28 },
  statBox: {
    flex: 1, backgroundColor: '#1e1e1e',
    borderRadius: 14, padding: 12, alignItems: 'center',
  },
  statIcon:  { fontSize: 20, marginBottom: 6 },
  statLabel: { color: '#888', fontSize: 10, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  button: {
    backgroundColor: '#6C63FF', borderRadius: 16,
    padding: 20, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  buttonIcon: { fontSize: 22 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hint:       { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 16 },
});