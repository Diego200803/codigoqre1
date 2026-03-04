import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BalanceProvider } from '../lib/modules/BalanceContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BalanceProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BalanceProvider>
    </SafeAreaProvider>
  );
}