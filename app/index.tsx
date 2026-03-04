import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useBalance } from '../lib/modules/BalanceContext';
import { getStats } from '../lib/core/supabase/transactionService';
import { supabase } from '../lib/core/supabase/client';

export default function HomeScreen() {
  const { balance } = useBalance();
  const [stats, setStats] = useState({ compras: 0, gastado: 0, exitos: 0, fracasos: 0 });
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadStats();
    loadUser();
  }, []);

  const loadStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) setUserEmail(user.email);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bienvenido 👋</Text>
            <Text style={styles.name}>{userEmail || 'Usuario'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        <Text style={styles.balanceSub}>USD • Cuenta Principal</Text>
      </View>

      <View style={styles.statsRow}>
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
      </View>

      <Text style={styles.sectionTitle}>¿Qué querés escanear?</Text>

      <View style={styles.scanRow}>
        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => router.push({ pathname: '/(checkout)/scanner', params: { mode: 'qr' } })}
        >
          <Text style={styles.scanCardIcon}>📷</Text>
          <Text style={styles.scanCardTitle}>Código QR</Text>
          <Text style={styles.scanCardSub}>Pagos y links</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanCard, styles.scanCardAlt]}
          onPress={() => router.push({ pathname: '/(checkout)/scanner', params: { mode: 'barcode' } })}
        >
          <Text style={styles.scanCardIcon}>📦</Text>
          <Text style={styles.scanCardTitle}>Código de Barras</Text>
          <Text style={styles.scanCardSub}>Productos retail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 24, paddingTop: 60 },
  header: { marginBottom: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#888', fontSize: 15 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#1e1e1e', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  logoutText: { color: '#6C63FF', fontWeight: 'bold', fontSize: 13 },
  balanceCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  balanceLabel: { color: '#ffffffaa', fontSize: 13, marginBottom: 6 },
  balanceAmount: { color: '#fff', fontSize: 38, fontWeight: 'bold' },
  balanceSub: { color: '#ffffffaa', fontSize: 12, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  statBox: {
    flex: 1, backgroundColor: '#1e1e1e', borderRadius: 14,
    padding: 12, alignItems: 'center',
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statLabel: { color: '#888', fontSize: 10, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  scanRow: { flexDirection: 'row', gap: 12 },
  scanCard: {
    flex: 1, backgroundColor: '#6C63FF', borderRadius: 20,
    padding: 24, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  scanCardAlt: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#6C63FF',
    shadowColor: '#000',
  },
  scanCardIcon: { fontSize: 36, marginBottom: 10 },
  scanCardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  scanCardSub: { color: '#ffffffaa', fontSize: 11, marginTop: 4, textAlign: 'center' },
});