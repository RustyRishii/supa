import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SUPABASE_ANON_KEY,SUPABASE_URL } from '@env'

export const supabase = createClient(SUPABASE_URL,SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true as boolean,
    persistSession: true as boolean,
    detectSessionInUrl: false as boolean,
  },
});
        