import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://vdxdbvdltcviwmpgogma.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeGRidmRsdGN2aXdtcGdvZ21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODE2NTYsImV4cCI6MjA4ODA1NzY1Nn0.wKDyQUGuvmFPh_f12dBefX-afpIs5NtDP1BvPzQFSuA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});