import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SUPABASE_URL = 'https://wbvncfdfbsmbsgyyaxan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indidm5jZmRmYnNtYnNneXlheGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTI3OTEsImV4cCI6MjA4ODIyODc5MX0.Pa9qB_Km66f-cXPBZtEwZeZnzW72QIKb4hXkEP9h4PQ';

const storage = Platform.OS === 'web' ? undefined : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});