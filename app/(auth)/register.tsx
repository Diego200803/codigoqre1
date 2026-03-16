import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, UserPlus, Rocket } from 'lucide-react-native';
import { supabase } from '../../lib/core/supabase/client';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) { Alert.alert('Error', 'Completá todos los campos'); return; }
    if (password !== confirm) { Alert.alert('Error', 'Las contraseñas no coinciden'); return; }
    if (password.length < 6) { Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('¡Listo!', 'Cuenta creada exitosamente', [
        { text: 'Iniciar Sesión', onPress: () => router.replace('/(auth)/login') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Rocket size={56} color="#6C63FF" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Registrate para empezar</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <Mail size={18} color="#555" style={{ marginRight: 10 }} />
          <TextInput style={styles.input} placeholder="tu@email.com" placeholderTextColor="#555" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
          <Lock size={18} color="#555" style={{ marginRight: 10 }} />
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#555" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.inputRow}>
          <Lock size={18} color="#555" style={{ marginRight: 10 }} />
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#555" value={confirm} onChangeText={setConfirm} secureTextEntry />
        </View>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <View style={styles.btnRow}>
              <UserPlus size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <Text style={styles.linkText}>¿Ya tenés cuenta? <Text style={styles.linkBold}>Iniciá sesión</Text></Text>
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