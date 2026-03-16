import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, LogIn, QrCode } from 'lucide-react-native';
import { supabase } from '../../lib/core/supabase/client';
import { notify } from '../../lib/core/notifications/notificationService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Completá todos los campos'); return; }
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
        <QrCode size={56} color="#6C63FF" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>QR Checkout</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <Mail size={18} color="#555" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
          <Lock size={18} color="#555" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <View style={styles.btnRow}>
              <LogIn size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 15, marginTop: 6 },
  form: { gap: 12 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#2e2e2e', marginBottom: 8 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  button: { backgroundColor: '#6C63FF', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  btnRow: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#888', fontSize: 14 },
  linkBold: { color: '#6C63FF', fontWeight: 'bold' },
});