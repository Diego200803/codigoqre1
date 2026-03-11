import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { router } from 'expo-router';

import {
  Package,
  CheckCircle,
  XCircle,
  TrendingUp,
  MailOpen,
  ArrowLeft
} from "lucide-react-native";

import { getStats, getRecentTransactions } from '../lib/core/supabase/transactionService';

type Stats = {
  compras: number;
  gastado: number;
  exitos: number;
  fracasos: number;
};

type TxRow = {
  id: string;
  product_name: string;
  amount: number;
  status: string;
  transaction_code: string | null;
  created_at: string;
};

export default function StatsScreen() {

  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [s, h] = await Promise.all([getStats(), getRecentTransactions()]);
    setStats(s);
    setHistory(h);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#6C63FF"
        />
      }
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backRow}>
            <ArrowLeft size={18} color="#6C63FF" />
            <Text style={styles.back}>Volver</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Mis Estadísticas</Text>

      </View>


      {/* TARJETA PRINCIPAL */}

      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Total Gastado</Text>
        <Text style={styles.mainAmount}>${stats?.gastado.toFixed(2)}</Text>
        <Text style={styles.mainSub}>
          en {stats?.compras} transacciones
        </Text>
      </View>


      {/* GRID DE STATS */}

      <View style={styles.grid}>

        <View style={styles.gridItem}>
          <Package size={24} color="#fff" style={styles.icon} />
          <Text style={styles.gridValue}>{stats?.compras}</Text>
          <Text style={styles.gridLabel}>Compras</Text>
        </View>

        <View style={styles.gridItem}>
          <CheckCircle size={24} color="#4ade80" style={styles.icon} />
          <Text style={[styles.gridValue,{color:'#4ade80'}]}>
            {stats?.exitos}
          </Text>
          <Text style={styles.gridLabel}>Aprobados</Text>
        </View>

        <View style={styles.gridItem}>
          <XCircle size={24} color="#f87171" style={styles.icon} />
          <Text style={[styles.gridValue,{color:'#f87171'}]}>
            {stats?.fracasos}
          </Text>
          <Text style={styles.gridLabel}>Rechazados</Text>
        </View>

        <View style={styles.gridItem}>
          <TrendingUp size={24} color="#6C63FF" style={styles.icon} />
          <Text style={[styles.gridValue,{color:'#6C63FF'}]}>
            {stats?.compras
              ? Math.round((stats.exitos / stats.compras) * 100)
              : 0}%
          </Text>
          <Text style={styles.gridLabel}>Tasa éxito</Text>
        </View>

      </View>


      {/* HISTORIAL */}

      <Text style={styles.sectionTitle}>Historial Reciente</Text>

      {history.length === 0 ? (

        <View style={styles.empty}>
          <MailOpen size={40} color="#555" />
          <Text style={styles.emptyText}>
            Aún no hay transacciones
          </Text>
        </View>

      ) : (

        history.map((tx) => (

          <View key={tx.id} style={styles.txRow}>

            <View style={styles.txLeft}>

              {tx.status === 'approved'
                ? <CheckCircle size={20} color="#4ade80"/>
                : <XCircle size={20} color="#f87171"/>
              }

              <View>

                <Text style={styles.txName}>
                  {tx.product_name}
                </Text>

                <Text style={styles.txDate}>
                  {formatDate(tx.created_at)}
                </Text>

                {tx.transaction_code && (
                  <Text style={styles.txCode}>
                    {tx.transaction_code}
                  </Text>
                )}

              </View>

            </View>

            <Text style={[
              styles.txAmount,
              { color: tx.status === 'approved'
                ? '#4ade80'
                : '#f87171'
              }
            ]}>
              {tx.status === 'approved' ? '-' : ''}
              ${Number(tx.amount).toFixed(2)}
            </Text>

          </View>

        ))

      )}

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#0f0f0f'
  },

  content:{
    padding:24,
    paddingTop:60,
    paddingBottom:40
  },

  centered:{
    flex:1,
    backgroundColor:'#0f0f0f',
    justifyContent:'center',
    alignItems:'center'
  },

  loadingText:{
    color:'#888',
    marginTop:12
  },

  header:{
    marginBottom:24
  },

  backRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:6,
    marginBottom:8
  },

  back:{
    color:'#6C63FF',
    fontSize:15
  },

  title:{
    color:'#fff',
    fontSize:26,
    fontWeight:'bold'
  },

  mainCard:{
    backgroundColor:'#6C63FF',
    borderRadius:20,
    padding:24,
    marginBottom:20,
    shadowColor:'#6C63FF',
    shadowOffset:{width:0,height:8},
    shadowOpacity:0.4,
    shadowRadius:16,
    elevation:10
  },

  mainLabel:{
    color:'#ffffffaa',
    fontSize:13,
    marginBottom:6
  },

  mainAmount:{
    color:'#fff',
    fontSize:42,
    fontWeight:'bold'
  },

  mainSub:{
    color:'#ffffffaa',
    fontSize:12,
    marginTop:6
  },

  grid:{
    flexDirection:'row',
    flexWrap:'wrap',
    gap:12,
    marginBottom:32
  },

  gridItem:{
    width:'47%',
    backgroundColor:'#1e1e1e',
    borderRadius:14,
    padding:16,
    alignItems:'center'
  },

  icon:{
    marginBottom:8
  },

  gridValue:{
    color:'#fff',
    fontSize:22,
    fontWeight:'bold'
  },

  gridLabel:{
    color:'#888',
    fontSize:12,
    marginTop:4
  },

  sectionTitle:{
    color:'#fff',
    fontSize:18,
    fontWeight:'700',
    marginBottom:12
  },

  empty:{
    alignItems:'center',
    paddingVertical:40
  },

  emptyText:{
    color:'#555',
    fontSize:15,
    marginTop:12
  },

  txRow:{
    backgroundColor:'#1e1e1e',
    borderRadius:14,
    padding:16,
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },

  txLeft:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    flex:1
  },

  txName:{
    color:'#fff',
    fontSize:15,
    fontWeight:'600'
  },

  txDate:{
    color:'#888',
    fontSize:11,
    marginTop:2
  },

  txCode:{
    color:'#6C63FF',
    fontSize:10,
    marginTop:2
  },

  txAmount:{
    fontSize:16,
    fontWeight:'bold'
  }

});