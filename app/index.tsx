import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useBalance } from '../lib/modules/BalanceContext';
import { getStats } from '../lib/core/supabase/transactionService';
import { supabase } from '../lib/core/supabase/client';

import {
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Camera,
  ScanBarcode,
  LogOut,
  Shield,
  Hand
} from "lucide-react-native";

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

      {/* Header */}

      <View style={styles.header}>

        <View style={styles.headerRow}>

          <View style={styles.greetingRow}>
            <Hand size={18} color="#888"/>
            <Text style={styles.greeting}>Bienvenido</Text>
          </View>

          <View>
            <Text style={styles.name}>{userEmail || 'Usuario'}</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <View style={styles.logoutRow}>
              <LogOut size={16} color="#6C63FF"/>
              <Text style={styles.logoutText}>Salir</Text>
            </View>
          </TouchableOpacity>

        </View>

      </View>


      {/* Balance */}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        <Text style={styles.balanceSub}>USD • Cuenta Principal</Text>
      </View>


      {/* Stats */}

      <TouchableOpacity
        style={styles.statsRow}
        onPress={() => router.push('/stats')}
        activeOpacity={0.8}
      >

        <View style={styles.statBox}>
          <Package size={20} color="#fff" style={styles.statIcon}/>
          <Text style={styles.statLabel}>Compras</Text>
          <Text style={styles.statValue}>{stats.compras}</Text>
        </View>

        <View style={styles.statBox}>
          <DollarSign size={20} color="#fff" style={styles.statIcon}/>
          <Text style={styles.statLabel}>Gastado</Text>
          <Text style={styles.statValue}>${stats.gastado.toLocaleString()}</Text>
        </View>

        <View style={styles.statBox}>
          <CheckCircle size={20} color="#4ade80" style={styles.statIcon}/>
          <Text style={styles.statLabel}>Éxitos</Text>
          <Text style={styles.statValue}>{stats.exitos}</Text>
        </View>

        <View style={styles.statBox}>
          <XCircle size={20} color="#f87171" style={styles.statIcon}/>
          <Text style={styles.statLabel}>Fracasos</Text>
          <Text style={styles.statValue}>{stats.fracasos}</Text>
        </View>

      </TouchableOpacity>

      <Text style={styles.statsHint}>Toca para ver detalles →</Text>


      {/* Escaneo */}

      <Text style={styles.sectionTitle}>¿Qué querés escanear?</Text>

      <View style={styles.scanRow}>

        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => router.push({ pathname: '/(checkout)/scanner', params: { mode: 'qr' } })}
        >

          <Camera size={36} color="#fff" style={styles.scanCardIcon}/>
          <Text style={styles.scanCardTitle}>Código QR</Text>
          <Text style={styles.scanCardSub}>Pagos y links</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanCard, styles.scanCardAlt]}
          onPress={() => router.push({ pathname: '/(checkout)/scanner', params: { mode: 'barcode' } })}
        >

          <ScanBarcode size={36} color="#6C63FF" style={styles.scanCardIcon}/>
          <Text style={styles.scanCardTitle}>Código de Barras</Text>
          <Text style={styles.scanCardSub}>Productos retail</Text>

        </TouchableOpacity>

      </View>


      {/* Footer */}

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Shield size={14} color="#333"/>
          <Text style={styles.footerText}>Tus pagos están protegidos</Text>
        </View>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#0f0f0f',
    padding:24,
    paddingTop:60
  },

  header:{
    marginBottom:28
  },

  headerRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },

  greetingRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:6
  },

  greeting:{
    color:'#888',
    fontSize:15
  },

  name:{
    color:'#fff',
    fontSize:20,
    fontWeight:'bold'
  },

  logoutBtn:{
    backgroundColor:'#1e1e1e',
    paddingHorizontal:14,
    paddingVertical:8,
    borderRadius:10
  },

  logoutRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:6
  },

  logoutText:{
    color:'#6C63FF',
    fontWeight:'bold',
    fontSize:13
  },

  balanceCard:{
    backgroundColor:'#6C63FF',
    borderRadius:20,
    padding:24,
    marginBottom:24,
    shadowColor:'#6C63FF',
    shadowOffset:{width:0,height:8},
    shadowOpacity:0.4,
    shadowRadius:16,
    elevation:10
  },

  balanceLabel:{
    color:'#ffffffaa',
    fontSize:13,
    marginBottom:6
  },

  balanceAmount:{
    color:'#fff',
    fontSize:38,
    fontWeight:'bold'
  },

  balanceSub:{
    color:'#ffffffaa',
    fontSize:12,
    marginTop:6
  },

  statsRow:{
    flexDirection:'row',
    gap:8,
    marginBottom:4
  },

  statsHint:{
    color:'#555',
    fontSize:11,
    textAlign:'right',
    marginBottom:20
  },

  statBox:{
    flex:1,
    backgroundColor:'#1e1e1e',
    borderRadius:14,
    padding:12,
    alignItems:'center'
  },

  statIcon:{
    marginBottom:6
  },

  statLabel:{
    color:'#888',
    fontSize:10,
    marginBottom:4
  },

  statValue:{
    color:'#fff',
    fontSize:14,
    fontWeight:'bold'
  },

  sectionTitle:{
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
    marginBottom:16
  },

  scanRow:{
    flexDirection:'row',
    gap:12
  },

  scanCard:{
    flex:1,
    backgroundColor:'#6C63FF',
    borderRadius:20,
    padding:24,
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#6C63FF',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.35,
    shadowRadius:12,
    elevation:8
  },

  scanCardAlt:{
    backgroundColor:'#1e1e1e',
    borderWidth:1,
    borderColor:'#6C63FF',
    shadowColor:'#000'
  },

  scanCardIcon:{
    marginBottom:10
  },

  scanCardTitle:{
    color:'#fff',
    fontSize:15,
    fontWeight:'bold',
    textAlign:'center'
  },

  scanCardSub:{
    color:'#ffffffaa',
    fontSize:11,
    marginTop:4,
    textAlign:'center'
  },

  footer:{
    alignItems:'center',
    marginTop:24
  },

  footerRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:6
  },

  footerText:{
    color:'#333',
    fontSize:12
  }

});