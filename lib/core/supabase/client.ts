import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://wbvncfdfbsmbsgyyaxan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indidm5jZmRmYnNtYnNneXlheGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTI3OTEsImV4cCI6MjA4ODIyODc5MX0.Pa9qB_Km66f-cXPBZtEwZeZnzW72QIKb4hXkEP9h4PQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage:          AsyncStorage,  // persiste sesión en el dispositivo
    autoRefreshToken: true,          // renueva el token automáticamente
    persistSession:   true,          // mantiene sesión aunque cierres la app
    detectSessionInUrl: false,       // necesario en React Native (no hay URLs)
  },
});