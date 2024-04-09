// import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient } from '@supabase/supabase-js'
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// })


import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://hlgnifpdoxwdaezhvlru.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZ25pZnBkb3h3ZGFlemh2bHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2OTY0NzEsImV4cCI6MjAyNTI3MjQ3MX0.b5-6MGgEiFwEcp3xI_37ks0-GT4iYguvB-M86a4CSn8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  
});


        