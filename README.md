# 📱 QR Checkout

> Aplicación móvil de pagos mediante escaneo de códigos QR y barras, desarrollada con React Native + Expo y respaldada por Supabase como backend.

---

## 🧾 Descripción

**QR Checkout** es una app móvil que permite a usuarios registrados escanear códigos QR o de barras para identificar productos y procesar pagos de forma simulada. Cada transacción queda registrada en la nube, y el usuario puede consultar sus estadísticas de compra en tiempo real.

---

## ✨ Funcionalidades

- 🔐 **Autenticación** — Registro e inicio de sesión con email y contraseña (Supabase Auth)
- 📷 **Escáner QR y Código de Barras** — Acceso a la cámara con detección automática de códigos
- 💳 **Procesamiento de Pagos** — Simulación de pago con resultado de éxito/fracaso y descuento de saldo
- 📊 **Estadísticas** — Pantalla con total gastado, tasa de éxito y historial de últimas transacciones
- 🗺️ **Mapa** — Visualización de la ubicación actual del usuario con Google Maps
- 🔔 **Notificaciones Locales** — Alertas en cada evento: login, pago, escaneo, ubicación
- 🛡️ **Guard de Autenticación** — Redirección automática según estado de sesión

---

## 🗂️ Estructura del Proyecto

```
codigoqre1/
├── app/
│   ├── _layout.tsx              # Layout raíz: guard de auth + providers globales
│   ├── index.tsx                # Pantalla principal (Home)
│   ├── stats.tsx                # Estadísticas y historial de transacciones
│   ├── map.tsx                  # Mapa con ubicación actual
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Pantalla de inicio de sesión
│   │   └── register.tsx         # Pantalla de registro
│   └── (checkout)/
│       ├── _layout.tsx
│       ├── scanner.tsx          # Pantalla de escaneo
│       └── payment.tsx          # Confirmación y resultado del pago
│
├── components/
│   ├── MapView.tsx              # Componente de mapa (react-native-maps)
│   └── scanner/
│       └── CameraScanner.tsx    # Componente de cámara y escaneo
│
├── lib/
│   ├── core/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Configuración del cliente Supabase
│   │   │   └── transactionService.ts  # CRUD de transacciones
│   │   ├── payments/
│   │   │   └── paymentService.ts      # Lógica de pago simulado + catálogo
│   │   └── notifications/
│   │       └── notificationService.ts # Notificaciones locales
│   └── modules/
│       ├── BalanceContext.tsx   # Contexto global del saldo del usuario
│       └── useCheckout.ts       # Custom hook que orquesta el proceso de pago
│
├── assets/                      # Imágenes, íconos y fuentes
├── .env                         # Variables de entorno (⚠️ no subir a producción)
├── app.json                     # Configuración de la app Expo
├── eas.json                     # Configuración de Expo Application Services
├── package.json
└── tsconfig.json
```

---

## 🔄 Flujo de la Aplicación

```
Inicio
  └── ¿Hay sesión activa?
        ├── NO → Login / Registro
        └── SÍ → Home
              ├── Escanear QR      → Scanner → Pago → Resultado
              ├── Escanear Barcode → Scanner → Pago → Resultado
              ├── Ver Estadísticas → Stats (historial + métricas)
              └── Ver Mapa         → Map (ubicación GPS)
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework base para la app móvil |
| Expo | ~54.0 | Herramientas de desarrollo y librerías |
| Expo Router | ~6.0 | Navegación basada en sistema de archivos |
| TypeScript | ~5.9 | Tipado estático |
| Supabase | ^2.98 | Autenticación + base de datos PostgreSQL |
| expo-camera | ~17.0 | Acceso a cámara y escaneo de códigos |
| expo-location | ~19.0 | Geolocalización GPS |
| expo-notifications | ~0.32 | Notificaciones locales |
| expo-haptics | ~15.0 | Retroalimentación táctil (vibración) |
| react-native-maps | 1.20.1 | Mapa con Google Maps |
| lucide-react-native | ^0.577 | Íconos |
| AsyncStorage | 2.2.0 | Persistencia de sesión local |

---

## ⚙️ Instalación y Configuración

### Requisitos previos

### 1. Clonar el repositorio

```bash
git clone https://github.com/Diego200803/codigoqre1.git
cd codigoqre1
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Configurar Supabase

Crea la tabla `transactions` en tu proyecto de Supabase con la siguiente estructura:

```sql
create table transactions (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users,
  product_id       text not null,
  product_name     text not null,
  amount           numeric not null,
  transaction_code text,
  status           text not null check (status in ('approved', 'rejected')),
  error_message    text,
  payment_method   text default 'qr',
  created_at       timestamptz default now()
);
```

### 5. Ejecutar la app

```bash
# npx expo start --tunnel
```

## 📱 Pantallas

| Pantalla | Ruta | Descripción |
|---|---|---|
| Login | `/(auth)/login` | Iniciar sesión con email y contraseña |
| Registro | `/(auth)/register` | Crear nueva cuenta |
| Home | `/` | Panel principal con saldo y accesos rápidos |
| Scanner | `/(checkout)/scanner` | Escaneo de QR o código de barras |
| Pago | `/(checkout)/payment` | Confirmación y procesamiento del pago |
| Estadísticas | `/stats` | Métricas personales e historial |
| Mapa | `/map` | Ubicación GPS del usuario |

---

## 🔔 Eventos de Notificación

La app envía notificaciones locales en los siguientes momentos:

- ✅ Login exitoso
- 🚀 Registro de cuenta completado
- 🗺️ Apertura del mapa
- 📍 Ubicación GPS detectada
- 📷 Código QR/Barras escaneado
- ✅ Pago aprobado (con monto)
- ❌ Pago rechazado

---

## ⚠️ Limitaciones Conocidas

- El saldo del usuario es solo en memoria (se reinicia al cerrar la app)
- Los pagos son simulados al 80% de éxito (no hay pasarela real)
- `getStats()` actualmente trae transacciones de todos los usuarios (requiere RLS en Supabase)
- La `SUPABASE_ANON_KEY` debe migrarse a variables de entorno (`.env`)

---

## 👥 Autores

- **Diego Pesantez**
- **Paul Juela**
- **Matias Cabrera**
