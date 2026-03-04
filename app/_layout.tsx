import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BalanceProvider } from '../lib/modules/BalanceContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/core/supabase/client';

export default function RootLayout() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/(auth)/login');
      }
      setChecked(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  if (!checked) return null;

  return (
    <SafeAreaProvider>
      <BalanceProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BalanceProvider>
    </SafeAreaProvider>
  );
}