import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/core/supabase/client';
import { notify } from '../../lib/core/notifications/notificationService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await notify.loginSuccess();
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.title}>QR Checkout</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Iniciar Sesión</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.linkText}>¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  icon: { fontSize: 56, marginBottom: 12 },
  title: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 15, marginTop: 6 },
  form: { gap: 12 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 12,
    padding: 16, fontSize: 15, borderWidth: 1, borderColor: '#2e2e2e',
    marginBottom: 8,
  },
  button: { backgroundColor: '#6C63FF', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#888', fontSize: 14 },
  linkBold: { color: '#6C63FF', fontWeight: 'bold' },
});