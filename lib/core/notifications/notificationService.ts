import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configuración global
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function sendLocalNotification(title: string, body: string) {
  const granted = await requestNotificationPermissions();
  if (!granted) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}

// Notificaciones específicas
export const notify = {
  loginSuccess: () =>
    sendLocalNotification('¡Bienvenido! 👋', 'Inicio de sesión exitoso.'),

  locationDetected: () =>
    sendLocalNotification('📍 Ubicación detectada', '¡Ubicación detectada exitosamente!'),

  mapOpened: () =>
    sendLocalNotification('🗺️ Mapa abierto', 'Cargando tu ubicación en el mapa...'),

  paymentSuccess: (amount: number) =>
    sendLocalNotification('✅ Pago realizado', `¡Pago de $${amount} realizado exitosamente!`),

  paymentFailed: () =>
    sendLocalNotification('❌ Pago rechazado', 'Tu pago fue rechazado. Intentá de nuevo.'),

  qrScanned: () =>
    sendLocalNotification('📷 Código detectado', '¡Código escaneado! Procesando pago...'),
};