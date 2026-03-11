import { Stack, Redirect, useSegments, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BalanceProvider } from '../lib/modules/BalanceContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/core/supabase/client';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession]   = useState<Session | null | undefined>(undefined);
  const [ready,   setReady]     = useState(false);
  const segments = useSegments();
  const router   = useRouter();

  useEffect(() => {
    // Timeout de seguridad: si en 3s no responde, asume sin sesión
    const timeout = setTimeout(() => {
      if (!ready) {
        setSession(null);
        setReady(true);
      }
    }, 3000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, ready, segments]);

  // Renderiza inmediatamente, sin bloquear
  return (
    <SafeAreaProvider>
      <BalanceProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BalanceProvider>
    </SafeAreaProvider>
  );
}