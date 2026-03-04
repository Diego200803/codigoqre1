import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

type Props = {
  onDataDetected: (data: string) => void;
};

export default function CameraScanner({ onDataDetected }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Necesitamos acceso a tu cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDataDetected(data);
    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e', 'itf14'] }}
      />
      <View style={styles.overlay}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      {scanned && (
        <View style={styles.scanning}>
          <Text style={styles.scanningText}>✅ Escaneando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 16, marginBottom: 20, textAlign: 'center', paddingHorizontal: 30 },
  button: { backgroundColor: '#6C63FF', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#6C63FF', borderWidth: 4 },
  topLeft: { top: '30%', left: '15%', borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: '30%', right: '15%', borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: '30%', left: '15%', borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: '30%', right: '15%', borderLeftWidth: 0, borderTopWidth: 0 },
  scanning: { position: 'absolute', bottom: 60, alignSelf: 'center', backgroundColor: '#000000cc', padding: 16, borderRadius: 12 },
  scanningText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});